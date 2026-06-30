import type { Agent, DidString } from "@atproto/lex";
import { useCallback, useState } from "react";
import type { SocialGraphProfile } from "./useSocialGraph";
import { useFollowUser, useUnfollowUser } from "./useSocialGraphMutations";

export function useFollowActions(agent: Agent) {
	const [followOverrides, setFollowOverrides] = useState<Map<string, string | null>>(new Map());
	const [mutatingDids, setMutatingDids] = useState<Set<string>>(new Set());

	const followMutation = useFollowUser(agent);
	const unfollowMutation = useUnfollowUser(agent);

	const handleFollow = useCallback(
		(did: DidString) => {
			setMutatingDids((prev) => new Set(prev).add(did));

			followMutation.mutate(did, {
				onSuccess: (data) => {
					setFollowOverrides((prev) => {
						const next = new Map(prev);
						next.set(did, data.uri);

						return next;
					});
				},
				onSettled: () => {
					setMutatingDids((prev) => {
						const next = new Set(prev);
						next.delete(did);

						return next;
					});
				},
			});
		},
		[followMutation],
	);

	const handleUnfollow = useCallback(
		(did: DidString, followUri: string) => {
			setMutatingDids((prev) => new Set(prev).add(did));

			unfollowMutation.mutate(followUri, {
				onSuccess: () => {
					setFollowOverrides((prev) => {
						const next = new Map(prev);
						next.set(did, null);

						return next;
					});
				},
				onSettled: () => {
					setMutatingDids((prev) => {
						const next = new Set(prev);
						next.delete(did);

						return next;
					});
				},
			});
		},
		[unfollowMutation],
	);

	const resolvedFollowUri = (profile: SocialGraphProfile): string | null => {
		if (followOverrides.has(profile.did)) {
			return followOverrides.get(profile.did) ?? null;
		}
		return profile.viewer?.following ?? null;
	};

	const isMutating = (did: DidString) => mutatingDids.has(did);

	return { handleFollow, handleUnfollow, resolvedFollowUri, isMutating };
}
