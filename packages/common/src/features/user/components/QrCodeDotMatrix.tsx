import QRCode from "qrcode";
import { useEffect, useMemo } from "react";
import Animated, {
	Extrapolation,
	interpolate,
	type SharedValue,
	useAnimatedProps,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Circle, G, Rect, Svg } from "react-native-svg";

interface QrCodeDotMatrixProps {
	value: string;
	size: number;
	foreground?: string;
	background?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ANIM_TOTAL_MS = 1000;
const ANIM_DOT_MS = 400;

function buildMatrix(value: string): boolean[][] {
	const data = QRCode.create(value, { errorCorrectionLevel: "M" });
	const n = data.modules.size;
	return Array.from({ length: n }, (_, row) =>
		Array.from({ length: n }, (_, col) => data.modules.data[row * n + col] === 1),
	);
}

function Dot({
	cx,
	cy,
	r,
	fill,
	start,
	end,
	progress,
}: {
	cx: number;
	cy: number;
	r: number;
	fill: string;
	start: number;
	end: number;
	progress: SharedValue<number>;
}) {
	const animatedProps = useAnimatedProps(() => ({
		opacity: interpolate(progress.value, [start, end], [0, 1], Extrapolation.CLAMP),
	}));

	return <AnimatedCircle cx={cx} cy={cy} r={r} fill={fill} animatedProps={animatedProps} />;
}

export function QrCodeDotMatrix({ value, size, foreground = "#000000", background = "#ffffff" }: QrCodeDotMatrixProps) {
	const matrix = useMemo(() => buildMatrix(value), [value]);
	const cellSize = size / matrix.length;
	const r = cellSize * 0.45;

	const progress = useSharedValue(0);

	const delays = useMemo(() => {
		const maxDelayMs = ANIM_TOTAL_MS - ANIM_DOT_MS;
		return matrix.map((row) => row.map(() => Math.random() * maxDelayMs));
	}, [matrix]);

	useEffect(() => {
		progress.value = 0;
		progress.value = withTiming(1, { duration: ANIM_TOTAL_MS });
	}, [progress]);

	return (
		<Svg width={size} height={size}>
			<Rect x={0} y={0} width={size} height={size} fill={background} />
			<G>
				{matrix.flatMap((row, ri) =>
					row.map((on, ci) => {
						if (!on) {
							return null;
						}
						const start = delays[ri][ci] / ANIM_TOTAL_MS;
						const end = Math.min(start + ANIM_DOT_MS / ANIM_TOTAL_MS, 1);
						return (
							<Dot
								key={`${ri}-${ci}`}
								cx={ci * cellSize + cellSize / 2}
								cy={ri * cellSize + cellSize / 2}
								r={r}
								fill={foreground}
								start={start}
								end={end}
								progress={progress}
							/>
						);
					}),
				)}
			</G>
		</Svg>
	);
}
