import { atoms as a } from "@atprotobrew/common/alf";
import { UserProfileView } from "@atprotobrew/common/user/components/UserProfileView";
import { router, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { View } from "react-native";
import { useAuthContext } from "../../../../modules/auth/AuthProvider";
import {
	ProfileEditBottomSheet,
	type ProfileEditBottomSheetMethods,
} from "../../../../modules/user/ProfileEditBottomSheet";

export default function ProfileScreen() {
	const { did } = useLocalSearchParams<{ did: string }>();
	const { authState } = useAuthContext();
	const sheetRef = useRef<ProfileEditBottomSheetMethods>(null);

	if (authState.status !== "authenticated" || !did) {
		return null;
	}

	const isOwnProfile = did === authState.session.did;

	return (
		<View style={[a.h_full, a.w_full]}>
			<UserProfileView
				actor={did}
				agent={authState.session}
				currentUserDid={authState.session.did}
				onNavigateToFollows={() =>
					router.push({
						pathname: "/(app)/profile/[did]/follows",
						params: { did },
					})
				}
				onNavigateToFollowers={() =>
					router.push({
						pathname: "/(app)/profile/[did]/followers",
						params: { did },
					})
				}
				onEditProfile={isOwnProfile ? () => sheetRef.current?.open() : undefined}
			/>

			{isOwnProfile && <ProfileEditBottomSheet ref={sheetRef} agent={authState.session} actor={did} />}
		</View>
	);
}
