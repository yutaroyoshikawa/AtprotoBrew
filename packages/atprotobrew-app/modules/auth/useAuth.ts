import type { AtprotoDid, OAuthSession } from "@atproto/oauth-client-expo";
import {
	accountsAtom,
	activeDidAtom,
	addAccountAtom,
	isAccountStoreHydratedAtom,
	removeAccountAtom,
	setActiveDidAtom,
} from "@atprotobrew/common/account/accountStoreAtoms";
import type { StoredAccount } from "@atprotobrew/common/account/types";
import {
	draftAtom,
	perPageAtom,
	removeLauncherLayout,
	storeViewsAtom,
} from "@atprotobrew/common/launcher/launcherStore";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useStore } from "jotai";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { DEFAULT_HANDLE_RESOLVER, getExpoOAuthClient, onSessionDeleted } from "./client";

export type AuthState =
	| { status: "loading" }
	| { status: "unauthenticated" }
	| { status: "switching" }
	| { status: "authenticated"; session: OAuthSession; did: AtprotoDid };

export function useAuth() {
	const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
	const sessionRef = useRef<OAuthSession | null>(null);

	const queryClient = useQueryClient();
	const store = useStore();

	const isHydrated = useAtomValue(isAccountStoreHydratedAtom);
	const accounts = useAtomValue(accountsAtom);
	const activeDid = useAtomValue(activeDidAtom);

	const handleSessionDeleted = useEffectEvent((sub: AtprotoDid) => {
		if (sessionRef.current?.sub !== sub) {
			return;
		}

		sessionRef.current = null;
		store.set(setActiveDidAtom, null);
		setAuthState({ status: "unauthenticated" });
	});

	useEffect(() => onSessionDeleted(handleSessionDeleted), []);

	const resolveHandleResolver = useEffectEvent(
		(did: AtprotoDid) =>
			store.get(accountsAtom).find((a) => a.did === did)?.handleResolver ?? DEFAULT_HANDLE_RESOLVER,
	);

	const onRestoreSuccess = useEffectEvent((session: OAuthSession) => {
		sessionRef.current = session;
		setAuthState({ status: "authenticated", session, did: session.did });
	});

	const onRestoreError = useEffectEvent((did: AtprotoDid) => {
		store.set(removeAccountAtom, did);
		setAuthState({ status: "unauthenticated" });
	});

	useEffect(() => {
		if (!isHydrated) {
			return;
		}

		if (!activeDid) {
			setAuthState({ status: "unauthenticated" });
			return;
		}

		let cancelled = false;
		const oauthClient = getExpoOAuthClient(resolveHandleResolver(activeDid));

		oauthClient
			.restore(activeDid)
			.then((session: OAuthSession) => {
				if (!cancelled) {
					onRestoreSuccess(session);
				}
			})
			.catch(() => {
				if (!cancelled) {
					onRestoreError(activeDid);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [isHydrated, activeDid]);

	const login = async (handle: string, handleResolver: string): Promise<void> => {
		const oauthClient = getExpoOAuthClient(handleResolver);
		const session: OAuthSession = await oauthClient.signIn(handle);

		const now = Date.now();
		const account: StoredAccount = {
			did: session.did,
			handle,
			handleResolver,
			addedAt: now,
			lastUsedAt: now,
		};

		store.set(addAccountAtom, account);
		store.set(setActiveDidAtom, session.did);

		sessionRef.current = session;
		setAuthState({ status: "authenticated", session, did: session.did });
	};

	const logout = async (): Promise<void> => {
		const session = sessionRef.current;

		try {
			await session?.signOut();
		} catch {
			// sign-out errors are non-fatal
		}

		sessionRef.current = null;
		store.set(setActiveDidAtom, null);
		setAuthState({ status: "unauthenticated" });
	};

	const switchAccount = async (targetDid: AtprotoDid): Promise<void> => {
		if (authState.status === "switching") {
			return;
		}

		const currentDid = authState.status === "authenticated" ? authState.did : null;

		if (targetDid === currentDid) {
			return;
		}

		setAuthState({ status: "switching" });

		await queryClient.cancelQueries();
		queryClient.clear();

		store.set(draftAtom, null);
		store.set(storeViewsAtom, []);
		store.set(perPageAtom, 0);

		const targetAccount = store.get(accountsAtom).find((a) => a.did === targetDid);
		const handleResolver = targetAccount?.handleResolver ?? DEFAULT_HANDLE_RESOLVER;
		const oauthClient = getExpoOAuthClient(handleResolver);

		try {
			const session: OAuthSession = await oauthClient.restore(targetDid);

			store.set(setActiveDidAtom, targetDid);

			sessionRef.current = session;
			setAuthState({ status: "authenticated", session, did: session.did });
		} catch {
			store.set(removeAccountAtom, targetDid);
			setAuthState({ status: "unauthenticated" });
		}
	};

	const deleteAccount = async (targetDid: AtprotoDid): Promise<void> => {
		setAuthState({ status: "switching" });

		const targetAccount = store.get(accountsAtom).find((a) => a.did === targetDid);
		const handleResolver = targetAccount?.handleResolver ?? DEFAULT_HANDLE_RESOLVER;

		try {
			const session = await getExpoOAuthClient(handleResolver).restore(targetDid);

			await session.signOut();
		} catch {
			// revoke failure is non-fatal
		}

		removeLauncherLayout(targetDid);
		store.set(removeAccountAtom, targetDid);

		const remaining = store.get(accountsAtom);
		const next = [...remaining].sort((a, b) => b.lastUsedAt - a.lastUsedAt)[0];

		if (next?.did) {
			await switchAccount(next.did);
		} else {
			sessionRef.current = null;
			setAuthState({ status: "unauthenticated" });
		}
	};

	return {
		authState,
		accounts,
		login,
		logout,
		switchAccount,
		deleteAccount,
	};
}
