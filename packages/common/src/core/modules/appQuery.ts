import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

export function getAppQueryClient(config?: QueryClientConfig) {
	const client = new QueryClient(config);

	return client;
}
