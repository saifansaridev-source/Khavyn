import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Product } from "@/models/Product";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) || [];

    await connectToDatabase();

    const query: any =
      ids.length > 0
        ? {
            $or: [
              { styleCode: { $in: ids } },
              { slug: { $in: ids } },
            ],
          }
        : {};

    const products = await Product.find(query).select("styleCode slug stock price name");

    const stockMap: Record<string, { inStock: boolean; totalStock: number }> = {};
    for (const p of products) {
      const s = p.stock || { S: 0, M: 0, L: 0, XL: 0 };
      const total = (s.S || 0) + (s.M || 0) + (s.L || 0) + (s.XL || 0);
      const info = { inStock: total > 0, totalStock: total };
      stockMap[p._id.toString()] = info;
      if (p.styleCode) stockMap[p.styleCode] = info;
      if (p.slug) stockMap[p.slug] = info;
    }

    return NextResponse.json({ success: true, stockMap });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch stock." },
      { status: 500 }
    );
  }
}
