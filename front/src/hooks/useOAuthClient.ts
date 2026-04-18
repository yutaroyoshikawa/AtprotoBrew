import { BrowserOAuthClient, buildLoopbackClientId } from "@atproto/oauth-client-browser";

type SessionDeletedHandler = (sub: string, cause: unknown) => void;

const deleteHandlers = new Set<SessionDeletedHandler>();
let clientPromise: Promise<BrowserOAuthClient> | null = null;

function getClientId(): string {
	const { hostname } = window.location;
	if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
		return buildLoopbackClientId(window.location);
	}
	return (import.meta.env.VITE_CLIENT_ID as string | undefined) ?? `${window.location.origin}/client-metadata.json`;
}

export function getOAuthClient(): Promise<BrowserOAuthClient> {
	if (!clientPromise) {
		clientPromise = BrowserOAuthClient.load({
			clientId: getClientId(),
			handleResolver: "https://bsky.social",
			onDelete: (_sub, cause) => {
				for (const handler of deleteHandlers) handler(_sub, cause);
			},
		});
	}
	return clientPromise;
}

export function onSessionDeleted(handler: SessionDeletedHandler): () => void {
	deleteHandlers.add(handler);
	return () => {
		deleteHandlers.delete(handler);
	};
}
