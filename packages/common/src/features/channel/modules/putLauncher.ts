import { type AtIdentifierString, type Client, toDatetimeString } from "@atproto/lex";
import * as com from "@atprotobrew/atproto/lexicons/com";
import type * as org from "@atprotobrew/atproto/lexicons/org";

export async function putLauncher({
	client,
	identifier,
	launcherItems,
}: {
	client: Client;
	identifier: AtIdentifierString;
	launcherItems: org.tarororo.brew.launcher.Item[];
}) {
	const res = await client.xrpc(com.atproto.repo.putRecord, {
		body: {
			repo: identifier,
			collection: "org.tarororo.brew.launcher",
			record: {
				items: launcherItems,
				$type: "org.tarororo.brew.launcher",
				createdAt: toDatetimeString(new Date()),
			} satisfies org.tarororo.brew.launcher.Main,
			rkey: "self",
		},
	});

	return res;
}
