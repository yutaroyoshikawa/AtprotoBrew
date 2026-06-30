import { AtPassport } from "@atpassport/client/core";
import type { AppLanguage } from "@atprotobrew/common/core/types/i18n";
import { DEFAULT_HANDLE_RESOLVER } from "./useOAuthClient";

const AT_PASSPORT_STATE_KEY = "atpassport:state";

function createClient(lang?: AppLanguage): AtPassport {
	return new AtPassport({
		callbackUrl: `${window.location.origin}/atpassport/callback`,
		lang,
	});
}

export function startAtPassportLogin(lang: AppLanguage): void {
	const passport = createClient(lang);
	const { url, atpstate } = passport.generateAuthUrl();
	sessionStorage.setItem(AT_PASSPORT_STATE_KEY, atpstate);
	window.location.href = url;
}

export function parseAtPassportCallback(
	login: (handle: string, handleResolver: string) => Promise<void>,
): Promise<void> {
	const passport = createClient();
	const atpstate = sessionStorage.getItem(AT_PASSPORT_STATE_KEY);

	sessionStorage.removeItem(AT_PASSPORT_STATE_KEY);

	const { handle, pdsUrl } = passport.parseCallback(window.location.href, atpstate);

	if (!handle) {
		throw new Error("handle not returned from AtPassport");
	}

	return login(handle, pdsUrl ?? DEFAULT_HANDLE_RESOLVER);
}
