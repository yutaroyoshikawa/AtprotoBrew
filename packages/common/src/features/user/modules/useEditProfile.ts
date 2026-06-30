"use client";

import { type Agent, xrpc } from "@atproto/lex";
import * as com from "@atprotobrew/atproto/lexicons/com";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface PendingImage {
	uri: string;
	data: Uint8Array;
	mimeType: `${string}/${string}`;
}

export interface EditProfileInput {
	displayName: string;
	description: string;
	website: string;
	pronouns: string;
	pendingAvatar?: PendingImage;
	pendingBanner?: PendingImage;
}

async function uploadBlob(agent: Agent, image: PendingImage): Promise<unknown> {
	const res = await xrpc(agent, com.atproto.repo.uploadBlob.main, {
		body: image.data,
		encoding: image.mimeType,
	});

	return res.body.blob;
}

async function editProfile(agent: Agent, input: EditProfileInput): Promise<void> {
	const did = agent.did;
	if (!did) {
		throw new Error("Not authenticated");
	}

	let existing: Record<string, unknown> = {};
	let existingCid: string | undefined;

	try {
		const getRes = await xrpc(agent, com.atproto.repo.getRecord.main, {
			params: { repo: did, collection: "app.bsky.actor.profile", rkey: "self" },
		});

		existing = getRes.body.value;
		existingCid = getRes.body.cid;
	} catch (err) {
		if (!isRecordNotFound(err)) {
			throw err;
		}
	}

	const avatarBlobRef = input.pendingAvatar ? await uploadBlob(agent, input.pendingAvatar) : undefined;
	const bannerBlobRef = input.pendingBanner ? await uploadBlob(agent, input.pendingBanner) : undefined;

	await xrpc(agent, com.atproto.repo.putRecord.main, {
		body: {
			repo: did,
			collection: "app.bsky.actor.profile",
			rkey: "self",
			swapRecord: existingCid,
			record: {
				...existing,
				$type: "app.bsky.actor.profile",
				displayName: input.displayName || undefined,
				description: input.description || undefined,
				website: input.website || undefined,
				pronouns: input.pronouns || undefined,
				...(avatarBlobRef ? { avatar: avatarBlobRef } : {}),
				...(bannerBlobRef ? { banner: bannerBlobRef } : {}),
			},
		},
	});
}

function isRecordNotFound(err: unknown): boolean {
	return typeof err === "object" && err !== null && "error" in err && err.error === "RecordNotFound";
}

export function isInvalidSwap(err: unknown): boolean {
	return typeof err === "object" && err !== null && "error" in err && err.error === "InvalidSwap";
}

export function useEditProfile(agent: Agent, actor: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: EditProfileInput) => editProfile(agent, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile", actor] });
		},
	});
}
