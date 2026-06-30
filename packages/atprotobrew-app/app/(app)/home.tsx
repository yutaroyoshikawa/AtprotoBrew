import type { AtprotoDid } from "@atproto/did";
import type { OAuthSession } from "@atproto/oauth-client-expo";
import type { StoredAccount } from "@atprotobrew/common/account/types";
import { atoms as a } from "@atprotobrew/common/alf";
import { useFetchLaunchers } from "@atprotobrew/common/channel/modules/launchersHooks";
import { AppFooter } from "@atprotobrew/common/core/components/AppFooter";
import { BubbleBackground } from "@atprotobrew/common/core/components/Background";
import { modeAtom } from "@atprotobrew/common/launcher/launcherStore";
import { useUnreadNotificationCount } from "@atprotobrew/common/notifications/modules/useNotifications";
import { useThemeColors } from "@atprotobrew/common/theme";
import { useLingui } from "@lingui/react/macro";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { Settings } from "lucide-react-native";
import { Suspense } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthContext } from "../../modules/auth/AuthProvider";
import { LauncherScreen } from "../../modules/launcher/LauncherScreen";
import { UserMenuButton } from "../../modules/user/UserMenuButton";

export default function Home() {
	const { authState, accounts, logout, switchAccount, deleteAccount } = useAuthContext();

	if (authState.status !== "authenticated") {
		return null;
	}

	return (
		<Suspense fallback={<LoadingView />}>
			<HomeScreenContent
				session={authState.session}
				accounts={accounts}
				logout={logout}
				switchAccount={switchAccount}
				deleteAccount={deleteAccount}
			/>
		</Suspense>
	);
}

interface HomeScreenContentProps {
	session: OAuthSession;
	accounts: StoredAccount[];
	logout: () => Promise<void>;
	switchAccount: (did: AtprotoDid) => Promise<void>;
	deleteAccount: (did: AtprotoDid) => Promise<void>;
}

function HomeScreenContent({ session, accounts, logout, switchAccount, deleteAccount }: HomeScreenContentProps) {
	const { data } = useFetchLaunchers({ agent: session });
	const { data: unreadCount = 0 } = useUnreadNotificationCount(session);
	const tc = useThemeColors();
	const insets = useSafeAreaInsets();
	const { t } = useLingui();
	const mode = useAtomValue(modeAtom);

	return (
		<View style={[a.h_full]}>
			<BubbleBackground />

			<View style={[a.h_full, a.flex_col]}>
				<LauncherScreen storeViews={data.body.items} />
				<AppFooter
					onRequestOpenNotifications={() => router.push("/(app)/notifications")}
					unreadNotificationCount={unreadCount}
					onRequestOpenSocialGraph={() => router.push("/(app)/social-graph")}
				/>
			</View>

			{mode === "VIEW" && (
				<View style={[a.absolute, a.z_10, { top: insets.top + 8, left: 16 }]}>
					<Pressable
						onPress={() => router.push("/(app)/settings")}
						accessibilityRole="button"
						style={({ pressed }) => [
							a.flex_row,
							a.items_center,
							{
								borderRadius: 999,
								backgroundColor: tc.bgContrast25,
								opacity: pressed ? 0.7 : 1,
							},
						]}
						aria-label={t`設定`}
					>
						<View style={[a.p_3]}>
							<Settings color={tc.textContrastMedium} />
						</View>
					</Pressable>
				</View>
			)}

			{mode === "VIEW" && (
				<UserMenuButton
					did={session.did}
					accounts={accounts}
					onLogout={logout}
					onSwitchAccount={switchAccount}
					onDeleteAccount={deleteAccount}
				/>
			)}
		</View>
	);
}

function LoadingView() {
	return (
		<View style={[a.h_full, a.justify_center]}>
			<ActivityIndicator />
		</View>
	);
}
