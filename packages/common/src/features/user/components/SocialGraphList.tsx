import type { Agent } from "@atproto/lex";
import { useLingui } from "@lingui/react/macro";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, type ListRenderItem, Text, useWindowDimensions, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { atoms as a } from "../../../styles/alf";
import { useThemeColors } from "../../../styles/theme";
import { useFollowActions } from "../modules/useFollowActions";
import { useFollowers, useFollows } from "../modules/useSocialGraph";
import { SocialGraphUserRow } from "./SocialGraphUserRow";

type TabKey = "follows" | "followers";
type Route = { key: TabKey; title: string };

const ROW_H = 80;

interface SocialGraphListProps {
	actor: string;
	agent: Agent;
	currentUserDid: string | undefined;
	initialTab?: TabKey;
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
	const layout = useWindowDimensions();

	const routes = useMemo<Route[]>(
		() => [
			{ key: "follows", title: t`フォロー中` },
			{ key: "followers", title: t`フォロワー` },
		],
		[t],
	);

	const [index, setIndex] = useState(initialTab === "follows" ? 0 : 1);

	const followsQuery = useFollows(actor, agent);
	const followersQuery = useFollowers(actor, agent);
	const { handleFollow, handleUnfollow, resolvedFollowUri, isMutating } = useFollowActions(agent);

	const follows = useMemo(() => {
		const seen = new Set<string>();
		return (followsQuery.data?.pages.flatMap((page) => page.follows) ?? []).filter((p) => {
			if (seen.has(p.did)) {
				return false;
			}
			seen.add(p.did);
			return true;
		});
	}, [followsQuery.data]);
	const followers = useMemo(() => {
		const seen = new Set<string>();
		return (followersQuery.data?.pages.flatMap((page) => page.followers) ?? []).filter((p) => {
			if (seen.has(p.did)) {
				return false;
			}
			seen.add(p.did);
			return true;
		});
	}, [followersQuery.data]);

	type Profile = (typeof follows)[number] | (typeof followers)[number];

	const keyExtractor = useCallback((item: Profile) => item.did, []);

	const renderItem = useCallback<ListRenderItem<Profile>>(
		({ item }) => (
			<SocialGraphUserRow
				profile={item}
				currentUserDid={currentUserDid}
				followUri={resolvedFollowUri(item)}
				onFollow={handleFollow}
				onUnfollow={(followUri) => handleUnfollow(item.did, followUri)}
				isMutating={isMutating(item.did)}
				onNavigateToProfile={onNavigateToProfile}
			/>
		),
		[currentUserDid, resolvedFollowUri, handleFollow, handleUnfollow, isMutating, onNavigateToProfile],
	);

	const renderSubList = (type: TabKey) => {
		const query = type === "follows" ? followsQuery : followersQuery;
		const profiles = type === "follows" ? follows : followers;

		if (query.isPending) {
			return (
				<View style={[a.flex_1, a.justify_center, a.items_center]}>
					<ActivityIndicator />
				</View>
			);
		}

		if (query.isError) {
			return (
				<View style={[a.flex_1, a.justify_center, a.items_center]}>
					<Text style={{ color: tc.textContrastMedium }}>{t`読み込みエラー`}</Text>
				</View>
			);
		}

		return (
			<FlatList
				data={profiles}
				keyExtractor={keyExtractor}
				renderItem={renderItem}
				onEndReached={() => {
					if (query.hasNextPage && !query.isFetchingNextPage) {
						query.fetchNextPage();
					}
				}}
				onEndReachedThreshold={0.3}
				initialNumToRender={10}
				maxToRenderPerBatch={10}
				getItemLayout={(_, i) => ({
					length: ROW_H,
					offset: ROW_H * i,
					index: i,
				})}
				ListFooterComponent={
					query.isFetchingNextPage ? (
						<View style={{ paddingVertical: 16 }}>
							<ActivityIndicator />
						</View>
					) : null
				}
				ListEmptyComponent={
					<View style={[a.flex_1, a.justify_center, a.items_center, { paddingVertical: 48 }]}>
						<Text style={{ color: tc.textContrastMedium }}>
							{type === "follows" ? t`フォロー中のユーザーがいません` : t`フォロワーがいません`}
						</Text>
					</View>
				}
			/>
		);
	};

	const renderScene = ({ route }: { route: { key: string } }) => {
		switch (route.key) {
			case "follows":
				return renderSubList("follows");
			case "followers":
				return renderSubList("followers");
			default:
				return null;
		}
	};

	return (
		<TabView
			lazy
			renderLazyPlaceholder={() => (
				<View style={[a.flex_1, a.justify_center, a.items_center]}>
					<ActivityIndicator />
				</View>
			)}
			navigationState={{ index, routes }}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={{ width: layout.width }}
			renderTabBar={(props) => (
				<TabBar
					{...props}
					indicatorStyle={{ backgroundColor: tc.accent, height: 2 }}
					style={{
						backgroundColor: "transparent",
						borderBottomWidth: 1,
						borderBottomColor: tc.bgContrast25,
						elevation: 0,
						shadowOpacity: 0,
					}}
					activeColor={tc.accent}
					inactiveColor={tc.textContrastMedium}
				/>
			)}
		/>
	);
}
