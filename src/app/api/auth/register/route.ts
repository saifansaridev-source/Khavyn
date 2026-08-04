import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/models/User";
import { SignJWT } from "jose";

const SECRET = process.env.USER_SESSION_SECRET || "khavyn_user_secret_2026";
const secretKey = new TextEncoder().encode(SECRET);

// In-memory rate limiter: max 3 register attempts per IP per hour
const registerAttempts = new Map<string, { count: number; firstAttempt: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();

    const attempt = registerAttempts.get(ip);
    if (attempt && now - attempt.firstAttempt < 60 * 60 * 1000) {
      if (attempt.count >= 10) {
        return NextResponse.json(
          { success: false, error: "Too many registration attempts. Please try again later." },
          { status: 429 }
        );
      }
    } else {
      registerAttempts.set(ip, { count: 0, firstAttempt: now });
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address format." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    // Demo mode — no MongoDB
    if (!db || mongoose.connection.readyState !== 1) {
      return NextResponse.json(
        { success: false, error: "Database not connected. Please configure MONGODB_URI in .env.local to enable user registration." },
        { status: 503 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      const current = registerAttempts.get(ip)!;
      registerAttempts.set(ip, { ...current, count: current.count + 1 });
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password with cost factor 12
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new customer
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "customer",
      addresses: [],
      isRestrictedFromCOD: false,
    });

    // Create session token
    const token = await new SignJWT({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
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
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
