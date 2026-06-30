import { eq } from "drizzle-orm";
import { storeItemsTable } from "../../db/schema";
import type { XrpcServer } from "./types";

export function registerGetStoreItem(xrpc: XrpcServer) {
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
}
