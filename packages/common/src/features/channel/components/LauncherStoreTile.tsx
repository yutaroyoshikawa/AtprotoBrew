import type { ComponentProps } from "react";
import { Path, Rect, Svg } from "react-native-svg";
import { useTheme } from "tamagui";
import { ChannelTile } from "./ChannelTile";

interface LauncherStoreTileProps extends Pick<ComponentProps<typeof ChannelTile>, "render" | "onPress"> {}

export function LauncherStoreTile({ render, onPress }: LauncherStoreTileProps) {
	const theme = useTheme();
	const accent = theme.accent.get();

	return (
		<ChannelTile intensity={0.3} variant="compact" render={render} onPress={onPress}>
			<Svg width={48} height={48} viewBox="0 0 36 36" fill={accent}>
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
		</ChannelTile>
	);
}
