import { BlobRef } from "@atproto/lexicon";
import { createServer } from "./lexicons";
import { LaunchWeb, Record } from "./lexicons/types/org/tarororo/brew/storeItem";
import { Hono } from "hono";

type Env = { Bindings: {}; Variables: {} };

const xrpc = createServer<Env>();

const storeRecord1: Record = {
	$type: "org.tarororo.brew.storeItem",
	author: "Bluesky Social PBC",
	title: "Bluesky",
	launch: { $type: "org.tarororo.brew.storeItem#launchWeb", link: "https://bsky.app" } satisfies LaunchWeb,
	description: "Bluesky",
	thumbnail: new BlobRef("bafkreihwihm6kpd6zuwhhlro75p5qks5qtrcu55jp3gddbfjsieiv7wuka", "image/jpeg", 256555),
};
const storeRecord2: Record = {
	$type: "org.tarororo.brew.storeItem",
	author: "ほりべあ",
	description: "",
	title: "TOKIMEKI",
	launch: { $type: "org.tarororo.brew.storeItem#launchWeb", link: "https://tokimeki.blue" } satisfies LaunchWeb,
	thumbnail: new BlobRef("bafkreibsbcc6yqqhdvmb6hzzqkwnxobog45cuelt4twmbdpctmcs7e4udy", "image/png", 42840),
};

xrpc.org.tarororo.brew.getLauncher(async ({ auth, params, input, c }) => {
	return {
		encoding: "application/json",
		body: {
			record: {
				$type: "org.tarororo.brew.launcher",
				items: [
					{ $type: "org.tarororo.brew.launcher#item", storeItemRef: { uri: "", cid: "" } },
					{ $type: "org.tarororo.brew.launcher#item", storeItemRef: { uri: "", cid: "" } },
				],
			},
			view: [
				{
					record: storeRecord1,
					thumbnail:
						"https://cdn.bsky.app/img/avatar/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreihwihm6kpd6zuwhhlro75p5qks5qtrcu55jp3gddbfjsieiv7wuka",
				},
				{
					record: storeRecord2,
					thumbnail:
						"https://cdn.bsky.app/img/avatar/plain/did:plc:4tr5dqti7nmu6g2czpthntak/bafkreibsbcc6yqqhdvmb6hzzqkwnxobog45cuelt4twmbdpctmcs7e4udy",
				},
			],
		},
	};
});

const app = new Hono<Env>();
app.route("/", xrpc.xrpc.createApp());
export default app;
