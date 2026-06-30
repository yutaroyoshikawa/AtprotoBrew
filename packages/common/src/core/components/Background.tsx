import chroma from "chroma-js";
import type { ExpoWebGLRenderingContext } from "expo-gl";
import { GLView, getWorkletContext } from "expo-gl";
import { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";
import { View } from "tamagui";
import { atoms } from "../../styles/alf";
import { useThemeColors } from "../../styles/theme";

const BUBBLE_COUNT = 28;

/** [r, g, b, a]（rgb は 0〜1） */
type RGBA = [number, number, number, number];

/**
 * chroma で扱える色を RGBA(0〜1) に変換するヘルパ。
 * ※ chroma は worklet 内では動かないため、必ず JS スレッドで呼ぶこと。
 */
export function toRGBA(color: chroma.ChromaInput, alpha?: number): RGBA {
	const c = chroma(color);
	const [r, g, b] = c.rgb(); // 0〜255
	const a = alpha ?? c.alpha();
	return [r / 255, g / 255, b / 255, a];
}

/** worklet に渡す解決済みの色・パラメータ（すべて数値のみ＝worklet-safe） */
interface ResolvedColors {
	inner: RGBA;
	mid: RGBA;
	out: RGBA;
	ring: RGBA;
	highlight: RGBA;
	gloss: number;
	wobble: number;
}

/**
 * 背景の明暗だけを見て決め打ちの泡パレットを返す。
 * inner→mid→out で明度を変えて球の奥行きを出す。
 * ※ chroma を使うので JS スレッド専用。
 */
function deriveBubbleColors(bgColor: chroma.ChromaInput): Omit<ResolvedColors, "gloss" | "wobble"> {
	const L = chroma(bgColor).luminance(); // 0〜1
	const isLight = L > 0.5;

	if (isLight) {
		// 明背景: 青いバブル。
		return {
			inner: toRGBA("#dff3ff", 0.92),
			mid: toRGBA("#7cc4f0", 0.55),
			out: toRGBA("#2f86d6", 0.86),
			ring: toRGBA("#1f6fc0", 0.9),
			highlight: toRGBA("#ffffff", 0.9),
		};
	}

	// 暗背景: 白いバブル。
	return {
		inner: toRGBA("#ffffff", 0.92),
		mid: toRGBA("#eaf2f8", 0.5),
		out: toRGBA("#cfe0ec", 0.22),
		ring: toRGBA("#ffffff", 0.7),
		highlight: toRGBA("#ffffff", 0.85),
	};
}

interface Props {
	/** 光沢の強さ 0〜1（既定 0.9） */
	gloss?: number;
	/** 輪郭の歪み（震え）の強さ 0〜1（既定 1。0 で真円） */
	wobble?: number;
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
	vUv = aPos * 0.5 + 0.5;
	gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// 背景は透明。全バブルを 1 パスで描画し、色とアルファを累積する。
const FRAG = `
precision highp float;
varying vec2 vUv;

uniform vec2 uRes;
uniform int uCount;
// x, y, r, opacity を bubble ごとに格納
uniform vec4 uBubbles[${BUBBLE_COUNT}];

// バブルの3ストップ色（rgb + alpha）
uniform vec4 uInner;
uniform vec4 uMid;
uniform vec4 uOut;
// 輪郭線・ハイライトの色と強度（rgb + 強度）
uniform vec4 uRing;
uniform vec4 uHighlight;
// 光沢の全体強度
uniform float uGloss;
// 輪郭の歪み強度と時間
uniform float uWobble;
uniform float uTime;

void main() {
	// vUv.y は下が 0。Canvas 座標系（上が 0）に合わせて反転。
	vec2 px = vec2(vUv.x * uRes.x, (1.0 - vUv.y) * uRes.y);

	// 背景は透明。色とアルファを累積していく。
	vec3 col = vec3(0.0);
	float alpha = 0.0;

	for (int i = 0; i < ${BUBBLE_COUNT}; i++) {
		if (i >= uCount) break;
		vec4 b = uBubbles[i];
		vec2 c = b.xy;
		float r = b.z;
		float op = b.w;

		// バブル中心からの相対ベクトルと角度
		vec2 rel = px - c;
		float ang = atan(rel.y, rel.x);
		float dist = length(rel);

		// 角度に応じて半径を小刻みに震わせる。uWobble で強度調整（0 で真円）。
		float wob =
			sin(ang * 7.0 + uTime * 0.006 + b.x * 0.07) * 0.5 +
			sin(ang * 11.0 - uTime * 0.008 + b.y * 0.07) * 0.5;
		float rDyn = r * (1.0 + uWobble * 0.02 * wob);

		float d = dist;
		if (d > rDyn + 1.5) continue;

		// 放射状グラデーション（中心オフセットあり）
		vec2 lightCenter = c + vec2(-rDyn * 0.3, -rDyn * 0.3);
		float ld = distance(px, lightCenter) / rDyn;

		vec3 inner = uInner.rgb;
		vec3 midC  = uMid.rgb;
		vec3 outC  = uOut.rgb;

		float aInner = uInner.a, aMid = uMid.a, aOut = uOut.a;
		vec3 fillCol;
		float fillA;
		if (ld < 0.4) {
			float k = ld / 0.4;
			fillCol = mix(inner, midC, k);
			fillA = mix(aInner, aMid, k);
		} else {
			float k = clamp((ld - 0.4) / 0.6, 0.0, 1.0);
			fillCol = mix(midC, outC, k);
			fillA = mix(aMid, aOut, k);
		}

		// 円の縁を滑らかに（アンチエイリアス）
		float edge = 1.0 - smoothstep(rDyn - 1.0, rDyn + 1.0, d);
		float a = fillA * op * edge;
		col = mix(col, fillCol, a);
		alpha = alpha + a * (1.0 - alpha);

		// リム反射（縁に沿った明るい帯）
		float rim = smoothstep(rDyn * 0.82, rDyn, d) * (1.0 - smoothstep(rDyn, rDyn + 1.0, d));
		float rimA = rim * 0.35 * uGloss * op;
		col = mix(col, uHighlight.rgb, rimA);
		alpha = alpha + rimA * (1.0 - alpha);

		// 輪郭線
		float ring = smoothstep(rDyn - 1.4, rDyn - 0.2, d) * (1.0 - smoothstep(rDyn, rDyn + 1.0, d));
		float ringA = ring * uRing.a * op;
		col = mix(col, uRing.rgb, ringA);
		alpha = alpha + ringA * (1.0 - alpha);

		// メインのハイライト（左上の大きめソフト光）
		vec2 hl = c + vec2(-rDyn * 0.28, -rDyn * 0.32);
		float hd = distance(px, hl);
		float hr = rDyn * 0.28;
		float hlA = (1.0 - smoothstep(hr * 0.2, hr, hd)) * uHighlight.a * op;
		col = mix(col, uHighlight.rgb, hlA);
		alpha = alpha + hlA * (1.0 - alpha);

		// 鋭いスペキュラ光沢（小さく強い光点）
		vec2 sp = c + vec2(-rDyn * 0.34, -rDyn * 0.4);
		float sd = distance(px, sp);
		float sr = rDyn * 0.1;
		float specA = (1.0 - smoothstep(0.0, sr, sd)) * uGloss * op;
		col = mix(col, uHighlight.rgb, specA);
		alpha = alpha + specA * (1.0 - alpha);

		// 下側の弱い反射光（環境光の回り込み）
		vec2 lo = c + vec2(rDyn * 0.22, rDyn * 0.34);
		float lod = distance(px, lo);
		float lor = rDyn * 0.3;
		float loA = (1.0 - smoothstep(lor * 0.2, lor, lod)) * 0.18 * uGloss * op;
		col = mix(col, uHighlight.rgb, loA);
		alpha = alpha + loA * (1.0 - alpha);
	}

	gl_FragColor = vec4(col, alpha);
}
`;

export function BubbleBackground({ gloss = 0.9, wobble = 1 }: Props) {
	const t = useThemeColors();

	// worklet スレッドと共有する状態。
	// - colors: 色・光沢・歪み（JS スレッドで chroma 計算した結果を入れる）
	// - running: アンマウント時に rAF ループを止めるためのフラグ
	const colors = useSharedValue<ResolvedColors>({
		...deriveBubbleColors(t.bg),
		gloss,
		wobble,
	});
	const running = useSharedValue(true);

	// テーマ背景色・props が変わったら JS スレッドで色を計算し直し、
	// sharedValue に書き込む。worklet 側は次フレームで自動的に反映する。
	useEffect(() => {
		colors.value = {
			...deriveBubbleColors(t.bg),
			gloss,
			wobble,
		};
	}, [t.bg, gloss, wobble, colors]);

	// マウント中はループ ON、アンマウントで OFF にしてループを終了させる。
	useEffect(() => {
		running.value = true;
		return () => {
			running.value = false;
		};
	}, [running]);

	const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
		// ここは JS スレッド。GL コンテキスト ID だけを worklet に渡す。
		scheduleOnUI((contextId: number) => {
			"worklet";
			const g = getWorkletContext(contextId);

			if (!g) {
				return;
			}

			const w = g.drawingBufferWidth;
			const h = g.drawingBufferHeight;

			g.viewport(0, 0, w, h); // ← 抜けていたので追加

			const compile = (type: number, src: string) => {
				const s = g.createShader(type);

				if (s) {
					g.shaderSource(s, src);
					g.compileShader(s);
					if (!g.getShaderParameter(s, g.COMPILE_STATUS)) {
						console.error("[GL] compile failed:", g.getShaderInfoLog(s)); // ← iOS で出るか
					}
				}

				return s;
			};

			const prog = g.createProgram();
			const vert = compile(g.VERTEX_SHADER, VERT);

			if (vert) {
				g.attachShader(prog, vert);
			}
			const frag = compile(g.FRAGMENT_SHADER, FRAG);
			if (frag) {
				g.attachShader(prog, frag);
			}

			g.linkProgram(prog);
			if (!g.getProgramParameter(prog, g.LINK_STATUS)) {
				console.error("[GL] link failed:", g.getProgramInfoLog(prog)); // ← 最有力。ここが出る想定
			}
			g.useProgram(prog);

			// 透明描画のためのブレンド設定
			g.enable(g.BLEND);
			g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
			g.clearColor(0, 0, 0, 0);

			// フルスクリーン三角形（2 枚）
			const buf = g.createBuffer();
			g.bindBuffer(g.ARRAY_BUFFER, buf);
			g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), g.STATIC_DRAW);
			const aPos = g.getAttribLocation(prog, "aPos");
			g.enableVertexAttribArray(aPos);
			g.vertexAttribPointer(aPos, 2, g.FLOAT, false, 0, 0);

			// uniform location（すべて worklet 内で取得して保持）
			const uRes = g.getUniformLocation(prog, "uRes");
			const uCount = g.getUniformLocation(prog, "uCount");
			const uBubbles = g.getUniformLocation(prog, "uBubbles");
			const uTime = g.getUniformLocation(prog, "uTime");
			const uInner = g.getUniformLocation(prog, "uInner");
			const uMid = g.getUniformLocation(prog, "uMid");
			const uOut = g.getUniformLocation(prog, "uOut");
			const uRing = g.getUniformLocation(prog, "uRing");
			const uHighlight = g.getUniformLocation(prog, "uHighlight");
			const uGloss = g.getUniformLocation(prog, "uGloss");
			const uWobble = g.getUniformLocation(prog, "uWobble");

			g.uniform2f(uRes, w, h);
			g.uniform1i(uCount, BUBBLE_COUNT);

			// --- バブル初期化（worklet 内で生成。状態は closure に保持される）---
			const bubbles: {
				x: number;
				y: number;
				r: number;
				speed: number;
				opacity: number;
				drift: number;
				phase: number;
				swayPhase: number;
				bobPhase: number;
				bobAmp: number;
				pulsePhase: number;
				pulseAmp: number;
			}[] = [];
			const baseR: number[] = [];
			for (let i = 0; i < BUBBLE_COUNT; i++) {
				const r = 20 + Math.random() * 60;
				bubbles.push({
					x: Math.random() * w,
					y: h + Math.random() * 300,
					r,
					speed: 0.28 + Math.random() * 0.45,
					opacity: 0.18 + Math.random() * 0.22,
					drift: (Math.random() - 0.5) * 0.7,
					phase: Math.random() * Math.PI * 2,
					swayPhase: Math.random() * Math.PI * 2,
					bobPhase: Math.random() * Math.PI * 2,
					bobAmp: 1.5 + Math.random() * 3,
					pulsePhase: Math.random() * Math.PI * 2,
					pulseAmp: 1 + Math.random() * 2.5,
				});
				baseR.push(r);
			}

			const data = new Float32Array(BUBBLE_COUNT * 4);

			// 描画ループ（UI スレッドで回り続ける）
			const draw = (time: number) => {
				if (!running.value) {
					return; // アンマウントされたら終了
				}

				// JS スレッドから更新された色・パラメータを反映（毎フレームでも十分軽い）
				const c = colors.value;
				g.uniform4f(uInner, c.inner[0], c.inner[1], c.inner[2], c.inner[3]);
				g.uniform4f(uMid, c.mid[0], c.mid[1], c.mid[2], c.mid[3]);
				g.uniform4f(uOut, c.out[0], c.out[1], c.out[2], c.out[3]);
				g.uniform4f(uRing, c.ring[0], c.ring[1], c.ring[2], c.ring[3]);
				g.uniform4f(uHighlight, c.highlight[0], c.highlight[1], c.highlight[2], c.highlight[3]);
				g.uniform1f(uGloss, c.gloss);
				g.uniform1f(uWobble, c.wobble);

				g.clear(g.COLOR_BUFFER_BIT);

				for (let i = 0; i < bubbles.length; i++) {
					const b = bubbles[i];
					b.y -= b.speed;

					b.x += Math.sin(time * 0.0008 + b.phase) * b.drift + Math.sin(time * 0.0005 + b.swayPhase) * 0.25;

					b.y += Math.sin(time * 0.0011 + b.bobPhase) * b.bobAmp * 0.02;

					const r = baseR[i] + Math.sin(time * 0.0009 + b.pulsePhase) * b.pulseAmp;

					if (b.y + r < -20) {
						b.y = h + r + Math.random() * 100;
						b.x = Math.random() * w;
					}
					data[i * 4 + 0] = b.x;
					data[i * 4 + 1] = b.y;
					data[i * 4 + 2] = r;
					data[i * 4 + 3] = b.opacity;
				}

				g.uniform1f(uTime, time);
				g.uniform4fv(uBubbles, data);
				g.drawArrays(g.TRIANGLES, 0, 6);
				g.flush();
				g.endFrameEXP();

				requestAnimationFrame(draw);
			};

			requestAnimationFrame(draw);
		}, gl.contextId);
	};

	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 0,
			}}
			transition={{
				backgroundImage: "bouncy",
			}}
			backgroundImage="linear-gradient(180deg, $bgBubbleGradientStart 0%, $bgBubbleGradientEnd 100%)"
		>
			<GLView
				style={[atoms.w_full, atoms.h_full, { backgroundColor: "transparent" }]}
				enableExperimentalWorkletSupport
				onContextCreate={onContextCreate}
			/>
		</View>
	);
}
