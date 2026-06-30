import type { DbClient } from "./db/client";

export type BrewEnv = {
	Bindings: CloudflareBindings;
	Variables: {
		db: DbClient;
	};
};
