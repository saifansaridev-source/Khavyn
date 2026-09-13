"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import {
  Package,
  MapPin,
  Heart,
  Ruler,
  Settings,
  HelpCircle,
  LogOut,
  Download,
  RotateCcw,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Truck,
  Box,
  Check,
  Plus,
  Trash2,
  Edit2,
  Phone,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Lock,
} from "lucide-react";

interface OrderItem {
  productId?: string;
  name: string;
  styleCode?: string;
  colour?: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  createdAt?: string;
  status: string;
  paymentType: string;
  subtotal: number;
  shippingCharge: number;
  total: number;
  advancePaid: number;
  balanceDue: number;
  shippingAddress: any;
  items: OrderItem[];
}

interface SavedAddress {
  _id?: string;
  id?: string;
  label: "Home" | "Office" | "Other";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const SIZE_CATEGORIES = [
  { key: "Formal Shirts", label: "Formal Shirts", options: ["S", "M", "L", "XL", "XXL"] },
  { key: "Polo T-Shirts", label: "Polo T-Shirts", options: ["S", "M", "L", "XL", "XXL"] },
  { key: "Oversized T-Shirts", label: "Oversized T-Shirts", options: ["S", "M", "L", "XL"] },
  { key: "Round Neck T-Shirts", label: "Round Neck T-Shirts", options: ["S", "M", "L", "XL"] },
  { key: "Trousers & Chinos", label: "Trousers & Chinos", options: ["30", "32", "34", "36", "38"] },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "addresses" | "wishlist" | "sizes" | "settings" | "support"
  >((tabParam as any) || "overview");

  const { user, logout, fetchUser } = useUserStore();
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggleWishlist, clearWishlist } = useWishlistStore();

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Addresses state
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<SavedAddress>({
    label: "Home",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  // Size Profile state
  const [sizeProfile, setSizeProfile] = useState<{ [category: string]: string }>({});
  const [savingSizes, setSavingSizes] = useState(false);
  const [sizeSaveSuccess, setSizeSaveSuccess] = useState(false);

  // Account Settings state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    googleLinked: false,
    commPreferences: {
      whatsapp: true,
      email: true,
      sms: true,
    },
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Wishlist stock status
  const [stockMap, setStockMap] = useState<Record<string, { inStock: boolean; totalStock: number }>>({});

  // Toast / notification banner
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    fetchUser();
    loadOrders();
    loadAddresses();
    loadProfileAndSizes();
  }, []);

  useEffect(() => {
    if (tabParam && ["overview", "orders", "addresses", "wishlist", "sizes", "settings", "support"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  // Check stock for wishlist items
  useEffect(() => {
    if (wishlistItems.length > 0) {
      const ids = wishlistItems.map((i) => i.styleCode || i.productId).join(",");
      fetch(`/api/products/stock?ids=${encodeURIComponent(ids)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.stockMap) {
            setStockMap(data.stockMap);
          }
        })
        .catch(() => {});
    }
  }, [wishlistItems]);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch("/api/user/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        // Fallback demo orders if not yet populated
        setOrders([
          {
            id: "KHV-849201",
            orderNumber: "KHV-849201",
            date: "28 Jul 2026",
            status: "Shipped",
            paymentType: "Partial COD (50% Advance)",
            subtotal: 5998,
            shippingCharge: 70,
            total: 6068,
            advancePaid: 3034,
            balanceDue: 3034,
            shippingAddress: {
              fullName: "Vikramaditya Sharma",
              street: "B-402, Imperial Heights, Off Linking Road",
              city: "Mumbai",
              state: "Maharashtra",
              pincode: "400050",
              phone: "+91 98765 43210",
            },
            items: [
              {
                name: "White Signature Premium Formal Shirt",
                size: "M",
                colour: "Crisp White",
                quantity: 1,
                price: 2999,
                image: "/images/shirt-white.jpg",
                styleCode: "KHV-FS-001",
              },
              {
                name: "Midnight Navy Formal Shirt",
                size: "M",
                colour: "Navy",
                quantity: 1,
                price: 2999,
                image: "/images/shirt-navy.jpg",
                styleCode: "KHV-FS-002",
              },
            ],
          },
          {
            id: "KHV-719302",
            orderNumber: "KHV-719302",
            date: "15 Jul 2026",
            status: "Delivered",
            paymentType: "100% Prepaid",
            subtotal: 2499,
            shippingCharge: 70,
            total: 2569,
            advancePaid: 2569,
            balanceDue: 0,
            shippingAddress: {
              fullName: "Vikramaditya Sharma",
              street: "B-402, Imperial Heights",
              city: "Mumbai",
              state: "Maharashtra",
              pincode: "400050",
              phone: "+91 98765 43210",
            },
            items: [
              {
                name: "Sage Green Signature Luxury Polo T-Shirt",
                size: "L",
                colour: "Sage Green",
                quantity: 1,
                price: 2499,
                image: "/images/polo-sage.jpg",
                styleCode: "KHV-PL-001",
              },
            ],
          },
        ]);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await fetch("/api/user/addresses");
      const data = await res.json();
      if (data.success && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      }
    } catch {
      // ignore
    } finally {
      setLoadingAddresses(false);
    }
  };

  const loadProfileAndSizes = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.user) {
        setProfileData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          googleLinked: Boolean(data.user.googleLinked),
          commPreferences: data.user.commPreferences || {
            whatsapp: true,
            email: true,
            sms: true,
          },
        });

        // Populate size profile map
        if (Array.isArray(data.user.sizeProfile)) {
          const map: { [cat: string]: string } = {};
          data.user.sizeProfile.forEach((item: any) => {
            map[item.category] = item.size;
          });
          setSizeProfile(map);
        }
      }
    } catch {
      // ignore
    }
  };

  // Reorder Handler: adds all items of an order back to cart
  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem({
        productId: item.productId || item.name,
        name: item.name,
        slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        styleCode: item.styleCode || "KHV-STD",
        colour: item.colour || "Standard",
        size: item.size || "M",
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || "/images/placeholder.jpg",
      });
    });
    showToast(`Items from Order #${order.orderNumber} added to your bag.`);
  };

  // Save Size Profile
  const handleSaveSizeProfile = async () => {
    setSavingSizes(true);
    setSizeSaveSuccess(false);
    try {
      const list = Object.entries(sizeProfile).map(([category, size]) => ({
        category,
        size,
      }));
      const res = await fetch("/api/user/size-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sizeProfile: list }),
      });
      const data = await res.json();
      if (data.success) {
        setSizeSaveSuccess(true);
        showToast("Preferred sizes saved successfully.");
        setTimeout(() => setSizeSaveSuccess(false), 3000);
      }
    } catch {
      showToast("Could not save size profile. Please retry.");
    } finally {
      setSavingSizes(false);
    }
  };

  // Address CRUD
  const handleOpenAddressModal = (addr?: SavedAddress) => {
    if (addr) {
      setEditingAddressId(addr._id || addr.id || null);
      setAddressForm({ ...addr });
    } else {
      setEditingAddressId(null);
      setAddressForm({
        label: "Home",
        fullName: profileData.name || "",
        phone: profileData.phone || "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: addresses.length === 0,
      });
    }
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        // Update existing
        const res = await fetch(`/api/user/addresses/${editingAddressId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressForm),
        });
        const data = await res.json();
        if (data.success) {
          showToast("Address updated.");
          loadAddresses();
          setAddressModalOpen(false);
        }
      } else {
        // Create new
        const res = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressForm),
        });
        const data = await res.json();
        if (data.success) {
          showToast("Address saved.");
          loadAddresses();
          setAddressModalOpen(false);
        }
      }
    } catch {
      showToast("Error saving address. Please try again.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Address removed.");
        loadAddresses();
      }
    } catch {
      showToast("Failed to delete address.");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Default address updated.");
        loadAddresses();
      }
    } catch {
      showToast("Could not set default address.");
    }
  };

  // Account Settings Submit
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsFeedback(null);

    if (passwordForm.newPassword) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setSettingsFeedback({
          type: "error",
          message: "New password and confirmation do not match.",
        });
        setSavingSettings(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          commPreferences: profileData.commPreferences,
          currentPassword: passwordForm.currentPassword || undefined,
          newPassword: passwordForm.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsFeedback({
          type: "success",
          message: "Account settings updated successfully.",
        });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        fetchUser();
      } else {
        setSettingsFeedback({
          type: "error",
          message: data.error || "Failed to update profile.",
        });
      }
    } catch {
      setSettingsFeedback({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Stepper timeline helper for Order status
  const getTimelineStepIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) return 4;
    if (s.includes("out for delivery")) return 3;
    if (s.includes("shipped")) return 2;
    if (s.includes("packed") || s.includes("processing")) return 1;
    return 0; // Placed / Pending
  };

  const TIMELINE_STEPS = [
    { label: "Placed", icon: Clock },
    { label: "Packed", icon: Box },
    { label: "Shipped", icon: Truck },
    { label: "Out for Delivery", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 },
  ];

  // Active orders count (anything not delivered/cancelled)
  const activeOrdersCount = orders.filter(
    (o) => !o.status.toLowerCase().includes("delivered") && !o.status.toLowerCase().includes("cancelled")
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white border border-[#C6A664] px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#C6A664] flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-[#1A1A1A] text-white py-10 px-4 text-center border-b border-[#C6A664]/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C6A664_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C6A664] font-semibold inline-block mb-1">
            KHAVYN PRIVATE CLIENT PORTAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || profileData.name || "Valued Patron"}
          </h1>
          <p className="text-white/50 text-xs mt-1.5 tracking-widest">
            {user?.email || profileData.email}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 rounded-xl p-3 space-y-1.5 sticky top-24 shadow-sm">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#1A1A1A] text-[#C6A664] shadow-sm"
                    : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#C6A664]" />
                  <span>Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[#1A1A1A] text-[#C6A664] shadow-sm"
                    : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#C6A664]" />
                  <span>My Orders</span>
                </div>
                {activeOrdersCount > 0 && (
                  <span className="bg-[#C6A664] text-[#1A1A1A] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {activeOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "addresses"
                    ? "bg-[#1A1A1A] text-[#C6A664] shadow-sm"
                    : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#C6A664]" />
                  <span>Saved Addresses</span>
                </div>
                <span className="text-[11px] text-[#1A1A1A]/50 font-numeric">{addresses.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "wishlist"
                    ? "bg-[#1A1A1A] text-[#C6A664] shadow-sm"
                    : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#C6A664]" />
                  <span>Wishlist</span>
                </div>
                <span className="text-[11px] text-[#1A1A1A]/50 font-numeric">{wishlistItems.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("sizes")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "sizes"
                    ? "bg-[#1A1A1A] text-[#C6A664] shadow-sm"
                    : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Ruler className="w-4 h-4 text-[#C6A664]" />
                  <span>Size Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-[#1A1A1A] text-[#C6A664] shadow-sm"
                    : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-[#C6A664]" />
                  <span>Account Settings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                onClick={() => setActiveTab("support")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "support"
                    ? "bg-[#1A1A1A] text-[#C6A664] shadow-sm"
                    : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-[#C6A664]" />
                  <span>Concierge &amp; FAQ</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <div className="pt-3 border-t border-[#D8C9B0]/40">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area (9 cols) */}
          <div className="lg:col-span-9 space-y-6">

            {/* ================================================================ */}
            {/* TAB 1: OVERVIEW */}
            {/* ================================================================ */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Snapshot Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 p-5 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#1A1A1A]/60 font-semibold">
                        Active Shipments
                      </span>
                      <Truck className="w-5 h-5 text-[#C6A664]" />
                    </div>
                    <p className="font-serif text-3xl font-bold text-[#1A1A1A] mt-2 font-numeric">
                      {activeOrdersCount}
                    </p>
                    <p className="text-[11px] text-[#1A1A1A]/50 mt-1">
                      {activeOrdersCount > 0 ? "Currently in transit or processing" : "No active shipments right now"}
                    </p>
                  </div>

                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 p-5 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#1A1A1A]/60 font-semibold">
                        Saved Addresses
                      </span>
                      <MapPin className="w-5 h-5 text-[#C6A664]" />
                    </div>
                    <p className="font-serif text-3xl font-bold text-[#1A1A1A] mt-2 font-numeric">
                      {addresses.length}
                    </p>
                    <p className="text-[11px] text-[#1A1A1A]/50 mt-1">
                      {addresses.find((a) => a.isDefault)?.city
                        ? `Default: ${addresses.find((a) => a.isDefault)?.city}`
                        : "Ready for express 1-click checkout"}
                    </p>
                  </div>

                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 p-5 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#1A1A1A]/60 font-semibold">
                        Wishlist Pieces
                      </span>
                      <Heart className="w-5 h-5 text-[#C6A664]" />
                    </div>
                    <p className="font-serif text-3xl font-bold text-[#1A1A1A] mt-2 font-numeric">
                      {wishlistItems.length}
                    </p>
                    <p className="text-[11px] text-[#1A1A1A]/50 mt-1">
                      Curated luxury styles saved for later
                    </p>
                  </div>
                </div>

                {/* Latest Order Spotlight */}
                {orders.length > 0 && (
                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 rounded-xl p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D8C9B0]/40 gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C6A664]">
                          MOST RECENT ORDER
                        </span>
                        <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                          Order #{orders[0].orderNumber}
                        </h3>
                        <p className="text-xs text-[#1A1A1A]/60">Placed on {orders[0].date}</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs text-[#1A1A1A] hover:text-[#C6A664] font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All Orders</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Timeline stepper */}
                    <div className="py-2">
                      <div className="grid grid-cols-5 gap-1 text-center relative">
                        {TIMELINE_STEPS.map((step, idx) => {
                          const currentStepIdx = getTimelineStepIndex(orders[0].status);
                          const isDone = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          const IconComp = step.icon;

                          return (
                            <div key={step.label} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  isDone
                                    ? "bg-[#1A1A1A] text-[#C6A664] ring-2 ring-[#C6A664]/50"
                                    : "bg-white border border-[#D8C9B0] text-[#1A1A1A]/30"
                                }`}
                              >
                                {isDone && !isCurrent ? (
                                  <Check className="w-4 h-4 text-[#C6A664]" />
                                ) : (
                                  <IconComp className="w-4 h-4" />
                                )}
                              </div>
                              <span
                                className={`text-[10px] mt-2 tracking-wider uppercase font-semibold ${
                                  isCurrent
                                    ? "text-[#C6A664] font-bold"
                                    : isDone
                                    ? "text-[#1A1A1A]"
                                    : "text-[#1A1A1A]/40"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => handleReorder(orders[0])}
                        className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder Items</span>
                      </button>
                      <a
                        href={`/api/orders/${orders[0].orderNumber}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-[#D8C9B0] hover:border-[#C6A664] text-[#1A1A1A] hover:text-[#C6A664] px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C6A664]" />
                        <span>Download GST Invoice</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Quick Concierge Banner */}
                <div className="bg-[#22201D] text-white p-6 rounded-xl border border-[#332B20] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#C6A664]">
                      Personal Concierge Desk
                    </h4>
                    <p className="text-xs text-white/70 max-w-md mt-0.5">
                      Need bespoke sizing advice, priority delivery rerouting, or styling suggestions? Our concierge is available via WhatsApp.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/919373205258?text=Hello%20KHAVYN%20Concierge,%20I%20need%20assistance%20with%20my%20account"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#C6A664] text-[#1A1A1A] hover:bg-white px-6 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors flex-shrink-0 inline-flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Talk on WhatsApp</span>
                  </a>
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 2: MY ORDERS */}
            {/* ================================================================ */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#D8C9B0]/50 pb-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">
                      My Orders &amp; Shipment Tracking
                    </h2>
                    <p className="text-xs text-[#1A1A1A]/60">
                      Track deliveries, review item details, download tax invoices, and reorder.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#1A1A1A]/70">
                    {orders.length} Total Orders
                  </span>
                </div>

                {loadingOrders ? (
                  <div className="py-16 text-center text-xs text-[#1A1A1A]/60">
                    Loading your purchase history...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-xl p-12 text-center space-y-4">
                    <Package className="w-10 h-10 text-[#C6A664] mx-auto" />
                    <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">No Orders Placed Yet</h3>
                    <p className="text-xs text-[#1A1A1A]/60 max-w-sm mx-auto">
                      Explore our handcrafted collections of formal shirts, luxury polo t-shirts, and tailored menswear.
                    </p>
                    <Link
                      href="/shop"
                      className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-6 py-3 rounded text-xs font-semibold uppercase tracking-widest inline-block transition-colors"
                    >
                      Explore Collection
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const stepIdx = getTimelineStepIndex(order.status);

                      return (
                        <div
                          key={order.orderNumber}
                          className="bg-[#F5F3EF] border border-[#D8C9B0]/60 rounded-xl p-6 shadow-xs space-y-5"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D8C9B0]/40 pb-4 gap-3">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-serif text-lg font-bold text-[#1A1A1A]">
                                  Order #{order.orderNumber}
                                </span>
                                <span className="px-2.5 py-0.5 bg-[#1A1A1A] text-[#C6A664] rounded text-[10px] font-bold uppercase tracking-wider">
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
                                Placed on {order.date} &bull; {order.paymentType}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <a
                                href={`/api/orders/${order.orderNumber}/invoice`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#1A1A1A] hover:text-[#C6A664] border border-[#D8C9B0] hover:border-[#C6A664] px-3 py-1.5 rounded transition-colors bg-white font-medium shadow-xs"
                                title="Download Official GST Invoice PDF"
                              >
                                <Download className="w-3.5 h-3.5 text-[#C6A664]" />
                                <span>Download Invoice</span>
                              </a>

                              <button
                                onClick={() => handleReorder(order)}
                                className="inline-flex items-center gap-1.5 text-xs bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-3 py-1.5 rounded transition-colors font-medium shadow-xs cursor-pointer"
                                title="Add these items to your shopping cart again"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reorder</span>
                              </button>

                              <Link
                                href={`/account/returns/new?orderId=${order.orderNumber}`}
                                className="inline-flex items-center gap-1.5 text-xs text-[#C6A664] hover:underline font-semibold px-2 py-1.5"
                              >
                                <span>Request Return/Exchange</span>
                              </Link>
                            </div>
                          </div>

                          {/* Stepper UI Timeline */}
                          <div className="bg-[#FAF7F2] p-4 rounded-lg border border-[#D8C9B0]/40">
                            <div className="grid grid-cols-5 gap-1 text-center">
                              {TIMELINE_STEPS.map((step, idx) => {
                                const isDone = idx <= stepIdx;
                                const isCurrent = idx === stepIdx;
                                const StepIcon = step.icon;

                                return (
                                  <div key={step.label} className="flex flex-col items-center">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                        isDone
                                          ? "bg-[#1A1A1A] text-[#C6A664]"
                                          : "bg-white border border-[#D8C9B0] text-[#1A1A1A]/30"
                                      }`}
                                    >
                                      {isDone && !isCurrent ? (
                                        <Check className="w-3.5 h-3.5 text-[#C6A664]" />
                                      ) : (
                                        <StepIcon className="w-3.5 h-3.5" />
                                      )}
                                    </div>
                                    <span
                                      className={`text-[9.5px] mt-1.5 tracking-wider uppercase font-semibold ${
                                        isCurrent
                                          ? "text-[#C6A664] font-bold"
                                          : isDone
                                          ? "text-[#1A1A1A]"
                                          : "text-[#1A1A1A]/40"
                                      }`}
                                    >
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Items List */}
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs border-b border-[#D8C9B0]/30 pb-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-12 bg-white rounded border border-[#D8C9B0]/40 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                                    {item.image ? (
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <Box className="w-5 h-5 text-[#C6A664]" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
                                    <p className="text-[11px] text-[#1A1A1A]/60 mt-0.5">
                                      {item.size ? `Size: ${item.size}` : ""}{" "}
                                      {item.colour ? `| Colour: ${item.colour}` : ""} | Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-bold font-numeric text-[#1A1A1A]">
                                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Financial Summary */}
                          <div className="bg-[#FAF7F2] p-3.5 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-[#D8C9B0]/40">
                            <div className="space-y-0.5">
                              <p className="text-[#1A1A1A]/70">
                                Subtotal: <span className="font-numeric">₹{order.subtotal?.toLocaleString("en-IN")}</span> &bull; Flat Shipping: <span className="font-numeric">₹{order.shippingCharge ?? 70}</span>
                              </p>
                              {order.balanceDue > 0 ? (
                                <p className="text-[11px] text-amber-800 font-semibold">
                                  Advance Paid: ₹{order.advancePaid?.toLocaleString("en-IN")} | Cash Payable at Delivery: ₹{order.balanceDue?.toLocaleString("en-IN")}
                                </p>
                              ) : (
                                <p className="text-[11px] text-emerald-800 font-semibold">
                                  ✓ 100% Paid Online via Razorpay
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-[#1A1A1A]/50 uppercase tracking-wider block">
                                Total Order Value
                              </span>
                              <span className="font-serif text-base font-bold font-numeric text-[#1A1A1A]">
                                ₹{order.total?.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 3: SAVED ADDRESSES */}
            {/* ================================================================ */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#D8C9B0]/50 pb-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-[#1A1A1A]/60">
                      Manage your home, office, and preferred delivery destinations.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenAddressModal()}
                    className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="py-16 text-center text-xs text-[#1A1A1A]/60">
                    Loading addresses...
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-xl p-12 text-center space-y-3">
                    <MapPin className="w-8 h-8 text-[#C6A664] mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Addresses Saved Yet</h3>
                    <p className="text-xs text-[#1A1A1A]/60 max-w-sm mx-auto">
                      Save your delivery address for faster checkout on all future KHAVYN orders.
                    </p>
                    <button
                      onClick={() => handleOpenAddressModal()}
                      className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => {
                      const addrId = addr._id || addr.id || "";

                      return (
                        <div
                          key={addrId}
                          className={`bg-[#F5F3EF] border rounded-xl p-5 relative transition-all ${
                            addr.isDefault
                              ? "border-[#C6A664] ring-2 ring-[#C6A664]/20 shadow-sm"
                              : "border-[#D8C9B0]/60 hover:border-[#1A1A1A]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-0.5 bg-[#1A1A1A] text-white rounded text-[10px] font-bold uppercase tracking-wider">
                              {addr.label || "Home"}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2.5 py-0.5 bg-[#C6A664] text-[#1A1A1A] rounded text-[10px] font-bold uppercase tracking-wider">
                                DEFAULT
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-base font-bold text-[#1A1A1A]">
                            {addr.fullName}
                          </h4>
                          <p className="text-xs text-[#1A1A1A]/70 mt-1 leading-relaxed">
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                            {addr.landmark ? ` (Near: ${addr.landmark})` : ""}
                            <br />
                            {addr.city}, {addr.state} – <strong className="text-[#1A1A1A]">{addr.pincode}</strong>
                          </p>
                          <p className="text-xs text-[#1A1A1A]/60 mt-2">
                            Phone: <strong className="text-[#1A1A1A]">{addr.phone}</strong>
                          </p>

                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#D8C9B0]/40 text-xs">
                            {!addr.isDefault ? (
                              <button
                                onClick={() => handleSetDefaultAddress(addrId)}
                                className="text-xs text-[#1A1A1A]/70 hover:text-[#C6A664] font-semibold cursor-pointer"
                              >
                                Set as Default
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#C6A664] font-semibold">
                                ✓ Primary Address
                              </span>
                            )}

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleOpenAddressModal(addr)}
                                className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] p-1 cursor-pointer"
                                title="Edit Address"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addrId)}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                title="Delete Address"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add / Edit Modal */}
                {addressModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#FAF7F2] border border-[#D8C9B0] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between border-b border-[#D8C9B0]/50 pb-3">
                        <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                          {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                        </h3>
                        <button
                          onClick={() => setAddressModalOpen(false)}
                          className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] font-bold text-lg cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>

                      <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                        {/* Tag / Label */}
                        <div>
                          <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                            Address Tag / Label *
                          </label>
                          <div className="flex gap-2">
                            {(["Home", "Office", "Other"] as const).map((tag) => (
                              <button
                                type="button"
                                key={tag}
                                onClick={() => setAddressForm({ ...addressForm, label: tag })}
                                className={`px-4 py-1.5 rounded border text-xs font-semibold cursor-pointer transition-colors ${
                                  addressForm.label === tag
                                    ? "bg-[#1A1A1A] text-[#C6A664] border-[#1A1A1A]"
                                    : "bg-white text-[#1A1A1A] border-[#D8C9B0]"
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                              Recipient Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.fullName}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, fullName: e.target.value })
                              }
                              placeholder="Full Name"
                              className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              required
                              value={addressForm.phone}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, phone: e.target.value })
                              }
                              placeholder="+91 9876543210"
                              className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                            Address Line 1 (Flat/House No, Building, Street) *
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.addressLine1}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, addressLine1: e.target.value })
                            }
                            placeholder="Flat/House No., Street Name"
                            className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                              Address Line 2 (Area, Colony - Optional)
                            </label>
                            <input
                              type="text"
                              value={addressForm.addressLine2 || ""}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, addressLine2: e.target.value })
                              }
                              placeholder="Locality"
                              className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                              Landmark (Optional)
                            </label>
                            <input
                              type="text"
                              value={addressForm.landmark || ""}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, landmark: e.target.value })
                              }
                              placeholder="e.g. Near Grand Mall"
                              className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[#1A1A1A]/70 font-semibold mb-1">City *</label>
                            <input
                              type="text"
                              required
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, city: e.target.value })
                              }
                              placeholder="Mumbai"
                              className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#1A1A1A]/70 font-semibold mb-1">State *</label>
                            <input
                              type="text"
                              required
                              value={addressForm.state}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, state: e.target.value })
                              }
                              placeholder="Maharashtra"
                              className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                              PIN Code *
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.pincode}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, pincode: e.target.value })
                              }
                              placeholder="400001"
                              className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={addressForm.isDefault}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, isDefault: e.target.checked })
                              }
                              className="accent-[#C6A664] w-4 h-4"
                            />
                            <span className="text-xs text-[#1A1A1A] font-medium">
                              Set as default delivery address
                            </span>
                          </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-[#D8C9B0]/40">
                          <button
                            type="button"
                            onClick={() => setAddressModalOpen(false)}
                            className="px-4 py-2 rounded text-xs font-semibold text-[#1A1A1A]/70 hover:bg-[#FAF7F2] cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-6 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 4: WISHLIST */}
            {/* ================================================================ */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#D8C9B0]/50 pb-3">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">
                      My Private Wishlist
                    </h2>
                    <p className="text-xs text-[#1A1A1A]/60">
                      Saved garments and stock availability alerts.
                    </p>
                  </div>
                  {wishlistItems.length > 0 && (
                    <button
                      onClick={clearWishlist}
                      className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                    >
                      Clear Wishlist
                    </button>
                  )}
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-xl p-12 text-center space-y-3">
                    <Heart className="w-8 h-8 text-[#C6A664] mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Your Wishlist is Empty</h3>
                    <p className="text-xs text-[#1A1A1A]/60 max-w-sm mx-auto">
                      Save luxury menswear pieces to your private wishlist while browsing our catalog.
                    </p>
                    <Link
                      href="/shop"
                      className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-widest inline-block transition-colors"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {wishlistItems.map((item) => {
                      const stockInfo = stockMap[item.styleCode] || stockMap[item.productId] || {
                        inStock: true,
                        totalStock: 10,
                      };
                      const isBackInStock = stockInfo.inStock;

                      return (
                        <div
                          key={item.productId}
                          className="bg-[#F5F3EF] border border-[#D8C9B0]/60 rounded-xl overflow-hidden shadow-xs flex flex-col group"
                        >
                          <div className="relative aspect-3/4 w-full bg-white overflow-hidden">
                            <Image
                              src={item.image || "/images/placeholder.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Stock Badge */}
                            <div className="absolute top-2.5 left-2.5">
                              {isBackInStock ? (
                                <span className="bg-[#1A1A1A] text-[#C6A664] text-[9.5px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-xs">
                                  In Stock
                                </span>
                              ) : (
                                <span className="bg-red-700 text-white text-[9.5px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-xs">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => toggleWishlist(item)}
                              className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-red-600 hover:bg-white transition-colors cursor-pointer shadow-xs"
                              title="Remove from wishlist"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <Link
                                href={`/shop/${item.slug || item.productId}`}
                                className="font-serif text-sm font-bold text-[#1A1A1A] hover:text-[#C6A664] line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <p className="text-[11px] text-[#1A1A1A]/60 mt-0.5">
                                {item.colour ? `Colour: ${item.colour}` : "European Tailored"}
                              </p>
                              <p className="font-serif text-sm font-bold text-[#1A1A1A] mt-1 font-numeric">
                                ₹{item.price.toLocaleString("en-IN")}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-[#D8C9B0]/40 flex gap-2">
                              <button
                                onClick={() => {
                                  addItem({
                                    productId: item.productId,
                                    name: item.name,
                                    slug: item.slug || item.productId,
                                    styleCode: item.styleCode || "KHV-STD",
                                    colour: item.colour || "Standard",
                                    size: "M",
                                    price: item.price,
                                    quantity: 1,
                                    image: item.image,
                                  });
                                  toggleWishlist(item);
                                  showToast(`${item.name} moved to shopping bag.`);
                                }}
                                disabled={!isBackInStock}
                                className="w-full bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Move to Bag</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 5: SIZE PROFILE */}
            {/* ================================================================ */}
            {activeTab === "sizes" && (
              <div className="space-y-6">
                <div className="border-b border-[#D8C9B0]/50 pb-3">
                  <h2 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Bespoke Size Profile
                  </h2>
                  <p className="text-xs text-[#1A1A1A]/60">
                    Save your preferred sizes across KHAVYN silhouettes for pre-selected sizing and tailored recommendations.
                  </p>
                </div>

                <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 rounded-xl p-6 shadow-xs space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SIZE_CATEGORIES.map((cat) => {
                      const currentSelected = sizeProfile[cat.key] || "";

                      return (
                        <div
                          key={cat.key}
                          className="bg-white border border-[#D8C9B0]/60 rounded-lg p-4 space-y-2.5 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                              {cat.label}
                            </span>
                            {currentSelected && (
                              <span className="text-[10px] font-bold bg-[#C6A664]/20 text-[#C6A664] px-2 py-0.5 rounded">
                                Selected: {currentSelected}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {cat.options.map((opt) => (
                              <button
                                type="button"
                                key={opt}
                                onClick={() =>
                                  setSizeProfile({ ...sizeProfile, [cat.key]: opt })
                                }
                                className={`w-10 h-10 rounded border text-xs font-bold transition-all cursor-pointer ${
                                  currentSelected === opt
                                    ? "bg-[#1A1A1A] text-[#C6A664] border-[#1A1A1A] ring-2 ring-[#C6A664]/30"
                                    : "bg-[#FAF7F2] text-[#1A1A1A]/70 border-[#D8C9B0] hover:border-[#1A1A1A]"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {sizeSaveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Size profile updated successfully. Your selections will be applied at checkout.</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSaveSizeProfile}
                      disabled={savingSizes}
                      className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-8 py-3 rounded text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {savingSizes ? "Saving Sizes..." : "Save Size Profile"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 6: ACCOUNT SETTINGS */}
            {/* ================================================================ */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="border-b border-[#D8C9B0]/50 pb-3">
                  <h2 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Account &amp; Security Settings
                  </h2>
                  <p className="text-xs text-[#1A1A1A]/60">
                    Manage contact details, security credentials, and communication channels.
                  </p>
                </div>

                {settingsFeedback && (
                  <div
                    className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 ${
                      settingsFeedback.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {settingsFeedback.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <span>{settingsFeedback.message}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                  {/* Personal Information */}
                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 rounded-xl p-6 shadow-xs space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#1A1A1A] uppercase tracking-wider border-b border-[#D8C9B0]/40 pb-2">
                      1. Contact Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, name: e.target.value })
                          }
                          className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                          Email Address (Locked)
                        </label>
                        <input
                          type="email"
                          disabled
                          value={profileData.email}
                          className="w-full bg-gray-100 border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A]/60 cursor-not-allowed"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[#1A1A1A]/70 font-semibold mb-1">
                          Mobile Phone Number (SMS &amp; WhatsApp Concierge)
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({ ...profileData, phone: e.target.value })
                          }
                          placeholder="+91 9876543210"
                          className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Authentication & Linked Accounts */}
                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 rounded-xl p-6 shadow-xs space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#1A1A1A] uppercase tracking-wider border-b border-[#D8C9B0]/40 pb-2">
                      2. Linked Providers &amp; Password
                    </h3>

                    {/* Google Linked Status */}
                    <div className="flex items-center justify-between p-3 bg-white border border-[#D8C9B0] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold text-xs">
                          G
                        </div>
                        <div>
                          <span className="font-semibold text-[#1A1A1A] block">Google Account</span>
                          <span className="text-[11px] text-[#1A1A1A]/60">
                            {profileData.googleLinked
                              ? "Linked for fast 1-click Google authentication"
                              : "Not linked. You can also sign in with Google using your email."}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                          profileData.googleLinked
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {profileData.googleLinked ? "LINKED" : "AVAILABLE"}
                      </span>
                    </div>

                    {/* Change Password fields */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-semibold text-xs text-[#1A1A1A]">
                        Change Password (Leave blank to keep unchanged)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#1A1A1A]/60 text-[11px] mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder="••••••••"
                            className="w-full bg-white border border-[#D8C9B0] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#1A1A1A]/60 text-[11px] mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Min 6 chars"
                            className="w-full bg-white border border-[#D8C9B0] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#1A1A1A]/60 text-[11px] mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Repeat new password"
                            className="w-full bg-white border border-[#D8C9B0] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Communication Preferences */}
                  <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 rounded-xl p-6 shadow-xs space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#1A1A1A] uppercase tracking-wider border-b border-[#D8C9B0]/40 pb-2">
                      3. Communication &amp; Concierge Preferences
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-white border border-[#D8C9B0] rounded-lg cursor-pointer">
                        <div>
                          <span className="font-semibold text-[#1A1A1A] block">
                            WhatsApp Order Dispatch &amp; Concierge Updates
                          </span>
                          <span className="text-[11px] text-[#1A1A1A]/60">
                            Receive real-time courier tracking links and delivery OTP alerts on WhatsApp.
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={profileData.commPreferences.whatsapp}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              commPreferences: {
                                ...profileData.commPreferences,
                                whatsapp: e.target.checked,
                              },
                            })
                          }
                          className="accent-[#C6A664] w-4 h-4 cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-white border border-[#D8C9B0] rounded-lg cursor-pointer">
                        <div>
                          <span className="font-semibold text-[#1A1A1A] block">
                            Email Invoices &amp; Private Preview Access
                          </span>
                          <span className="text-[11px] text-[#1A1A1A]/60">
                            Official GST tax invoices, order receipts, and invitations to seasonal lookbook drops.
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={profileData.commPreferences.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              commPreferences: {
                                ...profileData.commPreferences,
                                email: e.target.checked,
                              },
                            })
                          }
                          className="accent-[#C6A664] w-4 h-4 cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-white border border-[#D8C9B0] rounded-lg cursor-pointer">
                        <div>
                          <span className="font-semibold text-[#1A1A1A] block">
                            SMS Delivery Notifications
                          </span>
                          <span className="text-[11px] text-[#1A1A1A]/60">
                            Standard carrier SMS for out-for-delivery verification.
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={profileData.commPreferences.sms}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              commPreferences: {
                                ...profileData.commPreferences,
                                sms: e.target.checked,
                              },
                            })
                          }
                          className="accent-[#C6A664] w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-8 py-3 rounded text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {savingSettings ? "Updating Settings..." : "Save Settings"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ================================================================ */}
            {/* TAB 7: SUPPORT & FAQ */}
            {/* ================================================================ */}
            {activeTab === "support" && (
              <div className="space-y-6">
                <div className="border-b border-[#D8C9B0]/50 pb-3">
                  <h2 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Concierge Support &amp; Policy Helpdesk
                  </h2>
                  <p className="text-xs text-[#1A1A1A]/60">
                    Direct communication with the KHAVYN customer care team and quick legal references.
                  </p>
                </div>

                {/* WhatsApp Support Hero Card */}
                <div className="bg-[#1A1A1A] text-white rounded-xl p-8 border border-[#C6A664]/40 shadow-sm space-y-4 text-center">
                  <div className="w-14 h-14 bg-[#C6A664]/20 rounded-full flex items-center justify-center mx-auto text-[#C6A664]">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Direct VIP WhatsApp Concierge
                  </h3>
                  <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
                    Have an urgent query regarding your delivery, custom fitting, or need a personal stylist recommendation? Connect instantly with our Pune headquarters team.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://wa.me/919373205258?text=Hello%20KHAVYN%20Team,%20I%20have%20an%20order%20inquiry."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#C6A664] text-[#1A1A1A] hover:bg-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-widest transition-colors shadow-lg"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Talk to Us on WhatsApp (+91 93732 05258)</span>
                    </a>
                  </div>
                  <p className="text-[10px] text-white/40">
                    Operating Hours: Monday – Saturday (10:00 AM – 7:00 PM IST)
                  </p>
                </div>

                {/* Policy Shortcuts Grid */}
                <div className="space-y-3">
                  <h4 className="font-serif text-base font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Frequently Referenced Store Policies
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                      href="/policies/shipping"
                      className="bg-[#F5F3EF] border border-[#D8C9B0]/60 p-4 rounded-xl hover:border-[#C6A664] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Truck className="w-5 h-5 text-[#C6A664]" />
                        <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/40 group-hover:text-[#C6A664]" />
                      </div>
                      <h5 className="font-serif font-bold text-[#1A1A1A] text-sm group-hover:text-[#C6A664]">
                        Shipping &amp; Delivery
                      </h5>
                      <p className="text-[11px] text-[#1A1A1A]/60 mt-1">
                        Flat ₹70 courier rate, dispatch timelines, and express air freight.
                      </p>
                    </Link>

                    <Link
                      href="/policies/refund"
                      className="bg-[#F5F3EF] border border-[#D8C9B0]/60 p-4 rounded-xl hover:border-[#C6A664] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <RotateCcw className="w-5 h-5 text-[#C6A664]" />
                        <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/40 group-hover:text-[#C6A664]" />
                      </div>
                      <h5 className="font-serif font-bold text-[#1A1A1A] text-sm group-hover:text-[#C6A664]">
                        Returns &amp; Exchanges
                      </h5>
                      <p className="text-[11px] text-[#1A1A1A]/60 mt-1">
                        Hassle-free size exchange window, pickup coordination, and refunds.
                      </p>
                    </Link>

                    <Link
                      href="/policies/payment"
                      className="bg-[#F5F3EF] border border-[#D8C9B0]/60 p-4 rounded-xl hover:border-[#C6A664] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <ShieldCheck className="w-5 h-5 text-[#C6A664]" />
                        <ExternalLink className="w-3.5 h-3.5 text-[#1A1A1A]/40 group-hover:text-[#C6A664]" />
                      </div>
                      <h5 className="font-serif font-bold text-[#1A1A1A] text-sm group-hover:text-[#C6A664]">
                        Payments &amp; Partial COD
                      </h5>
                      <p className="text-[11px] text-[#1A1A1A]/60 mt-1">
                        Razorpay 256-bit SSL encryption, 50% advance rules, and GST invoices.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Email / Official Address details */}
                <div className="bg-[#F5F3EF] border border-[#D8C9B0]/60 p-6 rounded-xl text-xs text-[#1A1A1A]/70 space-y-1">
                  <p className="font-bold text-[#1A1A1A] text-sm">KHAVYN Fashion Private Limited</p>
                  <p>Sr. No. 80/16, Kavita Apartment, Samarth Nagar, New Sangavi, Pune – 411027, Maharashtra</p>
                  <p>Customer Support Email: <a href="mailto:complaint@khavyn.com" className="text-[#C6A664] font-semibold">complaint@khavyn.com</a></p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] text-[#1A1A1A]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#C6A664] border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-[#1A1A1A] text-sm tracking-widest uppercase">Loading Account Dashboard...</p>
      </div>
    </div>
  );
}

export default function AccountDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

