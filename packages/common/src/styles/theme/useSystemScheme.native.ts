import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { Appearance } from "react-native";
import { systemSchemeAtom } from "./atoms";

/**
 * native: Appearance でネイティブのカラースキーム変化を購読。
 * マウント時に現在値をセット、リアルタイムで追従。
 */
export function useSystemScheme() {
	const set = useSetAtom(systemSchemeAtom);

	useEffect(() => {
		set((prev) => {
			const colorScheme = Appearance.getColorScheme();

			if (colorScheme === "dark" || colorScheme === "light") {
				return colorScheme;
			}

			return prev;
		});

		const sub = Appearance.addChangeListener(({ colorScheme }) =>
			set((prev) => {
				if (colorScheme === "dark" || colorScheme === "light") {
					return colorScheme;
				}

				return prev;
			}),
		);

		return () => {
			sub.remove();
		};
	}, [set]);
}
