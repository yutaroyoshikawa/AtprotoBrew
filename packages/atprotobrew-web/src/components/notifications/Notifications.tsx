import type { Client } from "@atproto/lex";
import { useMarkNotificationsRead } from "@atprotobrew/common/notifications/modules/useNotificationMutations";
import { useNotifications } from "@atprotobrew/common/notifications/modules/useNotifications";
import { useLingui } from "@lingui/react/macro";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

interface NotificationsProps {
	client: Client;
}

export function Notifications({ client }: NotificationsProps) {
	const { t, i18n } = useLingui();

	const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useNotifications(client);

	const { mutate: markRead } = useMarkNotificationsRead(client);

	const initialUnreadUris = useRef<Set<string> | null>(null);

	const notifications = useMemo(() => data?.pages.flatMap((p) => p.body.notifications) ?? [], [data]);

	useEffect(() => {
		if (data && initialUnreadUris.current === null) {
			const firstPage = data.pages[0]?.body.notifications ?? [];

			initialUnreadUris.current = new Set(firstPage.filter((n) => !n.isRead).map((n) => n.uri));
		}
	}, [data]);

	useEffect(() => {
		markRead();
	}, [markRead]);

	if (isPending) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (notifications.length === 0) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-sm text-textContrastMedium">{t`まだ通知はありません`}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1">
			<ul>
				{notifications.map((n) => {
					const isInitiallyUnread = initialUnreadUris.current?.has(n.uri) ?? false;
					const displayName = n.author.displayName ?? n.author.handle;
					const relativeTime = formatDistanceToNow(new Date(n.indexedAt), {
						addSuffix: true,
						locale: i18n.locale === "ja" ? ja : undefined,
					});

					return (
						<li
							key={n.uri}
							className="relative flex items-center gap-3 px-4 py-3 border-b border-bgContrast25"
						>
							{isInitiallyUnread && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent" />}

							<Link to={`/profile/${n.author.did}`} className="flex items-center gap-3 flex-1 min-w-0">
								{n.author.avatar ? (
									<img
										src={n.author.avatar}
										alt=""
										className="w-11 h-11 rounded-full shrink-0 object-cover"
									/>
								) : (
									<div className="w-11 h-11 rounded-full shrink-0 bg-bgContrast50" />
								)}

								<div className="flex flex-col min-w-0">
									<p className="text-sm text-text truncate">
										<span className="font-semibold">{displayName}</span>
										{"  "}
										{t`があなたをフォローしました`}
									</p>
									<p className="text-xs text-textContrastMedium mt-0.5 truncate">
										@{n.author.handle}
										{"  ·  "}
										{relativeTime}
									</p>
								</div>
							</Link>
						</li>
					);
				})}
			</ul>

			{hasNextPage && (
				<div className="flex justify-center py-4">
					{isFetchingNextPage ? (
						<div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
					) : (
						<button
							type="button"
							onClick={() => fetchNextPage()}
							className="text-sm text-accent hover:underline cursor-pointer"
						>
							{t`さらに読み込む`}
						</button>
					)}
				</div>
			)}
		</div>
	);
}
