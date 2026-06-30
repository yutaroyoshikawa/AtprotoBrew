import { useAtomValue } from "jotai";
import { Theme } from "tamagui";
import { resolvedThemeAtom } from "../../styles/theme/atoms";
import { useApplyPlatformTheme } from "../../styles/theme/useApplyPlatformTheme";
import { useSystemScheme } from "../../styles/theme/useSystemScheme";

/**
 * クロスプラットフォーム Theme プロバイダ。
 *
 * 役割:
 * 1. useSystemScheme(): OS スキーム購読開始
 * 2. useApplyPlatformTheme(resolved): web なら .dark class トグル
 * 3. <Theme name={resolved}>: Tamagui テーマを resolved 値に設定
 *
 * アプリのルートで使用。JotaiProvider と TamaguiProvider でラップ済み前提。
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
	useSystemScheme();

	const resolved = useAtomValue(resolvedThemeAtom);

	useApplyPlatformTheme(resolved);

	return <Theme name={resolved}>{children}</Theme>;
}
