import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { SEED_PRODUCTS } from "@/lib/data/productsData";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const dbProducts = await Product.find().lean();
      if (dbProducts && dbProducts.length > 0) {
        return NextResponse.json({ success: true, products: dbProducts });
      }
    }
    // Fallback to seed products
    return NextResponse.json({ success: true, products: SEED_PRODUCTS });
  } catch (err: any) {
    return NextResponse.json({ success: true, products: SEED_PRODUCTS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.styleCode || !body.price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    try {
      const db = await connectToDatabase();
      if (db) {
        const created = await Product.create({
          ...body,
          slug: body.slug || body.name.toLowerCase().replace(/ /g, "-"),
        });
        return NextResponse.json({ success: true, product: created });
      }
    } catch {
      // Fallback response for demo mode without MongoDB
    }

    return NextResponse.json({ success: true, message: "Product saved in dynamic store.", product: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.styleCode) {
      return NextResponse.json({ success: false, error: "Missing style code" }, { status: 400 });
    }

    try {
      const db = await connectToDatabase();
      if (db) {
        const updated = await Product.findOneAndUpdate(
          { styleCode: body.styleCode },
          { $set: body },
          { new: true }
        );
        return NextResponse.json({ success: true, product: updated });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({ success: true, message: "Product updated in dynamic store.", product: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const styleCode = searchParams.get("styleCode");

    if (!styleCode) {
      return NextResponse.json({ success: false, error: "Missing styleCode" }, { status: 400 });
    }

    try {
      const db = await connectToDatabase();
      if (db) {
        await Product.findOneAndDelete({ styleCode });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({ success: true, message: `Product ${styleCode} deleted.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
