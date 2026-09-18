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

function formatErrorMessage(err: any): string {
  if (!err) return "Database error. Please try again.";
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    const fieldName = fields.length > 0 ? fields.join(", ") : "slug or identifier";
    return `Duplicate key collision on ${fieldName}. Please use a unique product name or style code.`;
  }
  if (err.name === "ValidationError") {
    const errorDetails = Object.values(err.errors || {})
      .map((e: any) => e.message)
      .filter(Boolean)
      .join("; ");
    return errorDetails || err.message || "Validation failed on product schema.";
  }
  return typeof err.message === "string"
    ? err.message.replace(/:\s*Cast to .* failed.*$/, "")
    : "An unexpected error occurred while saving to the database.";
}

function normalizeProductPayload(body: any) {
  // FIX 2 — Strip immutable/internal fields before $set or create
  const { _id, __v, createdAt, updatedAt, ...cleanBody } = body || {};

  const colour = (cleanBody.colour || "Classic Gold").trim();
  const collectionName = (cleanBody.collectionName || "Formal Shirts").trim();
  const styleCode = (
    cleanBody.styleCode || `KHV-${Math.floor(1000 + Math.random() * 9000)}`
  ).trim();

  // Auto-generate name if empty or generic
  let name = (cleanBody.name || "").trim();
  if (!name) {
    name = `${colour} Signature ${collectionName}`;
  }

  // Auto-generate URL-safe slug
  let slug = (cleanBody.slug || "").trim();
  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  // Synchronize Hex and RGB values
  let colourHex = (cleanBody.colourHex || "#C6A664").trim();
  let colourRgb = (cleanBody.colourRgb || "").trim();

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

  // Normalize Images — only "front" gets a fallback (it is the mandatory primary image).
  // Every other slot is stored exactly as submitted; empty string stays empty.
  const images = {
    front: cleanBody.images?.front || DEFAULT_IMAGE,
    side: cleanBody.images?.side ?? "",
    back: cleanBody.images?.back ?? "",
    angle45: cleanBody.images?.angle45 ?? "",
    fabricTexture: cleanBody.images?.fabricTexture ?? "",
    embroidery: cleanBody.images?.embroidery ?? "",
    collarLabel: cleanBody.images?.collarLabel ?? "",
    modelFront: cleanBody.images?.modelFront ?? "",
    modelSide: cleanBody.images?.modelSide ?? "",
    modelBack: cleanBody.images?.modelBack ?? "",
    model45: cleanBody.images?.model45 ?? "",
  };

  // Normalize Stock & Sizes
  const stock = {
    S: Number(cleanBody.stock?.S ?? 15),
    M: Number(cleanBody.stock?.M ?? 25),
    L: Number(cleanBody.stock?.L ?? 20),
    XL: Number(cleanBody.stock?.XL ?? 10),
    ...(cleanBody.stock || {}),
  };

  // Derive active sizes
  let sizes = Array.isArray(cleanBody.sizes) && cleanBody.sizes.length > 0 ? cleanBody.sizes : [];
  if (sizes.length === 0) {
    sizes = Object.keys(stock).filter((k) => stock[k] > 0);
    if (sizes.length === 0) sizes = ["S", "M", "L", "XL"];
  }

  const payload: any = {
    ...cleanBody,
    name,
    slug,
    styleCode,
    collectionName,
    colour,
    colourHex,
    colourRgb,
    price: Number(cleanBody.price || 2999),
    compareAtPrice: Number(cleanBody.compareAtPrice || 4999),
    images,
    stock,
    sizes,
    videoUrl: cleanBody.videoUrl || "",
    material: cleanBody.material || "100% Combed Long-Staple Cotton",
    fabricWeight: cleanBody.fabricWeight || "240 GSM",
    fit: cleanBody.fit || "Tailored Contemporary Fit",
    collarType: cleanBody.collarType || "Structured Spread Collar",
    sleeve: cleanBody.sleeve || "Full Sleeves with Double-Button Cuffs",
    closure: cleanBody.closure || "Mother-of-Pearl Button Placket",
    occasion: cleanBody.occasion || ["Business", "Evening", "Smart Casual"],
    description:
      cleanBody.description ||
      "Masterfully engineered with premium bio-washed combed cotton for an unyielding drape, silken finish, and unmatched everyday luxury.",
    whyYoullLoveIt:
      cleanBody.whyYoullLoveIt ||
      "Breathable, lightweight, and structured to retain crispness from desk to dinner without crease compromise.",
    styleRecommendation:
      cleanBody.styleRecommendation ||
      "Pair with tailored trousers and handcrafted leather loafers for an effortlessly elevated ensemble.",
    careInstructions: cleanBody.careInstructions || [
      "Machine wash cold inside-out on gentle cycle",
      "Do not bleach or tumble dry",
      "Warm iron on reverse side",
    ],
    keyFeatures: cleanBody.keyFeatures || [
      "100% Bio-Washed Combed Cotton",
      "Reinforced Collar Architecture",
      "Single-Needle Clean Seam Tailoring",
      "Signature KHAVYN Emblem",
    ],
    packageContains: cleanBody.packageContains || "1 Unit Luxury Garment",
    countryOfOrigin: cleanBody.countryOfOrigin || "India",
    isBestSeller: Boolean(cleanBody.isBestSeller),
    isNewArrival: Boolean(cleanBody.isNewArrival ?? true),
    customBadge: cleanBody.customBadge || "",
    returnPolicyApplicable: cleanBody.returnPolicyApplicable !== false,
  };

  // Absolute guarantee: remove immutable and internal fields
  delete payload._id;
  delete payload.__v;
  delete payload.createdAt;
  delete payload.updatedAt;

  return payload;
}

// FIX 3 — Shared helper to resolve slug collisions across different style codes
async function resolveUniqueSlug(slug: string, styleCode: string): Promise<string> {
  let uniqueSlug = slug;
  const existing = (await Product.findOne({ slug: uniqueSlug }).lean()) as any;
  if (existing && existing.styleCode !== styleCode) {
    const cleanSuffix = styleCode.slice(-4).toLowerCase().replace(/[^a-z0-9]/g, "");
    const suffix = cleanSuffix || Math.floor(100 + Math.random() * 900).toString();
    uniqueSlug = `${slug}-${suffix}`;
  }
  return uniqueSlug;
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

    // FIX 1 — Do not swallow DB errors; verify connection first
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database connection unavailable. Please try again." },
        { status: 503 }
      );
    }

    // FIX 3 — Handle slug collisions
    payload.slug = await resolveUniqueSlug(payload.slug, payload.styleCode);

    try {
      const saved = await Product.findOneAndUpdate(
        { styleCode: payload.styleCode },
        { $set: payload },
        { new: true, upsert: true }
      );
      return NextResponse.json({ success: true, product: saved });
    } catch (dbErr: any) {
      console.error("MongoDB error in POST /api/products:", dbErr);
      // FIX 4 — Safe upsert retry on duplicate key (E11000)
      if (dbErr.code === 11000 || dbErr.message?.includes("E11000")) {
        try {
          payload.slug = `${payload.slug}-${Math.floor(1000 + Math.random() * 9000)}`;
          const retrySaved = await Product.findOneAndUpdate(
            { styleCode: payload.styleCode },
            { $set: payload },
            { new: true, upsert: true }
          );
          return NextResponse.json({ success: true, product: retrySaved });
        } catch (retryErr: any) {
          console.error("Retry failed in POST /api/products:", retryErr);
          return NextResponse.json(
            { success: false, error: formatErrorMessage(retryErr) },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(
        { success: false, error: formatErrorMessage(dbErr) },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { success: false, error: formatErrorMessage(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const rawBody = await req.json();
    if (!rawBody?.styleCode) {
      return NextResponse.json({ success: false, error: "Missing style code" }, { status: 400 });
    }

    const payload = normalizeProductPayload(rawBody);

    // FIX 1 — Do not swallow DB errors; verify connection first
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database connection unavailable. Please try again." },
        { status: 503 }
      );
    }

    // FIX 3 — Handle slug collisions in PUT before findOneAndUpdate
    payload.slug = await resolveUniqueSlug(payload.slug, payload.styleCode);

    try {
      const updated = await Product.findOneAndUpdate(
        { styleCode: payload.styleCode },
        { $set: payload },
        { new: true, upsert: true }
      );
      return NextResponse.json({ success: true, product: updated });
    } catch (dbErr: any) {
      console.error("MongoDB error in PUT /api/products:", dbErr);
      // FIX 4 — Safe upsert retry on duplicate key (E11000)
      if (dbErr.code === 11000 || dbErr.message?.includes("E11000")) {
        try {
          payload.slug = `${payload.slug}-${Math.floor(1000 + Math.random() * 9000)}`;
          const retryUpdated = await Product.findOneAndUpdate(
            { styleCode: payload.styleCode },
            { $set: payload },
            { new: true, upsert: true }
          );
          return NextResponse.json({ success: true, product: retryUpdated });
        } catch (retryErr: any) {
          console.error("Retry failed in PUT /api/products:", retryErr);
          return NextResponse.json(
            { success: false, error: formatErrorMessage(retryErr) },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(
        { success: false, error: formatErrorMessage(dbErr) },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("PUT /api/products error:", err);
    return NextResponse.json(
      { success: false, error: formatErrorMessage(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const styleCode = searchParams.get("styleCode");

    if (!styleCode) {
      return NextResponse.json({ success: false, error: "Missing styleCode" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database connection unavailable. Please try again." },
        { status: 503 }
      );
    }

    await Product.findOneAndDelete({ styleCode });
    return NextResponse.json({ success: true, message: `Product ${styleCode} deleted.` });
  } catch (err: any) {
    console.error("DELETE /api/products error:", err);
    return NextResponse.json(
      { success: false, error: formatErrorMessage(err) },
      { status: 500 }
    );
  }
}
