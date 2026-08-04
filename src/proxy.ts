import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || "khavyn_admin_secret_key_2026";
const adminSecretKey = new TextEncoder().encode(ADMIN_SECRET);

const USER_SECRET = process.env.USER_SESSION_SECRET || "khavyn_user_secret_2026";
const userSecretKey = new TextEncoder().encode(USER_SECRET);

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ─── Admin route protection ───────────────────────────────────────────────
  if (path.startsWith("/admin/dashboard")) {
    const token = req.cookies.get("khavyn_admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      await jwtVerify(token, adminSecretKey, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("khavyn_admin_token");
      return response;
    }
  }

  // Redirect authenticated admin away from login page
  if (path === "/admin/login") {
    const token = req.cookies.get("khavyn_admin_token")?.value;
    if (token) {
      try {
        await jwtVerify(token, adminSecretKey, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } catch {
        // Token invalid, allow login page
      }
    }
  }

  // ─── Customer route protection ────────────────────────────────────────────
  if (path.startsWith("/account") || path.startsWith("/checkout")) {
    const token = req.cookies.get("khavyn_user_token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, userSecretKey, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("khavyn_user_token");
      return response;
    }
  }

  // Redirect authenticated users away from /login and /register
  if (path === "/login" || path === "/register") {
    const token = req.cookies.get("khavyn_user_token")?.value;
    if (token) {
      try {
        await jwtVerify(token, userSecretKey, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL("/account", req.url));
      } catch {
        // Token invalid, allow login page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/login",
    "/account/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
};
