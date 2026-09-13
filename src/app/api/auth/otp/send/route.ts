import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/connect";
import { OtpVerification } from "@/models/OtpVerification";
import { sendEmail } from "@/lib/email";
import { sendPhoneOtp } from "@/lib/otp";
import { wrapInLuxuryEmailTemplate } from "@/lib/email/emailTemplates";

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function getOtpEmailHtml(name: string, otp: string): string {
  const contentHtml = `
    <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #1A1A1A; margin-top: 0;">
      Verify Your Email Address
    </h2>
    <p>Hello ${name || "there"},</p>
    <p>Use the verification code below to complete your KHAVYN account registration.</p>
    <div style="text-align: center; margin: 32px 0;">
      <div style="display: inline-block; background-color: #1A1A1A; border: 2px solid #C6A664; border-radius: 8px; padding: 20px 40px;">
        <p style="margin: 0; font-size: 11px; color: #C6A664; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Your OTP</p>
        <p style="margin: 0; font-size: 36px; font-weight: bold; color: #FFFFFF; letter-spacing: 8px; font-family: monospace;">${otp}</p>
      </div>
    </div>
    <p style="font-size: 13px; color: #666;">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
    <p style="font-size: 12px; color: #999;">If you did not register on khavyn.com, please ignore this email.</p>
  `;
  return wrapInLuxuryEmailTemplate({
    title: "KHAVYN — Email Verification Code",
    preheader: `Your KHAVYN verification code is: ${otp}`,
    contentHtml,
  });
}

// Rate limit: max 3 OTP requests per email per 10 min (in-memory)
const otpRateLimiter = new Map<string, { count: number; firstAttempt: number }>();

export async function POST(req: Request) {
  try {
    const { email, phone, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Phone is optional contact info
    let cleanPhone = "";
    if (phone && phone.trim()) {
      cleanPhone = phone.replace(/\D/g, "");
    }

    // Rate limit check
    const now = Date.now();
    const key = email.toLowerCase().trim();
    const rl = otpRateLimiter.get(key);
    if (rl && now - rl.firstAttempt < 10 * 60 * 1000) {
      if (rl.count >= 3) {
        return NextResponse.json(
          { success: false, error: "Too many OTP requests. Please wait 10 minutes before trying again." },
          { status: 429 }
        );
      }
      otpRateLimiter.set(key, { ...rl, count: rl.count + 1 });
    } else {
      otpRateLimiter.set(key, { count: 1, firstAttempt: now });
    }

    // Generate Email OTP only
    const emailOtp = generateOtp();
    const emailOtpHashed = await bcrypt.hash(emailOtp, 10);

    // Store in DB (upsert to handle resend)
    await connectToDatabase();
    await OtpVerification.deleteMany({ email: key }); // Remove old OTPs for this email
    await OtpVerification.create({
      email: key,
      phone: cleanPhone || undefined,
      emailOtpHashed,
      emailVerified: false,
      phoneVerified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send email OTP
    const emailResult = await sendEmail({
      to: key,
      subject: "KHAVYN — Your Email Verification Code",
      html: getOtpEmailHtml(name || "", emailOtp),
    });

    const emailSent = emailResult.success;

    if (!emailSent) {
      // If Resend failed because domain is unverified (free tier restriction to account email only)
      const isDomainRestricted =
        emailResult.error?.includes("resend.com/domains") ||
        emailResult.error?.includes("testing emails to your own email") ||
        emailResult.error?.includes("validation_error");

      if (isDomainRestricted || process.env.NODE_ENV !== "production") {
        console.warn(
          `[OTP Send Fallback] Resend unverified domain restriction. Providing test OTP for ${key}: ${emailOtp}`
        );
        return NextResponse.json({
          success: true,
          message: "Verification code generated (Testing/Fallback Mode).",
          _dev: {
            note: "Resend domain unverified. Use this OTP to complete verification:",
            emailOtp,
          },
        });
      }

      return NextResponse.json(
        { success: false, error: emailResult.error || "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    // In dev/simulation mode, include OTP in response for automated testing
    const isSimulated = emailResult.simulated || process.env.NODE_ENV !== "production";

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email.",
      ...(isSimulated && {
        _dev: {
          note: "Dev/Testing mode OTP",
          emailOtp,
        },
      }),
    });
  } catch (error: any) {
    console.error("[OTP Send Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send verification codes. Please try again." },
      { status: 500 }
    );
  }
}
