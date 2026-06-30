import type { ComponentProps } from "react";
import { Image, View } from "tamagui";
import { AppText } from "../../../core/components/AppText";
import { AppVStack } from "../../../core/components/AppVStack";
import { atoms as a } from "../../../styles/alf";
import { ChannelTile } from "./ChannelTile";

interface InstalledChannelTileProps extends Pick<ComponentProps<typeof ChannelTile>, "render" | "onPress"> {
	channelName: string;
	thumbnailUrl: string;
}

export function InstalledChannelTile({ render, onPress, channelName, thumbnailUrl }: InstalledChannelTileProps) {
	return (
		<View style={{ backdropFilter: "blur(10px)" }}>
			<ChannelTile render={render} intensity={0.3} onPress={onPress}>
				<AppVStack style={[a.items_center, a.gap_2]}>
					<Image
						src={thumbnailUrl}
						width={80}
						height={80}
						accessibilityLabel={`${channelName} のサムネイル`}
					/>
					<AppText style={[a.text_center, a.font_bold, { color: "$tileLabel" }]}>{channelName}</AppText>
				</AppVStack>
			</ChannelTile>
		</View>
	);
}
