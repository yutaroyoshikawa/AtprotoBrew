import { type AgentConfig, Client } from "@atproto/lex";
import { useMemo } from "react";
import { useOAuth } from "./useOAuth";

export function useAtProtoClient(): Client | null {
	const { authState } = useOAuth();

	return useMemo(() => {
		if (authState.status !== "authenticated") {
			return null;
		}

		const session = authState.session;
		const client = new Client({
			service: session.pdsUrl,
			token: session.accessToken,
		} as AgentConfig);

		client.headers.set("atproto-proxy", "did:web:brew.tarororo.org");
		client.headers.set("authorization", `Bearer ${session.accessToken}`);

		return client;
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
