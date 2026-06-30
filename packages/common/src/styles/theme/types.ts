import { z } from "zod";

export const themeOverrideSchema = z.enum(["light", "dark", "system"]);

export type ThemeOverride = z.infer<typeof themeOverrideSchema>;
export type SystemScheme = "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export function isTheme(value: string): value is ThemeOverride {
	return themeOverrideSchema.safeParse(value).success;
}

/**
 * 永続化キー。FOUC 対策スクリプト (web/index.html) と必ず一致させること。
 * キー・JSON 形式の変更時は両方を同期する。
 */
export const THEME_STORAGE_KEY = "theme-override";
