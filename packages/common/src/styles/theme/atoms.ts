import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { storage } from "./storage";
import { type ResolvedTheme, type SystemScheme, THEME_STORAGE_KEY, type ThemeOverride } from "./types";

/**
 * 永続化される唯一の状態。ユーザーが選択した override 値。
 * 初期描画でストレージ値を即読むため getOnInit: true。
 */
export const themeOverrideAtom = atomWithStorage<ThemeOverride>(THEME_STORAGE_KEY, "system", storage, {
	getOnInit: true,
});

/**
 * OS スキーム (揮発)。购読 hook (useSystemScheme) が更新する。
 */
export const systemSchemeAtom = atom<SystemScheme>("light");

/**
 * 派生: 実適用値 (read-only)。
 * override が 'system' の場合は systemScheme に追従。
 * 'light'/'dark' 固定時は OS に関わらずその値。
 */
export const resolvedThemeAtom = atom<ResolvedTheme>((get) => {
	const override = get(themeOverrideAtom);

	return override === "system" ? get(systemSchemeAtom) : override;
});
