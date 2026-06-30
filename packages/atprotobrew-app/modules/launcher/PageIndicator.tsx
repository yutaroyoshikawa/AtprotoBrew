import { atoms as a } from "@atprotobrew/common/alf";
import { useThemeColors } from "@atprotobrew/common/theme";
import { View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const DOT_SIZE = 6;

interface PageIndicatorProps {
	pageCount: number;
	currentPage: SharedValue<number>;
}

function Dot({
	index,
	currentPage,
	activeColor,
	inactiveColor,
}: {
	index: number;
	currentPage: SharedValue<number>;
	activeColor: string;
	inactiveColor: string;
}) {
	const dotStyle = useAnimatedStyle(() => ({
		opacity: currentPage.value === index ? 1 : 0.4,
		transform: [{ scale: currentPage.value === index ? 1.2 : 1 }],
		backgroundColor: currentPage.value === index ? activeColor : inactiveColor,
	}));

	return <Animated.View style={[a.rounded_full, { width: DOT_SIZE, height: DOT_SIZE }, dotStyle]} />;
}

export function PageIndicator({ pageCount, currentPage }: PageIndicatorProps) {
	const tc = useThemeColors();

	return (
		<View style={[a.flex_row, a.items_start, a.justify_center, a.gap_2, { height: 54 }]}>
			{Array.from({ length: pageCount }, (_, i) => (
				<Dot
					key={i}
					index={i}
					currentPage={currentPage}
					activeColor={tc.primary}
					inactiveColor={tc.textContrastLow}
				/>
			))}
		</View>
	);
}
