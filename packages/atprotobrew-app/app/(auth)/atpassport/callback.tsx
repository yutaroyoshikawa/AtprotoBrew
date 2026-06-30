import { atoms as a } from "@atprotobrew/common/alf";
import { useThemeColors } from "@atprotobrew/common/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useEffectEvent } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthContext } from "../../../modules/auth/AuthProvider";
import { ATPSTATE_STORAGE_KEY } from "../../../modules/auth/atpassport";
import { DEFAULT_HANDLE_RESOLVER } from "../../../modules/auth/client";

// Shown when the OS opens the app via Universal Link / App Link for
// https://brew.tarororo.org/atpassport/callback?handle=...
// loginWithAtPassport handles the normal flow; this screen covers the deep-link fallback.
function AtPassportCallback() {
	const t = useThemeColors();
	const { login } = useAuthContext();
	const router = useRouter();
	const { handle, pdsurl } = useLocalSearchParams<{
		handle?: string;
		pdsurl?: string;
	}>();

	const runCallback = useEffectEvent(async (signal: AbortSignal) => {
		if (!handle) {
			return;
		}

		const storedAtpstate = await AsyncStorage.getItem(ATPSTATE_STORAGE_KEY);

		if (signal.aborted) {
			return;
		}

		// loginWithAtPassport is still in flight (atpstate not yet cleaned up).
		// The openAuthSessionAsync Linking listener will handle the result.
		if (storedAtpstate !== null) {
			return;
		}

		await login(handle, pdsurl ?? DEFAULT_HANDLE_RESOLVER);
	});

	useEffect(() => {
		const controller = new AbortController();

		runCallback(controller.signal).catch(() => {
			if (!controller.signal.aborted) {
				router.replace("/(auth)/login");
			}
		});

		return () => {
			controller.abort();
		};
	}, [router.replace]);

	return (
		<View style={[a.h_full, a.w_full, a.flex_col, a.justify_center, a.items_center, { backgroundColor: t.bg }]}>
			<ActivityIndicator />
		</View>
	);
}

export default AtPassportCallback;
