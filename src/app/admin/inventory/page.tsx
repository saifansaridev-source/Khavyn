"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, AlertTriangle, Check, Layers, RefreshCw } from "lucide-react";
import { SEED_PRODUCTS, ProductSeedInput } from "@/lib/data/productsData";

export default function AdminInventoryPage() {
  const [productsList, setProductsList] = useState<ProductSeedInput[]>(SEED_PRODUCTS);
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [savedSuccessCode, setSavedSuccessCode] = useState<string | null>(null);

  const handleStockChange = (styleCode: string, size: "S" | "M" | "L" | "XL", val: number) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.styleCode === styleCode) {
          return {
            ...p,
            stock: {
              ...p.stock,
              [size]: Math.max(0, val),
            },
          };
        }
        return p;
      })
    );
  };

  const handleSaveProductStock = async (prod: ProductSeedInput) => {
    setSavingCode(prod.styleCode);
    setSavedSuccessCode(null);

    try {
      // Save all size stock levels for this SKU
      for (const s of ["S", "M", "L", "XL"] as const) {
        await fetch("/api/admin/products/stock", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            styleCode: prod.styleCode,
            size: s,
            newStock: prod.stock[s],
          }),
        });
      }

      setSavedSuccessCode(prod.styleCode);
      setTimeout(() => setSavedSuccessCode(null), 3000);
    } catch (err) {
      console.error("Failed to save inventory stock", err);
    } finally {
      setSavingCode(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-6 sm:p-10 font-sans selection:bg-[#C6A664] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#C6A664]/30 pb-6 gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-xs text-[#C6A664] hover:underline flex items-center gap-1.5 mb-2 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Executive Dashboard</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-[#C6A664] tracking-wider uppercase">
              SKU Inventory & Stock Matrix Control
            </h1>
            <p className="text-xs text-white/60 mt-1">
              Manage live stock units per size (S, M, L, XL) across all colour variants.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#222] border border-[#C6A664]/30 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300">
                Low Stock Threshold: ≤ 5 units
              </span>
            </div>
          </div>
        </div>

        {/* Product Inventory Grid */}
        <div className="bg-[#222] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#151515] text-[#C6A664] font-semibold border-b border-white/10 uppercase tracking-wider text-[11px]">
                  <th className="p-4">SKU / Style Code</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Colour Variant</th>
                  <th className="p-4 text-center">Size S</th>
                  <th className="p-4 text-center">Size M</th>
                  <th className="p-4 text-center">Size L</th>
                  <th className="p-4 text-center">Size XL</th>
                  <th className="p-4 text-center">Total Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {productsList.map((prod) => {
                  const totalStock =
                    prod.stock.S + prod.stock.M + prod.stock.L + prod.stock.XL;
                  const hasLowStock =
                    prod.stock.S <= 5 ||
                    prod.stock.M <= 5 ||
                    prod.stock.L <= 5 ||
                    prod.stock.XL <= 5;

                  return (
                    <tr
                      key={prod.styleCode}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 font-mono text-[#C6A664] font-semibold">
                        {prod.styleCode}
                      </td>
                      <td className="p-4 font-serif font-medium text-white text-sm">
                        {prod.name}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block"
                            style={{ backgroundColor: prod.colourHex }}
                          />
                          <span className="text-white/80">{prod.colour}</span>
                        </div>
                      </td>

                      {/* Size S */}
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          min={0}
                          value={prod.stock.S}
                          onChange={(e) =>
                            handleStockChange(prod.styleCode, "S", parseInt(e.target.value) || 0)
                          }
                          className={`w-16 bg-[#1A1A1A] border rounded text-center py-1.5 text-xs font-mono font-semibold focus:outline-none focus:border-[#C6A664] ${
                            prod.stock.S <= 5 ? "border-amber-500/80 text-amber-300" : "border-white/20 text-white"
                          }`}
                        />
                      </td>

                      {/* Size M */}
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          min={0}
                          value={prod.stock.M}
                          onChange={(e) =>
                            handleStockChange(prod.styleCode, "M", parseInt(e.target.value) || 0)
                          }
                          className={`w-16 bg-[#1A1A1A] border rounded text-center py-1.5 text-xs font-mono font-semibold focus:outline-none focus:border-[#C6A664] ${
                            prod.stock.M <= 5 ? "border-amber-500/80 text-amber-300" : "border-white/20 text-white"
                          }`}
                        />
                      </td>

                      {/* Size L */}
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          min={0}
                          value={prod.stock.L}
                          onChange={(e) =>
                            handleStockChange(prod.styleCode, "L", parseInt(e.target.value) || 0)
                          }
                          className={`w-16 bg-[#1A1A1A] border rounded text-center py-1.5 text-xs font-mono font-semibold focus:outline-none focus:border-[#C6A664] ${
                            prod.stock.L <= 5 ? "border-amber-500/80 text-amber-300" : "border-white/20 text-white"
                          }`}
                        />
                      </td>

                      {/* Size XL */}
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          min={0}
                          value={prod.stock.XL}
                          onChange={(e) =>
                            handleStockChange(prod.styleCode, "XL", parseInt(e.target.value) || 0)
                          }
                          className={`w-16 bg-[#1A1A1A] border rounded text-center py-1.5 text-xs font-mono font-semibold focus:outline-none focus:border-[#C6A664] ${
                            prod.stock.XL <= 5 ? "border-amber-500/80 text-amber-300" : "border-white/20 text-white"
                          }`}
                        />
                      </td>

                      {/* Total Stock */}
                      <td className="p-4 text-center">
                        <span
                          className={`font-mono font-bold text-sm ${
                            hasLowStock ? "text-amber-400" : "text-emerald-400"
                          }`}
                        >
                          {totalStock}
                        </span>
                        {hasLowStock && (
                          <span className="block text-[9px] uppercase font-bold text-amber-400 tracking-wider">
                            Low Stock
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleSaveProductStock(prod)}
                          disabled={savingCode === prod.styleCode}
                          className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ml-auto ${
                            savedSuccessCode === prod.styleCode
                              ? "bg-emerald-600 text-white"
                              : "bg-[#C6A664] text-black hover:bg-white"
                          }`}
                        >
                          {savingCode === prod.styleCode ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : savedSuccessCode === prod.styleCode ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Stock</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
