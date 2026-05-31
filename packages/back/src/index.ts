import "./polyfills";
import { BlobRef } from "@atproto/lexicon";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { createAirglow } from "./airglow";
import { checkAuthFactory } from "./auth";
import { storeItemsTable } from "./db/schema";
import { createServer } from "./lexicons";
import type { LaunchStore, LaunchWeb } from "./lexicons/types/org/tarororo/brew/defs";
import type { Record } from "./lexicons/types/org/tarororo/brew/storeItem";
import type { Env } from "./types";

const xrpc = createServer<Env>();

const storeRecord0: Record = {
	$type: "org.tarororo.brew.storeItem",
	author: "atproto brew",
	description: "store",
	title: "Store",
	launch: { $type: "org.tarororo.brew.defs#launchStore" } satisfies LaunchStore,
	createdAt: "2024-01-01T00:00:00Z",
	thumbnail: new BlobRef(
		{ $link: "bafkreihwihm6kpd6zuwhhlro75p5qks5qtrcu55jp3gddbfjsieiv7wuka" },
		"image/jpeg",
		256555,
	),
};
const storeRecord1: Record = {
	$type: "org.tarororo.brew.storeItem",
	author: "Bluesky Social PBC",
	title: "Bluesky",
	launch: {
		$type: "org.tarororo.brew.defs#launchWeb",
		link: "https://bsky.app",
	} satisfies LaunchWeb,
	description: "Bluesky",
	thumbnail: new BlobRef(
		{ $link: "bafkreihwihm6kpd6zuwhhlro75p5qks5qtrcu55jp3gddbfjsieiv7wuka" },
		"image/jpeg",
		256555,
	),
	createdAt: "2024-01-01T00:00:00Z",
};
const storeRecord2: Record = {
	$type: "org.tarororo.brew.storeItem",
	author: "ほりべあ",
	description: "",
	title: "TOKIMEKI",
	launch: {
		$type: "org.tarororo.brew.defs#launchWeb",
		link: "https://tokimeki.blue",
	} satisfies LaunchWeb,
	thumbnail: new BlobRef(
		{ $link: "bafkreibsbcc6yqqhdvmb6hzzqkwnxobog45cuelt4twmbdpctmcs7e4udy" },
		"image/png",
		42840,
	),
	createdAt: "2024-01-01T00:00:00Z",
};

const auth = checkAuthFactory({ ownDid: "did:web:brew.tarororo.org" });

xrpc.org.tarororo.brew.getLauncher({
	auth,
	handler: async ({ auth, params, input, c }) => {
		const userDid = auth.credentials.iss;
		return {
			encoding: "application/json",
			body: {
				record: {
					$type: "org.tarororo.brew.launcher",
					items: [
						{
							$type: "org.tarororo.brew.launcher#item",
							storeItemRef: { uri: "", cid: "" },
						},
						{
							$type: "org.tarororo.brew.launcher#item",
							storeItemRef: { uri: "", cid: "" },
						},
					],
				},
				items: [
					{
						record: storeRecord0,
						thumbnail:
							"https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:qcwvyds5tixmcwkwrg3hxgxd/bafkreihnhntxfqni2otd4jfa24uhepfs32nlzx76ypwvq332pu77bal6eu",
						title: storeRecord0.title,
						description: storeRecord0.description,
						author: storeRecord0.author,
						launch: storeRecord0.launch,
						uri: "at://did:web:brew.tarororo.org/org.tarororo.brew.storeItem/0",
					},
					{
						record: storeRecord1,
						thumbnail:
							"https://cdn.bsky.app/img/avatar/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreihwihm6kpd6zuwhhlro75p5qks5qtrcu55jp3gddbfjsieiv7wuka",
						author: storeRecord1.author,
						description: storeRecord1.description,
						title: storeRecord1.title,
						launch: storeRecord1.launch,
						uri: "at://did:web:brew.tarororo.org/org.tarororo.brew.storeItem/1",
					},
					{
						record: storeRecord2,
						thumbnail:
							"https://cdn.bsky.app/img/avatar/plain/did:plc:4tr5dqti7nmu6g2czpthntak/bafkreibsbcc6yqqhdvmb6hzzqkwnxobog45cuelt4twmbdpctmcs7e4udy",
						author: storeRecord2.author,
						description: storeRecord2.description,
						title: storeRecord2.title,
						launch: storeRecord2.launch,
						uri: "at://did:web:brew.tarororo.org/org.tarororo.brew.storeItem/2",
					},
				],
			},
		};
	},
});
xrpc.org.tarororo.brew.getStoreItem({
	handler: async ({ c, params }) => {
		const db = c.get("db");
		const rawresult = await db.select().from(storeItemsTable).where(eq(storeItemsTable.uri, params.uri));
		const result = rawresult[0];
		if (result == null) {
			return {
				status: 404,
				error: "NotFoundError",
			};
		}
		return {
			encoding: "application/json",
			body: {
				author: result.author ?? undefined,
				description: result.description ?? undefined,
				title: result.title,
				launch: JSON.parse(result.launch),
				thumbnail: result.thumbnailUrl,
				uri: result.uri,
				createdAt: new Date(result.createdAt).toISOString(),
				updatedAt: new Date(result.updatedAt).toISOString(),
				record: JSON.parse(result.originalRecord),
			},
		};
	},
});

const app = new Hono<Env>();
app.use(async (c, next) => {
	const db = drizzle(c.env.DB);
	c.set("db", db);
	await next();
});
app.route("/", xrpc.xrpc.createApp());
app.route("/airglow", createAirglow());

export default app;
