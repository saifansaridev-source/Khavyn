import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/models/User";
import { getAuthenticatedUser } from "@/lib/userAuth";

export async function GET() {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ _id: session.userId }, { email: session.email.toLowerCase() }],
    }).select("-passwordHash");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        googleLinked: !!user.googleId,
        sizeProfile: user.sizeProfile || [],
        commPreferences: user.commPreferences || {
          whatsapp: true,
          email: true,
          sms: true,
        },
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("[User Profile GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, commPreferences, currentPassword, newPassword } = body;

    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ _id: session.userId }, { email: session.email.toLowerCase() }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    // Update basic fields
    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }
    if (typeof phone === "string") {
      user.phone = phone.trim();
    }
    if (commPreferences && typeof commPreferences === "object") {
      user.commPreferences = {
        whatsapp: Boolean(commPreferences.whatsapp),
        email: Boolean(commPreferences.email),
        sms: Boolean(commPreferences.sms),
      };
    }

    // Password change logic (if customer provided password fields)
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters." },
          { status: 400 }
        );
      }

      // If user currently has a passwordHash, verify current password
      if (user.passwordHash) {
        if (!currentPassword) {
          return NextResponse.json(
            { success: false, error: "Current password is required to set a new password." },
            { status: 400 }
          );
        }
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
          return NextResponse.json(
            { success: false, error: "Current password is incorrect." },
            { status: 400 }
          );
        }
      }

      user.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        googleLinked: !!user.googleId,
        sizeProfile: user.sizeProfile || [],
        commPreferences: user.commPreferences,
      },
    });
  } catch (error: any) {
    console.error("[User Profile PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
