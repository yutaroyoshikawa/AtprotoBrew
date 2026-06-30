import { Client } from "@atproto/lex";
import { useMemo } from "react";
import { useOAuth } from "./useOAuth";

export function useAtProtoClient(): Client | null {
	const { authState } = useOAuth();

	return useMemo(() => {
		if (authState.status !== "authenticated") {
			return null;
		}

		const session = authState.session;
		return new Client(session, {
			service: "did:web:brew.tarororo.org#brew_api",
		});
	}, [authState]);
}

export function useAtProtoSession() {
	const { authState } = useOAuth();

	return authState.status === "authenticated" ? authState.session : null;
}

export function useUserDid(): string | null {
	const { authState } = useOAuth();

	return authState.status === "authenticated" ? authState.session.sub : null;
}
