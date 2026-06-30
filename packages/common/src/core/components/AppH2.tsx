// AppH2.tsx — 変更不要だが fontWeight 等あれば文字列化
import type { ComponentProps, ReactNode } from "react";
import { H2, styled } from "tamagui";

interface AppH2Props extends ComponentProps<typeof StyledH2> {
	children: ReactNode;
}

export function AppH2({ children, ...props }: AppH2Props) {
	return <StyledH2 {...props}>{children}</StyledH2>;
}

const StyledH2 = styled(H2, {});
