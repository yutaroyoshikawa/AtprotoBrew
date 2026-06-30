import { atoms as a } from "@atprotobrew/common/alf";
import { useThemeColors } from "@atprotobrew/common/theme";
import { ActivityIndicator, View } from "react-native";

function OAuthCallback() {
	const t = useThemeColors();

	return (
		<View style={[a.h_full, a.w_full, a.flex_col, a.justify_center, a.items_center, { backgroundColor: t.bg }]}>
			<ActivityIndicator />
		</View>
	);
}

export default OAuthCallback;
