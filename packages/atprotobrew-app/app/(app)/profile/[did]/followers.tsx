import { useLocalSearchParams } from "expo-router";
import { useAuthContext } from "../../../../modules/auth/AuthProvider";
import { SocialGraphListWithNav } from "../../../../modules/user/SocialGraphListWithNav";

export default function FollowersScreen() {
	const { did } = useLocalSearchParams<{ did: string }>();
	const { authState } = useAuthContext();

	if (authState.status !== "authenticated" || !did) {
		return null;
	}

	return (
		<SocialGraphListWithNav
			actor={did}
			agent={authState.session}
			currentUserDid={authState.session.did}
			initialTab="followers"
		/>
	);
}
