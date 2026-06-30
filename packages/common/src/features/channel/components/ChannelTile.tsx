import type { ComponentProps, ReactNode } from "react";
import { Defs, Path, Stop, Svg, LinearGradient as SvgGradient } from "react-native-svg";
import { styled, View } from "tamagui";

interface ChannelTileProps extends ComponentProps<typeof ChannelTileBase> {
	children?: ReactNode;
	intensity: number;
}

export function ChannelTile({ children, intensity, ...props }: ChannelTileProps) {
	return (
		<ChannelTileBase {...props}>
			{children}

			<TileGloss intensity={intensity} />
		</ChannelTileBase>
	);
}

const ChannelTileBase = styled(View, {
	position: "relative",
	overflow: "hidden",
	width: 80,
	height: 80,
	justifyContent: "center",
	alignItems: "center",
	borderRadius: "$8",
	borderWidth: 1,
	borderColor: "rgba(255,255,255,0.3)",

	variants: {
		variant: {
			filled: {
				backgroundColor: "rgba(180,215,255,0.15)",
				boxShadow:
					"0 6px 20px rgba(70,140,235,0.35), 0 1px 3px rgba(30,80,170,0.25), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -10px 22px rgba(120,180,255,0.28)",
				hoverStyle: {
					y: -1,
					boxShadow:
						"0 10px 28px rgba(70,140,235,0.55), 0 2px 4px rgba(30,80,170,0.3), inset 0 1px 0 rgba(255,255,255,1), inset 0 -10px 22px rgba(120,180,255,0.32)",
				},
				pressStyle: {
					y: 1,
					boxShadow:
						"0 3px 10px rgba(70,140,235,0.4), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -6px 14px rgba(120,180,255,0.25)",
				},
			},
			empty: {
				backgroundColor: "rgba(255,255,255,0.01)",
				borderStyle: "dashed",
				borderColor: "rgba(255,255,255,0)",
				boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
			},
			compact: {
				width: 80,
				height: 80,
				backgroundColor: "rgba(180,215,255,0.25)",
				boxShadow:
					"0 4px 14px rgba(70,140,235,0.35), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -8px 16px rgba(120,180,255,0.28)",
				hoverStyle: {
					y: -1,
					boxShadow:
						"0 8px 20px rgba(70,140,235,0.5), inset 0 1px 0 rgba(255,255,255,1), inset 0 -8px 16px rgba(120,180,255,0.32)",
				},
			},
			compactEmpty: {
				width: 80,
				height: 80,
				backgroundColor: "rgba(255,255,255,0.06)",
				borderStyle: "dotted",
				borderWidth: 0,
				borderColor: "$primary",
			},
		},
	} as const,

	defaultVariants: { variant: "filled" },
});

interface TileGlossProps {
	intensity?: number;
}

export function TileGloss({ intensity = 0.85 }: TileGlossProps) {
	return (
		<Svg
			pointerEvents="none"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
		>
			<Defs>
				<SvgGradient id="tileGloss" x1="0" y1="0" x2="0" y2="1">
					<Stop offset="0" stopColor="#ffffff" stopOpacity={intensity} />
					<Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
				</SvgGradient>
			</Defs>

			<Path d="M0 0 H100 V42 Q50 62 0 42 Z" fill="url(#tileGloss)" />
		</Svg>
	);
}
