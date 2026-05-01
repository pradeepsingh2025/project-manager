"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tokenStore } from "@/lib/token";

// ─── Auth context types ───────────────────────────────────────────────────────
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthContextValue {
  user: AuthUser | null;
  setSession: (user: AuthUser, accessToken: string) => void;
  clearSession: () => void;
}

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <Providers>");
  return ctx;
}

// ─── QueryClient (singleton per app) ─────────────────────────────────────────
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000, retry: 1 },
      mutations: { retry: 0 },
    },
  });
}

let browserQueryClient: QueryClient | undefined;
function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

// ─── Providers ────────────────────────────────────────────────────────────────
export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);

  const setSession = useCallback((u: AuthUser, accessToken: string) => {
    tokenStore.set(accessToken);
    setUser(u);
  }, []);

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, setSession, clearSession }}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
