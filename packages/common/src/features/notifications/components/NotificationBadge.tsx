import { useLingui } from "@lingui/react/macro";
import { Text, View } from "react-native";
import { atoms as a } from "../../../styles/alf";
import { useThemeColors } from "../../../styles/theme";

interface NotificationBadgeProps {
	count: number;
}

const PAGE_LIMIT = 50;

export function NotificationBadge({ count }: NotificationBadgeProps) {
	const tc = useThemeColors();
	const { t } = useLingui();

	if (count === 0) {
		return null;
	}

	const label = count > PAGE_LIMIT ? `${PAGE_LIMIT}+` : String(count);
	const accessibilityLabel = t`通知 ${count} 件の未読があります`;

	return (
		<View
			accessibilityLabel={accessibilityLabel}
			accessibilityRole="text"
			style={[
				a.absolute,
				a.items_center,
				a.justify_center,
				a.z_10,
				{
					top: -4,
					right: -4,
					minWidth: 18,
					height: 18,
					borderRadius: 9,
					paddingHorizontal: 4,
					backgroundColor: tc.accent,
				},
			]}
		>
			<Text style={[a.font_bold, { color: tc.bg, fontSize: 10, lineHeight: 18 }]}>{label}</Text>
		</View>
	);
}
