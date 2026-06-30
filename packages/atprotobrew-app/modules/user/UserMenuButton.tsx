import type { AtprotoDid } from "@atproto/oauth-client-expo";
import type { StoredAccount } from "@atprotobrew/common/account/types";
import { useThemeColors } from "@atprotobrew/common/theme";
import { UserMenuItems } from "@atprotobrew/common/user/components/UserMenuItems";
import { UserMenuTrigger } from "@atprotobrew/common/user/components/UserMenuTrigger";
import { useUserProfile } from "@atprotobrew/common/user/modules/useUserProfile";
import { type BottomSheetMethods, BottomSheetModal, BottomSheetView } from "@expo/ui/community/bottom-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileQrCodeBottomSheet, type ProfileQrCodeBottomSheetMethods } from "./ProfileQrCodeBottomSheet";

interface UserMenuButtonProps {
	did: AtprotoDid;
	accounts: StoredAccount[];
	onLogout: () => void | Promise<void>;
	onSwitchAccount: (did: AtprotoDid) => void | Promise<void>;
	onDeleteAccount: (did: AtprotoDid) => void | Promise<void>;
}

export function UserMenuButton({ did, accounts, onLogout, onSwitchAccount, onDeleteAccount }: UserMenuButtonProps) {
	const tc = useThemeColors();
	const insets = useSafeAreaInsets();
	const sheetRef = useRef<BottomSheetMethods>(null);
	const qrSheetRef = useRef<ProfileQrCodeBottomSheetMethods>(null);
	const { data: profile } = useUserProfile(did);

	const handleNavigateToProfile = () => {
		router.push({ pathname: "/(app)/profile/[did]", params: { did } });
	};

	return (
		<>
			<View style={[styles.triggerWrapper, { top: insets.top + 8, right: 16 }]}>
				<UserMenuTrigger actor={did} onPress={() => sheetRef.current?.present()} />
			</View>

			<BottomSheetModal
				ref={sheetRef}
				enableDynamicSizing
				enablePanDownToClose
				backgroundStyle={{ backgroundColor: tc.bgContrast25 }}
				handleIndicatorStyle={{ backgroundColor: tc.textContrastLow }}
			>
				<BottomSheetView style={[styles.sheetContent, { paddingBottom: insets.bottom + 16 }]}>
					<UserMenuItems
						accounts={accounts}
						activeDid={did}
						onSwitchAccount={onSwitchAccount}
						onAddAccount={onLogout}
						onLogout={onLogout}
						onDeleteAccount={onDeleteAccount}
						onDismiss={() => sheetRef.current?.dismiss()}
						onNavigateToProfile={handleNavigateToProfile}
						onShowQrCode={() => qrSheetRef.current?.present()}
					/>
				</BottomSheetView>
			</BottomSheetModal>

			<ProfileQrCodeBottomSheet
				ref={qrSheetRef}
				did={did}
				displayName={profile?.displayName}
				handle={profile?.handle ?? did}
				avatarUri={profile?.avatar}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	triggerWrapper: {
		position: "absolute",
		zIndex: 10,
	},
	sheetContent: {
		paddingHorizontal: 20,
	},
});
