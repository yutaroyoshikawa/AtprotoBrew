import { atoms as a } from "@atprotobrew/common/alf";
import { useThemeColors } from "@atprotobrew/common/theme";
import { useLingui } from "@lingui/react/macro";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOPBAR_H = 48;

interface EditTopBarProps {
	onSave: () => void;
	onCancel: () => void;
}

export function EditTopBar({ onSave, onCancel }: EditTopBarProps) {
	const insets = useSafeAreaInsets();
	const { t } = useLingui();
	const tc = useThemeColors();

	return (
		<View
			style={[
				a.absolute,
				a.z_10,
				a.w_full,
				a.border_b,
				{ top: 0, paddingTop: insets.top, backgroundColor: tc.bgContrast25, borderBottomColor: tc.border },
			]}
		>
			<View style={[a.flex_row, a.justify_between, a.items_center, a.px_5, { height: TOPBAR_H }]}>
				<TouchableOpacity onPress={onCancel} style={[a.py_2, a.px_1]} hitSlop={8}>
					<Text style={[a.text_md, { color: tc.text }]}>{t`キャンセル`}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={onSave} style={[a.py_2, a.px_1]} hitSlop={8}>
					<Text style={[a.text_md, a.font_semibold, { color: tc.primary }]}>{t`保存`}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
