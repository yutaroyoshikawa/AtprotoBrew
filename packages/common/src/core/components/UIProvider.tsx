import type { ReactNode } from "react";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../../../tamagui.config";
import { ThemeProvider } from "./ThemeProvider";

interface UIProviderProps {
	children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
	return (
		<TamaguiProvider config={tamaguiConfig} defaultTheme="light">
			<ThemeProvider>{children}</ThemeProvider>
		</TamaguiProvider>
	);
}
