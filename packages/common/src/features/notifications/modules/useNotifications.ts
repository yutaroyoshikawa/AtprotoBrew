import type { Agent } from "@atproto/lex";
import { xrpc } from "@atproto/lex";
import * as app from "@atprotobrew/atproto/lexicons/app";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export type Notification = app.bsky.notification.listNotifications.Notification;

const NOTIFICATIONS_PAGE_LIMIT = 50;
const initialPageParam: string | undefined = undefined;

export function useNotifications(agent: Agent, reasons?: string[]) {
	const activeReasons = reasons ?? ["follow"];

	return useInfiniteQuery({
		queryKey: ["notifications", agent.did, activeReasons],
		queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
			xrpc(agent, app.bsky.notification.listNotifications.main, {
				params: {
					limit: NOTIFICATIONS_PAGE_LIMIT,
					cursor: pageParam,
					reasons: activeReasons,
				},
			}),
		initialPageParam,
		getNextPageParam: (lastPage) => lastPage.body.cursor,
		staleTime: 60_000,
	});
}

export function useUnreadNotificationCount(agent: Agent) {
	return useQuery({
		queryKey: ["notifications", "unread", agent.did],
		queryFn: () => xrpc(agent, app.bsky.notification.getUnreadCount.main, { params: {} }),
		select: (res) => res.body.count,
		staleTime: 30_000,
		refetchInterval: 60_000,
	});
}
