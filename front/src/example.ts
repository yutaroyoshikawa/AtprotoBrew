import { type AgentConfig, Client } from "@atproto/lex";
import * as org from "./lexicons/org";

const session = {};
const client = new Client(session as AgentConfig);
client.headers.set("atproto-proxy", "did:web:");
const res = await client.xrpc(org.tarororo.brew.getLauncher);
const data = res.body;
