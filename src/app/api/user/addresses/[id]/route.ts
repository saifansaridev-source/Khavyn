import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Address } from "@/models/Address";
import { getAuthenticatedUser } from "@/lib/userAuth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();

    await connectToDatabase();

    const address = await Address.findOne({
      _id: id,
      $or: [{ userId: session.userId }, { userEmail: session.email.toLowerCase() }],
    });

    if (!address) {
      return NextResponse.json(
        { success: false, error: "Address not found." },
        { status: 404 }
      );
    }

    if (body.isDefault) {
      await Address.updateMany(
        { $or: [{ userId: session.userId }, { userEmail: session.email.toLowerCase() }] },
        { isDefault: false }
      );
      address.isDefault = true;
    } else if (body.isDefault === false) {
      address.isDefault = false;
    }

    if (body.label) address.label = body.label;
    if (body.fullName) address.fullName = body.fullName.trim();
    if (body.phone) address.phone = body.phone.trim();
    if (body.addressLine1) address.addressLine1 = body.addressLine1.trim();
    if (body.addressLine2 !== undefined) address.addressLine2 = body.addressLine2.trim();
    if (body.landmark !== undefined) address.landmark = body.landmark.trim();
    if (body.city) address.city = body.city.trim();
    if (body.state) address.state = body.state.trim();
    if (body.pincode) address.pincode = body.pincode.trim();

    await address.save();

    return NextResponse.json({
      success: true,
      message: "Address updated successfully.",
      address,
    });
  } catch (error: any) {
    console.error("[Address PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update address." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await connectToDatabase();

    const result = await Address.findOneAndDelete({
      _id: id,
      $or: [{ userId: session.userId }, { userEmail: session.email.toLowerCase() }],
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Address not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error: any) {
    console.error("[Address DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete address." },
      { status: 500 }
    );
  }
}
