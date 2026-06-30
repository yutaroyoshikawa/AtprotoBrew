import { atoms as a } from "@atprotobrew/common/alf";
import { NotificationList } from "@atprotobrew/common/notifications/components/NotificationList";
import { useMarkNotificationsRead } from "@atprotobrew/common/notifications/modules/useNotificationMutations";
import { useNotifications } from "@atprotobrew/common/notifications/modules/useNotifications";
import { router } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { useAuthContext } from "../../../modules/auth/AuthProvider";

function Screen() {
	const { authState } = useAuthContext();

	if (authState.status !== "authenticated") {
		return null;
	}

	return <ScreenContent session={authState.session} />;
}

export default Screen;

function ScreenContent({ session }: { session: { did: string } & Parameters<typeof useNotifications>[0] }) {
	const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useNotifications(session);

	const { mutate: markRead } = useMarkNotificationsRead(session);

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

	const handleReachEnd = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const handlePressAuthor = (did: string) => {
		router.push({ pathname: "/(app)/profile/[did]", params: { did } });
	};

	return (
		<View style={[a.h_full]}>
			<NotificationList
				notifications={notifications}
				initialUnreadUris={initialUnreadUris.current ?? new Set()}
				isLoading={isPending}
				isFetchingNextPage={isFetchingNextPage}
				onReachEnd={handleReachEnd}
				onPressAuthor={handlePressAuthor}
			/>
		</View>
	);
}
