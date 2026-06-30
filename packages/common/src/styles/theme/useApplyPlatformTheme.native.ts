import type { ResolvedTheme } from "./types";

/**
 * native: no-op
 * Tamagui の <Theme> で完結するため実装不要。
 * 必要に応じて StatusBar の色切替などはここに追加可能。
 */
export function useApplyPlatformTheme(_resolved: ResolvedTheme): void {
	// no-op
}
