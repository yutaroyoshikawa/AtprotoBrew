import { type DidDocument, DidResolver, getPds, MemoryCache } from "@atproto/did-resolver";

const didResolver = new DidResolver({}, new MemoryCache());

export async function resolvePdsUrl(did: string): Promise<string | null> {
	const doc = await didResolver.resolveDid(did);
	if (doc == null) {
		return null;
	}
	return getPds(doc) || null;
}
export async function resolveDiddoc(did: string, forceRefresh: boolean): Promise<DidDocument | null> {
	const doc = await didResolver.resolveDid(did, forceRefresh);
	return doc;
}
