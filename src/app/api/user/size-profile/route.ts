import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/models/User";
import { getAuthenticatedUser } from "@/lib/userAuth";

export async function GET() {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({
      $or: [{ _id: session.userId }, { email: session.email.toLowerCase() }],
    }).select("sizeProfile");

    return NextResponse.json({
      success: true,
      sizeProfile: user?.sizeProfile || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch size profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { sizeProfile } = await req.json();

    if (!Array.isArray(sizeProfile)) {
      return NextResponse.json(
        { success: false, error: "sizeProfile must be an array of { category, size }." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOneAndUpdate(
      { $or: [{ _id: session.userId }, { email: session.email.toLowerCase() }] },
      { sizeProfile },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Size profile updated.",
      sizeProfile: user?.sizeProfile || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save size profile." },
      { status: 500 }
    );
  }
}
