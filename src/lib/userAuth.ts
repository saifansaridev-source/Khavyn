import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = process.env.USER_SESSION_SECRET || "khavyn_user_secret_2026";
const secretKey = new TextEncoder().encode(SECRET);

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export async function getAuthenticatedUser(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("khavyn_user_token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, secretKey);
    return {
      userId: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role: (payload.role as string) || "customer",
    };
  } catch {
    return null;
  }
}
