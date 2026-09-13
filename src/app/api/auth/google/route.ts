import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirect = searchParams.get("redirect") || "/account";

  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId || clientId.trim() === "" || clientId.includes("XXXXXXXX")) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(
          "Google Sign-In is not configured yet. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables."
        )}`,
        req.url
      )
    );
  }

  // Support both production redirect URI and dynamic local dev
  const isProd = process.env.NODE_ENV === "production";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (isProd ? "https://khavyn.vercel.app" : "http://localhost:3000");
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  const stateObj = JSON.stringify({ redirect });
  const state = Buffer.from(stateObj).toString("base64");

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(googleAuthUrl.toString());
}
