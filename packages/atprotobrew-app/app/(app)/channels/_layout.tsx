import { useThemeColors } from "@atprotobrew/common/theme";
import { aero } from "@atprotobrew/tokens/aero";
import { useLingui } from "@lingui/react/macro";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";

function Layout() {
	const tc = useThemeColors();
	const { t } = useLingui();
	const router = useRouter();

	return (
		<Stack
			screenOptions={{
				headerShown: true,
					headerTransparent: true,
				headerTitle: "",
				headerLeft: () => (
						<Pressable
							onPress={() => router.back()}
							accessibilityRole="button"
							accessibilityLabel={t`閉じる`}
							style={{
								width: 36,
								height: 36,
								borderRadius: 18,
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "rgba(255,255,255,0.3)",
								borderWidth: 1,
								borderColor: aero.glassShadowHighlight,
							}}
						>
							<ChevronLeft size={22} color={aero.glassHeroText} />
						</Pressable>
					),
				contentStyle: { backgroundColor: tc.bg },
			}}
		/>
	);
}

export default Layout;
