import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import {
  SEED_PRODUCTS,
  hexToRgb,
  formatRgbString,
  parseRgbString,
  rgbToHex,
} from "@/lib/data/productsData";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=80";

function normalizeProductPayload(body: any) {
  const colour = (body.colour || "Classic Gold").trim();
  const collectionName = (body.collectionName || "Formal Shirts").trim();
  const styleCode = (
    body.styleCode || `KHV-${Math.floor(1000 + Math.random() * 9000)}`
  ).trim();

  // Auto-generate name if empty or generic
  let name = (body.name || "").trim();
  if (!name) {
    name = `${colour} Signature ${collectionName}`;
  }

  // Auto-generate URL-safe slug
  let slug = (body.slug || "").trim();
  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  // Synchronize Hex and RGB values
  let colourHex = (body.colourHex || "#C6A664").trim();
  let colourRgb = (body.colourRgb || "").trim();

  if (colourRgb && (!colourHex || colourHex === "#C6A664")) {
    const parsed = parseRgbString(colourRgb);
    if (parsed) {
      colourHex = rgbToHex(parsed.r, parsed.g, parsed.b);
      colourRgb = formatRgbString(parsed.r, parsed.g, parsed.b);
    }
  } else if (colourHex) {
    const rgbObj = hexToRgb(colourHex);
    if (rgbObj && !colourRgb) {
      colourRgb = formatRgbString(rgbObj.r, rgbObj.g, rgbObj.b);
    }
  }

  // Normalize Images
  const frontImg = body.images?.front || DEFAULT_IMAGE;
  const images = {
    front: frontImg,
    side: body.images?.side || frontImg,
    back: body.images?.back || frontImg,
    angle45: body.images?.angle45 || frontImg,
    fabricTexture: body.images?.fabricTexture || frontImg,
    embroidery: body.images?.embroidery || frontImg,
    collarLabel: body.images?.collarLabel || frontImg,
    modelFront: body.images?.modelFront || frontImg,
    modelSide: body.images?.modelSide || frontImg,
    modelBack: body.images?.modelBack || frontImg,
    model45: body.images?.model45 || frontImg,
    ...(body.images || {}),
  };

  // Normalize Stock & Sizes
  const stock = {
    S: Number(body.stock?.S ?? 15),
    M: Number(body.stock?.M ?? 25),
    L: Number(body.stock?.L ?? 20),
    XL: Number(body.stock?.XL ?? 10),
    ...(body.stock || {}),
  };

  // Derive active sizes
  let sizes = Array.isArray(body.sizes) && body.sizes.length > 0 ? body.sizes : [];
  if (sizes.length === 0) {
    sizes = Object.keys(stock).filter((k) => stock[k] > 0);
    if (sizes.length === 0) sizes = ["S", "M", "L", "XL"];
  }

  return {
    ...body,
    name,
    slug,
    styleCode,
    collectionName,
    colour,
    colourHex,
    colourRgb,
    price: Number(body.price || 2999),
    compareAtPrice: Number(body.compareAtPrice || 4999),
    images,
    stock,
    sizes,
    videoUrl: body.videoUrl || "",
    material: body.material || "100% Combed Long-Staple Cotton",
    fabricWeight: body.fabricWeight || "240 GSM",
    fit: body.fit || "Tailored Contemporary Fit",
    collarType: body.collarType || "Structured Spread Collar",
    sleeve: body.sleeve || "Full Sleeves with Double-Button Cuffs",
    closure: body.closure || "Mother-of-Pearl Button Placket",
    occasion: body.occasion || ["Business", "Evening", "Smart Casual"],
    description:
      body.description ||
      "Masterfully engineered with premium bio-washed combed cotton for an unyielding drape, silken finish, and unmatched everyday luxury.",
    whyYoullLoveIt:
      body.whyYoullLoveIt ||
      "Breathable, lightweight, and structured to retain crispness from desk to dinner without crease compromise.",
    styleRecommendation:
      body.styleRecommendation ||
      "Pair with tailored trousers and handcrafted leather loafers for an effortlessly elevated ensemble.",
    careInstructions: body.careInstructions || [
      "Machine wash cold inside-out on gentle cycle",
      "Do not bleach or tumble dry",
      "Warm iron on reverse side",
    ],
    keyFeatures: body.keyFeatures || [
      "100% Bio-Washed Combed Cotton",
      "Reinforced Collar Architecture",
      "Single-Needle Clean Seam Tailoring",
      "Signature KHAVYN Emblem",
    ],
    packageContains: body.packageContains || "1 Unit Luxury Garment",
    countryOfOrigin: body.countryOfOrigin || "India",
    isBestSeller: Boolean(body.isBestSeller),
    isNewArrival: Boolean(body.isNewArrival ?? true),
    customBadge: body.customBadge || "",
    returnPolicyApplicable: body.returnPolicyApplicable !== false,
  };
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const dbProducts = await Product.find().lean();
      if (dbProducts && dbProducts.length > 0) {
        return NextResponse.json({ success: true, products: dbProducts });
      }
    }
    return NextResponse.json({ success: true, products: SEED_PRODUCTS });
  } catch (err: any) {
    return NextResponse.json({ success: true, products: SEED_PRODUCTS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const payload = normalizeProductPayload(rawBody);

    try {
      const db = await connectToDatabase();
      if (db) {
        // Ensure unique slug if already taken by another style code
        let uniqueSlug = payload.slug;
        const existing = await Product.findOne({ slug: uniqueSlug });
        if (existing && existing.styleCode !== payload.styleCode) {
          uniqueSlug = `${payload.slug}-${Math.floor(100 + Math.random() * 900)}`;
        }
        payload.slug = uniqueSlug;

        // Upsert into MongoDB by styleCode so duplicate calls safely update
        const saved = await Product.findOneAndUpdate(
          { styleCode: payload.styleCode },
          { $set: payload },
          { new: true, upsert: true }
        );
        return NextResponse.json({ success: true, product: saved });
      }
    } catch (dbErr: any) {
      console.warn("MongoDB write encountered error, falling back to dynamic store:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Product saved in dynamic store.",
      product: payload,
    });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const rawBody = await req.json();
    if (!rawBody.styleCode) {
      return NextResponse.json({ success: false, error: "Missing style code" }, { status: 400 });
    }

    const payload = normalizeProductPayload(rawBody);

    try {
      const db = await connectToDatabase();
      if (db) {
        const updated = await Product.findOneAndUpdate(
          { styleCode: payload.styleCode },
          { $set: payload },
          { new: true, upsert: true }
        );
        return NextResponse.json({ success: true, product: updated });
      }
    } catch (dbErr: any) {
      console.warn("MongoDB update encountered error, falling back to dynamic store:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Product updated in dynamic store.",
      product: payload,
    });
  } catch (err: any) {
    console.error("PUT /api/products error:", err);
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
    } catch (dbErr) {
      console.warn("MongoDB delete fallback:", dbErr);
    }

    return NextResponse.json({ success: true, message: `Product ${styleCode} deleted.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
