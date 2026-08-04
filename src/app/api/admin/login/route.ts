import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/models/User";
import { createAdminToken } from "@/lib/adminAuth";
import { AuditLog } from "@/models/AuditLog";

// In-memory rate limiting map for login protection
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();

    // Check rate limit: max 5 attempts per 15 minutes
    const attempt = loginAttempts.get(ip);
    if (attempt) {
      if (now - attempt.firstAttempt < 15 * 60 * 1000) {
        if (attempt.count >= 5) {
          return NextResponse.json(
            {
              success: false,
              error: "Too many failed login attempts. Account temporarily locked for 15 minutes.",
            },
            { status: 429 }
          );
        }
      } else {
        // Reset window
        loginAttempts.set(ip, { count: 0, firstAttempt: now });
      }
    } else {
      loginAttempts.set(ip, { count: 0, firstAttempt: now });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    let user: any = null;

    // Try MongoDB if database is connected
    if (db && mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email });

        if (!user && email === "admin@khavyn.com") {
          const passwordHash = await bcrypt.hash("KhavynAdmin2026!", 12);
          user = await User.create({
            name: "KHAVYN Executive Administrator",
            email: "admin@khavyn.com",
            passwordHash,
            role: "admin",
          });
        }
      } catch (dbError) {
        console.warn("MongoDB user query failed, attempting demo fallback:", dbError);
      }
    }

    // Demo fallback mode when DB is unavailable or disconnected
    if (!user && email === "admin@khavyn.com" && password === "KhavynAdmin2026!") {
      user = {
        _id: "demo_admin_id_2026",
        email: "admin@khavyn.com",
        role: "admin",
        passwordHash: null,
      };
    }

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      const current = loginAttempts.get(ip)!;
      loginAttempts.set(ip, { ...current, count: current.count + 1 });
      return NextResponse.json(
        { success: false, error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Verify password if DB user has hash, or compare directly for demo admin
    const isPasswordValid = user.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : password === "KhavynAdmin2026!";

    if (!isPasswordValid) {
      const current = loginAttempts.get(ip)!;
      loginAttempts.set(ip, { ...current, count: current.count + 1 });
      return NextResponse.json(
        { success: false, error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Reset login attempts on success
    loginAttempts.delete(ip);

    // Create session token
    const token = await createAdminToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Log admin audit action if DB is connected
    if (db && mongoose.connection.readyState === 1) {
      try {
        await AuditLog.create({
          adminUserId: user._id.toString(),
          adminEmail: user.email,
          action: "ADMIN_LOGIN",
          targetType: "AUTH",
          details: "Admin user authenticated successfully",
          ipAddress: ip,
        });
      } catch (auditErr) {
        console.warn("Failed to write audit log:", auditErr);
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      role: user.role,
    });

    // Set secure httpOnly cookie
    response.cookies.set({
      name: "khavyn_admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 12 * 60 * 60, // 12 hours
    });

    return response;
  } catch (error: any) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Admin login error" },
      { status: 500 }
    );
  }
}
