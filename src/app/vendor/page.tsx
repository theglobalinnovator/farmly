// src/app/vendor/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, Plus, ClipboardList, MessageSquare, ChevronLeft, ChevronRight, 
  LogOut, Trash2, MapPin, TrendingUp, CheckCircle, Flame, Search, Star, Upload, X, Edit3
} from "lucide-react";
import { useApp, Product } from "../context/AppContext";
import toast, { Toaster } from "react-hot-toast";

export default function VendorDashboard() {
  const {
    theme, setTheme, vendorName, setUserRole, products, addProduct, updateProduct, deleteProduct,
    orders, setOrders, monthlyRevenue, reviews
  } = useApp();

  const [activeTab, setActiveTab] = useState("analytics");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", price: "", location: "Ogbomosho Farm Complex", 
    description: "", stockUnit: "Crate", 
    isCluster: false, isFlashClearance: false,
    eta: "24 Hours", imageUrl: "" 
  });

  const isDark = theme === "dark";

  const totalRevenueLogged = monthlyRevenue ? monthlyRevenue.reduce((acc, curr) => acc + curr.amount, 0) : 0;
  const highestRevenueMonth = monthlyRevenue && monthlyRevenue.length > 0 
    ? [...monthlyRevenue].sort((a, b) => b.amount - a.amount)[0] 
    : { month: "N/A", amount: 0 };

  const navTabs = [
    { id: "analytics", label: "Analytics Stream", icon: BarChart3 },
    { id: "add_product", label: "Add Produce", icon: Plus },
    { id: "active_orders", label: "Active Orders", icon: ClipboardList },
    { id: "complaints", label: "Feedback Logs", icon: MessageSquare }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: String(p.price),
      location: p.location || "Ogbomosho Farm Complex",
      description: p.description || "",
      stockUnit: p.stockUnit || "Crate",
      isCluster: p.isCluster || false,
      isFlashClearance: p.tag === "distress",
      eta: "24 Hours",
      imageUrl: p.image || ""
    });
    setActiveTab("add_product");
    toast("Loaded product into editor for modification.");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", location: "Ogbomosho Farm Complex", description: "", stockUnit: "Crate", isCluster: false, isFlashClearance: false, eta: "24 Hours", imageUrl: "" });
  };

  const handleVendorFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const defaultImage = "https://images.unsplash.com/photo-1592417817098-8f3d6eb26966?w=400&auto=format&fit=crop&q=60";
    const determinedTag = formData.isFlashClearance ? "distress" : formData.isCluster ? "cluster" : "standard";

    const productPayload: Product = {
      id: editingId || "v_" + Date.now(),
      name: formData.name,
      price: Number(formData.price),
      image: formData.imageUrl || defaultImage,
      location: formData.location || "Ogbomosho Farm Complex",
      rating: 5.0,
      isCluster: formData.isCluster,
      clusterRemainingPercent: formData.isCluster ? 100 : undefined,
      description: formData.description,
      stockUnit: formData.stockUnit,
      tag: determinedTag
    };

    if (editingId) {
      updateProduct(productPayload);
      toast.success("Crop asset updated successfully!");
      setEditingId(null);
    } else {
      addProduct(productPayload);
      toast.success("Asset deployed to production stream catalog!");
    }

    setFormData({ name: "", price: "", location: "Ogbomosho Farm Complex", description: "", stockUnit: "Crate", isCluster: false, isFlashClearance: false, eta: "24 Hours", imageUrl: "" });
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 pb-20 md:pb-0 ${isDark ? "bg-[#020b05] text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#020b05', color: '#fff', border: '1px solid #065f46', fontSize: '12px' } }} />

      {/* SIDEBAR */}
      <motion.aside 
        animate={{ width: sidebarCollapsed ? 88 : 280 }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className={`border-r shrink-0 hidden md:flex flex-col justify-between p-5 relative z-40 h-screen sticky top-0 ${isDark ? "bg-[#010602] border-emerald-950/60" : "bg-white border-zinc-200"}`}
      >
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`absolute top-6 -right-3 h-6 w-6 rounded-full border flex items-center justify-center cursor-pointer transition-all shadow-md ${isDark ? "bg-emerald-950 border-emerald-800 text-emerald-400 hover:bg-emerald-900" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
        >
          {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <div className="space-y-6 overflow-hidden">
          <div className="flex items-center gap-3 px-2 pt-1 cursor-pointer" onClick={() => window.location.href = '/'}>
            <Image src="/logo-icon.png" alt="Logo" width={28} height={28} />
            {!sidebarCollapsed && <span className="font-bricolage text-xl font-black text-emerald-500 animate-in fade-in duration-200">farmly</span>}
          </div>

          {!sidebarCollapsed && (
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 block animate-in fade-in duration-200">
              Vendor Navigation
            </span>
          )}
          
          <nav className="space-y-1.5">
            {navTabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === tab.id ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md" : "text-zinc-400 hover:bg-emerald-950/20"}`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate animate-in fade-in duration-200">{tab.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t dark:border-emerald-950/40 border-zinc-100 overflow-hidden">
          <div className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? "bg-[#031407]/40 border-emerald-950/50" : "bg-zinc-50 border-zinc-100"}`}>
            <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {(vendorName || "Vendor").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1 animate-in fade-in duration-200">
                <p className="text-xs font-bold truncate leading-tight">{vendorName || "Commercial Farm"}</p>
                <span className="text-[9px] uppercase font-bold text-emerald-400">Commercial Node</span>
              </div>
            )}
          </div>

          <button onClick={() => { window.location.href = '/'; toast.success("Exited vendor matrix"); }} className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!sidebarCollapsed && <span className="animate-in fade-in duration-200">Exit Dashboard</span>}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE BOTTOM NAV */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex justify-around items-center p-2 backdrop-blur-xl ${isDark ? "bg-[#010602]/90 border-emerald-950/80 text-zinc-300" : "bg-white/90 border-zinc-200 text-zinc-600"}`}>
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === tab.id ? "text-emerald-500 font-bold scale-105" : "hover:text-emerald-400"}`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className={`p-4 md:p-5 border-b flex items-center justify-between px-6 md:px-8 sticky top-0 z-45 backdrop-blur-xl ${isDark ? "bg-[#020b05]/80 border-emerald-950/40" : "bg-white/80 border-zinc-200"}`}>
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
              <Image src="/logo-icon.png" alt="Logo" width={24} height={24} />
              <span className="font-bricolage text-lg font-black text-emerald-500">farmly</span>
            </div>
            <div className="hidden md:block">
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Vendor Control Portal</span>
              <h2 className="font-bricolage text-lg md:text-xl font-extrabold tracking-tight capitalize mt-0.5">Commercial Matrix: {vendorName || "Ogbomosho Commercial Farms"}</h2>
            </div>
          </div>
          
          <button onClick={() => window.location.href = '/'} className="px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer">
            Back to Marketplace
          </button>
        </header>

        <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className={`p-5 sm:p-6 border rounded-2xl ${isDark ? "bg-gradient-to-br from-[#031508] to-[#010903] border-emerald-950/60" : "bg-white border-zinc-200"}`}>
                  <p className="text-[10px] uppercase text-zinc-400 font-extrabold tracking-wider">Gross Sales Turnover</p>
                  <h3 className="text-2xl sm:text-3xl font-bricolage font-black text-emerald-500 mt-2">₦{totalRevenueLogged.toLocaleString()}</h3>
                </div>
                <div className={`p-5 sm:p-6 border rounded-2xl ${isDark ? "bg-gradient-to-br from-[#031508] to-[#010903] border-emerald-950/60" : "bg-white border-zinc-200"}`}>
                  <p className="text-[10px] uppercase text-zinc-400 font-extrabold tracking-wider">Active Catalog SKUs</p>
                  <h3 className="text-2xl sm:text-3xl font-bricolage font-black mt-2">{products.length} Items</h3>
                </div>
                <div className={`p-5 sm:p-6 border rounded-2xl sm:col-span-2 lg:col-span-1 ${isDark ? "bg-gradient-to-br from-[#031508] to-[#010903] border-emerald-950/60" : "bg-white border-zinc-200"}`}>
                  <p className="text-[10px] uppercase text-zinc-400 font-extrabold tracking-wider">Peak Velocity</p>
                  <h3 className="text-2xl sm:text-3xl font-bricolage font-black text-amber-500 mt-2">{highestRevenueMonth.month}</h3>
                </div>
              </div>
            </div>
          )}

          {activeTab === "add_product" && (
            <div className="grid gap-8 lg:grid-cols-5 items-start animate-in fade-in duration-200">
              <div className={`lg:col-span-2 border rounded-2xl p-6 ${isDark ? "bg-[#010803]/80 border-emerald-950/60" : "bg-white border-zinc-200"}`}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bricolage text-base font-extrabold">{editingId ? "Update Crop Asset" : "Initialize Crop Asset"}</h4>
                  {editingId && <button onClick={handleCancelEdit} className="text-xs text-rose-400 hover:underline cursor-pointer">Cancel Edit</button>}
                </div>
                <p className="text-xs text-zinc-400 mb-6">Upload verified crop data directly to the marketplace core directory.</p>
                
                <form onSubmit={handleVendorFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Produce Name</label>
                    <input type="text" required placeholder="Red Sweet Tomatoes" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none dark:border-emerald-950 bg-emerald-950/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Wholesale Price (₦)</label>
                      <input type="number" required placeholder="15000" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none dark:border-emerald-950 bg-emerald-950/10" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Unit Pack</label>
                      <input type="text" placeholder="Crate" value={formData.stockUnit} onChange={(e) => setFormData({...formData, stockUnit: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none dark:border-emerald-950 bg-emerald-950/10" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Farm / Dispatch Location</label>
                    <div className="relative">
                      <MapPin className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-emerald-500" />
                      <input type="text" required placeholder="e.g. Ogbomosho Farm Complex" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-xs outline-none dark:border-emerald-950 bg-emerald-950/10 font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400">Product Image (Upload from Device)</label>
                    <label className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed text-xs font-bold cursor-pointer transition-all ${isDark ? "border-emerald-900 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400" : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700"}`}>
                      <Upload className="w-4 h-4" /> Choose File from Device
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    {formData.imageUrl && (
                      <div className="relative mt-2 h-28 w-full rounded-xl overflow-hidden border border-emerald-500/30 bg-zinc-900 flex items-center justify-center">
                        <img src={formData.imageUrl} alt="Upload Preview" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))} className="absolute top-2 right-2 h-6 w-6 rounded-full bg-zinc-950/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>

                  <div className={`p-4 rounded-xl border space-y-3 ${isDark ? "border-emerald-950/80 bg-emerald-950/10" : "border-zinc-200 bg-zinc-50"}`}>
                    <label className="block text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Ecosystem Strategy Flags</label>
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={formData.isCluster} onChange={(e) => setFormData({...formData, isCluster: e.target.checked})} className="h-4 w-4 rounded border-emerald-600 text-emerald-600 accent-emerald-600 cursor-pointer" />
                      <span className="text-xs font-semibold">Enable for Cluster Purchase (Crowdfund / Group Split)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={formData.isFlashClearance} onChange={(e) => setFormData({...formData, isFlashClearance: e.target.checked})} className="h-4 w-4 rounded border-amber-600 text-amber-600 accent-amber-600 cursor-pointer" />
                      <span className="text-xs font-semibold text-amber-400">Flash Clearance / Rapid Yield</span>
                    </label>
                  </div>

                  <button type="submit" className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-sm text-white shadow-md cursor-pointer transition-all">
                    {editingId ? "Save Changes" : "Deploy Harvest Live"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <div className="relative"><Search className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-zinc-500" /><input type="text" placeholder="Search product indices..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full rounded-xl border py-3 pl-11 pr-4 text-xs outline-none dark:border-emerald-950 bg-emerald-950/10" /></div>
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).map((p) => (
                    <div key={p.id} className={`p-4 border rounded-2xl flex items-center justify-between gap-4 ${editingId === p.id ? "border-emerald-500 bg-emerald-500/5" : isDark ? "bg-[#031206]/30 border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="h-12 w-12 rounded-xl overflow-hidden relative shrink-0 bg-zinc-800">
                          {p.image && (p.image.startsWith("http") || p.image.startsWith("data:")) ? (
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-2xl">{p.image || "📦"}</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-sm truncate">{p.name}</h5>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">₦{p.price.toLocaleString()} • {p.location || "Ogbomosho Farm Complex"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button onClick={() => handleStartEdit(p)} className="p-2 text-zinc-400 hover:text-emerald-400 rounded-xl transition-all cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => { deleteProduct(p.id); toast.success("Product removed"); }} className="p-2 text-zinc-400 hover:text-red-400 rounded-xl transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <div className="py-12 text-center text-zinc-500 text-xs">No active products found. Initialize a crop asset on the left.</div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === "active_orders" && (
            <div className="space-y-4 max-w-4xl animate-in fade-in duration-200">
              {orders.map((o) => (
                <div key={o.id} className={`p-5 border rounded-2xl flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center ${isDark ? "bg-[#010903]/80 border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-500">{o.id}</span>
                    <h4 className="font-extrabold text-base pt-0.5">{o.items}</h4>
                    <p className="text-xs text-zinc-400">Buyer: {o.buyer}</p>
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">{o.status}</span>
                </div>
              ))}
              {orders.length === 0 && <div className="py-12 text-center text-zinc-500 text-xs">No active orders found.</div>}
            </div>
          )}

          {/* VENDOR FEEDBACK LOGS (SHOWS REAL REVIEWS) */}
          {activeTab === "complaints" && (
            <div className="max-w-4xl space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-bricolage text-2xl font-black">Consumer Feedback Logs</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Real-time reviews and ratings submitted by consumers across your commercial nodes.</p>
              </div>

              <div className="space-y-4 pt-2">
                {reviews.map((r, idx) => (
                  <div key={idx} className={`p-5 border rounded-2xl space-y-3 ${isDark ? "bg-[#010903]/80 border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zinc-200">{r.name}</span>
                      <div className="flex text-amber-500">{[...Array(r.stars)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}</div>
                    </div>
                    <p className="text-xs text-zinc-400 italic leading-relaxed">"{r.comment}"</p>
                    <span className="block text-[9px] text-zinc-500 uppercase font-black tracking-widest font-mono">{r.date} • Verified Consumer Evaluation Log</span>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="py-16 text-center space-y-2 border border-dashed rounded-2xl dark:border-emerald-950">
                    <p className="font-bold text-sm text-zinc-400">No consumer reviews logged yet.</p>
                    <p className="text-xs text-zinc-500">Reviews submitted by buyers in the consumer portal will show up here instantly.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}