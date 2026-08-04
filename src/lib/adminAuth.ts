import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || "khavyn_admin_secret_key_2026";
const secretKey = new TextEncoder().encode(ADMIN_SECRET);

export interface AdminSession {
  userId: string;
  email: string;
  role: "admin" | "staff";
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("khavyn_admin_token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    const session = payload as unknown as AdminSession;
    if (session.role !== "admin" && session.role !== "staff") {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function createAdminToken(session: AdminSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secretKey);
}
