import { atoms as a } from "@atprotobrew/common/alf";
import { useThemeColors } from "@atprotobrew/common/theme";
import { type ReactNode, useCallback, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GROW = 140;

interface ScrollGrowSheetProps {
	hero: ReactNode;
	tabHeader: ReactNode;
	children?: ReactNode;
	/** 最初に見えるタブの高さ。hero に収めたい中身より小さくしすぎないこと */
	peekHeight?: number;
}

export function ScrollGrowSheet({ hero, tabHeader, children, peekHeight = 200 }: ScrollGrowSheetProps) {
	const t = useThemeColors();
	const insets = useSafeAreaInsets();
	const { height: winH } = useWindowDimensions();

	const rootRef = useRef<View>(null);
	// 外側の padding やヘッダーに依存しないよう、実際に画面上で占める領域を測る
	const [box, setBox] = useState({ top: 0, height: winH });
	const onRootLayout = useCallback(() => {
		rootRef.current?.measureInWindow((_x, y, _w, h) => {
			if (h > 0) {
				setBox({ top: y, height: h });
			}
		});
	}, []);

	// 画面上の位置から、実際に必要な safe area のはみ出し量だけを算出（二重加算を防ぐ）
	const topPad = Math.max(0, insets.top - box.top);
	const bottomPad = Math.max(0, box.top + box.height - (winH - insets.bottom));

	const availH = box.height;
	const peekStrip = peekHeight + bottomPad;
	const heroHeight = Math.max(0, availH - peekStrip);
	const dockEnd = heroHeight;
	const dockStart = Math.max(0, dockEnd - GROW);

	const scrollY = useSharedValue(0);
	const onScroll = useAnimatedScrollHandler((e) => {
		scrollY.value = e.contentOffset.y;
	});

	const cardStyle = useAnimatedStyle(() => {
		const r = interpolate(scrollY.value, [dockStart, dockEnd], [24, 0], "clamp");
		const m = interpolate(scrollY.value, [dockStart, dockEnd], [12, 0], "clamp");
		return {
			marginHorizontal: m,
			borderTopLeftRadius: r,
			borderTopRightRadius: r,
		};
	});

	// 上部 safe area はフルスクリーン化に連動して必要量だけ足す
	const headerStyle = useAnimatedStyle(() => ({
		paddingTop: interpolate(scrollY.value, [dockStart, dockEnd], [12, topPad + 8], "clamp"),
	}));

	return (
		<View ref={rootRef} onLayout={onRootLayout} style={[a.flex_1, { backgroundColor: t.bg }]}>
			{/* 固定ヒーロー：はみ出しは隠して中央寄せ（小さくなっても破綻させない） */}
			<View
				pointerEvents="none"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: heroHeight,
					overflow: "hidden",
					justifyContent: "center",
				}}
			>
				{hero}
			</View>

			<Animated.ScrollView
				onScroll={onScroll}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: "transparent" }}
			>
				{/* ヒーローを覗かせる透明スペーサー */}
				<View style={{ height: heroHeight }} />

				{/* カード（タブ → フルスクリーン） */}
				<Animated.View
					style={[
						{ minHeight: availH, backgroundColor: t.bgContrast50 },
						{
							shadowColor: "#000",
							shadowOffset: { width: 0, height: -4 },
							shadowOpacity: 0.12,
							shadowRadius: 16,
							elevation: 16,
						},
						cardStyle,
					]}
				>
					<Animated.View style={[a.px_6, { minHeight: peekStrip, paddingBottom: bottomPad }, headerStyle]}>
						<View
							style={{
								alignSelf: "center",
								width: 40,
								height: 5,
								borderRadius: 999,
								backgroundColor: t.textContrastLow,
								marginBottom: 16,
							}}
						/>
						{tabHeader}
					</Animated.View>

					<View style={[a.px_6]}>{children}</View>
				</Animated.View>
			</Animated.ScrollView>
		</View>
	);
}
