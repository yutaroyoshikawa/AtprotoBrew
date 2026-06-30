import type { ComponentProps, ReactNode } from "react";
import { Label, styled } from "tamagui";

interface AppLabelProps extends ComponentProps<typeof StyledLabel> {
	children: ReactNode;
}

export function AppLabel({ children, ...props }: AppLabelProps) {
	return (
		<StyledLabel {...props} aria-required>
			{children}
		</StyledLabel>
	);
}

const StyledLabel = styled(Label, {
	fontSize: 16,
	lineHeight: "$1",
	fontWeight: 800,
	color: "$text",
	paddingVertical: "$3",
});
