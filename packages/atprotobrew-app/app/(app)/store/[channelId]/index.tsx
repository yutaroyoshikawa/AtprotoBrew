import type { OAuthSession } from "@atproto/oauth-client-expo";
import { atoms as a } from "@atprotobrew/common/alf";
import { LauncherInstalledTile } from "@atprotobrew/common/channel/components/LauncherInstalledTile";
import { useFetchLaunchers } from "@atprotobrew/common/channel/modules/launchersHooks";
import { AppButton } from "@atprotobrew/common/core/components/AppButton";
import { AppH1 } from "@atprotobrew/common/core/components/AppH1";
import { useThemeColors } from "@atprotobrew/common/theme";
import { useLingui } from "@lingui/react/macro";
import { useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { Text, View } from "react-native";
import { ScrollGrowSheet } from "../../../../components/ScrollGrowSheet";
import { useAuthContext } from "../../../../modules/auth/AuthProvider";

function Screen() {
	const { authState } = useAuthContext();

	if (authState.status !== "authenticated") {
		return null;
	}

	return (
		<Suspense>
			<ScreenContent session={authState.session} />
		</Suspense>
	);
}

interface ScreenContentProps {
	session: OAuthSession;
}

function ScreenContent({ session }: ScreenContentProps) {
	const { t } = useLingui();
	const tc = useThemeColors();
	const { channelId } = useLocalSearchParams<{ channelId: string }>();

	const { data } = useFetchLaunchers({ agent: session });

	const targetLauncher = data.body.items.find((item) => item.title === channelId);

	if (!targetLauncher) {
		return null;
	}

	return (
		<View style={[a.w_full, a.flex_1]}>
			<ScrollGrowSheet
				hero={
					<View
						style={[
							a.w_full,
							a.flex_col,
							{ minHeight: 300 },
							a.justify_center,
							a.rounded_2xl,
							a.overflow_hidden,
						]}
					>
						<View
							style={[
								a.flex_1,
								{ minHeight: 160 },
								a.flex_row,
								a.gap_6,
								a.justify_center,
								a.items_center,
								a.px_10,
								a.py_4,
							]}
						>
							<LauncherInstalledTile
								channelName={targetLauncher.title}
								thumbnailUrl={targetLauncher.thumbnail}
							/>
							<View style={[a.flex_1, a.gap_1, a.flex_col, a.justify_center]}>
								<AppH1 style={[a.font_bold, { color: tc.text }]}>{targetLauncher.title}</AppH1>

								{targetLauncher.author && (
									<Text style={[a.text_xs, { color: tc.textContrastLow }]}>
										{targetLauncher.author}
									</Text>
								)}
							</View>
						</View>
						<View style={[a.w_full, a.px_6]}>
							<AppButton shape="tile" disabled>
								インストール済み
							</AppButton>
						</View>
					</View>
				}
				tabHeader={
					<View style={[a.flex_col, a.gap_3]}>
						<Text
							style={[a.text_lg, a.font_bold, { color: tc.textContrastMedium }]}
						>{t`このチャンネルについて`}</Text>
						<Text style={[a.text_sm, { color: tc.text }]}>{targetLauncher.description}</Text>
					</View>
				}
				peekHeight={500}
			></ScrollGrowSheet>
		</View>
	);
}

export default Screen;
