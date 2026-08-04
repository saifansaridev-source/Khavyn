"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";

import {
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  RotateCw,
  Users,
  Package,
  FileText,
  LogOut,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Download,
  ShieldCheck,
  Search,
  Check,
  X,
  Filter,
  TrendingUp,
  RefreshCw,
  Trash2,
  Eye,
  SlidersHorizontal,
  Settings,
  Tag,
  CreditCard,
  Truck,
  Lock,
  Megaphone,
  Percent,
  Save,
  Key,
} from "lucide-react";
import { SEED_PRODUCTS, ProductSeedInput } from "@/lib/data/productsData";
import { useProductStore } from "@/store/useProductStore";
import { ImageDropzone } from "@/components/admin/ImageDropzone";

export default function AdminDashboardPage() {
  const { products: storeProducts, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [activeSection, setActiveSection] = useState<
    | "kpis"
    | "products"
    | "orders"
    | "returns"
    | "customers"
    | "promotions"
    | "settings"
    | "audit"
  >("kpis");

  // 1. PRODUCTS STATE
  const [productSearch, setProductSearch] = useState("");
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState("all");

  const productsList = storeProducts;


  // Modal State for Product Add / Edit
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductSeedInput | null>(null);
  
  const defaultProductTemplate: ProductSeedInput = {
    ...SEED_PRODUCTS[0],
    name: "",
    slug: "",
    styleCode: "KHV-NEW-01",
    price: 2999,
    compareAtPrice: 4999,
    isBestSeller: false,
    isNewArrival: true,
    stock: { S: 10, M: 25, L: 20, XL: 15 },
  };

  const [productForm, setProductForm] = useState<ProductSeedInput>(defaultProductTemplate);

  // 2. ORDERS STATE
  const [orders, setOrders] = useState([
    {
      id: "KHV-849201",
      customer: "Vikramaditya Sharma",
      email: "vikram@example.com",
      phone: "+91 9876543210",
      shippingAddress: "Flat 402, Signature Towers, Jubilee Hills, Hyderabad - 500033",
      total: 5998,
      advancePaid: 2999,
      balanceDue: 2999,
      balanceCollected: false,
      paymentType: "partial_cod",
      status: "Shipped",
      trackingId: "AWB-778912304",
      date: "2026-07-28",
      items: ["White Signature Formal Shirt (M)", "Blue Signature Formal Shirt (M)"],
    },
    {
      id: "KHV-719302",
      customer: "Ananya Deshmukh",
      email: "ananya@example.com",
      phone: "+91 9123456789",
      shippingAddress: "Villa 12, Palam Vihar, Gurugram, Haryana - 122017",
      total: 2499,
      advancePaid: 2499,
      balanceDue: 0,
      balanceCollected: true,
      paymentType: "full",
      status: "Delivered",
      trackingId: "AWB-991204812",
      date: "2026-07-27",
      items: ["Sage Green Signature Polo (L)"],
    },
    {
      id: "KHV-601928",
      customer: "Rohan Kapoor",
      email: "rohan@example.com",
      phone: "+91 9988776655",
      shippingAddress: "B-404, Sea Breeze Apartments, Bandra West, Mumbai - 400050",
      total: 2299,
      advancePaid: 1150,
      balanceDue: 1149,
      balanceCollected: false,
      paymentType: "partial_cod",
      status: "Processing",
      trackingId: "Pending Generation",
      date: "2026-07-29",
      items: ["Sage Green Signature Oversized T-Shirt (XL)"],
    },
    {
      id: "KHV-510293",
      customer: "Siddharth Malhotra",
      email: "siddharth@example.com",
      phone: "+91 9811223344",
      shippingAddress: "77, Race Course Road, Bengaluru, Karnataka - 560001",
      total: 1899,
      advancePaid: 1899,
      balanceDue: 0,
      balanceCollected: true,
      paymentType: "full",
      status: "Pending",
      trackingId: "Pending Generation",
      date: "2026-08-01",
      items: ["Midnight Black Round Neck T-Shirt (L)"],
    },
  ]);

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  // 3. RETURNS STATE
  const [returnsQueue, setReturnsQueue] = useState([
    {
      id: "RET-1092",
      orderId: "KHV-719302",
      customer: "Ananya Deshmukh",
      type: "Size Exchange",
      reason: "Requested size L -> XL exchange for relaxed shoulder drape",
      status: "Pending Inspection",
      evidencePhoto: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "RET-1093",
      orderId: "KHV-849201",
      customer: "Vikramaditya Sharma",
      type: "Defect Report",
      reason: "Small seam thread loose on left collar",
      status: "Pending Inspection",
      evidencePhoto: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80",
    },
  ]);

  // 4. CUSTOMERS STATE
  const [customersList, setCustomersList] = useState([
    {
      id: "CUST-101",
      name: "Vikramaditya Sharma",
      email: "vikram@example.com",
      phone: "+91 9876543210",
      totalOrders: 3,
      totalSpent: 14996,
      codBlocked: false,
      riskLevel: "Low Risk",
      joinedDate: "2026-01-15",
    },
    {
      id: "CUST-102",
      name: "Ananya Deshmukh",
      email: "ananya@example.com",
      phone: "+91 9123456789",
      totalOrders: 2,
      totalSpent: 6998,
      codBlocked: false,
      riskLevel: "Low Risk",
      joinedDate: "2026-02-10",
    },
    {
      id: "CUST-103",
      name: "Rajesh Varma",
      email: "rajesh.varma@fake.com",
      phone: "+91 9000000001",
      totalOrders: 4,
      totalSpent: 0,
      codBlocked: true,
      riskLevel: "High Risk (RTO Spike)",
      joinedDate: "2026-05-22",
    },
  ]);
  const [customerSearch, setCustomerSearch] = useState("");

  // 5. PROMOTIONS & COUPONS STATE
  const [coupons, setCoupons] = useState([
    {
      code: "KHAVYN10",
      discount: "10% OFF",
      minOrder: 2499,
      usageCount: 142,
      status: "Active",
    },
    {
      code: "LUXURY500",
      discount: "₹500 OFF",
      minOrder: 3999,
      usageCount: 89,
      status: "Active",
    },
    {
      code: "VIPWELCOME",
      discount: "15% OFF",
      minOrder: 4999,
      usageCount: 37,
      status: "Active",
    },
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("10% OFF");
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(2499);

  // 6. STORE SETTINGS STATE
  const [storeSettings, setStoreSettings] = useState({
    announcementText: "COMPLIMENTARY EXPRESS SHIPPING ON ORDERS ABOVE ₹2,499",
    heroHeadline: "Timeless Style. Everyday Luxury.",
    heroSubline: "Architectural precision meets long-staple bio-washed combed cotton. Elevated essentials designed in Europe, tailored in India.",
    freeShippingThreshold: 2499,
    standardShippingFee: 150,
    partialCodAdvanceAmount: 1000,
    razorpayLiveMode: true,
    razorpayKeyId: "rzp_live_KHAVYN2026_PRODUCTION",
  });
  const [settingsSaveNotice, setSettingsSaveNotice] = useState(false);

  // 7. AUDIT LOGS STATE
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "LOG-9001",
      timestamp: "2026-08-01 17:30:12",
      admin: "admin@khavyn.com",
      action: "ADMIN_LOGIN",
      module: "AUTH",
      ip: "127.0.0.1",
      status: "SUCCESS",
    },
    {
      id: "LOG-9002",
      timestamp: "2026-08-01 17:35:45",
      admin: "admin@khavyn.com",
      action: "UPDATE_ORDER_STATUS",
      module: "ORDERS",
      ip: "127.0.0.1",
      status: "SUCCESS",
    },
    {
      id: "LOG-9003",
      timestamp: "2026-08-01 17:42:00",
      admin: "admin@khavyn.com",
      action: "ADD_PRODUCT_CATALOGUE",
      module: "CATALOGUE",
      ip: "127.0.0.1",
      status: "SUCCESS",
    },
  ]);

  // DERIVED COMPUTATIONS
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalAdvanceCollected = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.advancePaid, 0);
  }, [orders]);

  const pendingCodBalance = useMemo(() => {
    return orders.reduce((sum, o) => (o.balanceCollected ? sum : sum + o.balanceDue), 0);
  }, [orders]);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.styleCode.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCollection =
        selectedCollectionFilter === "all" || p.collectionName === selectedCollectionFilter;
      return matchesSearch && matchesCollection;
    });
  }, [productsList, productSearch, selectedCollectionFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.email.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredCustomers = useMemo(() => {
    return customersList.filter(
      (c) =>
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch)
    );
  }, [customersList, customerSearch]);

  // HANDLERS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      ...defaultProductTemplate,
      styleCode: `KHV-SHIRT-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: ProductSeedInput) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await updateProduct(productForm);
      addAuditLog("UPDATE_PRODUCT", "CATALOGUE", `Updated ${productForm.name} stock & pricing`);
    } else {
      await addProduct(productForm);
      addAuditLog("CREATE_PRODUCT", "CATALOGUE", `Added new product ${productForm.name}`);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (styleCode: string) => {
    if (confirm(`Are you sure you want to remove product ${styleCode} from catalogue?`)) {
      await deleteProduct(styleCode);
      addAuditLog("DELETE_PRODUCT", "CATALOGUE", `Deleted product ${styleCode}`);
    }
  };


  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    addAuditLog("UPDATE_ORDER_STATUS", "ORDERS", `Order ${orderId} changed to ${newStatus}`);
  };

  const handleToggleCodBalance = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              balanceCollected: !o.balanceCollected,
              balanceDue: !o.balanceCollected ? 0 : o.total - o.advancePaid,
            }
          : o
      )
    );
    addAuditLog("TOGGLE_COD_BALANCE", "FINANCE", `Toggled COD balance for ${orderId}`);
  };

  const handleApproveReturn = (returnId: string) => {
    setReturnsQueue((prev) =>
      prev.map((r) =>
        r.id === returnId ? { ...r, status: "Approved - Exchange Granted" } : r
      )
    );
    addAuditLog("APPROVE_RETURN", "RETURNS", `Approved return ${returnId}`);
  };

  const handleRejectReturn = (returnId: string) => {
    setReturnsQueue((prev) =>
      prev.map((r) => (r.id === returnId ? { ...r, status: "Rejected" } : r))
    );
    addAuditLog("REJECT_RETURN", "RETURNS", `Rejected return ${returnId}`);
  };

  const handleToggleCustomerCod = (custId: string) => {
    setCustomersList((prev) =>
      prev.map((c) => (c.id === custId ? { ...c, codBlocked: !c.codBlocked } : c))
    );
    addAuditLog("TOGGLE_CUSTOMER_COD", "CUSTOMERS", `Toggled COD restrictions for ${custId}`);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    setCoupons((prev) => [
      ...prev,
      {
        code: newCouponCode.toUpperCase().trim(),
        discount: newCouponDiscount,
        minOrder: Number(newCouponMinOrder),
        usageCount: 0,
        status: "Active",
      },
    ]);
    setNewCouponCode("");
    addAuditLog("CREATE_COUPON", "PROMOTIONS", `Created promotion code ${newCouponCode}`);
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaveNotice(true);
    setTimeout(() => setSettingsSaveNotice(false), 3000);
    addAuditLog("UPDATE_STORE_SETTINGS", "SETTINGS", "Updated global store configuration");
  };

  const addAuditLog = (action: string, module: string, details: string) => {
    setAuditLogs((prev) => [
      {
        id: `LOG-${Math.floor(9000 + Math.random() * 1000)}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        admin: "admin@khavyn.com",
        action,
        module,
        ip: "127.0.0.1",
        status: "SUCCESS",
      },
      ...prev,
    ]);
  };

  const handleExportCSV = () => {
    const headers = "Order ID,Customer,Email,Total (INR),Advance (INR),Balance Due,Status,Date\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.customer}","${o.email}",${o.total},${o.advancePaid},${o.balanceDue},"${o.status}","${o.date}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KHAVYN_Orders_Report_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-sans selection:bg-[#C6A664] selection:text-black">
      {/* Top Admin Header */}
      <header className="bg-[#1F1F1F] border-b border-[#C6A664]/30 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif text-2xl font-bold tracking-[0.2em] text-[#C6A664] hover:text-white transition-colors">
            KHAVYN
          </Link>
          <span className="text-[10px] bg-[#C6A664] text-black font-bold uppercase tracking-widest px-2.5 py-0.5 rounded shadow">
            EXECUTIVE CONSOLE A-Z
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="hidden sm:flex items-center gap-2 text-white/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Server: <strong className="text-white">Online (Port 3000)</strong></span>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded">
            <ShieldCheck className="w-4 h-4 text-[#C6A664]" />
            <span className="text-white/90 font-medium">admin@khavyn.com</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[#C6A664] hover:text-white transition-colors uppercase font-semibold text-[11px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-[#C6A664]/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Admin Navigation Sidebar */}
        <aside className="w-full lg:w-64 bg-[#1A1A1A] border-r border-[#C6A664]/20 p-4 space-y-1.5 flex-shrink-0">
          <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#C6A664]">
            Executive Controls
          </div>
          {[
            { id: "kpis", label: "Executive Overview", icon: DollarSign, badge: null },
            { id: "products", label: "Catalogue & Stock", icon: Package, badge: productsList.length },
            { id: "orders", label: "Orders & Settlement", icon: ShoppingBag, badge: orders.length },
            { id: "returns", label: "Returns Desk", icon: RotateCw, badge: returnsQueue.filter(r => r.status.includes("Pending")).length },
            { id: "customers", label: "Customer Risk Desk", icon: Users, badge: customersList.length },
            { id: "promotions", label: "Promotions & Engine", icon: Percent, badge: coupons.length },
            { id: "settings", label: "Storefront Config", icon: Settings, badge: null },
            { id: "audit", label: "Security & Audit Logs", icon: FileText, badge: null },
          ].map((nav) => {
            const Icon = nav.icon;
            const isActive = activeSection === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveSection(nav.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-[#C6A664] text-black font-bold shadow-lg"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{nav.label}</span>
                </div>
                {nav.badge !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-black text-[#C6A664]" : "bg-white/10 text-white"
                    }`}
                  >
                    {nav.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 space-y-1.5 border-t border-white/10 px-1">
            <Link
              href="/admin/inventory"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>SKU Stock Grid</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">NEW</span>
            </Link>

            <Link
              href="/admin/reviews"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-[#C6A664] bg-[#C6A664]/10 border border-[#C6A664]/30 hover:bg-[#C6A664]/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Review Moderation</span>
              </div>
            </Link>
          </div>

          <div className="pt-6 px-3">
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[#C6A664] border border-[#C6A664]/40 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Report</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* SECTION 1: EXECUTIVE KPIS */}
          {activeSection === "kpis" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#C6A664]">
                    Executive Financial Overview
                  </h2>
                  <p className="text-xs text-white/60">
                    Real-time metrics on gross revenue, advance deposits, COD balances, and stock telemetry.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => addAuditLog("REFRESH_METRICS", "TELEMETRY", "Refreshed revenue data")}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded text-xs font-medium text-white/80"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#C6A664]" />
                    <span>Sync Metrics</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-[#1F1F1F] border border-white/10 rounded-lg p-5 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Gross Order Value</span>
                    <DollarSign className="w-4 h-4 text-[#C6A664]" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18.4% vs last week</span>
                  </div>
                </div>

                <div className="bg-[#1F1F1F] border border-white/10 rounded-lg p-5 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Prepaid Advances Collected</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-emerald-400">
                    ₹{totalAdvanceCollected.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-white/50">
                    100% Zero-RTO Risk Secured
                  </div>
                </div>

                <div className="bg-[#1F1F1F] border border-white/10 rounded-lg p-5 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Pending Partial COD Balance</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-amber-400">
                    ₹{pendingCodBalance.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-amber-400/80">
                    Collectable on Delivery
                  </div>
                </div>

                <div className="bg-[#1F1F1F] border border-white/10 rounded-lg p-5 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Active Stock SKUs</span>
                    <Package className="w-4 h-4 text-[#C6A664]" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">
                    {productsList.length} Products
                  </div>
                  <div className="text-[11px] text-emerald-400">
                    4 Signature Collections
                  </div>
                </div>
              </div>

              {/* Collection Revenue Breakdown */}
              <div className="bg-[#1F1F1F] border border-white/10 rounded-lg p-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#C6A664]" />
                  <span>Category Revenue Share</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Formal Shirts", share: 45, revenue: "₹3,40,000", color: "bg-[#C6A664]" },
                    { name: "Polo T-Shirts", share: 30, revenue: "₹2,25,000", color: "bg-[#B08D57]" },
                    { name: "Oversized T-Shirts", share: 15, revenue: "₹1,12,500", color: "bg-emerald-500" },
                    { name: "Round Neck T-Shirts", share: 10, revenue: "₹75,000", color: "bg-blue-500" },
                  ].map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-white/90">{cat.name}</span>
                        <span className="text-[#C6A664]">{cat.revenue} ({cat.share}%)</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color}`} style={{ width: `${cat.share}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CATALOGUE & STOCK */}
          {activeSection === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#C6A664]">
                    Product Catalogue & Inventory Control
                  </h2>
                  <p className="text-xs text-white/60">
                    Add new products, adjust live pricing, edit size-wise stock levels (S, M, L, XL), or manage bestsellers.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center justify-center gap-2 bg-[#C6A664] text-black hover:bg-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1F1F1F] p-4 rounded-lg border border-white/10">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search name or style code..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-[#141414] border border-white/20 rounded pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C6A664]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Filter className="w-4 h-4 text-[#C6A664]" />
                  <select
                    value={selectedCollectionFilter}
                    onChange={(e) => setSelectedCollectionFilter(e.target.value)}
                    className="bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                  >
                    <option value="all">All Collections</option>
                    <option value="Formal Shirts">Formal Shirts</option>
                    <option value="Polo T-Shirts">Polo T-Shirts</option>
                    <option value="Oversized T-Shirts">Oversized T-Shirts</option>
                    <option value="Round Neck T-Shirts">Round Neck T-Shirts</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#1F1F1F] border border-white/10 rounded-lg overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#141414] text-[#C6A664] uppercase font-bold text-[10px] tracking-widest border-b border-white/10">
                      <tr>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Style Code</th>
                        <th className="p-4">Collection</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock Breakdown (S/M/L/XL)</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredProducts.map((prod) => {
                        const totalStock = Object.values(prod.stock).reduce((a, b) => a + b, 0);
                        return (
                          <tr key={prod.styleCode} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-semibold text-white">
                              {prod.name}
                              {prod.isBestSeller && (
                                <span className="ml-2 bg-[#C6A664] text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                  Bestseller
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-white/70 font-mono">{prod.styleCode}</td>
                            <td className="p-4 text-white/80">{prod.collectionName}</td>
                            <td className="p-4 text-[#C6A664] font-bold">
                              ₹{prod.price.toLocaleString("en-IN")}
                              {prod.compareAtPrice && (
                                <span className="ml-2 text-white/40 line-through text-[10px]">
                                  ₹{prod.compareAtPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/90">S:{prod.stock.S}</span>
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/90">M:{prod.stock.M}</span>
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/90">L:{prod.stock.L}</span>
                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/90">XL:{prod.stock.XL}</span>
                                <span className="ml-1 font-bold text-white">({totalStock} total)</span>
                              </div>
                            </td>
                            <td className="p-4">
                              {totalStock > 10 ? (
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                  In Stock
                                </span>
                              ) : (
                                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                  Low Stock ({totalStock})
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1.5 bg-white/10 hover:bg-[#C6A664] hover:text-black rounded text-white transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.styleCode)}
                                  className="p-1.5 bg-red-500/20 hover:bg-red-600 rounded text-red-400 hover:text-white transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: ORDERS & SETTLEMENT */}
          {activeSection === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#C6A664]">
                    Orders & Settlement Desk
                  </h2>
                  <p className="text-xs text-white/60">
                    Track order progression (Pending → Processing → Shipped → Delivered → Cancelled) and collect Partial COD balances.
                  </p>
                </div>
              </div>

              {/* Order Search & Filters */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1F1F1F] p-4 rounded-lg border border-white/10">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search Order ID, Customer name..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-[#141414] border border-white/20 rounded pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C6A664]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Filter className="w-4 h-4 text-[#C6A664]" />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                  >
                    <option value="all">All Order Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#1F1F1F] border border-white/10 rounded-lg overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#141414] text-[#C6A664] uppercase font-bold text-[10px] tracking-widest border-b border-white/10">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Advance Paid</th>
                        <th className="p-4">Balance Due</th>
                        <th className="p-4">Fulfillment Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-white">{ord.id}</td>
                          <td className="p-4">
                            <div className="font-semibold text-white">{ord.customer}</div>
                            <div className="text-[10px] text-white/50">{ord.email}</div>
                          </td>
                          <td className="p-4 font-bold text-white">₹{ord.total.toLocaleString("en-IN")}</td>
                          <td className="p-4 text-emerald-400 font-medium">₹{ord.advancePaid.toLocaleString("en-IN")}</td>
                          <td className="p-4">
                            {ord.balanceCollected ? (
                              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                Collected (₹0)
                              </span>
                            ) : (
                              <button
                                onClick={() => handleToggleCodBalance(ord.id)}
                                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded transition-colors"
                              >
                                ₹{ord.balanceDue.toLocaleString("en-IN")} (Click to Collect)
                              </button>
                            )}
                          </td>
                          <td className="p-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="bg-[#141414] border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:border-[#C6A664]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="px-3 py-1.5 bg-white/10 hover:bg-[#C6A664] hover:text-black rounded text-[11px] font-semibold text-white transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: RETURNS DESK */}
          {activeSection === "returns" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#C6A664]">
                    Returns & Quality Inspection Desk
                  </h2>
                  <p className="text-xs text-white/60">
                    Review exchange requests, inspect customer upload evidence, and issue store credit or replacements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {returnsQueue.map((ret) => (
                  <div key={ret.id} className="bg-[#1F1F1F] border border-white/10 rounded-lg p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#C6A664]">{ret.id}</span>
                        <h4 className="font-semibold text-white text-sm">{ret.customer}</h4>
                      </div>
                      <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                        {ret.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-white/80">
                      <p><strong>Order ID:</strong> {ret.orderId}</p>
                      <p><strong>Request Type:</strong> {ret.type}</p>
                      <p><strong>Reason:</strong> {ret.reason}</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleRejectReturn(ret.id)}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded text-xs font-semibold transition-colors"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => handleApproveReturn(ret.id)}
                        className="px-4 py-1.5 bg-[#C6A664] hover:bg-white text-black font-bold rounded text-xs uppercase tracking-wider transition-colors"
                      >
                        Approve Exchange
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: CUSTOMER RISK DESK */}
          {activeSection === "customers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#C6A664]">
                    Customer Risk Management & Blacklist
                  </h2>
                  <p className="text-xs text-white/60">
                    Monitor high-RTO risk customers, block Partial COD access, and review purchasing telemetry.
                  </p>
                </div>
              </div>

              <div className="bg-[#1F1F1F] border border-white/10 rounded-lg overflow-hidden shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#141414] text-[#C6A664] uppercase font-bold text-[10px] tracking-widest border-b border-white/10">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Orders Placed</th>
                      <th className="p-4">Risk Profile</th>
                      <th className="p-4">COD Restrictions</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-semibold text-white">{cust.name}</td>
                        <td className="p-4 text-white/70">{cust.email} ({cust.phone})</td>
                        <td className="p-4 font-bold text-white">{cust.totalOrders}</td>
                        <td className="p-4">
                          {cust.riskLevel.includes("High") ? (
                            <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">
                              {cust.riskLevel}
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                              {cust.riskLevel}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {cust.codBlocked ? (
                            <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">
                              COD Blocked
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                              COD Allowed
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleCustomerCod(cust.id)}
                            className="px-3 py-1.5 bg-white/10 hover:bg-[#C6A664] hover:text-black rounded text-xs font-semibold text-white transition-colors"
                          >
                            {cust.codBlocked ? "Unblock COD" : "Block COD"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 6: PROMOTIONS & ENGINE */}
          {activeSection === "promotions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#C6A664]">
                    Promotions & Coupon Code Engine
                  </h2>
                  <p className="text-xs text-white/60">
                    Create discount voucher codes, set minimum cart requirements, and monitor usage metrics.
                  </p>
                </div>
              </div>

              {/* Create Coupon Form */}
              <div className="bg-[#1F1F1F] border border-white/10 rounded-lg p-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C6A664]" />
                  <span>Create New Promotion Voucher</span>
                </h3>
                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. VIP2026"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Discount Amount</label>
                    <input
                      type="text"
                      placeholder="e.g. 15% OFF or ₹500 OFF"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(e.target.value)}
                      className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Min Order Threshold (₹)</label>
                    <input
                      type="number"
                      value={newCouponMinOrder}
                      onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                      className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#C6A664] hover:bg-white text-black font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-colors"
                    >
                      Activate Voucher
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons List */}
              <div className="bg-[#1F1F1F] border border-white/10 rounded-lg overflow-hidden shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#141414] text-[#C6A664] uppercase font-bold text-[10px] tracking-widest border-b border-white/10">
                    <tr>
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Min Order Value</th>
                      <th className="p-4">Redemptions</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {coupons.map((cp, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">{cp.code}</td>
                        <td className="p-4 text-emerald-400 font-bold">{cp.discount}</td>
                        <td className="p-4 text-white/80">₹{cp.minOrder.toLocaleString("en-IN")}</td>
                        <td className="p-4 text-white font-bold">{cp.usageCount} times</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                            {cp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 7: STOREFRONT CONFIG & SETTINGS */}
          {activeSection === "settings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#C6A664]">
                    Storefront Configuration & Payment Gateway
                  </h2>
                  <p className="text-xs text-white/60">
                    Control announcement text, shipping thresholds, partial COD parameters, and Razorpay API credentials.
                  </p>
                </div>

                {settingsSaveNotice && (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Store Configuration Saved Live!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveStoreSettings} className="space-y-6">
                {/* Announcement Bar & Hero Configuration */}
                <div className="bg-[#1F1F1F] border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                    <Megaphone className="w-4 h-4 text-[#C6A664]" />
                    <span>Hero Banner & Announcement Controls</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Live Announcement Ticker Text</label>
                      <input
                        type="text"
                        value={storeSettings.announcementText}
                        onChange={(e) => setStoreSettings({ ...storeSettings, announcementText: e.target.value })}
                        className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Hero Section Main Headline</label>
                      <input
                        type="text"
                        value={storeSettings.heroHeadline}
                        onChange={(e) => setStoreSettings({ ...storeSettings, heroHeadline: e.target.value })}
                        className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping & Partial COD Controls */}
                <div className="bg-[#1F1F1F] border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                    <Truck className="w-4 h-4 text-[#C6A664]" />
                    <span>Shipping Rules & Partial COD Rules</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Free Shipping Min Order (₹)</label>
                      <input
                        type="number"
                        value={storeSettings.freeShippingThreshold}
                        onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Standard Shipping Fee (₹)</label>
                      <input
                        type="number"
                        value={storeSettings.standardShippingFee}
                        onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
                        className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Fixed Partial COD Advance (₹)</label>
                      <input
                        type="number"
                        value={storeSettings.partialCodAdvanceAmount}
                        onChange={(e) => setStoreSettings({ ...storeSettings, partialCodAdvanceAmount: Number(e.target.value) })}
                        className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                      />
                    </div>
                  </div>
                </div>

                {/* Razorpay Gateway Parameters */}
                <div className="bg-[#1F1F1F] border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                    <Key className="w-4 h-4 text-[#C6A664]" />
                    <span>Razorpay API Credentials & HMAC Signatures</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Active Razorpay Key ID</label>
                      <input
                        type="text"
                        value={storeSettings.razorpayKeyId}
                        onChange={(e) => setStoreSettings({ ...storeSettings, razorpayKeyId: e.target.value })}
                        className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-xs font-mono text-[#C6A664] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <input
                        type="checkbox"
                        id="razorpayLiveMode"
                        checked={storeSettings.razorpayLiveMode}
                        onChange={(e) => setStoreSettings({ ...storeSettings, razorpayLiveMode: e.target.checked })}
                        className="rounded text-[#C6A664] focus:ring-0 w-4 h-4"
                      />
                      <label htmlFor="razorpayLiveMode" className="text-xs font-bold text-white cursor-pointer">
                        Enable Razorpay Live Production Environment
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#C6A664] hover:bg-white text-black font-bold px-8 py-3 rounded text-xs uppercase tracking-wider transition-colors shadow-xl"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Configuration</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 8: AUDIT LOGS & SECURITY */}
          {activeSection === "audit" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#C6A664]">
                    Security Telemetry & System Audit Trail
                  </h2>
                  <p className="text-xs text-white/60">
                    Live system audit logging of all administrative actions, authentication tokens, and Edge security statuses.
                  </p>
                </div>
              </div>

              {/* Security Telemetry Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1F1F1F] border border-emerald-500/30 p-4 rounded-lg flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/60 block">Edge Proxy Router</span>
                    <span className="text-sm font-bold text-emerald-400">src/proxy.ts Active</span>
                  </div>
                </div>

                <div className="bg-[#1F1F1F] border border-emerald-500/30 p-4 rounded-lg flex items-center gap-3">
                  <Lock className="w-8 h-8 text-emerald-400" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/60 block">HTTP Security Headers</span>
                    <span className="text-sm font-bold text-emerald-400">HSTS & DENY Enforced</span>
                  </div>
                </div>

                <div className="bg-[#1F1F1F] border border-emerald-500/30 p-4 rounded-lg flex items-center gap-3">
                  <Key className="w-8 h-8 text-emerald-400" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/60 block">JWT Token Encryption</span>
                    <span className="text-sm font-bold text-emerald-400">HS256 12-Hour Session</span>
                  </div>
                </div>
              </div>

              {/* Audit Table */}
              <div className="bg-[#1F1F1F] border border-white/10 rounded-lg overflow-hidden shadow-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#141414] text-[#C6A664] uppercase font-bold text-[10px] tracking-widest border-b border-white/10">
                    <tr>
                      <th className="p-4">Log ID</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Admin User</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Module</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-[#C6A664]">{log.id}</td>
                        <td className="p-4 text-white/80">{log.timestamp}</td>
                        <td className="p-4 text-white">{log.admin}</td>
                        <td className="p-4 text-white font-bold">{log.action}</td>
                        <td className="p-4 text-white/70">{log.module}</td>
                        <td className="p-4 text-white/60">{log.ip}</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Add/Edit Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1F1F1F] border border-[#C6A664] rounded-xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto my-8">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#C6A664]">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product to Catalogue"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-white/70 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/ /g, "-"),
                      })
                    }
                    className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-[#C6A664]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase text-white/70 block mb-1">Style Code (SKU) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.styleCode}
                    onChange={(e) => setProductForm({ ...productForm, styleCode: e.target.value })}
                    className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-[#C6A664]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase text-white/70 block mb-1">Collection *</label>
                  <select
                    value={productForm.collectionName}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        collectionName: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-[#C6A664]"
                  >
                    <option value="Formal Shirts">Formal Shirts</option>
                    <option value="Polo T-Shirts">Polo T-Shirts</option>
                    <option value="Oversized T-Shirts">Oversized T-Shirts</option>
                    <option value="Round Neck T-Shirts">Round Neck T-Shirts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase text-white/70 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-[#C6A664]"
                  />
                </div>
              </div>

              {/* Colour Selection & Hex Picker */}
              <div className="border-t border-white/10 pt-3 space-y-2">
                <label className="text-[10px] font-semibold uppercase text-white/70 block">
                  Colour Variant Settings *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">Colour Name (e.g. Sage Green)</span>
                    <input
                      type="text"
                      required
                      value={productForm.colour}
                      onChange={(e) => setProductForm({ ...productForm, colour: e.target.value })}
                      className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">Colour Swatch Hex Code</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={productForm.colourHex || "#C6A664"}
                        onChange={(e) => setProductForm({ ...productForm, colourHex: e.target.value })}
                        className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={productForm.colourHex || "#C6A664"}
                        onChange={(e) => setProductForm({ ...productForm, colourHex: e.target.value })}
                        className="flex-1 bg-[#141414] border border-white/20 rounded px-3 py-2 font-mono text-white focus:outline-none focus:border-[#C6A664]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Images Drag & Drop Gallery */}
              <div className="border-t border-white/10 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold uppercase text-white/70 block">
                    Product Image Gallery (Drag & Drop or Pick File) *
                  </label>
                  <span className="text-[10px] text-[#C6A664]">
                    Drag files directly or paste image URLs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Front View Shot", key: "front" },
                    { label: "Side View Shot", key: "side" },
                    { label: "Back View Shot", key: "back" },
                    { label: "45° Angle Shot", key: "angle45" },
                    { label: "Fabric Texture Close-up", key: "fabricTexture" },
                    { label: "Model Showcase Shot", key: "modelFront" },
                  ].map((imgField) => {
                    const currentUrl = (productForm.images as any)[imgField.key] || "";
                    return (
                      <ImageDropzone
                        key={imgField.key}
                        label={imgField.label}
                        value={currentUrl}
                        onChange={(newUrl) =>
                          setProductForm({
                            ...productForm,
                            images: {
                              ...productForm.images,
                              [imgField.key]: newUrl,
                            },
                          })
                        }
                      />
                    );
                  })}
                </div>
              </div>


              {/* Stock Inventory per size */}
              <div className="space-y-1.5 border-t border-white/10 pt-3">
                <label className="text-[10px] font-semibold uppercase text-white/70">Size Variant Inventory *</label>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-white/50 block">Size S</span>
                    <input
                      type="number"
                      value={productForm.stock.S}
                      onChange={(e) => setProductForm({ ...productForm, stock: { ...productForm.stock, S: Number(e.target.value) } })}
                      className="w-full bg-[#141414] border border-white/20 rounded px-2 py-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block">Size M</span>
                    <input
                      type="number"
                      value={productForm.stock.M}
                      onChange={(e) => setProductForm({ ...productForm, stock: { ...productForm.stock, M: Number(e.target.value) } })}
                      className="w-full bg-[#141414] border border-white/20 rounded px-2 py-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block">Size L</span>
                    <input
                      type="number"
                      value={productForm.stock.L}
                      onChange={(e) => setProductForm({ ...productForm, stock: { ...productForm.stock, L: Number(e.target.value) } })}
                      className="w-full bg-[#141414] border border-white/20 rounded px-2 py-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block">Size XL</span>
                    <input
                      type="number"
                      value={productForm.stock.XL}
                      onChange={(e) => setProductForm({ ...productForm, stock: { ...productForm.stock, XL: Number(e.target.value) } })}
                      className="w-full bg-[#141414] border border-white/20 rounded px-2 py-1.5 text-center text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bestSellerCheck"
                  checked={productForm.isBestSeller}
                  onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                  className="rounded border-white/20 text-[#C6A664] focus:ring-0"
                />
                <label htmlFor="bestSellerCheck" className="text-xs text-white/90 cursor-pointer">
                  Feature in Best Sellers Section
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C6A664] hover:bg-white text-black font-bold rounded uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Order Details */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1F1F1F] border border-[#C6A664] rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#C6A664]">
              Order Details — {selectedOrderDetails.id}
            </h3>

            <div className="space-y-3 text-white/80">
              <div className="bg-white/5 p-3 rounded space-y-1">
                <p><strong>Customer:</strong> {selectedOrderDetails.customer}</p>
                <p><strong>Email:</strong> {selectedOrderDetails.email}</p>
                <p><strong>Phone:</strong> {selectedOrderDetails.phone}</p>
                <p><strong>Shipping Address:</strong> {selectedOrderDetails.shippingAddress}</p>
              </div>

              <div className="bg-white/5 p-3 rounded space-y-1">
                <p><strong>Total Amount:</strong> ₹{selectedOrderDetails.total.toLocaleString("en-IN")}</p>
                <p><strong>Advance Paid:</strong> ₹{selectedOrderDetails.advancePaid.toLocaleString("en-IN")}</p>
                <p><strong>Balance Due:</strong> ₹{selectedOrderDetails.balanceDue.toLocaleString("en-IN")}</p>
                <p><strong>Tracking Number:</strong> {selectedOrderDetails.trackingId}</p>
              </div>

              <div className="bg-white/5 p-3 rounded space-y-1">
                <strong className="block text-white">Order Items:</strong>
                <ul className="list-disc list-inside">
                  {selectedOrderDetails.items.map((it: string, i: number) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2 bg-[#C6A664] hover:bg-white text-black font-bold rounded uppercase tracking-wider"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
