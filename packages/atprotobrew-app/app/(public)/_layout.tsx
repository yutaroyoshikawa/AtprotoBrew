import { useThemeColors } from "@atprotobrew/common/theme";
import { Stack } from "expo-router";

function Layout() {
	const tc = useThemeColors();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: tc.bg },
			}}
		/>
	);
}

export default Layout;
