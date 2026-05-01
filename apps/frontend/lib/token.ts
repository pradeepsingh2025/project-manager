/**
 * In-memory access token store.
 * Never persisted to localStorage/sessionStorage — lives only in JS closure.
 * This is the industry-standard approach for SPAs to avoid XSS attacks.
 */
let _accessToken: string | null = null;

export const tokenStore = {
  get: (): string | null => _accessToken,
  set: (token: string): void => {
    _accessToken = token;
  },
  clear: (): void => {
    _accessToken = null;
  },
};
