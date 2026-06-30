import type * as org from "@atprotobrew/atproto/lexicons/org";
import { atoms as a } from "@atprotobrew/common/alf";
import { LauncherInstalledTile } from "@atprotobrew/common/channel/components/LauncherInstalledTile";
import { AppButton } from "@atprotobrew/common/core/components/AppButton";
import { AppText } from "@atprotobrew/common/core/components/AppText";
import { aero } from "@atprotobrew/tokens/aero";
import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface ChannelLaunchScreenProps {
	item: org.tarororo.brew.defs.StoreItemView;
	onLaunch: () => void;
}

export function ChannelLaunchScreen({ item, onLaunch }: ChannelLaunchScreenProps) {
	const scale = useSharedValue(1);

	useEffect(() => {
		scale.value = withTiming(2, {
			duration: 10000,
			easing: Easing.out(Easing.ease),
		});
	}, [scale]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<View style={[a.h_full, a.flex_col, a.px_5]}>
			<AnimatedImage
				source={{ uri: item.thumbnail }}
				blurRadius={80}
				contentFit="cover"
				style={[StyleSheet.absoluteFill, animatedStyle]}
			/>

			<View style={[StyleSheet.absoluteFill, { backgroundColor: aero.glassHeroOverlayTint }]} />

			<View style={[a.flex_1, a.justify_center, a.items_center, a.gap_6]}>
				<View style={[a.items_center, a.gap_6]}>
					<AppText
						numberOfLines={2}
						style={{
							color: aero.glassHeroText,
							fontSize: 36,
							fontWeight: "700",
							textAlign: "center",
							textShadowColor: "rgba(0,0,0,0.35)",
							textShadowOffset: { width: 0, height: 1 },
							textShadowRadius: 8,
						}}
					>
						{item.title}
					</AppText>

					{item.author ? (
						<AppText
							numberOfLines={1}
							style={{
								color: aero.glassHeroTextSub,
								fontSize: 14,
								textShadowColor: "rgba(0,0,0,0.28)",
								textShadowOffset: { width: 0, height: 1 },
								textShadowRadius: 5,
							}}
						>
							{item.author}
						</AppText>
					) : null}
				</View>

				<LauncherInstalledTile thumbnailUrl={item.thumbnail} channelName={item.title} />
			</View>

			<View style={[a.w_full, a.pb_8]}>
				<AppButton shape="pill" variant="glossy" onPress={onLaunch} accessibilityLabel="起動する">
					起動する
				</AppButton>
			</View>
		</View>
	);
}
