import { useThemeColors } from "@atprotobrew/common/theme";
import { Stack } from "expo-router";

function Layout() {
	const tc = useThemeColors();

	return (
		<Stack
			screenOptions={{
				headerLargeTitleEnabled: true,
				headerTitle: "",
				headerTransparent: true,
				headerBackVisible: true,
				headerTintColor: tc.text,
				contentStyle: { backgroundColor: tc.bg },
			}}
		/>
	);
}

export default Layout;
