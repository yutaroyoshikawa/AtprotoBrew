import { atoms as a } from "@atprotobrew/common/alf";
import { LauncherInstalledTile } from "@atprotobrew/common/channel/components/LauncherInstalledTile";
import type { GridConfig } from "@atprotobrew/common/launcher/launcherGrid";
import type { LauncherItem } from "@atprotobrew/common/launcher/types";
import * as Haptics from "expo-haptics";
import { memo } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const EDGE_ZONE = 48;
const EDGE_HOLD_MS = 500;

interface LauncherIconProps {
	item: LauncherItem;
	isEdit: boolean;
	gridConfig: GridConfig;
	screenWidth: number;
	dragX: SharedValue<number>;
	dragY: SharedValue<number>;
	isDragging: SharedValue<boolean>;
	draggingId: SharedValue<string>;
	hoverAddress: SharedValue<number>;
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

function hapticMedium() {
	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

function clamp(v: number, lo: number, hi: number): number {
	"worklet";

	return Math.max(lo, Math.min(hi, v));
}

export const LauncherIcon = memo(function LauncherIcon({
	item,
	isEdit,
	gridConfig,
	screenWidth,
	dragX,
	dragY,
	isDragging,
	draggingId,
	hoverAddress,
	gridOriginX,
	gridOriginY,
	edgeEnterAt,
	currentPage,
	onDragEnd,
	onEnterEdit,
	onFlipPage,
	onSetOverlayChannel,
	onOpenApp,
}: LauncherIconProps) {
	const { cols, rows, perPage, cellSize } = gridConfig;

	const handleDragStart = (channel: { channelName: string; thumbnail: string }, enterEdit: boolean) => {
		"worklet";

		isDragging.value = true;
		draggingId.value = item.id;
		edgeEnterAt.value = -1;

		scheduleOnRN(onSetOverlayChannel, channel);

		if (enterEdit) {
			scheduleOnRN(onEnterEdit);
		}

		scheduleOnRN(hapticMedium);
	};

	const handleDragUpdate = (absX: number, absY: number) => {
		"worklet";

		dragX.value = absX;
		dragY.value = absY;

		const localX = absX - gridOriginX.value;
		const localY = absY - gridOriginY.value;
		const col = clamp(Math.floor(localX / cellSize), 0, cols - 1);
		const row = clamp(Math.floor(localY / cellSize), 0, rows - 1);
		hoverAddress.value = currentPage.value * perPage + row * cols + col;

		const now = Date.now();
		const atLeft = absX < EDGE_ZONE;
		const atRight = absX > screenWidth - EDGE_ZONE;

		if (atLeft || atRight) {
			if (edgeEnterAt.value < 0) {
				edgeEnterAt.value = now;
			} else if (now - edgeEnterAt.value > EDGE_HOLD_MS) {
				edgeEnterAt.value = now;
				scheduleOnRN(onFlipPage, atLeft ? -1 : 1);
			}
		} else {
			edgeEnterAt.value = -1;
		}
	};

	const handleDragEnd = () => {
		"worklet";

		const targetAddress = hoverAddress.value;

		isDragging.value = false;
		draggingId.value = "";
		hoverAddress.value = -1;

		scheduleOnRN(onSetOverlayChannel, null);
		scheduleOnRN(onDragEnd, item.id, targetAddress);
	};

	const handleDragFinalize = () => {
		"worklet";

		isDragging.value = false;
		draggingId.value = "";
		hoverAddress.value = -1;
	};

	// C1: Two Pan gestures always mounted, only `enabled` differs.
	// EDIT: quickDrag (no delay) wins the Race immediately.
	// VIEW: quickDrag disabled, enterDrag (2s long-press) activates.
	const quickDrag = Gesture.Pan()
		.activateAfterLongPress(0)
		.enabled(isEdit)
		.onStart(() => {
			"worklet";

			handleDragStart({ channelName: item.label, thumbnail: item.iconUri }, false);
		})
		.onUpdate((e) => {
			"worklet";

			handleDragUpdate(e.absoluteX, e.absoluteY);
		})
		.onEnd(() => {
			"worklet";

			handleDragEnd();
		})
		.onFinalize(() => {
			"worklet";

			handleDragFinalize();
		});

	const enterDrag = Gesture.Pan()
		.activateAfterLongPress(700)
		.onStart((e) => {
			"worklet";

			handleDragStart({ channelName: item.label, thumbnail: item.iconUri }, !isEdit);
			handleDragUpdate(e.absoluteX, e.absoluteY);
		})
		.onUpdate((e) => {
			"worklet";

			handleDragUpdate(e.absoluteX, e.absoluteY);
		})
		.onEnd(() => {
			"worklet";

			handleDragEnd();
		})
		.onFinalize(() => {
			"worklet";

			handleDragFinalize();
		});

	const tap = Gesture.Tap().onEnd(() => {
		"worklet";

		if (!isEdit) {
			scheduleOnRN(onOpenApp, item);
		}
	});

	const gesture = Gesture.Race(quickDrag, enterDrag, tap);

	// ドラッグ中は透明にして DragOverlay に見た目を委譲
	const iconOpacity = useAnimatedStyle(() => ({
		opacity: isDragging.value && draggingId.value === item.id ? 0 : 1,
	}));

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View style={[a.items_center, a.justify_center, iconOpacity]}>
				<LauncherInstalledTile channelName={item.label} thumbnailUrl={item.iconUri} />
			</Animated.View>
		</GestureDetector>
	);
});
