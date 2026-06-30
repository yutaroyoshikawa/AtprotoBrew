import { atoms as a } from "@atprotobrew/common/alf";
import { LauncherInstalledTile } from "@atprotobrew/common/channel/components/LauncherInstalledTile";
import { useThemeColors } from "@atprotobrew/common/theme";
import type { SharedValue } from "react-native-reanimated";
import Animated, { useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

interface DragOverlayProps {
	dragX: SharedValue<number>;
	dragY: SharedValue<number>;
	isDragging: SharedValue<boolean>;
	iconUri: string | null;
	channelName: string | null;
	cellSize: number;
}

export function DragOverlay({ dragX, dragY, isDragging, iconUri, channelName, cellSize }: DragOverlayProps) {
	const tc = useThemeColors();

	const overlayStyle = useAnimatedStyle(() => {
		const half = cellSize / 2;
		return {
			transform: [
				{ translateX: dragX.value - half },
				{ translateY: dragY.value - half },
				{ scale: withSpring(isDragging.value ? 1.1 : 1, { damping: 15 }) },
			],
			opacity: withTiming(isDragging.value ? 1 : 0, { duration: 300 }),
			shadowColor: tc.text,
		};
	});

	return (
		<Animated.View
			style={[
				a.absolute,
				a.z_999,
				{
					width: cellSize,
					height: cellSize,
					shadowOpacity: 0.3,
					shadowRadius: 8,
					shadowOffset: { width: 0, height: 4 },
					elevation: 8,
				},
				overlayStyle,
			]}
			pointerEvents="none"
		>
			{iconUri && channelName && <LauncherInstalledTile channelName={channelName} thumbnailUrl={iconUri} />}
		</Animated.View>
	);
}
