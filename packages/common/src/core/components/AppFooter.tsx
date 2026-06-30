import { useLingui } from "@lingui/react/macro";
import { Bell, Users } from "lucide-react-native";
import { styled, useTheme, View, XStack } from "tamagui";
import { NotificationBadge } from "../../features/notifications/components/NotificationBadge";
import { AppButton } from "./AppButton";
import { AtprotobrewLogoType } from "./AtprotobrewLogoType";

interface AppFooterProps {
	onRequestOpenNotifications?: () => void;
	unreadNotificationCount?: number;
	onRequestOpenSocialGraph?: () => void;
}

export function AppFooter({
	onRequestOpenNotifications,
	unreadNotificationCount = 0,
	onRequestOpenSocialGraph,
}: AppFooterProps) {
	const t = useTheme();
	const { t: tl } = useLingui();

	const count = unreadNotificationCount;
	const bellLabel = count > 0 ? tl`通知 ${count} 件の未読があります` : tl`通知`;

	return (
		<StyledWrapper>
			<Background />

			<StyledNavigation>
				<View style={{ position: "relative" }}>
					<AppButton
						onPress={onRequestOpenNotifications}
						shape="circle"
						variant="primary"
						buttonSize="large"
						aria-label={bellLabel}
					>
						<Bell color={t.textContrastMedium.val} />
					</AppButton>

					<NotificationBadge count={unreadNotificationCount} />
				</View>

				<View height={80} width={120} paddingTop="$4">
					<AtprotobrewLogoType />
				</View>

				<AppButton
					onPress={onRequestOpenSocialGraph}
					shape="circle"
					variant="primary"
					buttonSize="large"
					aria-label="ソーシャルグラフ"
				>
					<Users color={t.textContrastMedium.val} />
				</AppButton>
			</StyledNavigation>
		</StyledWrapper>
	);
}

const StyledWrapper = styled(View, {
	width: "100%",
	position: "relative",
});

const StyledNavigation = styled(XStack, {
	width: "100%",
	height: 50,
	alignItems: "center",
	justifyContent: "space-between",
	paddingHorizontal: "$5",
	paddingBottom: "$10",
	zIndex: 1,
});

const Background = styled(View, {
	position: "absolute",
	zIndex: 0,
	bottom: 0,
	width: "100%",
	height: 80,
	backgroundColor: "$bg",
});
