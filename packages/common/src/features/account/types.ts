import { isAtprotoDid } from "@atproto/did";
import { z } from "zod";

export const storedAccountSchema = z.object({
	did: z.string().refine(isAtprotoDid),
	handle: z.string(),
	handleResolver: z.string(),
	addedAt: z.number(),
	lastUsedAt: z.number(),
});

export const accountStoreStateSchema = z.object({
	accounts: z.array(storedAccountSchema),
	activeDid: z.string().refine(isAtprotoDid).nullable(),
});

export type StoredAccount = z.infer<typeof storedAccountSchema>;
export type AccountStoreState = z.infer<typeof accountStoreStateSchema>;

export const DEFAULT_ACCOUNT_STORE_STATE: AccountStoreState = {
	accounts: [],
	activeDid: null,
};
