import type { ComponentProps, ReactNode } from "react";
import { Form, styled } from "tamagui";

interface AppFormProps extends ComponentProps<typeof StyledForm> {
	children: ReactNode;
}

export function AppForm({ children, ...props }: AppFormProps) {
	return <StyledForm {...props}>{children}</StyledForm>;
}

const StyledForm = styled(Form, { width: "100%" });

interface AppFormTriggerProps extends ComponentProps<typeof Form.Trigger> {
	children: ReactNode;
}

export function AppFormTrigger({ children, ...props }: AppFormTriggerProps) {
	return <Form.Trigger {...props}>{children}</Form.Trigger>;
}
