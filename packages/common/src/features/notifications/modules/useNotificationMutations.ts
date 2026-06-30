import type { Agent } from "@atproto/lex";
import { currentDatetimeString, xrpc } from "@atproto/lex";
import * as app from "@atprotobrew/atproto/lexicons/app";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMarkNotificationsRead(agent: Agent) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			xrpc(agent, app.bsky.notification.updateSeen.main, {
				body: { seenAt: currentDatetimeString() },
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["notifications", "unread", agent.did],
			});
		},
	});
}
