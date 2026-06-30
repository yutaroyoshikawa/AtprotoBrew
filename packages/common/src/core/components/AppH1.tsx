// AppH1.tsx
import type { ComponentProps, ReactNode } from "react";
import { H1, styled } from "tamagui";

interface AppH1Props extends ComponentProps<typeof StyledH1> {
	children: ReactNode;
}

export function AppH1({ children, ...props }: AppH1Props) {
	return <StyledH1 {...props}>{children}</StyledH1>;
}

const StyledH1 = styled(H1, {
	fontSize: 24, // 1.5rem = 24px
	fontWeight: "800",
});
