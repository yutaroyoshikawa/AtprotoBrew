import type { Agent } from "@atproto/lex";
import { useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { atoms as a } from "../../../styles/alf";
import { useThemeColors } from "../../../styles/theme";
import { useFollowActions } from "../modules/useFollowActions";
import { useFollowers, useFollows } from "../modules/useSocialGraph";
import { SocialGraphUserRow } from "./SocialGraphUserRow";

type Tab = "follows" | "followers";

interface SocialGraphListProps {
	actor: string;
	agent: Agent;
	currentUserDid: string | undefined;
	initialTab?: Tab;
	onNavigateToProfile?: (did: string) => void;
}

export function SocialGraphList({
	actor,
	agent,
	currentUserDid,
	initialTab = "follows",
	onNavigateToProfile,
}: SocialGraphListProps) {
	const tc = useThemeColors();
	const { t } = useLingui();
	const [activeTab, setActiveTab] = useState<Tab>(initialTab);

	const followsQuery = useFollows(actor, agent);
	const followersQuery = useFollowers(actor, agent);
	const { handleFollow, handleUnfollow, resolvedFollowUri, isMutating } = useFollowActions(agent);

	const activeQuery = activeTab === "follows" ? followsQuery : followersQuery;

	const profiles =
		activeTab === "follows"
			? (followsQuery.data?.pages.flatMap((page) => page.follows) ?? [])
			: (followersQuery.data?.pages.flatMap((page) => page.followers) ?? []);

	return (
		<View style={[a.flex_1]}>
			<View
				style={[
					a.flex_row,
					{
						borderBottomWidth: 1,
						borderBottomColor: tc.bgContrast25,
					},
				]}
			>
				{(["follows", "followers"] as const).map((tab) => (
					<View
						key={tab}
						style={[
							a.flex_1,
							{
								paddingVertical: 12,
								borderBottomWidth: 2,
								borderBottomColor: activeTab === tab ? tc.accent : "transparent",
								alignItems: "center",
							},
						]}
					>
						<Text
							onPress={() => setActiveTab(tab)}
							style={{
								color: activeTab === tab ? tc.accent : tc.textContrastMedium,
								fontSize: 14,
								fontWeight: activeTab === tab ? "700" : "400",
							}}
						>
							{tab === "follows" ? t`フォロー中` : t`フォロワー`}
						</Text>
					</View>
				))}
			</View>

			{activeQuery.isPending ? (
				<View style={[a.flex_1, a.justify_center, a.items_center]}>
					<ActivityIndicator />
				</View>
			) : activeQuery.isError ? (
				<View style={[a.flex_1, a.justify_center, a.items_center]}>
					<Text style={{ color: tc.textContrastMedium }}>{t`読み込みエラー`}</Text>
				</View>
			) : (
				<FlatList
					data={profiles}
					keyExtractor={(item) => item.did}
					renderItem={({ item }) => (
						<SocialGraphUserRow
							profile={item}
							currentUserDid={currentUserDid}
							followUri={resolvedFollowUri(item)}
							onFollow={handleFollow}
							onUnfollow={(uri) => handleUnfollow(item.did, uri)}
							isMutating={isMutating(item.did)}
							onNavigateToProfile={onNavigateToProfile}
						/>
					)}
					onEndReached={() => {
						if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
							activeQuery.fetchNextPage();
						}
					}}
					onEndReachedThreshold={0.3}
					ListFooterComponent={
						activeQuery.isFetchingNextPage ? (
							<View style={{ paddingVertical: 16 }}>
								<ActivityIndicator />
							</View>
						) : null
					}
					ListEmptyComponent={
						<View style={[a.flex_1, a.justify_center, a.items_center, { paddingVertical: 48 }]}>
							<Text style={{ color: tc.textContrastMedium }}>
								{activeTab === "follows" ? t`フォロー中のユーザーがいません` : t`フォロワーがいません`}
							</Text>
						</View>
					}
				/>
			)}
		</View>
	);
}
