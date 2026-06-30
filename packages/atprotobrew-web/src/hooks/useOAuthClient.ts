import { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import config from "../../public/oauth/web/client-metadata.json";

export const DEFAULT_HANDLE_RESOLVER = "https://bsky.social";
const HANDLE_RESOLVER_STORAGE_KEY = "atprotobrew:handleResolver";

type SessionDeletedHandler = (sub: string, cause: unknown) => void;

const deleteHandlers = new Set<SessionDeletedHandler>();
const clientCache = new Map<string, Promise<BrowserOAuthClient>>();

export function saveHandleResolver(resolver: string): void {
	localStorage.setItem(HANDLE_RESOLVER_STORAGE_KEY, resolver);
}

export function loadHandleResolver(): string {
	return localStorage.getItem(HANDLE_RESOLVER_STORAGE_KEY) ?? DEFAULT_HANDLE_RESOLVER;
}

function createOnDelete() {
	return (sub: string, cause: unknown) => {
		for (const handler of deleteHandlers) {
			handler(sub, cause);
		}
	};
}

function getOAuthClientDev(handleResolver: string): Promise<BrowserOAuthClient> {
	const { port } = window.location;
	const hostname = "127.0.0.1";
	const redirectUri = `http://${hostname}:${port}/`;

	// loopback client_id を自前で組み立てる。
	// buildLoopbackClientId は scope を含められないので使わない。
	const params = new URLSearchParams({
		redirect_uri: redirectUri,
		scope: config.scope,
	});
	const clientId = `http://localhost?${params.toString()}`;

	return Promise.resolve(
		new BrowserOAuthClient({
			clientMetadata: {
				client_id: clientId,
				client_name: config.client_name,
				client_uri: config.client_uri,
				redirect_uris: [redirectUri],
				scope: config.scope,
				grant_types: ["authorization_code", "refresh_token"],
				response_types: ["code"],
				application_type: "web",
				token_endpoint_auth_method: "none",
				dpop_bound_access_tokens: true,
			},
			handleResolver,
			onDelete: createOnDelete(),
		}),
	);
}

export function getOAuthClient(handleResolver: string = loadHandleResolver()): Promise<BrowserOAuthClient> {
	const cached = clientCache.get(handleResolver);
	if (cached) {
		return cached;
	}

	const promise = import.meta.env.DEV
		? getOAuthClientDev(handleResolver)
		: BrowserOAuthClient.load({
				clientId: config.client_id,
				handleResolver,
				onDelete: createOnDelete(),
			});

	clientCache.set(handleResolver, promise);
	return promise;
}

export function onSessionDeleted(handler: SessionDeletedHandler): () => void {
	deleteHandlers.add(handler);

	return () => {
		deleteHandlers.delete(handler);
	};
}
