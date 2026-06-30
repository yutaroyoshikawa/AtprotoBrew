import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

interface AppQueryProviderProps {
	children: ReactNode;
	client: QueryClient;
}

export function AppQueryProvider({ children, client }: AppQueryProviderProps) {
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
