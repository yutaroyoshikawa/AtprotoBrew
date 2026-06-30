import type { Agent } from "@atproto/lex";
import { useLingui } from "@lingui/react/macro";
import { ExternalLink, Package } from "lucide-react-native";
import { Image, Linking, Pressable, View } from "react-native";
import { styled, Text, XStack, YStack } from "tamagui";
import { useThemeColors } from "../../../styles/theme";
import { useFollowActions } from "../modules/useFollowActions";
import type { UserProfile } from "../modules/useUserProfile";
import { FollowButton } from "./FollowButton";

interface UserProfileHeaderProps {
	profile: UserProfile;
	currentUserDid: string | undefined;
	agent: Agent | undefined;
	onNavigateToFollows: () => void;
	onNavigateToFollowers: () => void;
	onEditProfile?: () => void;
}

export function UserProfileHeader({
	profile,
	currentUserDid,
	agent,
	onNavigateToFollows,
	onNavigateToFollowers,
	onEditProfile,
}: UserProfileHeaderProps) {
	const tc = useThemeColors();
	const { t, i18n } = useLingui();

	const isSelf = currentUserDid === profile.did;
	const isFollowedBy = !!profile.viewer?.followedBy;
	const isMuted = !!profile.viewer?.muted;
	const isBlocking = !!profile.viewer?.blocking;
	const isBlockedBy = !!profile.viewer?.blockedBy;
	const knownFollowers = profile.viewer?.knownFollowers;
	const displayName = profile.displayName ?? profile.handle;

	const sinceDate = profile.createdAt
		? new Date(profile.createdAt).toLocaleDateString(i18n.locale, {
				year: "numeric",
				month: "long",
			})
		: null;

	const handleOpenWebsite = () => {
		const url = profile.website;

		if (url && /^https?:\/\//i.test(url)) {
			Linking.openURL(url);
		}
	};

	return (
		<YStack>
			<View style={{ height: 120, backgroundColor: tc.bgContrast25 }}>
				{profile.banner && (
					<Image
						source={{ uri: profile.banner }}
						style={{ width: "100%", height: "100%" }}
						resizeMode="cover"
						accessibilityLabel=""
					/>
				)}
			</View>

			<XStack paddingHorizontal="$4" paddingTop="$2" justifyContent="space-between" alignItems="flex-end">
				<View
					style={{
						marginTop: -40,
						width: 80,
						height: 80,
						borderRadius: 40,
						borderWidth: 3,
						borderColor: tc.bg,
						backgroundColor: tc.bgContrast25,
						overflow: "hidden",
					}}
				>
					{profile.avatar && (
						<Image
							source={{ uri: profile.avatar }}
							style={{ width: "100%", height: "100%" }}
							accessibilityLabel=""
						/>
					)}
				</View>

				{isSelf
					? onEditProfile && <EditButton onPress={onEditProfile} tc={tc} />
					: agent && !isBlockedBy && !isBlocking && <FollowSection profile={profile} agent={agent} />}
			</XStack>

			<YStack paddingHorizontal="$4" paddingTop="$3" gap="$1">
				<DisplayNameText>{displayName}</DisplayNameText>

				<XStack alignItems="center" gap="$2">
					<HandleText>@{profile.handle}</HandleText>

					{profile.pronouns && <PronounsText>{profile.pronouns}</PronounsText>}
				</XStack>

				<XStack flexWrap="wrap" gap="$2" style={{ marginTop: 8 }}>
					{isFollowedBy && (
						<Badge backgroundColor={tc.bgContrast25}>
							<BadgeText>{t`フォローされています`}</BadgeText>
						</Badge>
					)}

					{isMuted && (
						<Badge backgroundColor={tc.bgContrast25}>
							<BadgeText>{t`ミュート中`}</BadgeText>
						</Badge>
					)}

					{isBlocking && (
						<Badge backgroundColor={tc.bgContrast25}>
							<BadgeText>{t`ブロック中`}</BadgeText>
						</Badge>
					)}

					{isBlockedBy && (
						<Badge backgroundColor={tc.bgContrast25}>
							<BadgeText color="$negative">{t`ブロックされています`}</BadgeText>
						</Badge>
					)}

					{profile.joinedViaStarterPack && (
						<Badge backgroundColor={tc.bgContrast25}>
							<Package size={12} color={tc.textContrastMedium} />
							<BadgeText>{t`スターターパックで参加`}</BadgeText>
						</Badge>
					)}
				</XStack>

				{profile.description && <BioText style={{ marginTop: 8 }}>{profile.description}</BioText>}

				{profile.website && (
					<XStack alignItems="center" gap="$1" style={{ marginTop: 8 }}>
						<ExternalLink size={13} color={tc.accent} />
						<WebsiteText onPress={handleOpenWebsite} accessibilityRole="link">
							{profile.website.replace(/^https?:\/\//i, "")}
						</WebsiteText>
					</XStack>
				)}

				{sinceDate && <MetaText style={{ marginTop: 4 }}>{t`${sinceDate}から利用中`}</MetaText>}

				<XStack style={{ marginTop: 12 }} gap="$4">
					<XStack onPress={onNavigateToFollows} gap="$1" alignItems="baseline" accessibilityRole="button">
						<StatCount>{(profile.followsCount ?? 0).toLocaleString()}</StatCount>
						<StatLabel>{t`フォロー`}</StatLabel>
					</XStack>

					<XStack onPress={onNavigateToFollowers} gap="$1" alignItems="baseline" accessibilityRole="button">
						<StatCount>{(profile.followersCount ?? 0).toLocaleString()}</StatCount>
						<StatLabel>{t`フォロワー`}</StatLabel>
					</XStack>
				</XStack>

				{knownFollowers && knownFollowers.count > 0 && (
					<KnownFollowersRow knownFollowers={knownFollowers} tc={tc} />
				)}
			</YStack>
		</YStack>
	);
}

type KnownFollowers = NonNullable<NonNullable<UserProfile["viewer"]>["knownFollowers"]>;

interface KnownFollowersRowProps {
	knownFollowers: KnownFollowers;
	tc: ReturnType<typeof useThemeColors>;
}

function KnownFollowersRow({ knownFollowers, tc }: KnownFollowersRowProps) {
	const { t } = useLingui();

	const sample = knownFollowers.followers.slice(0, 2);
	const names = sample.map((f) => f.displayName ?? f.handle).join("、");

	const label =
		knownFollowers.count > sample.length
			? t`${names}など ${knownFollowers.count} 人がフォロー中`
			: t`${names}がフォロー中`;

	return (
		<XStack alignItems="center" gap="$2" style={{ marginTop: 12 }}>
			<View style={{ flexDirection: "row", marginRight: 4 }}>
				{sample.map((f, i) => (
					<View
						key={f.did}
						style={{
							width: 20,
							height: 20,
							borderRadius: 10,
							borderWidth: 1.5,
							borderColor: tc.bg,
							backgroundColor: tc.bgContrast25,
							overflow: "hidden",
							marginLeft: i === 0 ? 0 : -6,
							zIndex: sample.length - i,
						}}
					>
						{f.avatar && (
							<Image
								source={{ uri: f.avatar }}
								style={{ width: "100%", height: "100%" }}
								accessibilityLabel=""
							/>
						)}
					</View>
				))}
			</View>

			<KnownFollowersText style={{ flexShrink: 1 }}>{label}</KnownFollowersText>
		</XStack>
	);
}

interface EditButtonProps {
	onPress: () => void;
	tc: ReturnType<typeof useThemeColors>;
}

function EditButton({ onPress, tc }: EditButtonProps) {
	const { t } = useLingui();

	return (
		<Pressable
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={t`プロフィールを編集`}
			style={({ pressed }) => ({
				paddingHorizontal: 16,
				paddingVertical: 8,
				borderRadius: 999,
				borderWidth: 1.5,
				borderColor: tc.bgContrast50,
				opacity: pressed ? 0.6 : 1,
				minWidth: 80,
				alignItems: "center" as const,
			})}
		>
			<Text style={{ color: tc.text, fontSize: 14, fontWeight: "600" }}>{t`編集`}</Text>
		</Pressable>
	);
}

interface FollowSectionProps {
	profile: UserProfile;
	agent: Agent;
}

function FollowSection({ profile, agent }: FollowSectionProps) {
	const { handleFollow, handleUnfollow, isMutating } = useFollowActions(agent);

	const followUri = profile.viewer?.following ?? null;
	const isFollowing = followUri !== null;
	const isMut = isMutating(profile.did);

	const handlePress = () => {
		if (isFollowing && followUri) {
			handleUnfollow(profile.did, followUri);
		} else {
			handleFollow(profile.did);
		}
	};

	return <FollowButton isFollowing={isFollowing} isMutating={isMut} onPress={handlePress} size="lg" />;
}

const DisplayNameText = styled(Text, {
	fontSize: 20,
	fontWeight: "700",
	color: "$text",
});

const HandleText = styled(Text, {
	fontSize: 14,
	color: "$textContrastMedium",
});

const PronounsText = styled(Text, {
	fontSize: 12,
	color: "$textContrastMedium",
	paddingHorizontal: "$2",
	paddingVertical: "$0.5",
	backgroundColor: "$bgContrast25",
	borderRadius: "$2",
});

const BioText = styled(Text, {
	fontSize: 14,
	color: "$text",
	lineHeight: 20,
});

const WebsiteText = styled(Text, {
	fontSize: 13,
	color: "$accent",
});

const MetaText = styled(Text, {
	fontSize: 13,
	color: "$textContrastMedium",
});

const StatCount = styled(Text, {
	fontSize: 15,
	fontWeight: "700",
	color: "$text",
});

const StatLabel = styled(Text, {
	fontSize: 13,
	color: "$textContrastMedium",
});

const Badge = styled(XStack, {
	paddingHorizontal: "$2",
	paddingVertical: "$1",
	borderRadius: "$2",
	alignItems: "center",
	gap: "$1",
});

const BadgeText = styled(Text, {
	fontSize: 12,
	color: "$textContrastMedium",
});

const KnownFollowersText = styled(Text, {
	fontSize: 13,
	color: "$textContrastMedium",
});
