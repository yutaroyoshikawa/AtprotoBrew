import { useThemeColors } from "@atprotobrew/common/theme";
import { Stack } from "expo-router";

function Layout() {
	const t = useThemeColors();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				headerStyle: {
					backgroundColor: t.bgContrast25,
				},
				headerTintColor: t.text,
				contentStyle: { backgroundColor: t.bg },
			}}
		/>
	);
}

export default Layout;
