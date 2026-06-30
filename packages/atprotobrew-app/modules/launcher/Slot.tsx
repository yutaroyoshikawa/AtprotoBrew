import { atoms as a } from "@atprotobrew/common/alf";
import { LauncherEmptyTile } from "@atprotobrew/common/channel/components/LauncherEmptyTile";
import type { GridConfig } from "@atprotobrew/common/launcher/launcherGrid";
import type { LauncherItem } from "@atprotobrew/common/launcher/types";
import { useThemeColors } from "@atprotobrew/common/theme";
import { View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { LauncherIcon } from "./LauncherIcon";

interface SlotProps {
	address: number;
	item: LauncherItem | undefined;
	isEdit: boolean;
	gridConfig: GridConfig;
	screenWidth: number;
	isDragging: SharedValue<boolean>;
	draggingId: SharedValue<string>;
	hoverAddress: SharedValue<number>;
	dragX: SharedValue<number>;
	dragY: SharedValue<number>;
	gridOriginX: SharedValue<number>;
	gridOriginY: SharedValue<number>;
	edgeEnterAt: SharedValue<number>;
	currentPage: SharedValue<number>;
	onDragEnd: (id: string, targetAddress: number) => void;
	onEnterEdit: () => void;
	onFlipPage: (delta: number) => void;
	onSetOverlayChannel: (channel: { channelName: string; thumbnail: string } | null) => void;
	onOpenApp: (item: LauncherItem) => void;
}

export function Slot({
	address,
	item,
	isEdit,
	gridConfig,
	screenWidth,
	isDragging,
	draggingId,
	hoverAddress,
	dragX,
	dragY,
	gridOriginX,
	gridOriginY,
	edgeEnterAt,
	currentPage,
	onDragEnd,
	onEnterEdit,
	onFlipPage,
	onSetOverlayChannel,
	onOpenApp,
}: SlotProps) {
	const tc = useThemeColors();

	// C3: hoverAddress shared value read directly by useAnimatedStyle — no runOnJS per frame
	const indicatorStyle = useAnimatedStyle(() => ({
		opacity: isDragging.value && hoverAddress.value === address ? 0.35 : 0,
		backgroundColor: tc.primary,
	}));

	return (
		<View style={[a.items_center, a.justify_center, { width: gridConfig.cellSize, height: gridConfig.cellSize }]}>
			{item ? (
				<LauncherIcon
					item={item}
					isEdit={isEdit}
					gridConfig={gridConfig}
					screenWidth={screenWidth}
					dragX={dragX}
					dragY={dragY}
					isDragging={isDragging}
					draggingId={draggingId}
					hoverAddress={hoverAddress}
					gridOriginX={gridOriginX}
					gridOriginY={gridOriginY}
					edgeEnterAt={edgeEnterAt}
					currentPage={currentPage}
					onDragEnd={onDragEnd}
					onEnterEdit={onEnterEdit}
					onFlipPage={onFlipPage}
					onSetOverlayChannel={onSetOverlayChannel}
					onOpenApp={onOpenApp}
				/>
			) : (
				<LauncherEmptyTile />
			)}
			<Animated.View style={[a.absolute, a.inset_0, a.rounded_2xl, indicatorStyle]} pointerEvents="none" />
		</View>
	);
}
