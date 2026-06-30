import { type AtprotoDid, ExpoOAuthClient } from "@atproto/oauth-client-expo";
import clientMetadataJson from "../../../atprotobrew-web/public/oauth/native/client-metadata.json";

export const DEFAULT_HANDLE_RESOLVER = "https://bsky.social";

type SessionDeletedHandler = (sub: AtprotoDid, cause: unknown) => void;

// Custom scheme with dots required by ExpoOAuthClient (CUSTOM_URI_SCHEME_REGEX)
type CustomSchemeUri = `${string}.${string}:/${string}`;

function isCustomSchemeUri(uri: string): uri is CustomSchemeUri {
	return /^[^.]+\.[^:]+:\//.test(uri);
}

function isCustomSchemeUriList(uris: string[]): uris is [CustomSchemeUri, ...string[]] {
	return uris.length > 0 && isCustomSchemeUri(uris[0]);
}

const deleteHandlers = new Set<SessionDeletedHandler>();
const clientCache = new Map<string, ExpoOAuthClient>();

export function getExpoOAuthClient(handleResolver: string = DEFAULT_HANDLE_RESOLVER): ExpoOAuthClient {
	const cached = clientCache.get(handleResolver);
	if (cached) {
		return cached;
	}

	const { redirect_uris } = clientMetadataJson;

	if (!isCustomSchemeUriList(redirect_uris)) {
		throw new Error(
			`redirect_uris must start with a custom scheme URI (e.g. "org.example.app:/..."): ${JSON.stringify(redirect_uris)}`,
		);
	}

	const client = new ExpoOAuthClient({
		clientMetadata: {
			...clientMetadataJson,
			redirect_uris,
		},
		handleResolver,
		onDelete: (sub: AtprotoDid, cause: unknown) => {
			for (const handler of deleteHandlers) {
				handler(sub, cause);
			}
		},
	});

	clientCache.set(handleResolver, client);
	return client;
}

export function onSessionDeleted(handler: SessionDeletedHandler): () => void {
	deleteHandlers.add(handler);

	return () => {
		deleteHandlers.delete(handler);
	};
}
