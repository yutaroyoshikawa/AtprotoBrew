import type { ComponentProps, ReactNode } from "react";
import { Button, styled, Text } from "tamagui";

interface AppButtonProps extends ComponentProps<typeof StyledButton> {
	onPress?: () => void;
	children?: ReactNode;
}

export function AppButton({ onPress, children, shape, variant, ...props }: AppButtonProps) {
	return (
		<StyledButton onPress={onPress} shape={shape} variant={variant} {...props}>
			<StyledText>{children}</StyledText>
		</StyledButton>
	);
}

const StyledButton = styled(Button, {
	cursor: "pointer",
	height: 44,
	justifyContent: "center",
	alignItems: "center",
	borderWidth: 2,
	color: "$textContrastMedium",

	transition: {
		scale: "bouncy",
		backgroundImage: "bouncy",
	},

	pressStyle: { scale: 0.95 },

	variants: {
		variant: {
			primary: {
				backgroundImage: "linear-gradient(177deg, $primaryGradientStart 20%, $primaryGradientEnd 100%)",
				borderColor: "$buttonBorder",
			},
			secondary: {
				backgroundImage: "none",
				backgroundColor: "$bgContrast50",
				borderWidth: 0,
			},
			outlined: {
				backgroundImage: "none",
				backgroundColor: "transparent",
				borderWidth: 1,
				borderColor: "$buttonBorder",
			},
			glossy: {
				backgroundImage: "linear-gradient(180deg, $pillGradientStart 0%, $pillGradientEnd 100%)",
				borderWidth: 1,
				borderColor: "$pillBorder",
				shadowColor: "$pillGradientEnd",
				shadowOpacity: 0.45,
				shadowRadius: 12,
				shadowOffset: { width: 0, height: 6 },
				elevation: 6,
				pressStyle: { scale: 0.97 },
			},
		},
		shape: {
			tile: {
				flex: 0,
				padding: 0,
				borderRadius: "$4",
			},
			circle: {
				flex: 0,
				shrink: 0,
				padding: 0,
				width: 40,
				height: 40,
				borderRadius: 9999,
				overflow: "hidden",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "row",
			},
			pill: {
				flex: 0,
				borderRadius: 9999,
				height: 48,
			},
		},
		buttonSize: { large: { height: 60, width: 60 } },
	} as const,

	defaultVariants: { shape: "tile", variant: "primary" },
});

const StyledText = styled(Text, {
	fontWeight: "bold",
	color: "$textContrastMedium",

	variants: {
		variant: {
			glossy: { color: "white" },
		},
	} as const,
});
