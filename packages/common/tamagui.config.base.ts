import { themes } from "@atprotobrew/tokens/themes";
import { tokens } from "@atprotobrew/tokens/tokens";
import { defaultConfig } from "@tamagui/config/v5";
import { createTokens } from "@tamagui/core";

export const media = {
	sm: { maxWidth: 640 },
	md: { maxWidth: 768 },
	lg: { maxWidth: 1024 },
	xl: { maxWidth: 1280 },
};

export const shorthands = {
	borderRadius: "borderRadius",
	justifyContent: "justifyContent",
	alignItems: "alignItems",
	backgroundColor: "backgroundColor",
	textAlign: "textAlign",
	paddingHorizontal: "paddingHorizontal",
	paddingTop: "paddingTop",
	paddingVertical: "paddingVertical",
	paddingBottom: "paddingBottom",
	zIndex: "zIndex",
	bottom: "bottom",
} as const;

export const settings = {
	fastSchemeChange: true,
} as const;

// Strip `true` from custom tokens so Tamagui's default $true aliases (e.g. size.$true=44
// for Button height) are not zeroed out by the Style Dictionary generated `true: 0` entries.
const { true: _st, ...customSize } = tokens.size;
const { true: _sp, ...customSpace } = tokens.space;
const { true: _zi, ...customZIndex } = tokens.zIndex;

export const mergedTokens = createTokens({
	...defaultConfig.tokens,
	color: tokens.color,
	space: { ...defaultConfig.tokens.space, ...customSpace },
	size: { ...defaultConfig.tokens.size, ...customSize },
	radius: { ...defaultConfig.tokens.radius, ...tokens.radius },
	zIndex: { ...defaultConfig.tokens.zIndex, ...customZIndex },
});

// Deep-merge per theme so Tamagui's built-in variables (e.g. `color` used by Text/H3
// as the default text color) are preserved. On native there is no CSS color inheritance,
// so missing `color` causes text to be invisible even when web looks fine.
export const mergedThemes = {
	...defaultConfig.themes,
	light: { ...defaultConfig.themes.light, ...themes.light },
	dark: { ...defaultConfig.themes.dark, ...themes.dark },
};
