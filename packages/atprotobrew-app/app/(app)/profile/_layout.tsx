import { useThemeColors } from "@atprotobrew/common/theme";
import { useLingui } from "@lingui/react/macro";
import { Stack } from "expo-router";

function Layout() {
	const tc = useThemeColors();
	const { t } = useLingui();

	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: tc.bgContrast25 },
				headerTintColor: tc.text,
				contentStyle: { backgroundColor: tc.bg },
			}}
		>
			<Stack.Screen name="[did]" options={{ title: t`プロフィール` }} />
			<Stack.Screen name="[did]/follows" options={{ title: t`フォロー中` }} />
			<Stack.Screen name="[did]/followers" options={{ title: t`フォロワー` }} />
		</Stack>
	);
}

export default Layout;
