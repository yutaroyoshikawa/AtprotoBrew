import type { StoreItemView } from "@atprotobrew/atproto/lexicons/org/tarororo/brew/defs.defs";
import { z } from "zod";

export type LaunchTarget =
	| { $type: "org.tarororo.brew.defs#launchWeb"; link: string }
	| { $type: "org.tarororo.brew.defs#launchStore" };

export interface LauncherItem {
	id: string; // AT URI (storeItemView.uri)
	label: string; // storeItemView.title
	iconUri: string; // storeItemView.thumbnail
	address: number; // 絶対番地
	launch: LaunchTarget;
}

export type StoreItem = StoreItemView;

export const persistedLayoutV1Schema = z.object({
	version: z.literal(1),
	perPage: z.number(),
	items: z.array(z.object({ id: z.string(), address: z.number() })),
});

export type PersistedLayoutV1 = z.infer<typeof persistedLayoutV1Schema>;
