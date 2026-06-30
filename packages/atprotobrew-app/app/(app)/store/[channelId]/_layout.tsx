import { useThemeColors } from "@atprotobrew/common/theme";
import { Stack } from "expo-router";

function Layout() {
	const t = useThemeColors();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: t.bg },
			}}
		/>
	);
}

export default Layout;
