import type { Client } from "@atproto/lex";
import * as org from "@atprotobrew/atproto/lexicons/org";

export const lexicon = org.tarororo.brew.storeItem;

export async function fetchStoreLaunchers({ client }: { client: Client }) {
	const res = await client.list(lexicon, {});

	return res;
}
