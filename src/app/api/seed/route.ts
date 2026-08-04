import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { SEED_PRODUCTS } from "@/lib/data/productsData";
import bcrypt from "bcryptjs";

import mongoose from "mongoose";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db || mongoose.connection.readyState !== 1) {
      return NextResponse.json(
        {
          success: false,
          error: "MongoDB connection not established. Please configure MONGODB_URI in .env.local to seed to a live database.",
        },
        { status: 400 }
      );
    }

    // 1. Seed Products
    let createdCount = 0;
    for (const p of SEED_PRODUCTS) {
      await Product.findOneAndUpdate(
        { styleCode: p.styleCode },
        p,
        { upsert: true, new: true }
      );
      createdCount++;
    }

    // 2. Seed Default Admin User
    const adminPasswordHash = await bcrypt.hash("KhavynAdmin2026!", 12);
    await User.findOneAndUpdate(
      { email: "admin@khavyn.com" },
      {
        name: "KHAVYN Executive Administrator",
        email: "admin@khavyn.com",
        passwordHash: adminPasswordHash,
        role: "admin",
        isRestrictedFromCOD: false,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdCount} KHAVYN products and default Admin account (admin@khavyn.com).`,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Seeding failed" },
      { status: 500 }
    );
  }
}
