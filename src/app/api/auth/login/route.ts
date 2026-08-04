import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/models/User";
import { SignJWT } from "jose";

const SECRET = process.env.USER_SESSION_SECRET || "khavyn_user_secret_2026";
const secretKey = new TextEncoder().encode(SECRET);

// In-memory rate limiter: max 5 login attempts per 15 minutes
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();

    const attempt = loginAttempts.get(ip);
    if (attempt) {
      if (now - attempt.firstAttempt < 15 * 60 * 1000) {
        if (attempt.count >= 5) {
          return NextResponse.json(
            { success: false, error: "Too many failed attempts. Please try again in 15 minutes." },
            { status: 429 }
          );
        }
      } else {
        loginAttempts.set(ip, { count: 0, firstAttempt: now });
      }
    } else {
      loginAttempts.set(ip, { count: 0, firstAttempt: now });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    // Demo mode fallback for testing without MongoDB
    if (!db || mongoose.connection.readyState !== 1) {
      // Allow demo customer & admin logins when DB is unavailable
      if (
        (email === "customer@khavyn.com" && password === "KhavynCustomer2026!") ||
        (email === "admin@khavyn.com" && password === "KhavynAdmin2026!")
      ) {
        const isDbAdmin = email === "admin@khavyn.com";
        const token = await new SignJWT({
          userId: isDbAdmin ? "demo_admin_id" : "demo_customer_id",
          email: email,
          name: isDbAdmin ? "KHAVYN Executive Administrator" : "Demo Customer",
          role: isDbAdmin ? "admin" : "customer",
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("7d")
          .sign(secretKey);

        const response = NextResponse.json({
          success: true,
          message: "Logged in successfully (demo mode).",
          user: {
            name: isDbAdmin ? "KHAVYN Executive Administrator" : "Demo Customer",
            email: email,
            role: isDbAdmin ? "admin" : "customer",
          },
        });

        response.cookies.set({
          name: "khavyn_user_token",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        return response;
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Database not connected. Please use demo credentials (customer@khavyn.com / KhavynCustomer2026! or admin@khavyn.com / KhavynAdmin2026!).",
        },
        { status: 503 }
      );
    }

    // Find user in database
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !user.passwordHash) {
      const current = loginAttempts.get(ip)!;
      loginAttempts.set(ip, { ...current, count: current.count + 1 });
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      const current = loginAttempts.get(ip)!;
      loginAttempts.set(ip, { ...current, count: current.count + 1 });
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Success — reset rate limiter
    loginAttempts.delete(ip);

    // Create 7-day session token
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully.",
      user: { name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set({
      name: "khavyn_user_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
