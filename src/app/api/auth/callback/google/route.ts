import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/models/User";
import { SignJWT } from "jose";
import { getGoogleRedirectUri } from "@/lib/auth/google";

const SECRET = process.env.USER_SESSION_SECRET || "khavyn_user_secret_2026";
const secretKey = new TextEncoder().encode(SECRET);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const stateRaw = searchParams.get("state");

  let targetRedirect = "/account";
  if (stateRaw) {
    try {
      const parsed = JSON.parse(Buffer.from(stateRaw, "base64").toString());
      if (parsed.redirect) targetRedirect = parsed.redirect;
    } catch {}
  }

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Google Sign-In was cancelled or failed.")}`, req.url)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Google credentials are missing in server environment.")}`, req.url)
    );
  }

  const redirectUri = getGoogleRedirectUri(req);

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("[Google OAuth Token Error]:", tokenData);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Failed to retrieve authentication token from Google.")}`, req.url)
      );
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileRes.json();
    if (!profile.email) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Google account did not return a valid email address.")}`, req.url)
      );
    }

    const email = profile.email.toLowerCase().trim();
    const name = profile.name || email.split("@")[0];
    const image = profile.picture || "";
    const googleId = profile.id;

    // 3. Database connection & user sync
    let userId = `google_${googleId || Date.now()}`;
    let role = "customer";

    try {
      const db = await connectToDatabase();
      if (db) {
        let user = await User.findOne({ email });

        if (user) {
          // Existing user — link googleId and mark emailVerified
          user.googleId = googleId;
          user.emailVerified = true;
          if (!user.image && image) user.image = image;
          await user.save();
          userId = user._id.toString();
          role = user.role;
        } else {
          // New user from Google Sign-In
          user = await User.create({
            name,
            email,
            image,
            googleId,
            role: "customer",
            emailVerified: true,
            phoneVerified: false,
            isActive: true,
            addresses: [],
            isRestrictedFromCOD: false,
          });
          userId = user._id.toString();
          role = user.role;
        }
      }
    } catch (dbErr: any) {
      console.warn("[Google OAuth DB Sync Warning]:", dbErr?.message);
      // Fall back to verified Google token session so login still succeeds
    }

    // 4. Issue standard 7-day session token (matching existing JWT system)
    const token = await new SignJWT({
      userId,
      email,
      name,
      role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const redirectUrl = new URL(targetRedirect, req.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set({
      name: "khavyn_user_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error("[Google OAuth Callback Exception]:", err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err?.message || "An error occurred while signing in with Google.")}`, req.url)
    );
  }
}
