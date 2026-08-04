import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  styleCode: string;
  colour: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (item) => {
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          if (exists) {
            return {
              items: state.items.filter((i) => i.productId !== item.productId),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "khavyn-wishlist-storage",
    }
  )
);
