import { create } from "zustand";
import { SEED_PRODUCTS, ProductSeedInput } from "@/lib/data/productsData";

interface ProductStore {
  products: ProductSeedInput[];
  isLoaded: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductSeedInput) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (product: ProductSeedInput) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (styleCode: string) => Promise<void>;
}

const STORAGE_KEY = "khavyn_dynamic_products_v1";

export const useProductStore = create<ProductStore>((set, get) => ({
  products: SEED_PRODUCTS,
  isLoaded: false,

  fetchProducts: async () => {
    try {
      // 1. Try local storage first for immediate client responsiveness
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              set({ products: parsed, isLoaded: true });
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      // 2. Fetch latest from API
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          set({ products: data.products, isLoaded: true });
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.products));
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch dynamic products, using initial seed:", err);
      set({ isLoaded: true });
    }
  },

  addProduct: async (newProduct: ProductSeedInput): Promise<{ success: boolean; error?: string }> => {
    // Optimistic local state update
    const prev = get().products;
    const existingIndex = prev.findIndex((p) => p.styleCode === newProduct.styleCode);
    const updated = existingIndex >= 0
      ? prev.map((p, idx) => (idx === existingIndex ? newProduct : p))
      : [newProduct, ...prev];
    set({ products: updated });

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (res.ok && data.success && data.product) {
        // Replace with server-normalized product
        const finalProducts = get().products.map((p) =>
          p.styleCode === newProduct.styleCode ? { ...p, ...data.product } : p
        );
        set({ products: finalProducts });
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProducts));
        }
        return { success: true };
      }
      return { success: res.ok, error: data.error };
    } catch (err: any) {
      console.error("API call to save product failed:", err);
      return { success: false, error: err.message };
    }
  },

  updateProduct: async (updatedProduct: ProductSeedInput): Promise<{ success: boolean; error?: string }> => {
    const updated = get().products.map((p) =>
      p.styleCode === updatedProduct.styleCode ? updatedProduct : p
    );
    set({ products: updated });

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      if (res.ok && data.success && data.product) {
        const finalProducts = get().products.map((p) =>
          p.styleCode === updatedProduct.styleCode ? { ...p, ...data.product } : p
        );
        set({ products: finalProducts });
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProducts));
        }
        return { success: true };
      }
      return { success: res.ok, error: data.error };
    } catch (err: any) {
      console.error("API call to update product failed:", err);
      return { success: false, error: err.message };
    }
  },

  deleteProduct: async (styleCode: string) => {
    const updated = get().products.filter((p) => p.styleCode !== styleCode);
    set({ products: updated });

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    try {
      await fetch(`/api/products?styleCode=${styleCode}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("API call to delete product failed:", err);
    }
  },
}));
