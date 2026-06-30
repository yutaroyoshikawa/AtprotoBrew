import { useLingui } from "@lingui/react/macro";
import { CircleCheckIcon } from "lucide-react-native";
import { Text, useTheme, View, XStack, YStack } from "tamagui";
import { AppH1 } from "../../../core/components/AppH1";
import { atoms as a } from "../../../styles/alf";
import { LauncherInstalledTile } from "../../channel/components/LauncherInstalledTile";

interface StoreItemProps {
	title: string;
	thumbnail: string;
	author?: string;
	description?: string;
}

export function StoreItem({ title, thumbnail, author, description }: StoreItemProps) {
	const { t } = useLingui();
	const theme = useTheme();

	return (
		<View
			role="listitem"
			height={120}
			style={[
				a.flex_row,
				a.gap_3,
				a.items_center,
				a.p_4,
				a.rounded_2xl,
				{ backgroundColor: theme.bgContrast50.get() },
			]}
		>
			{/* Thumbnail */}
			<LauncherInstalledTile channelName={title} thumbnailUrl={thumbnail} />

			{/* Body */}
			<YStack style={[a.flex_1, a.gap_1]}>
				<AppH1 style={[a.text_sm, a.font_bold, { color: theme.text.get() }]}>{title}</AppH1>

				{author && <Text style={[a.text_xs, { color: theme.textContrastLow.get() }]}>{author}</Text>}

				{description && (
					<Text style={[a.text_xs, { color: theme.textContrastMedium.get() }]} numberOfLines={2}>
						{description}
					</Text>
				)}
			</YStack>

			{/* Installed status */}
			<XStack
				style={[
					a.items_center,
					a.gap_1,
					a.rounded_md,
					a.border,
					a.p_2,
					{ backgroundColor: theme.bg.get() },
					{ borderColor: theme.positive.get() },
				]}
				accessibilityRole="text"
				accessibilityLabel={t`インストール済み`}
			>
				<Text style={[a.text_xs, a.font_semibold, { color: theme.positive.get() }]}>{t`インストール済み`}</Text>
				<CircleCheckIcon size={18} color={theme.positive.get()} aria-hidden />
			</XStack>
		</View>
	);
}
