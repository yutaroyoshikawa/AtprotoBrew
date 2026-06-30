import { type Agent, asAtIdentifierString, xrpc } from "@atproto/lex";
import * as app from "@atprotobrew/atproto/lexicons/app";
import { useQuery } from "@tanstack/react-query";

export type UserProfile = app.bsky.actor.getProfile.$OutputBody;

const BSKY_PUBLIC_API = "https://public.api.bsky.app";

async function fetchUserProfile(actor: string, agent?: Agent): Promise<UserProfile> {
	const res = await xrpc(agent ?? BSKY_PUBLIC_API, app.bsky.actor.getProfile.main, {
		params: { actor: asAtIdentifierString(actor) },
	});

	return res.body;
}

export function useUserProfile(actor: string, agent?: Agent) {
	return useQuery<UserProfile>({
		queryKey: ["profile", actor, agent?.did ?? "public"],
		queryFn: () => fetchUserProfile(actor, agent),
		staleTime: 5 * 60 * 1000,
	});
}
