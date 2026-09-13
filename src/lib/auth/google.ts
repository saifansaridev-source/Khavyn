/**
 * Google OAuth Helper Utilities
 * Resolves consistent and environment-aware OAuth redirect URIs.
 */

export function getGoogleRedirectUri(req: Request): string {
  // 1. Explicit override if specified in environment
  if (process.env.GOOGLE_REDIRECT_URI && process.env.GOOGLE_REDIRECT_URI.trim() !== "") {
    return process.env.GOOGLE_REDIRECT_URI.trim();
  }

  const url = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || url.host;
  const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
  const proto = req.headers.get("x-forwarded-proto") || (isLocal ? "http" : "https");

  // 2. Check NEXT_PUBLIC_APP_URL if set
  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim() !== "") {
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, "");
    const configuredIsLocal = configuredUrl.includes("localhost") || configuredUrl.includes("127.0.0.1");

    // Match environment context (don't send localhost URL in production or prod URL in local dev)
    if ((isLocal && configuredIsLocal) || (!isLocal && !configuredIsLocal)) {
      return `${configuredUrl}/api/auth/callback/google`;
    }
  }

  // 3. Fall back to current incoming request host
  return `${proto}://${host}/api/auth/callback/google`;
}
