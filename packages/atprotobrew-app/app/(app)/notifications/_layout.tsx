import { useThemeColors } from "@atprotobrew/common/theme";
import { useLingui } from "@lingui/react/macro";
import { Stack } from "expo-router";

function Layout() {
	const tc = useThemeColors();
	const { t } = useLingui();

	return (
		<Stack
			screenOptions={{
				title: t`通知`,
				headerStyle: {
					backgroundColor: tc.bgContrast25,
				},
				headerTintColor: tc.text,
				contentStyle: { backgroundColor: tc.bg },
			}}
		/>
	);
}

export default Layout;
