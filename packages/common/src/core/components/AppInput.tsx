import type { ComponentProps } from "react";
import { Input, styled } from "tamagui";

interface AppInputProps extends ComponentProps<typeof StyledInput> {}

export function AppInput({ prefix, ...props }: AppInputProps) {
	return <StyledInput {...props} />;
}

const StyledInput = styled(Input, {
	width: "100%",
	alignItems: "center",
	paddingHorizontal: "$4",

	borderWidth: 3,
	borderRadius: "$10",
	borderColor: "$inputBorder",

	fontSize: 14,
	fontWeight: 800,
	color: "$inputText",

	backgroundImage: "linear-gradient(176deg, $bgContrast25 0%, $bg 100%)",

	placeholderTextColor: "$textContrastLow",

	outlineWidth: 0,
	outlineStyle: "none",

	hoverStyle: {
		backgroundColor: "$bgContrast25",
	},

	focusStyle: {
		borderColor: "$inputBorderFocus",
		outlineWidth: 0,
		outlineStyle: "none",
	},

	disabledStyle: {
		opacity: 0.55,
		backgroundImage: "linear-gradient(180deg, rgba(245,247,250,0.8) 0%, rgba(225,232,242,0.6) 100%)",
		boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
	},
});
