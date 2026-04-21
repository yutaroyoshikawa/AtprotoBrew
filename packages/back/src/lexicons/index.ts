/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
	type Auth,
	createXRPCHono as createXrpcServer,
	type HonoConfigOrHandler,
	type HonoXRPCOptions as XrpcOptions,
	type XRPCHono as XrpcServer,
} from "@evex-dev/xrpc-hono";
import type { Env } from "hono";
import { schemas } from "./lexicons.js";
import type * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.js";
import type * as OrgTarororoBrewGetLauncher from "./types/org/tarororo/brew/getLauncher.js";

export function createServer<E extends Env = Env>(options?: XrpcOptions<E>): Server<E> {
	return new Server<E>(options);
}

export class Server<E extends Env> {
	xrpc: XrpcServer<E>;
	com: ComNS<E>;
	org: OrgNS<E>;

	constructor(options?: XrpcOptions<E>) {
		this.xrpc = createXrpcServer<E>(schemas, options);
		this.com = new ComNS<E>(this);
		this.org = new OrgNS<E>(this);
	}
}

export class ComNS<E extends Env> {
	_server: Server<E>;
	atproto: ComAtprotoNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.atproto = new ComAtprotoNS<E>(server);
	}
}

export class ComAtprotoNS<E extends Env> {
	_server: Server<E>;
	repo: ComAtprotoRepoNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.repo = new ComAtprotoRepoNS<E>(server);
	}
}

export class ComAtprotoRepoNS<E extends Env> {
	_server: Server<E>;

	constructor(server: Server<E>) {
		this._server = server;
	}

	getRecord<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			ComAtprotoRepoGetRecord.QueryParams,
			ComAtprotoRepoGetRecord.HandlerInput,
			ComAtprotoRepoGetRecord.HandlerOutput
		>,
	) {
		const nsid = "com.atproto.repo.getRecord";
		return this._server.xrpc.addMethod(nsid, cfg);
	}
}

export class OrgNS<E extends Env> {
	_server: Server<E>;
	tarororo: OrgTarororoNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.tarororo = new OrgTarororoNS<E>(server);
	}
}

export class OrgTarororoNS<E extends Env> {
	_server: Server<E>;
	brew: OrgTarororoBrewNS<E>;

	constructor(server: Server<E>) {
		this._server = server;
		this.brew = new OrgTarororoBrewNS<E>(server);
	}
}

export class OrgTarororoBrewNS<E extends Env> {
	_server: Server<E>;

	constructor(server: Server<E>) {
		this._server = server;
	}

	getLauncher<A extends Auth = undefined>(
		cfg: HonoConfigOrHandler<
			E,
			A,
			OrgTarororoBrewGetLauncher.QueryParams,
			OrgTarororoBrewGetLauncher.HandlerInput,
			OrgTarororoBrewGetLauncher.HandlerOutput
		>,
	) {
		const nsid = "org.tarororo.brew.getLauncher";
		return this._server.xrpc.addMethod(nsid, cfg);
	}
}
