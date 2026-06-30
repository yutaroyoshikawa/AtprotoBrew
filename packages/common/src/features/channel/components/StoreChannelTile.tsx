import { Trans } from "@lingui/react/macro";
import type { ComponentProps } from "react";
import { Path, Rect, Svg } from "react-native-svg";
import { useTheme } from "tamagui";
import { AppText } from "../../../core/components/AppText";
import { AppVStack } from "../../../core/components/AppVStack";
import { atoms as a } from "../../../styles/alf";
import { ChannelTile } from "./ChannelTile";

interface StoreChannelTileProps extends Pick<ComponentProps<typeof ChannelTile>, "render" | "onPress"> {}

export function StoreChannelTile({ render, onPress }: StoreChannelTileProps) {
	const theme = useTheme();
	const accent = theme.accent.get();

	return (
		<ChannelTile intensity={0.2} render={render} onPress={onPress}>
			<AppVStack style={[a.items_center, a.gap_2]}>
				<Svg width={80} height={80} viewBox="0 0 36 36" fill={accent}>
					<Rect x="5" y="14" width="20" height="15" rx="3" />
					<Path
						d="M25 17 Q32 17 32 22 Q32 27 25 27"
						stroke={accent}
						strokeWidth="2.5"
						strokeLinecap="round"
						fill="none"
					/>
					<Path
						d="M10 9 Q10 5 14 5 Q14 9 18 9 Q18 5 22 5 Q22 9 26 9"
						stroke={accent}
						strokeWidth="2"
						strokeLinecap="round"
						fill="none"
						strokeOpacity="0.85"
					/>
					<Rect x="9" y="29" width="16" height="2" rx="1" fillOpacity="0.5" />
				</Svg>
				<AppText style={[a.text_center, a.font_bold, { color: "$tileLabel" }]}>
					<Trans>ストア</Trans>
				</AppText>
			</AppVStack>
		</ChannelTile>
	);
}
