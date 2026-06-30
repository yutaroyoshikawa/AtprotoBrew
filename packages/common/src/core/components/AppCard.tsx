import type { ComponentProps, ReactNode } from "react";
import { styled, View } from "tamagui";
import { aeroGlassShadow } from "../../styles/helper/aero-shadow";

interface AppCardProps extends ComponentProps<typeof StyledView> {
	children: ReactNode;
}

export function AppCard({ children, ...props }: AppCardProps) {
	return <StyledView {...props}>{children}</StyledView>;
}

const StyledView = styled(View, {
	width: "100%",
	boxSizing: "border-box",
	borderRadius: "$8",
	paddingHorizontal: "$3",
	paddingVertical: "$8",
	boxShadow: aeroGlassShadow(),
});
