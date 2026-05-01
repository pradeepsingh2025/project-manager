import { tokenStore } from "./token";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type FetchOptions = RequestInit & { skipAuth?: boolean };

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
}

/**
 * Silent refresh: calls /api/auth/refresh (refresh token is sent automatically
 * via the HttpOnly cookie), then updates the in-memory access token.
 */
async function silentRefresh(): Promise<string | null> {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    credentials: "include", // sends HttpOnly cookie
  });

  if (!res.ok) {
    tokenStore.clear();
    return null;
  }

  const data: { accessToken: string } = await res.json();
  tokenStore.set(data.accessToken);
  return data.accessToken;
}

/**
 * apiFetch — drop-in replacement for fetch() that:
 * 1. Attaches the Authorization header with the in-memory access token.
 * 2. On 401, silently attempts a token refresh and retries once.
 * 3. Always sends cookies (credentials: "include") for the HttpOnly refresh token.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...rest } = options;

  const buildHeaders = (token: string | null): HeadersInit => ({
    "Content-Type": "application/json",
    ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers as Record<string, string> | undefined),
  });

  const doFetch = (token: string | null) =>
    fetch(`${API_BASE}${path}`, {
      ...rest,
      credentials: "include",
      headers: buildHeaders(token),
    });

  // First attempt
  let response = await doFetch(tokenStore.get());

  if (response.status !== 401 || skipAuth) {
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw Object.assign(new Error(err.message ?? "Request failed"), {
        status: response.status,
        data: err,
      });
    }
    return response.json() as Promise<T>;
  }

  // 401 — attempt silent refresh, serialize concurrent refreshes
  if (isRefreshing) {
    const newToken = await new Promise<string | null>((resolve) => {
      refreshQueue.push(resolve);
    });
    if (!newToken) throw Object.assign(new Error("Session expired"), { status: 401 });
    response = await doFetch(newToken);
  } else {
    isRefreshing = true;
    const newToken = await silentRefresh();
    isRefreshing = false;
    processQueue(newToken);

    if (!newToken) throw Object.assign(new Error("Session expired"), { status: 401 });
    response = await doFetch(newToken);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }));
    throw Object.assign(new Error(err.message ?? "Request failed"), {
      status: response.status,
      data: err,
    });
  }

  return response.json() as Promise<T>;
}
