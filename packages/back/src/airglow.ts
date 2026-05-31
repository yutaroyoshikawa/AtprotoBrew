import { createHmac, timingSafeEqual } from "node:crypto";
import { Hono } from "hono";
import type { BlankSchema } from "hono/types";
import { storeItemsTable } from "./db/schema";
import { validateRecord as validateLauncherRecord } from "./lexicons/types/org/tarororo/brew/launcher";
import {
	type Record as storeItemRecord,
	validateRecord as validateStoreItemRecord,
} from "./lexicons/types/org/tarororo/brew/storeItem";
import { resolvePdsUrl } from "./resolver";
import type { Env } from "./types";

type WebhookPayload = {
	automation: string;
	lexicon: string;
	conditions: Array<{ field: string; operator: string; value: string }>;
	event: {
		did: string;
		time_us: number;
		kind: "commit";
		commit: {
			operation: "create" | "update" | "delete";
			collection: string;
			rkey: string;
			record?: Record<string, unknown>;
			cid?: string;
		};
	};
	fetches?: Record<string, { uri: string; cid: string; record: Record<string, unknown> }>;
	/** Present only when the action is configured with a forEach modifier — this
	 *  is the array element that triggered the current delivery. */
	item?: unknown;
};

export function createAirglow(): Hono<Env, BlankSchema, "/"> {
	const app = new Hono<Env>();

	app.post("storeitem", async (c) => {
		const payload = await c.req.json<WebhookPayload>().catch(() => null);
		if (payload == null || !validatePayload(payload, "org.tarororo.brew.storeItem")) {
			return c.text("Invalid payload", 400);
		}
		const buf = await c.req.raw.clone().arrayBuffer();
		const headerSig = c.req.header("x-airglow-signature")?.slice("sha256=".length);
		if (headerSig == null || !verifySign(Buffer.from(buf), headerSig, c.env.AIRGLOW_STOREITEM_SECRET)) {
			return c.text("Invalid signature", 400);
		}
		const pdsUrl = await resolvePdsUrl(payload.event.did);
		if (pdsUrl == null) {
			return c.text("Could not resolve PDS", 400);
		}
		const db = c.get("db");
		switch (payload.event.commit.operation) {
			case "create":
			case "update": {
				const record = payload.event.commit.record as storeItemRecord;
				const inserts: typeof storeItemsTable.$inferInsert = {
					author: record.author,
					description: record.description,
					launch: JSON.stringify(record.launch),
					thumbnailCid: record.thumbnail.ref.cid,
					thumbnailUrl: new URL(
						`/xrpc/com.atproto.sync.getBlob?did=${payload.event.did}&cid=${record.thumbnail.ref.cid}`,
						pdsUrl,
					).toString(),
					title: record.title,
					uri: `at://${payload.event.did}/${payload.event.commit.collection}/${payload.event.commit.rkey}`,
					createdAt: new Date(record.createdAt).valueOf(),
					updatedAt: Date.now(),
					indexedAt: Date.now(),
					originalRecord: JSON.stringify(record),
				};
				const recordInsertResult = await db
					.insert(storeItemsTable)
					.values(inserts)
					.onConflictDoUpdate({ set: inserts, target: [storeItemsTable.uri] })
					.returning({ id: storeItemsTable.id })
					.execute();

				// TODO: タグ機能つくりたい

				return c.status(204);
			}
			case "delete":
				// deleteは別hookにて対応、airglowの仕様上の都合
				return c.status(404);
		}
	});

	return app;
}
interface Automation {
	uri: string[];
	lexicon: string;
	validator: (v: unknown) => { success: boolean };
}
const automations = {
	"org.tarororo.brew.storeItem": {
		uri: ["at://did:plc:dkldnqnggfxlsagbgawfdc66/run.airglow.automation/3mmq7sz726s22"],
		lexicon: "org.tarororo.brew.storeItem",
		validator: validateStoreItemRecord,
	},

	"org.tarororo.brew.launcher": {
		uri: ["at://did:plc:dkldnqnggfxlsagbgawfdc66/run.airglow.automation/3mmq7sz726s22"],
		lexicon: "org.tarororo.brew.launcher",
		validator: validateLauncherRecord,
	},
} as const satisfies Record<string, Automation>;
function isTargetLexicon(lexicon: string): lexicon is keyof typeof automations {
	return Object.keys(automations).includes(lexicon);
}
function validatePayload(payload: Partial<WebhookPayload>, lexicon?: string): payload is WebhookPayload {
	if (
		payload.lexicon == null ||
		!isTargetLexicon(payload.lexicon) ||
		(lexicon != null && payload.lexicon !== lexicon)
	)
		return false;
	if (payload.automation == null || !automations[payload.lexicon].uri.some((uri) => uri === payload.automation))
		return false;
	if (!isObject(payload.event)) return false;
	if (payload.event.kind !== "commit") return false;
	if (!isObject(payload.event.commit)) return false;
	if (!isString(payload.event.commit.collection) || !isString(payload.event.commit.rkey)) return false;

	switch (payload.event.commit.operation) {
		case "create":
		case "update":
			if (payload.event.commit.record == null) return false;
			if (!automations[payload.lexicon].validator(payload.event.commit.record).success) return false;
			break;
		case "delete":
			break;
		default:
			return false;
	}
	return true;
}
function isObject(v: unknown): v is object {
	if (v == null) return false;
	return typeof v === "object";
}
function isString(v: unknown): v is string {
	if (v == null) return false;
	return typeof v === "string";
}
function verifySign(body: Buffer, signature: string, secret: string) {
	try {
		const recived = Buffer.from(signature, "hex");
		const conputedHex = createHmac("sha256", secret).update(body).digest("hex");
		const conputed = Buffer.from(conputedHex, "hex");
		if (conputed.length !== recived.length || !timingSafeEqual(recived, conputed)) {
			return false;
		}
		return true;
	} catch (e) {
		console.error("Error verifying signature", e);
		return false;
	}
}
