/**
 * @atprotobrew/common の theme パッケージの公開 API。
 *
 * 利用側 (web/native アプリ) は基本的に以下だけを使う:
 * - <ThemeProvider>: ルートでラップ
 * - <ThemeToggle>: UI コンポーネント、トグル表示
 * - useThemeToggle(): UI 不要な場合の hook
 *
 * atoms 等の直接 export は高度な用途向け。
 */

export { ThemeProvider } from "../../core/components/ThemeProvider";
export { ThemeToggle } from "../../core/components/ThemeToggle";
export {
	resolvedThemeAtom,
	systemSchemeAtom,
	themeOverrideAtom,
} from "./atoms";
export type { ResolvedTheme, SystemScheme, ThemeOverride } from "./types";
export { THEME_STORAGE_KEY } from "./types";
export { useApplyPlatformTheme } from "./useApplyPlatformTheme";
export { useSystemScheme } from "./useSystemScheme";
export { useThemeColors } from "./useThemeColors";
export type { UseThemeToggleReturn } from "./useThemeToggle";
export { useThemeToggle } from "./useThemeToggle";
