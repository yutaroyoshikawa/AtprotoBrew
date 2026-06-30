import { createAnimations } from "@tamagui/animations-css";
import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "@tamagui/core";
import { media, mergedThemes, mergedTokens, shorthands } from "./tamagui.config.base";

const animations = createAnimations({
	fast: "ease-in-out 150ms",
	medium: "ease-in-out 250ms",
	slow: "ease-in-out 350ms",
	bouncy: "cubic-bezier(0.5, 1.25, 0.5, 1) 300ms",
});

export const tamaguiConfig = createTamagui({
	...defaultConfig,
	animations,
	tokens: mergedTokens,
	themes: mergedThemes,
	media,
	shorthands,
});

export type AppConfig = typeof tamaguiConfig;

declare module "@tamagui/core" {
	interface TamaguiCustomConfig extends AppConfig {}
}
