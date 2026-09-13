import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/connect";
import { OtpVerification } from "@/models/OtpVerification";
import { User } from "@/models/User";
import { SignJWT } from "jose";
import { sendEmail } from "@/lib/email";
import { getWelcomeEmailHtml } from "@/lib/emailTemplates/welcome";

const SECRET = process.env.USER_SESSION_SECRET || "khavyn_user_secret_2026";
const secretKey = new TextEncoder().encode(SECRET);

export async function POST(req: Request) {
  try {
    const { email, emailOtp, phoneOtp, name, phone, password } = await req.json();

    if (!email || !emailOtp || !phoneOtp) {
      return NextResponse.json(
        { success: false, error: "Email, email OTP, and phone OTP are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the stored OTP verification record
    const record = await OtpVerification.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "OTP has expired or was not found. Please request a new code." },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      await record.deleteOne();
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Verify email OTP
    const emailOtpValid = await bcrypt.compare(emailOtp.toString().trim(), record.emailOtpHashed);
    if (!emailOtpValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect email verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Verify phone OTP
    const phoneOtpValid = await bcrypt.compare(phoneOtp.toString().trim(), record.phoneOtpHashed);
    if (!phoneOtpValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect phone verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Both OTPs verified — check if user already exists
    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      await record.deleteOne();
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name: (name || "").trim(),
      email: cleanEmail,
      phone: record.phone,
      passwordHash,
      role: "customer",
      emailVerified: true,
      phoneVerified: true,
      addresses: [],
      isRestrictedFromCOD: false,
      isActive: true,
    });

    // Clean up OTP record
    await record.deleteOne();

    // Send welcome email (non-blocking)
    sendEmail({
      to: cleanEmail,
      subject: "Welcome to KHAVYN — Crafting Everyday Luxury",
      html: getWelcomeEmailHtml({ customerName: newUser.name }),
    }).catch((err) => {
      console.warn("[KHAVYN] Welcome email dispatch error:", err);
    });

    // Issue session token
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
      message: "Account created successfully. Welcome to KHAVYN!",
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
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
  } catch (error: any) {
    console.error("[OTP Verify Error]:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
