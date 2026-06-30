import { AtPassport } from "@atpassport/client/core";
import type { AppLanguage } from "@atprotobrew/common/core/types/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { DEFAULT_HANDLE_RESOLVER } from "./client";

// ASWebAuthenticationSession (iOS 17.4+) uses .https(host:path:) callback matching
// when preferUniversalLinks is true, which requires the Associated Domains entitlement.
// On older iOS the fallback uses callbackURLScheme:"https"; preferUniversalLinks avoids
// that scheme intercepting intermediate atpassport redirects prematurely.
const CALLBACK_URL = "https://brew.tarororo.org/atpassport/callback";

// Exposed so callback.tsx can detect whether loginWithAtPassport is still in flight.
export const ATPSTATE_STORAGE_KEY = "atpassport:state";

export async function loginWithAtPassport(
	lang: AppLanguage,
	login: (handle: string, handleResolver: string) => Promise<void>,
	signal?: AbortSignal,
): Promise<void> {
	const passport = new AtPassport({ callbackUrl: CALLBACK_URL, lang });
	const { url, atpstate } = passport.generateAuthUrl();

	await AsyncStorage.setItem(ATPSTATE_STORAGE_KEY, atpstate);

	let result: Awaited<ReturnType<typeof WebBrowser.openAuthSessionAsync>>;

	try {
		result = await WebBrowser.openAuthSessionAsync(url, CALLBACK_URL, {
			preferUniversalLinks: true,
		});
	} finally {
		await AsyncStorage.removeItem(ATPSTATE_STORAGE_KEY);
	}

	if (signal?.aborted || result.type !== "success") {
		return;
	}

	const passportForParse = new AtPassport({ callbackUrl: CALLBACK_URL });
	const { handle, pdsUrl } = passportForParse.parseCallback(result.url, atpstate);

	if (signal?.aborted || !handle) {
		return;
	}

	await login(handle, pdsUrl ?? DEFAULT_HANDLE_RESOLVER);
}
