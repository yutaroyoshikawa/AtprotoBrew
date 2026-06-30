import type { OAuthSession } from "@atproto/oauth-client-expo";
import { atoms as a } from "@atprotobrew/common/alf";
import { useFetchLaunchers } from "@atprotobrew/common/channel/modules/launchersHooks";
import { AppH1 } from "@atprotobrew/common/core/components/AppH1";
import { StoreItem } from "@atprotobrew/common/store/components/StoreItem";
import { useThemeColors } from "@atprotobrew/common/theme";
import { Link } from "expo-router";
import { Suspense } from "react";
import { Pressable, View } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { useAuthContext } from "../../../modules/auth/AuthProvider";

export default function Screen() {
	const { authState } = useAuthContext();

	if (authState.status !== "authenticated") {
		return null;
	}

	return (
		<Suspense>
			<StoreScreenContent session={authState.session} />
		</Suspense>
	);
}

interface StoreScreenContentProps {
	session: OAuthSession;
}

function StoreScreenContent({ session }: StoreScreenContentProps) {
	const t = useThemeColors();
	const { data } = useFetchLaunchers({ agent: session });
	const scrollY = useSharedValue(0);

	const scrollHandler = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	const headerStyle = useAnimatedStyle(() => ({
		height: interpolate(scrollY.value, [0, 120], [300, 150], Extrapolation.CLAMP),
	}));

	return (
		<View style={[a.h_full, a.flex_col, a.px_2, a.py_2]}>
			<Animated.View
				style={[
					a.w_full,
					a.flex_col,
					a.justify_center,
					a.items_start,
					a.rounded_10xl,
					a.px_10,
					headerStyle,
					{ backgroundColor: t.bgBubbleGradientStart },
				]}
			>
				<AppH1>Channel store</AppH1>
			</Animated.View>

			<View style={[{ height: 24 }]} />

			<Animated.ScrollView
				style={[a.flex_1, a.w_full, a.rounded_2xl, a.overflow_hidden]}
				contentContainerStyle={[a.py_4]}
				showsVerticalScrollIndicator={false}
				scrollEventThrottle={16}
				alwaysBounceVertical={true}
				overScrollMode="always"
				onScroll={scrollHandler}
			>
				<View style={[a.flex_col, a.gap_6, a.rounded_2xl, a.overflow_hidden]}>
					{data.body.items.map((channel) => {
						return (
							<Link
								key={channel.title}
								href={{
									pathname: "/(app)/store/[channelId]",
									params: {
										channelId: channel.title,
									},
								}}
								style={[{ height: 120 }]}
								asChild
							>
								<Pressable>
									<StoreItem
										title={channel.title}
										thumbnail={channel.thumbnail}
										author={channel.author}
										description={channel.description}
									/>
								</Pressable>
							</Link>
						);
					})}
				</View>
			</Animated.ScrollView>
		</View>
	);
}
