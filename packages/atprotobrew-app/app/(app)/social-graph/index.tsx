import type { AtprotoDid } from "@atproto/did";
import { useThemeColors } from "@atprotobrew/common/theme";
import { useUserProfile } from "@atprotobrew/common/user/modules/useUserProfile";
import { useLingui } from "@lingui/react/macro";
import { Stack } from "expo-router";
import { QrCode } from "lucide-react-native";
import { type RefObject, useRef } from "react";
import { Pressable } from "react-native";
import { useAuthContext } from "../../../modules/auth/AuthProvider";
import {
	ProfileQrCodeBottomSheet,
	type ProfileQrCodeBottomSheetMethods,
} from "../../../modules/user/ProfileQrCodeBottomSheet";
import { SocialGraphListWithNav } from "../../../modules/user/SocialGraphListWithNav";

function Screen() {
	const { authState } = useAuthContext();
	const { t } = useLingui();
	const tc = useThemeColors();
	const qrSheetRef = useRef<ProfileQrCodeBottomSheetMethods>(null);

	if (authState.status !== "authenticated") {
		return null;
	}

	const did = authState.session.did;

	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<Pressable
							onPress={() => qrSheetRef.current?.present()}
							accessibilityRole="button"
							accessibilityLabel={t`QR コードで共有`}
							style={({ pressed }) => ({
								opacity: pressed ? 0.6 : 1,
								marginRight: 4,
							})}
						>
							<QrCode size={22} color={tc.text} />
						</Pressable>
					),
				}}
			/>
			<SocialGraphListWithNav actor={did} agent={authState.session} currentUserDid={did} />
			<ProfileQrCodeBottomSheetWithProfile qrSheetRef={qrSheetRef} did={did} agent={authState.session} />
		</>
	);
}

function ProfileQrCodeBottomSheetWithProfile({
	qrSheetRef,
	did,
	agent,
}: {
	qrSheetRef: RefObject<ProfileQrCodeBottomSheetMethods | null>;
	did: AtprotoDid;
	agent: Parameters<typeof useUserProfile>[1];
}) {
	const { data: profile } = useUserProfile(did, agent);

	return (
		<ProfileQrCodeBottomSheet
			ref={qrSheetRef}
			did={did}
			displayName={profile?.displayName}
			handle={profile?.handle ?? did}
			avatarUri={profile?.avatar}
		/>
	);
}

export default Screen;
