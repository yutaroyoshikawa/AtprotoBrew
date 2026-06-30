import type { AtprotoDid } from "@atproto/did";
import type { StoredAccount } from "@atprotobrew/common/account/types";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { AuthState } from "./useAuth";
import { useAuth } from "./useAuth";

interface AuthContextValue {
	authState: AuthState;
	accounts: StoredAccount[];
	login: (handle: string, handleResolver: string) => Promise<void>;
	logout: () => Promise<void>;
	switchAccount: (did: AtprotoDid) => Promise<void>;
	deleteAccount: (did: AtprotoDid) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const values = useAuth();

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
	const ctx = useContext(AuthContext);

	if (!ctx) {
		throw new Error("useAuthContext must be used within AuthProvider");
	}

	return ctx;
}
