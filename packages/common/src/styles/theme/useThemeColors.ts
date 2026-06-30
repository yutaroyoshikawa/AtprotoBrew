import { themes } from "@atprotobrew/tokens/themes"; // SD 生成の TS オブジェクト
import { useAtomValue } from "jotai";
import { resolvedThemeAtom } from "../theme/atoms"; // 既存の jotai atom

/**
 * ALF (素の RN プリミティブ) でテーマ色を参照するためのフック。
 * jotai の resolvedThemeAtom に追従し、Tamagui の <Theme> と同じ色・同じ
 * 切替タイミングで light/dark の色オブジェクトを返す。
 *
 * @example
 *   const c = useThemeColors()
 *   <View style={[a.p_4, {backgroundColor: c.bg}]}>
 *     <Text style={[a.text_md, {color: c.text}]} />
 *   </View>
 */
export function useThemeColors(): ThemeColors {
	const resolved = useAtomValue(resolvedThemeAtom); // 'light' | 'dark'

	return themes[resolved];
}

// 色オブジェクトの型。light/dark はキー集合が同一なので light から導出する。
export type ThemeColors = (typeof themes)["light"] | (typeof themes)["dark"];

// 色キーのユニオン ('bg' | 'text' | 'accent' | ...)。型注釈に便利。
export type ThemeColorKey = keyof ThemeColors;
