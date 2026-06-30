import type { ComponentProps } from "react";
import { Image } from "tamagui";
import { ChannelTile } from "./ChannelTile";

interface LauncherInstalledTileProps extends Pick<ComponentProps<typeof ChannelTile>, "render" | "onPress"> {
	channelName: string;
	thumbnailUrl: string;
}

export function LauncherInstalledTile({ render, onPress, channelName, thumbnailUrl }: LauncherInstalledTileProps) {
	return (
		<ChannelTile intensity={0.3} variant="compact" render={render} onPress={onPress}>
			<Image
				src={thumbnailUrl}
				width={52}
				height={52}
				borderRadius="$4"
				accessibilityLabel={`${channelName} のサムネイル`}
			/>
		</ChannelTile>
	);
}
