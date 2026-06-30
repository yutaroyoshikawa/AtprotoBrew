import { type AtIdentifierString, asAtIdentifierString, Client } from "@atproto/lex";
import type { AtprotoDid, OAuthSession } from "@atproto/oauth-client-browser";
import {
	accountsAtom,
	activeDidAtom,
	addAccountAtom,
	removeAccountAtom,
	setActiveDidAtom,
} from "@atprotobrew/common/account/accountStoreAtoms.web";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useStore } from "jotai";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { DEFAULT_HANDLE_RESOLVER, getOAuthClient, onSessionDeleted } from "./useOAuthClient";

export type AuthState =
	| { status: "loading" }
	| { status: "unauthenticated" }
	| { status: "switching" }
	| {
			status: "authenticated";
			client: Client;
			session: OAuthSession;
			identifier: AtIdentifierString;
	  };

const OLD_RESOLVER_KEY = "atprotobrew:handleResolver";

function buildClient(session: OAuthSession): Client {
	return new Client(session, { service: "did:web:brew.tarororo.org#brew_api" });
}

export function useOAuth() {
	const [authState, setAuthState] = useState<AuthState>({ status: "loading" });
	const sessionRef = useRef<OAuthSession | null>(null);

	const queryClient = useQueryClient();
	const store = useStore();

	const accounts = useAtomValue(accountsAtom);

	const onSessionDelete = useEffectEvent(() => {
		sessionRef.current = null;
		store.set(setActiveDidAtom, null);
		setAuthState({ status: "unauthenticated" });
	});

	const runInit = useEffectEvent(async (signal: AbortSignal) => {
		const currentAccounts = store.get(accountsAtom);
		const oldResolver = localStorage.getItem(OLD_RESOLVER_KEY);

		if (currentAccounts.length === 0 && oldResolver) {
			try {
				const oauthClient = await getOAuthClient(oldResolver);
				const result = await oauthClient.init();

				if (result?.session && !signal.aborted) {
					const did = result.session.sub;
					const now = Date.now();

					store.set(addAccountAtom, {
						did,
						handle: did,
						handleResolver: oldResolver,
						addedAt: now,
						lastUsedAt: now,
					});
					store.set(setActiveDidAtom, did);
					localStorage.removeItem(OLD_RESOLVER_KEY);

					sessionRef.current = result.session;
					const client = buildClient(result.session);

					setAuthState({
						status: "authenticated",
						client,
						session: result.session,
						identifier: asAtIdentifierString(did),
					});

					return;
				}
			} catch {
				// migration failure is non-fatal; clean up the stale key
			}

			localStorage.removeItem(OLD_RESOLVER_KEY);
		}

		if (signal.aborted) {
			return;
		}

		const currentActiveDid = store.get(activeDidAtom);

		if (!currentActiveDid) {
			setAuthState({ status: "unauthenticated" });
			return;
		}

		const activeAccount = store.get(accountsAtom).find((a) => a.did === currentActiveDid);
		const handleResolver = activeAccount?.handleResolver ?? DEFAULT_HANDLE_RESOLVER;

		try {
			const oauthClient = await getOAuthClient(handleResolver);

			// Process any pending OAuth callback redirect.
			const initResult = await oauthClient.init();

			if (signal.aborted) {
				return;
			}

			if (initResult?.session) {
				const did = initResult.session.did;

				if (!store.get(accountsAtom).some((a) => a.did === did)) {
					const now = Date.now();

					store.set(addAccountAtom, {
						did,
						handle: did,
						handleResolver,
						addedAt: now,
						lastUsedAt: now,
					});
				}

				store.set(setActiveDidAtom, did);
				sessionRef.current = initResult.session;
				const client = buildClient(initResult.session);

				setAuthState({
					status: "authenticated",
					client,
					session: initResult.session,
					identifier: asAtIdentifierString(did),
				});

				return;
			}

			// No callback — restore existing session.
			const session = await oauthClient.restore(currentActiveDid);

			if (signal.aborted) {
				return;
			}

			sessionRef.current = session;
			const client = buildClient(session);

			setAuthState({
				status: "authenticated",
				client,
				session,
				identifier: asAtIdentifierString(currentActiveDid),
			});
		} catch {
			if (!signal.aborted) {
				store.set(setActiveDidAtom, null);
				setAuthState({ status: "unauthenticated" });
			}
		}
	});

	useEffect(() => {
		const controller = new AbortController();

		const unsubscribe = onSessionDeleted(onSessionDelete);

		runInit(controller.signal).catch(() => {
			if (!controller.signal.aborted) {
				setAuthState({ status: "unauthenticated" });
			}
		});

		return () => {
			controller.abort();
			unsubscribe();
		};
	}, []);

	const login = async (handle: string, handleResolver: string) => {
		const oauthClient = await getOAuthClient(handleResolver);

		sessionStorage.setItem("atprotobrew:pendingHandleResolver", handleResolver);

		await oauthClient.signInRedirect(handle);
	};

	const logout = async () => {
		const session = sessionRef.current;

		try {
			await session?.signOut();
		} catch {
			// ignore errors during sign out
		}

		sessionRef.current = null;
		store.set(setActiveDidAtom, null);
		setAuthState({ status: "unauthenticated" });
	};

	const switchAccount = async (targetDid: AtprotoDid): Promise<void> => {
		if (authState.status === "switching") {
			return;
		}

		const currentDid = authState.status === "authenticated" ? authState.session.sub : null;

		if (targetDid === currentDid) {
			return;
		}

		setAuthState({ status: "switching" });

		await queryClient.cancelQueries();
		queryClient.clear();

		const targetAccount = store.get(accountsAtom).find((a) => a.did === targetDid);
		const handleResolver = targetAccount?.handleResolver ?? DEFAULT_HANDLE_RESOLVER;

		try {
			const oauthClient = await getOAuthClient(handleResolver);
			const session = await oauthClient.restore(targetDid);

			store.set(setActiveDidAtom, targetDid);
			sessionRef.current = session;
			const client = buildClient(session);

			setAuthState({
				status: "authenticated",
				client,
				session,
				identifier: asAtIdentifierString(targetDid),
			});
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
			const oauthClient = await getOAuthClient(handleResolver);
			const session = await oauthClient.restore(targetDid);

			await session.signOut();
		} catch {
			// revoke failure is non-fatal
		}

		store.set(removeAccountAtom, targetDid);

		const remaining = store.get(accountsAtom);
		const next = [...remaining].sort((a, b) => b.lastUsedAt - a.lastUsedAt)[0];

		if (next) {
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
