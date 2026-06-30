import type { ComponentProps, ReactNode } from "react";
import { styled, Text } from "tamagui";

interface AppTextProps extends ComponentProps<typeof StyledText> {
	children: ReactNode;
}

export function AppText({ children, ...props }: AppTextProps) {
	return <StyledText {...props}>{children}</StyledText>;
}

const StyledText = styled(Text, {
	fontSize: 14, // 0.875rem = 14px
	color: "$text", // ベーステキスト色を明示 (テーマ追従)

	variants: {
		kind: {
			default: {
				width: "100%",
			},
			error: {
				color: "$negative", // "red" → トークン。#ef4444
				fontSize: 12, // 0.75rem = 12px
			},
		},
	} as const,

	defaultVariants: {
		kind: "default",
	},
});
