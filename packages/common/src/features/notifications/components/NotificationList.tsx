import { useLingui } from "@lingui/react/macro";
import { ActivityIndicator, FlatList, type ListRenderItem, Text, View } from "react-native";
import { atoms as a } from "../../../styles/alf";
import { useThemeColors } from "../../../styles/theme";
import type { Notification } from "../modules/useNotifications";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
	notifications: Notification[];
	initialUnreadUris: ReadonlySet<string>;
	isLoading: boolean;
	isFetchingNextPage: boolean;
	onReachEnd: () => void;
	onPressAuthor: (did: string) => void;
}

export function NotificationList({
	notifications,
	initialUnreadUris,
	isLoading,
	isFetchingNextPage,
	onReachEnd,
	onPressAuthor,
}: NotificationListProps) {
	const tc = useThemeColors();
	const { t } = useLingui();

	if (isLoading) {
		return (
			<View style={[a.flex_1, a.justify_center, a.items_center]}>
				<ActivityIndicator />
			</View>
		);
	}

	const renderItem: ListRenderItem<Notification> = ({ item }) => (
		<NotificationItem
			notification={item}
			isInitiallyUnread={initialUnreadUris.has(item.uri)}
			onPressAuthor={onPressAuthor}
		/>
	);

	return (
		<FlatList
			data={notifications}
			keyExtractor={(item) => item.uri}
			renderItem={renderItem}
			onEndReached={onReachEnd}
			onEndReachedThreshold={0.3}
			initialNumToRender={20}
			maxToRenderPerBatch={20}
			ListFooterComponent={
				isFetchingNextPage ? (
					<View style={[a.py_4]}>
						<ActivityIndicator />
					</View>
				) : null
			}
			ListEmptyComponent={
				<View style={[a.justify_center, a.items_center, a.py_12]}>
					<Text style={[a.text_sm, { color: tc.textContrastMedium }]}>{t`まだ通知はありません`}</Text>
				</View>
			}
		/>
	);
}
