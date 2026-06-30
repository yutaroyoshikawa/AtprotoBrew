import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCOUNT_STORE_KEY, accountStorage } from "./accountStorage";
import { type AccountStoreState, accountStoreStateSchema, DEFAULT_ACCOUNT_STORE_STATE } from "./types";

const OLD_KEY = "@atprotobrew/account_store";

/**
 * Migrates account data from the legacy AsyncStorage key to MMKV.
 * Returns the migrated AccountStoreState if migration happened, null otherwise.
 * Safe to call on every launch — no-ops if MMKV already has data.
 */
export async function migrateAccountStorage(): Promise<AccountStoreState | null> {
	const existing = accountStorage.getItem(ACCOUNT_STORE_KEY, DEFAULT_ACCOUNT_STORE_STATE);

	if (existing.accounts.length > 0 || existing.activeDid !== null) {
		return null;
	}

	try {
		const raw = await AsyncStorage.getItem(OLD_KEY);

		if (!raw) {
			return null;
		}

		const result = accountStoreStateSchema.safeParse(JSON.parse(raw));

		if (!result.success) {
			return null;
		}

		accountStorage.setItem(ACCOUNT_STORE_KEY, result.data);

		await AsyncStorage.removeItem(OLD_KEY);
		return result.data;
	} catch {
		return null;
	}
}
