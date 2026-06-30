import { aero } from "@atprotobrew/tokens/aero";

// Frutiger Aero の標準ガラス影 (Web 用 box-shadow 文字列)
export const aeroGlassShadow = (hover = false) =>
	`0 ${hover ? 5 : 2}px 8px ${hover ? aero.glassShadowHover : aero.glassShadowSoft}, inset 0 1px 0 ${aero.glassShadowHighlight}`;

// Native 用 shadow* props (inset は表現不可)
export const aeroGlassShadowNative = (hover = false) => ({
	shadowColor: hover ? aero.glassShadowHover : aero.glassShadowSoft,
	shadowOffset: { width: 0, height: hover ? 5 : 2 },
	shadowOpacity: 1,
	shadowRadius: 8,
});
