import type { AtIdentifierString, Client } from "@atproto/lex";
import type * as org from "@atprotobrew/atproto/lexicons/org";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { fetchStoreLaunchers, lexicon } from "./fetchStoreLaunchers";
import { putLauncher } from "./putLauncher";

export function useFetchStoreItems({ client }: { client: Client }) {
	const queryKey = [lexicon.$nsid, client.did] as const;

	const queryValues = useSuspenseQuery({
		queryKey,
		queryFn: () => fetchStoreLaunchers({ client }),
	});

	return queryValues;
}

export function usePutStoreItemMutation({ identifier, client }: { client: Client; identifier: AtIdentifierString }) {
	const mutationValues = useMutation({
		mutationFn: (items: org.tarororo.brew.launcher.Item[]) =>
			putLauncher({ launcherItems: items, identifier, client }),
	});

	return mutationValues;
}
