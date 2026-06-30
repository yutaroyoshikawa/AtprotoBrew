import type { ComponentProps, ReactNode } from "react";
import { styled, YStack } from "tamagui";

interface AppVStackProps extends ComponentProps<typeof StyledYStack> {
	children: ReactNode;
}

export function AppVStack({ children, ...props }: AppVStackProps) {
	return <StyledYStack {...props}>{children}</StyledYStack>;
}

const StyledYStack = styled(YStack, {
	width: "100%",
});
