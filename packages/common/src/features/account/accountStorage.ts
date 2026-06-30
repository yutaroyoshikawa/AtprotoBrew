import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import { MMKV } from "react-native-mmkv";
import { type AccountStoreState, accountStoreStateSchema, DEFAULT_ACCOUNT_STORE_STATE } from "./types";

export const ACCOUNT_STORE_KEY = "atprotobrew:account_store";

const mmkv = new MMKV({ id: "account" });

export const accountStorage: SyncStorage<AccountStoreState> = {
	getItem: (key, initialValue) => {
		const raw = mmkv.getString(key);

		if (!raw) {
			return initialValue;
		}

		const result = accountStoreStateSchema.safeParse(JSON.parse(raw));
		return result.success ? result.data : initialValue;
	},
	setItem: (key, value) => {
		mmkv.set(key, JSON.stringify(value));
	},
	removeItem: (key) => {
		mmkv.delete(key);
	},
};

export function readInitialAccountState(): AccountStoreState {
	return accountStorage.getItem(ACCOUNT_STORE_KEY, DEFAULT_ACCOUNT_STORE_STATE);
}

export { DEFAULT_ACCOUNT_STORE_STATE };
