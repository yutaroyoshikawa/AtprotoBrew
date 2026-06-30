import type { SharedValue } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";

export interface LauncherDragState {
	dragX: SharedValue<number>;
	dragY: SharedValue<number>;
	isDragging: SharedValue<boolean>;
	draggingId: SharedValue<string>;
	hoverAddress: SharedValue<number>;
	gridOriginX: SharedValue<number>;
	gridOriginY: SharedValue<number>;
	edgeEnterAt: SharedValue<number>;
	currentPage: SharedValue<number>;
}

export function useLauncherDrag(): LauncherDragState {
	const dragX = useSharedValue(0);
	const dragY = useSharedValue(0);
	const isDragging = useSharedValue(false);
	const draggingId = useSharedValue("");
	const hoverAddress = useSharedValue(-1);
	const gridOriginX = useSharedValue(0);
	const gridOriginY = useSharedValue(0);
	const edgeEnterAt = useSharedValue(-1);
	const currentPage = useSharedValue(0);

	return {
		dragX,
		dragY,
		isDragging,
		draggingId,
		hoverAddress,
		gridOriginX,
		gridOriginY,
		edgeEnterAt,
		currentPage,
	};
}
