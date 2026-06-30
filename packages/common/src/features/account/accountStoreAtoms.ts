import type { AtprotoDid } from "@atproto/did";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ACCOUNT_STORE_KEY, accountStorage, readInitialAccountState } from "./accountStorage";
import type { StoredAccount } from "./types";

const accountStoreAtom = atomWithStorage(ACCOUNT_STORE_KEY, readInitialAccountState(), accountStorage);

export const isAccountStoreHydratedAtom = atom<boolean>(true);

export const accountsAtom = atom<StoredAccount[]>((get) => get(accountStoreAtom).accounts);

export const activeDidAtom = atom<AtprotoDid | null>((get) => get(accountStoreAtom).activeDid);

export const addAccountAtom = atom(null, (_get, set, account: StoredAccount) => {
	set(accountStoreAtom, (prev) => ({
		...prev,
		accounts: [...prev.accounts.filter((a) => a.did !== account.did), account],
	}));
});

export const removeAccountAtom = atom(null, (_get, set, did: AtprotoDid) => {
	set(accountStoreAtom, (prev) => ({
		accounts: prev.accounts.filter((a) => a.did !== did),
		activeDid: prev.activeDid === did ? null : prev.activeDid,
	}));
});

export const setActiveDidAtom = atom(null, (_get, set, did: AtprotoDid | null) => {
	set(accountStoreAtom, (prev) => ({
		accounts: prev.accounts.map((a) => (a.did === did ? { ...a, lastUsedAt: Date.now() } : a)),
		activeDid: did,
	}));
});
