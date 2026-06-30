import type { Agent } from "@atproto/lex";
import { useLingui } from "@lingui/react/macro";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Text } from "tamagui";
import { atoms as a } from "../../../styles/alf";
import { useUserProfile } from "../modules/useUserProfile";
import { UserProfileHeader } from "./UserProfileHeader";

interface UserProfileViewProps {
	actor: string;
	agent: Agent | undefined;
	currentUserDid: string | undefined;
	onNavigateToFollows: () => void;
	onNavigateToFollowers: () => void;
	onEditProfile?: () => void;
}

export function UserProfileView({
	actor,
	agent,
	currentUserDid,
	onNavigateToFollows,
	onNavigateToFollowers,
	onEditProfile,
}: UserProfileViewProps) {
	const { t } = useLingui();
	const { data: profile, isPending, isError } = useUserProfile(actor, agent);

	if (isPending) {
		return (
			<View style={[a.flex_1, a.justify_center, a.items_center]}>
				<ActivityIndicator />
			</View>
		);
	}

	if (isError || !profile) {
		return (
			<View style={[a.flex_1, a.justify_center, a.items_center]}>
				<Text color="$textContrastMedium">{t`プロフィールの読み込みに失敗しました`}</Text>
			</View>
		);
	}

	return (
		<ScrollView style={[a.flex_1]} contentContainerStyle={{ paddingBottom: 32 }}>
			<UserProfileHeader
				profile={profile}
				currentUserDid={currentUserDid}
				agent={agent}
				onNavigateToFollows={onNavigateToFollows}
				onNavigateToFollowers={onNavigateToFollowers}
				onEditProfile={onEditProfile}
			/>
		</ScrollView>
	);
}
