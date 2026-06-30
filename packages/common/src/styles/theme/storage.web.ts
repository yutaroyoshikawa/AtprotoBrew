import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import { type ThemeOverride, themeOverrideSchema } from "./types";

export const storage: SyncStorage<ThemeOverride> = {
	getItem: (key, initial) => {
		const v = localStorage.getItem(key);

		if (!v) {
			return initial;
		}

		const result = themeOverrideSchema.safeParse(JSON.parse(v));

		return result.success ? result.data : initial;
	},
	setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
	removeItem: (key) => localStorage.removeItem(key),
};
