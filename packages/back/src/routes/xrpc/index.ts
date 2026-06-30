import { createServer } from "../../lexicons";
import type { BrewEnv } from "../../types";
import { registerGetLauncher } from "./getLauncher";
import { registerGetStoreItem } from "./getStoreItem";
import { createServiceAuth } from "./lib/serviceAuth";

export function createXrpcServer() {
	const xrpc = createServer<BrewEnv>();
	const auth = createServiceAuth({ ownDid: "did:web:brew.tarororo.org" });
	registerGetLauncher(xrpc, auth);
	registerGetStoreItem(xrpc);
	return xrpc.xrpc.createApp();
}
