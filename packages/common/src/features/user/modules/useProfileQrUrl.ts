import type { AtprotoDid } from "@atproto/did";

const BREW_WEB_BASE_URL = "https://brew.tarororo.org";

export function useProfileQrUrl(did: AtprotoDid): string {
	return `${BREW_WEB_BASE_URL}/profile/${did}`;
}
