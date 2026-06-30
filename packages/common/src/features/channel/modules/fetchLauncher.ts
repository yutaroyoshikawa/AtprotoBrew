import { type Agent, xrpc } from "@atproto/lex";
import * as org from "@atprotobrew/atproto/lexicons/org";
import { atbrewXrpcHeader } from "../../../utils/xrpcHelper";

export const lexicon = org.tarororo.brew.getLauncher;

export async function fetchLauncher({ agent }: { agent: Agent }) {
	const res = await xrpc(agent, org.tarororo.brew.getLauncher, {
		headers: atbrewXrpcHeader,
	});

	return res;
}
