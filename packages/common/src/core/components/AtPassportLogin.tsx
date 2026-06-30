import { AtPassportIcon, AtPassportUI } from "@atpassport/client/ui";
import type { ComponentProps } from "react";
import { Button, styled, Text, useTheme } from "tamagui";
import type { AppLanguage } from "../types/i18n";

interface AtPassportLoginProps extends ComponentProps<typeof StyledButton> {
	lang: AppLanguage;
}

export function AtPassportLogin(props: AtPassportLoginProps) {
	const theme = useTheme();

	return (
		<StyledButton {...props} icon={<AtPassportIcon color={theme.primary.get()} />}>
			{props.lang === "ja" && <StyledText>{AtPassportUI.ja.title}</StyledText>}
			{props.lang === "en" && <StyledText>{AtPassportUI.en.title}</StyledText>}
		</StyledButton>
	);
}

const StyledButton = styled(Button, {
	width: "100%",
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
	columnGap: "$2",
	backgroundColor: "$bg",
	borderWidth: 1,
	borderColor: "$primary",
	borderRadius: "$3",
	paddingHorizontal: "$2",
	paddingVertical: "$5",
});

const StyledText = styled(Text, {
	textAlign: "center",
	color: "$primary",
	fontWeight: "800",
});
