import { createAnimations } from "@tamagui/animations-react-native";
import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "@tamagui/core";
import { media, mergedThemes, mergedTokens, shorthands } from "./tamagui.config.base";

const animations = createAnimations({
	fast: { type: "timing", duration: 150 },
	medium: { type: "timing", duration: 250 },
	slow: { type: "timing", duration: 350 },
	bouncy: { type: "spring", damping: 12, mass: 0.9, stiffness: 180 },
} as const);

export const tamaguiConfig = createTamagui({
	...defaultConfig,
	animations,
	tokens: mergedTokens,
	themes: mergedThemes,
	media,
	shorthands: {
		...defaultConfig.shorthands,
		...shorthands,
	},
});

export type AppConfig = typeof tamaguiConfig;

declare module "@tamagui/core" {
	interface TamaguiCustomConfig extends AppConfig {}
}
