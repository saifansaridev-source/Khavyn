import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = process.env.USER_SESSION_SECRET || "khavyn_user_secret_2026";
const secretKey = new TextEncoder().encode(SECRET);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("khavyn_user_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const { payload } = await jwtVerify(token, secretKey);

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
