import QRCode from "qrcode";
import { useMemo } from "react";
import { Circle, G, Rect, Svg } from "react-native-svg";

interface QrCodeDotMatrixProps {
	value: string;
	size: number;
	foreground?: string;
	background?: string;
}

function buildMatrix(value: string): boolean[][] {
	const data = QRCode.create(value, { errorCorrectionLevel: "M" });
	const n = data.modules.size;

	return Array.from({ length: n }, (_, row) =>
		Array.from({ length: n }, (_, col) => data.modules.data[row * n + col] === 1),
	);
}

export function QrCodeDotMatrix({ value, size, foreground = "#000000", background = "#ffffff" }: QrCodeDotMatrixProps) {
	const matrix = useMemo(() => buildMatrix(value), [value]);
	const cellSize = size / matrix.length;
	const r = cellSize * 0.45;

	return (
		<Svg width={size} height={size}>
			<Rect x={0} y={0} width={size} height={size} fill={background} />
			<G>
				{matrix.flatMap((row, ri) =>
					row.map((on, ci) =>
						on ? (
							<Circle
								key={`${ri}-${ci}`}
								cx={ci * cellSize + cellSize / 2}
								cy={ri * cellSize + cellSize / 2}
								r={r}
								fill={foreground}
							/>
						) : null,
					),
				)}
			</G>
		</Svg>
	);
}
