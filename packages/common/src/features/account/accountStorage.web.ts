import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import { type AccountStoreState, accountStoreStateSchema, DEFAULT_ACCOUNT_STORE_STATE } from "./types";

export const ACCOUNT_STORE_KEY = "atprotobrew:account_store";

export const accountStorage: SyncStorage<AccountStoreState> = {
	getItem: (key, initialValue) => {
		const raw = localStorage.getItem(key);

		if (!raw) {
			return initialValue;
		}

		const result = accountStoreStateSchema.safeParse(JSON.parse(raw));
		return result.success ? result.data : initialValue;
	},
	setItem: (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	},
	removeItem: (key) => {
		localStorage.removeItem(key);
	},
};

export { DEFAULT_ACCOUNT_STORE_STATE };
