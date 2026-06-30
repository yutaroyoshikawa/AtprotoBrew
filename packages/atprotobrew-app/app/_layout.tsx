import "../modules/polyfill";
import { AppI18nProvider } from "@atprotobrew/common/core/components/AppI18nProvider";
import { AppQueryProvider } from "@atprotobrew/common/core/components/AppQueryProvider";
import { UIProvider } from "@atprotobrew/common/core/components/UIProvider";
import { getAppQueryClient } from "@atprotobrew/common/core/modules/appQuery";
import type { CatalogLoader } from "@atprotobrew/common/core/types/i18n";
import { Stack, useRouter, useSegments } from "expo-router";
import { Provider as JotaiProvider } from "jotai";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuthContext } from "../modules/auth/AuthProvider";
import { useWidgetSync } from "../modules/launcher/useWidgetSync";

const queryClient = getAppQueryClient();

const catalogLoader: CatalogLoader = async (lang) => {
	switch (lang) {
		case "ja":
			return (await import("../locales/ja/messages")).messages;
		case "en":
			return (await import("../locales/en/messages")).messages;
	}
};

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<JotaiProvider>
				<AppI18nProvider extraLoaders={[catalogLoader]}>
					<UIProvider>
						<AppQueryProvider client={queryClient}>
							<AuthProvider>
								<RootLayoutNav />
							</AuthProvider>
						</AppQueryProvider>
					</UIProvider>
				</AppI18nProvider>
			</JotaiProvider>
		</GestureHandlerRootView>
	);
}

function RootLayoutNav() {
	const { authState } = useAuthContext();
	const segments = useSegments();
	const router = useRouter();

	useWidgetSync();

	useEffect(() => {
		if (authState.status === "loading") {
			return;
		}

		const group = segments[0];

		switch (group) {
			case "(app)": {
				if (authState.status === "unauthenticated") {
					// 未認証で保護領域にいる → ログインへ
					router.replace("/(auth)/login");
				}

				break;
			}
			case "(auth)": {
				if (authState.status === "authenticated") {
					// 認証済みでログイン画面にいる → ホームへ
					router.replace("/(app)/home");
				}

				break;
			}
		}
	}, [
		authState.status,
		segments[0], // 認証済みでログイン画面にいる → ホームへ
		router.replace,
	]);

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(auth)" />
			<Stack.Screen name="(app)" />
			<Stack.Screen name="(public)" />
		</Stack>
	);
}
