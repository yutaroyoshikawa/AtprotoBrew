import { useLingui } from "@lingui/react/macro";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Image, Pressable, Text, View } from "react-native";
import { atoms as a } from "../../../styles/alf";
import { useThemeColors } from "../../../styles/theme";
import type { Notification } from "../modules/useNotifications";

interface NotificationItemProps {
	notification: Notification;
	isInitiallyUnread: boolean;
	onPressAuthor: (did: string) => void;
}

export function NotificationItem({ notification, isInitiallyUnread, onPressAuthor }: NotificationItemProps) {
	const tc = useThemeColors();
	const { t, i18n } = useLingui();

	const { author } = notification;
	const displayName = author.displayName ?? author.handle;

	const relativeTime = formatDistanceToNow(new Date(notification.indexedAt), {
		addSuffix: true,
		locale: i18n.locale === "ja" ? ja : undefined,
	});

	return (
		<Pressable
			onPress={() => onPressAuthor(author.did)}
			accessibilityRole="button"
			style={[
				a.flex_row,
				a.items_center,
				a.px_4,
				a.py_3,
				a.gap_3,
				a.border_b,
				{ borderBottomColor: tc.bgContrast25 },
			]}
		>
			{isInitiallyUnread && (
				<View style={[a.absolute, a.top_0, a.bottom_0, a.left_0, { width: 3, backgroundColor: tc.accent }]} />
			)}

			{author.avatar ? (
				<Image
					source={{ uri: author.avatar }}
					style={[a.rounded_full, { width: 44, height: 44 }]}
					accessibilityLabel=""
				/>
			) : (
				<View style={[a.rounded_full, { width: 44, height: 44, backgroundColor: tc.bgContrast50 }]} />
			)}

			<View style={[a.flex_1]}>
				<Text style={[a.text_sm, { color: tc.text }]} numberOfLines={2}>
					<Text style={[a.font_semibold]}>{displayName}</Text>
					{"  "}
					{t`があなたをフォローしました`}
				</Text>

				<Text style={[a.text_xs, a.mt_1, { color: tc.textContrastMedium }]}>
					@{author.handle}
					{"  ·  "}
					{relativeTime}
				</Text>
			</View>
		</Pressable>
	);
}
