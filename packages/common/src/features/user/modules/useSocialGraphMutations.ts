import { type Agent, currentDatetimeString, type DidString, xrpc } from "@atproto/lex";
import * as app from "@atprotobrew/atproto/lexicons/app";
import * as com from "@atprotobrew/atproto/lexicons/com";
import type { $OutputBody as CreateRecordOutput } from "@atprotobrew/atproto/lexicons/com/atproto/repo/createRecord";
import { useMutation } from "@tanstack/react-query";

async function followUser(agent: Agent, subjectDid: DidString): Promise<CreateRecordOutput> {
	const did = agent.did;

	if (!did) {
		throw new Error("Not authenticated");
	}

	const record = app.bsky.graph.follow.$build({
		subject: subjectDid,
		createdAt: currentDatetimeString(),
	});

	const res = await xrpc(agent, com.atproto.repo.createRecord.main, {
		body: {
			repo: did,
			collection: app.bsky.graph.follow.$nsid,
			record,
		},
	});

	return res.body;
}

async function unfollowUser(agent: Agent, followUri: string): Promise<void> {
	const did = agent.did;

	if (!did) {
		throw new Error("Not authenticated");
	}

	const parts = followUri.split("/");
	const rkey = parts[parts.length - 1] ?? "";

	await xrpc(agent, com.atproto.repo.deleteRecord.main, {
		body: {
			repo: did,
			collection: app.bsky.graph.follow.$nsid,
			rkey,
		},
	});
}

export function useFollowUser(agent: Agent) {
	return useMutation({
		mutationFn: (subjectDid: DidString) => followUser(agent, subjectDid),
	});
}

export function useUnfollowUser(agent: Agent) {
	return useMutation({
		mutationFn: (followUri: string) => unfollowUser(agent, followUri),
	});
}
