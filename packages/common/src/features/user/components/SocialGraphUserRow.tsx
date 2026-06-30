import type { DidString } from "@atproto/lex";
import { Image, Pressable, Text, View } from "react-native";
import { atoms as a } from "../../../styles/alf";
import { useThemeColors } from "../../../styles/theme";
import type { SocialGraphProfile } from "../modules/useSocialGraph";
import { FollowButton } from "./FollowButton";

interface SocialGraphUserRowProps {
	profile: SocialGraphProfile;
	currentUserDid: string | undefined;
	followUri: string | null | undefined;
	onFollow: (did: DidString) => void;
	onUnfollow: (followUri: string) => void;
	isMutating: boolean;
	onNavigateToProfile?: (did: string) => void;
}

export function SocialGraphUserRow({
	profile,
	currentUserDid,
	followUri,
	onFollow,
	onUnfollow,
	isMutating,
	onNavigateToProfile,
}: SocialGraphUserRowProps) {
	const tc = useThemeColors();

	const isSelf = currentUserDid === profile.did;
	const isFollowing = followUri !== null && typeof followUri !== "undefined";

	const handleFollowPress = () => {
		if (isFollowing && followUri) {
			onUnfollow(followUri);
		} else {
			onFollow(profile.did);
		}
	};

	const displayName = profile.displayName ?? profile.handle;

	return (
		<View
			style={[
				a.flex_row,
				a.items_center,
				{
					paddingHorizontal: 16,
					paddingVertical: 12,
					gap: 12,
					borderBottomWidth: 1,
					borderBottomColor: tc.bgContrast25,
					height: 80,
				},
			]}
		>
			<Pressable
				onPress={() => onNavigateToProfile?.(profile.did)}
				accessibilityRole="button"
				style={[a.flex_row, a.items_center, { flex: 1, gap: 12 }]}
			>
				{profile.avatar ? (
					<Image source={{ uri: profile.avatar }} style={{ width: 44, height: 44, borderRadius: 22 }} />
				) : (
					<View
						style={{
							width: 44,
							height: 44,
							borderRadius: 22,
							backgroundColor: tc.bgContrast50,
						}}
					/>
				)}

				<View style={[a.flex_1]}>
					<Text style={{ color: tc.text, fontSize: 15, fontWeight: "600" }} numberOfLines={1}>
						{displayName}
					</Text>
					<Text style={{ color: tc.textContrastMedium, fontSize: 13, marginTop: 2 }} numberOfLines={1}>
						@{profile.handle}
					</Text>
				</View>
			</Pressable>

			{!isSelf && (
				<FollowButton isFollowing={isFollowing} isMutating={isMutating} onPress={handleFollowPress} size="sm" />
			)}
		</View>
	);
}
