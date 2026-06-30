import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import { MMKV } from "react-native-mmkv";
import { type ThemeOverride, themeOverrideSchema } from "./types";

const mmkv = new MMKV();

export const storage: SyncStorage<ThemeOverride> = {
	getItem: (key, initial) => {
		const v = mmkv.getString(key);

		if (!v) {
			return initial;
		}

		const result = themeOverrideSchema.safeParse(JSON.parse(v));

		return result.success ? result.data : initial;
	},
	setItem: (key, value) => mmkv.set(key, JSON.stringify(value)),
	removeItem: (key) => mmkv.delete(key),
};
