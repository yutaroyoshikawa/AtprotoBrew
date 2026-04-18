import { type AgentConfig, Client } from "@atproto/lex";
import * as com from "./lexicons/com";
import * as org from "./lexicons/org";

// 初期化、セッションはよしなに
const session = {};
const client = new Client(session as AgentConfig);
client.headers.set("atproto-proxy", "did:web:brew.tarororo.org");

// データ取得
const res = await client.xrpc(org.tarororo.brew.getLauncher);
const data = res.body;

// 保存
com.atproto.repo.putRecord;
await client.xrpc(com.atproto.repo.putRecord, {
	body: {
		repo: "did:plc:ユーザーのdid",
		collection: "org.tarororo.brew.launcher",
		record: { items: [], $type: "org.tarororo.brew.launcher" } satisfies org.tarororo.brew.launcher.Main,
		rkey: "self",
	},
});
