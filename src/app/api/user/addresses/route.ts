import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Address } from "@/models/Address";
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
    const addresses = await Address.find({
      $or: [{ userId: session.userId }, { userEmail: session.email.toLowerCase() }],
    }).sort({ isDefault: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error: any) {
    console.error("[Addresses GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch addresses." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      label = "Home",
      fullName,
      phone,
      addressLine1,
      addressLine2 = "",
      landmark = "",
      city,
      state,
      pincode,
      isDefault = false,
    } = body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required address fields." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // If marked as default, unset any existing default address
    if (isDefault) {
      await Address.updateMany(
        { $or: [{ userId: session.userId }, { userEmail: session.email.toLowerCase() }] },
        { isDefault: false }
      );
    }

    const newAddress = await Address.create({
      userId: session.userId,
      userEmail: session.email.toLowerCase(),
      label: ["Home", "Office", "Other"].includes(label) ? label : "Home",
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault: Boolean(isDefault),
    });

    return NextResponse.json({
      success: true,
      message: "Address saved successfully.",
      address: newAddress,
    });
  } catch (error: any) {
    console.error("[Addresses POST Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save address." },
      { status: 500 }
    );
  }
}
