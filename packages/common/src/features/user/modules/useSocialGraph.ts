import { type Agent, asAtIdentifierString, xrpc } from "@atproto/lex";
import * as app from "@atprotobrew/atproto/lexicons/app";
import { useInfiniteQuery } from "@tanstack/react-query";

const BSKY_PUBLIC_API = "https://public.api.bsky.app";

export type SocialGraphProfile = app.bsky.graph.getFollows.$OutputBody["follows"][number];

async function fetchFollows(
	actor: string,
	cursor: string | undefined,
	agent?: Agent,
): Promise<app.bsky.graph.getFollows.$OutputBody> {
	const res = await xrpc(agent ?? BSKY_PUBLIC_API, app.bsky.graph.getFollows.main, {
		params: {
			actor: asAtIdentifierString(actor),
			cursor,
			limit: 50,
		},
	});

	return res.body;
}

async function fetchFollowers(
	actor: string,
	cursor: string | undefined,
	agent?: Agent,
): Promise<app.bsky.graph.getFollowers.$OutputBody> {
	const res = await xrpc(agent ?? BSKY_PUBLIC_API, app.bsky.graph.getFollowers.main, {
		params: {
			actor: asAtIdentifierString(actor),
			cursor,
			limit: 50,
		},
	});

	return res.body;
}

export function useFollows(actor: string, agent?: Agent) {
	return useInfiniteQuery({
		queryKey: ["follows", actor, agent?.did ?? "public"],
		queryFn: ({ pageParam }: { pageParam: string | undefined }) => fetchFollows(actor, pageParam, agent),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage: app.bsky.graph.getFollows.$OutputBody) => lastPage.cursor,
	});
}

export function useFollowers(actor: string, agent?: Agent) {
	return useInfiniteQuery({
		queryKey: ["followers", actor, agent?.did ?? "public"],
		queryFn: ({ pageParam }: { pageParam: string | undefined }) => fetchFollowers(actor, pageParam, agent),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage: app.bsky.graph.getFollowers.$OutputBody) => lastPage.cursor,
	});
}
