import type { Agent } from "@atproto/lex";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchLauncher, lexicon } from "./fetchLauncher";

export function useFetchLaunchers({ agent }: { agent: Agent }) {
	const queryKey = [agent.did, lexicon.$nsid] as const;

	const queryValues = useSuspenseQuery({
		queryKey,
		queryFn: () => fetchLauncher({ agent }),
	});

	return queryValues;
}
