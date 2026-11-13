// src/app/consumer/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, ShoppingBag, Users, Heart, Star, ChevronLeft, ChevronRight, 
  LogOut, ShoppingCart, MapPin, Truck, CheckCircle2, ShieldCheck, Search, Trash2, X, Plus, Minus, Navigation
} from "lucide-react";
import { useApp, Product } from "../context/AppContext";
import toast, { Toaster } from "react-hot-toast";

export default function ConsumerDashboard() {
  const {
    theme, setTheme, userName, setUserRole, products, orders, favorites, 
    toggleFavorite, addToCart, cart, updateCartQuantity, removeFromCart, clearCart,
    reviews, addReview
  } = useApp();

  const [activeTab, setActiveTab] = useState("tracking");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [consumerLocation, setConsumerLocation] = useState<string>("Detecting GPS...");
  const [nearYouFilter, setNearYouFilter] = useState(false);

  // Review State
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewStars, setNewReviewStars] = useState(5);

  const [selectedClusterProduct, setSelectedClusterProduct] = useState<Product | null>(null);
  const [clusterSlots, setClusterSlots] = useState(1);

  const isDark = theme === "dark";
  const cartItemsCount = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const cartTotalSum = cart ? cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) : 0;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.state_district || data.address?.state || "Ogbomosho Central Node";
            setConsumerLocation(city);
          } catch (err) {
            setConsumerLocation("Ogbomosho Farm Complex");
          }
        },
        () => setConsumerLocation("Ogbomosho Farm Complex"),
        { timeout: 10000 }
      );
    } else {
      setConsumerLocation("Ogbomosho Farm Complex");
    }
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    const prodLoc = (p.location || "Ogbomosho Farm Complex").toLowerCase();
    const consumerLocClean = consumerLocation.toLowerCase();
    const matchesProximity = !nearYouFilter || prodLoc.includes("ogbomosho") || prodLoc.includes("ilorin") || prodLoc.includes(consumerLocClean.split(" ")[0]);
    return matchesSearch && matchesProximity;
  });

  const navTabs = [
    { id: "tracking", label: "Order Tracking", icon: Clock },
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "clusters", label: "Cluster Pools", icon: Users },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "rating", label: "Reviews", icon: Star }
  ];

  // Dynamic order manifests populated from active products if available
  const dynamicOrders = orders && orders.length > 0 ? orders : products.slice(0, 3).map((p, idx) => ({
    id: `ORD-99${idx}1`,
    items: `${p.name} x1`,
    status: (idx === 0 ? "Processing" : idx === 1 ? "In-Transit" : "Verified") as any,
    buyer: userName
  }));

  const handleClusterAddToCart = () => {
    if (!selectedClusterProduct) return;
    const baseFractionPrice = selectedClusterProduct.price / 4;
    const finalCustomPrice = baseFractionPrice * clusterSlots;

    const customClusterItem: Product = {
      ...selectedClusterProduct,
      id: selectedClusterProduct.id + "_cluster_" + Date.now(),
      name: `${selectedClusterProduct.name} (Cluster Pool: ${clusterSlots} Slot${clusterSlots > 1 ? "s" : ""})`,
      price: finalCustomPrice
    };

    addToCart(customClusterItem);
    setSelectedClusterProduct(null);
    setClusterSlots(1);
    setCartOpen(true);
    toast.success("Cluster lot secured in basket!");
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
              Navigation
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
              {userName.split(" ").map(n => n[0]).join("")}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1 animate-in fade-in duration-200">
                <p className="text-xs font-bold truncate leading-tight">{userName}</p>
                <span className="text-[9px] uppercase font-bold text-emerald-400 flex items-center gap-1 mt-0.5 truncate"><MapPin className="w-2.5 h-2.5 shrink-0" /> {consumerLocation}</span>
              </div>
            )}
          </div>

          <button onClick={() => { window.location.href = '/'; toast.success("Exited consumer portal"); }} className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!sidebarCollapsed && <span className="animate-in fade-in duration-200">Exit Dashboard</span>}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE NAV */}
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

      {/* VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className={`p-4 md:p-5 border-b flex items-center justify-between px-6 md:px-8 sticky top-0 z-45 backdrop-blur-xl ${isDark ? "bg-[#020b05]/80 border-emerald-950/40" : "bg-white/80 border-zinc-200"}`}>
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
              <Image src="/logo-icon.png" alt="Logo" width={24} height={24} />
              <span className="font-bricolage text-lg font-black text-emerald-500">farmly</span>
            </div>
            <div className="hidden md:block">
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Consumer Control Portal</span>
              <h2 className="font-bricolage text-xl font-extrabold tracking-tight capitalize mt-0.5">Welcome, {userName}</h2>
            </div>
          </div>
          
          <button onClick={() => setCartOpen(true)} className={`relative p-2.5 md:p-3 rounded-xl transition-all cursor-pointer border ${isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-900/30" : "bg-zinc-100 border-zinc-200 text-zinc-700"}`}>
            <ShoppingCart className="w-4 h-4" />
            {cartItemsCount > 0 && <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 bg-amber-500 text-white rounded-lg text-[10px] font-black flex items-center justify-center">{cartItemsCount}</span>}
          </button>
        </header>

        <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {activeTab === "tracking" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-bricolage text-xl md:text-2xl font-black">Live Transit & Map Tracking</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Real-time telemetry tracking your harvest bundles as they move toward your pickup terminal.</p>
              </div>

              <div className={`border rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-xl ${isDark ? "bg-[#031508]/60 border-emerald-950/60" : "bg-white border-zinc-200"}`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-8 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">Telemetry Active: Route #NG-884</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-400">ETA: 45 Minutes</span>
                </div>

                <div className="relative z-10 py-6 px-2 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-center space-y-1.5">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h5 className="font-bold text-xs">Commercial Farm Complex</h5>
                    <p className="text-[10px] text-zinc-400">Ogbomosho Grid Node</p>
                  </div>

                  <div className="flex-1 w-full max-w-sm px-4 flex flex-col items-center my-2 md:my-0">
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-emerald-950 rounded-full relative overflow-hidden">
                      <motion.div initial={{ width: "0%" }} animate={{ width: "65%" }} transition={{ duration: 1.5, ease: "easeInOut" }} className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-md animate-pulse" />
                      </motion.div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-500 mt-2 text-center">In-Transit (Cold Van Cluster 04)</span>
                  </div>

                  <div className="text-center space-y-1.5">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-md">
                      <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h5 className="font-bold text-xs">Consumer Pickup Terminal ({consumerLocation})</h5>
                    <p className="text-[10px] text-zinc-400">University Central Hub</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-bricolage text-base font-bold">Active Order Manifests</h4>
                {dynamicOrders.map((o) => (
                  <div key={o.id} className={`p-4 sm:p-5 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${isDark ? "bg-[#010803] border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-500">{o.id}</span>
                      <h4 className="font-bold text-sm mt-0.5">{o.items}</h4>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">{o.status}</span>
                  </div>
                ))}
                {dynamicOrders.length === 0 && <div className="py-12 text-center text-zinc-500 text-xs">No active order manifests.</div>}
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
                <div className="relative flex-1 w-full">
                  <Search className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-zinc-500" />
                  <input type="text" placeholder="Search available products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full rounded-xl border py-3 pl-11 pr-4 text-xs outline-none dark:border-emerald-950 bg-emerald-950/10 font-medium" />
                </div>
                <button onClick={() => setNearYouFilter(!nearYouFilter)} className={`px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border shrink-0 ${nearYouFilter ? "bg-emerald-600 text-white border-emerald-500 shadow-md" : isDark ? "bg-emerald-950/30 border-emerald-900 text-emerald-400 hover:bg-emerald-900/40" : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200"}`}>
                  <Navigation className="w-3.5 h-3.5" /> {nearYouFilter ? "Showing Near You" : "📍 Near You"}
                </button>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((p) => {
                  const isFav = favorites.includes(p.id);
                  return (
                    <div key={p.id} className={`p-4 border rounded-2xl relative shadow-2xs flex flex-col justify-between ${isDark ? "bg-[#010803] border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                      <div>
                        <div className="h-36 rounded-xl bg-zinc-900 overflow-hidden relative mb-3">
                          {p.image && (p.image.startsWith("http") || p.image.startsWith("data:")) ? (
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-3xl">{p.image || "📦"}</div>
                          )}
                          <button onClick={() => { toggleFavorite(p.id); toast.success(isFav ? "Removed from favorites" : "Saved to favorites"); }} className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-all ${isFav ? "bg-rose-500 text-white" : "bg-zinc-950/60 text-zinc-300 hover:text-white"}`}>
                            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                          </button>
                        </div>
                        <h4 className="font-bold text-sm mt-2 truncate">{p.name}</h4>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-500" /> {p.location || "Ogbomosho Farm Complex"}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t dark:border-emerald-950/30 flex items-center justify-between">
                        <span className="font-mono font-black text-emerald-500 text-sm">₦{p.price.toLocaleString()}</span>
                        <button onClick={() => { addToCart(p); setCartOpen(true); toast.success(`Added ${p.name} to cart`); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all">Add to Cart</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="py-24 text-center space-y-2">
                  <p className="font-bricolage text-2xl font-black text-zinc-300">No products available at the moment</p>
                  <p className="text-xs text-zinc-500">Wait for vendors to deploy crop inventory into the catalogue.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "clusters" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-200">
              {products.map((p) => {
                const hasCluster = p.isCluster || p.tag === "cluster";
                return (
                  <div key={p.id} className={`p-4 border rounded-2xl relative ${isDark ? "bg-[#010803] border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                    <div className="h-36 rounded-xl bg-zinc-900 overflow-hidden relative mb-3">
                      {p.image && (p.image.startsWith("http") || p.image.startsWith("data:")) ? (
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-3xl">{p.image || "📦"}</div>
                      )}
                    </div>
                    <span className={`absolute top-6 left-6 text-[9px] font-black uppercase px-2 py-0.5 rounded text-white ${hasCluster ? "bg-amber-500" : "bg-zinc-600"}`}>
                      {hasCluster ? `Pool Space: ${p.clusterRemainingPercent || 100}%` : "Not Available"}
                    </span>
                    <h4 className="font-bold text-sm mt-3 truncate">{p.name}</h4>
                    <p className="font-mono font-black text-emerald-500 text-sm mt-1">Fractional Base: ₦{(p.price / 4).toLocaleString()}</p>
                    <button disabled={!hasCluster} onClick={() => { setSelectedClusterProduct(p); setClusterSlots(1); }} className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold ${hasCluster ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" : "bg-zinc-500/10 text-zinc-500 cursor-not-allowed"}`}>
                      Secure Portion Lot
                    </button>
                  </div>
                );
              })}
              {products.length === 0 && <div className="col-span-full py-20 text-center text-zinc-500 text-xs">No active cluster pools available.</div>}
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="grid gap-6 sm:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-200">
              {products.filter(p => favorites.includes(p.id)).map((p) => (
                <div key={p.id} className={`p-4 border rounded-2xl ${isDark ? "bg-[#010803] border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                  <div className="h-32 rounded-xl bg-zinc-900 overflow-hidden relative mb-3">
                    {p.image && (p.image.startsWith("http") || p.image.startsWith("data:")) ? (
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-3xl">{p.image || "📦"}</div>
                    )}
                  </div>
                  <h4 className="font-bold text-sm mt-3 truncate">{p.name}</h4>
                  <p className="font-mono font-bold text-emerald-500 text-xs mt-1">₦{p.price.toLocaleString()}</p>
                  <button onClick={() => { toggleFavorite(p.id); toast.success("Removed from favorites"); }} className="w-full mt-4 py-2 rounded-xl text-[11px] font-bold border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 cursor-pointer">Remove Favorite</button>
                </div>
              ))}
              {favorites.length === 0 && <div className="col-span-full py-20 text-center text-zinc-500 text-xs">No saved favorites found.</div>}
            </div>
          )}

          {/* TAB 5: REVIEWS SUBMISSION FORM */}
          {activeTab === "rating" && (
            <div className={`max-w-xl border rounded-2xl p-6 ${isDark ? "bg-[#010803] border-emerald-950/50" : "bg-white border-zinc-200"}`}>
              <h3 className="font-bricolage text-base font-bold mb-1">Submit Satisfaction Evaluation</h3>
              <p className="text-xs text-zinc-400 mb-6">Your reviews update directly across the public marketplace transparency logs.</p>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setNewReviewStars(s)} className="cursor-pointer text-amber-500">
                      <Star className={`w-5 h-5 ${s <= newReviewStars ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  required 
                  rows={4} 
                  placeholder="Describe service and quality..." 
                  value={newReviewText} 
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full p-3 rounded-xl border text-xs bg-transparent dark:border-emerald-950 outline-none" 
                />
                <button onClick={() => {
                  if (!newReviewText) {
                    toast.error("Please type your review before publishing.");
                    return;
                  }
                  addReview({ name: userName, stars: newReviewStars, comment: newReviewText, date: new Date().toISOString().split('T')[0] });
                  setNewReviewText("");
                  toast.success("Review published successfully! Visible on landing page and vendor logs.");
                }} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-all">
                  Publish Review
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CLUSTER MODAL */}
      <AnimatePresence>
        {selectedClusterProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${isDark ? "bg-[#010803] border-emerald-900 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bricolage text-lg font-bold">Secure Cluster Slots</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{selectedClusterProduct.name}</p>
                </div>
                <button onClick={() => setSelectedClusterProduct(null)} className="text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6 my-4">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? "bg-emerald-950/20 border-emerald-900/40" : "bg-zinc-50 border-zinc-200"}`}>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Fractional Unit Base</span>
                    <span className="font-mono font-bold text-emerald-500 text-sm">₦{(selectedClusterProduct.price / 4).toLocaleString()} / Slot</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setClusterSlots(Math.max(1, clusterSlots - 1))} className="h-8 w-8 rounded-lg bg-zinc-500/10 flex items-center justify-center font-bold hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"><Minus className="w-4 h-4" /></button>
                    <input 
                      type="number" 
                      min="1" 
                      max="4"
                      value={clusterSlots} 
                      onChange={(e) => setClusterSlots(Math.min(4, Math.max(1, parseInt(e.target.value) || 1)))} 
                      className="w-10 text-center font-mono font-bold text-sm bg-transparent border-none focus:outline-none"
                    />
                    <button onClick={() => setClusterSlots(Math.min(4, clusterSlots + 1))} className="h-8 w-8 rounded-lg bg-zinc-500/10 flex items-center justify-center font-bold hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-bold text-zinc-400">Total Proportional Price:</span>
                  <span className="font-bricolage text-xl font-black font-mono text-emerald-500">₦{((selectedClusterProduct.price / 4) * clusterSlots).toLocaleString()}</span>
                </div>
              </div>

              <button onClick={handleClusterAddToCart} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md transition-all">Add Custom Cluster Lot to Cart</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/40 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setCartOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className={`relative w-full max-w-md h-screen border-l p-6 flex flex-col justify-between shadow-2xl z-50 ${isDark ? "bg-[#010703] text-zinc-100 border-emerald-950/60" : "bg-white border-zinc-200"}`}>
              <div className="space-y-6 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center pb-3 border-b dark:border-emerald-950/40">
                  <h4 className="font-bricolage text-base font-bold flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-emerald-500" /> Active Basket Registry</h4>
                  <button onClick={() => setCartOpen(false)} className="text-zinc-400 cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="p-3 border rounded-xl flex justify-between items-center bg-zinc-500/5 dark:border-emerald-950/20">
                      <div className="h-12 w-12 rounded-lg overflow-hidden relative shrink-0 bg-zinc-800 mr-3">
                        {item.product.image && (item.product.image.startsWith("http") || item.product.image.startsWith("data:")) ? (
                          <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xl">{item.product.image || "📦"}</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <h5 className="font-bold text-xs truncate">{item.product.name}</h5>
                        <p className="text-xs font-mono font-bold text-emerald-500 mt-0.5">₦{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className={`flex items-center gap-1.5 p-1 rounded-lg ${isDark ? "bg-zinc-500/10" : "bg-zinc-200/60"}`}>
                          <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="h-5 w-5 rounded bg-white dark:bg-emerald-950 text-xs font-bold font-mono cursor-pointer text-zinc-700 dark:text-zinc-200 flex items-center justify-center">-</button>
                          <input 
                            type="number" 
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              updateCartQuantity(item.product.id, isNaN(val) || val < 1 ? 1 : val);
                            }}
                            className={`w-10 text-center bg-transparent border-none text-xs font-bold font-mono focus:outline-none ${isDark ? "text-zinc-100" : "text-zinc-800"}`}
                          />
                          <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="h-5 w-5 rounded bg-white dark:bg-emerald-950 text-xs font-bold font-mono cursor-pointer text-zinc-700 dark:text-zinc-200 flex items-center justify-center">+</button>
                        </div>
                        <button onClick={() => { removeFromCart(item.product.id); toast.success("Item removed from basket"); }} className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && <div className="py-20 text-center text-zinc-500 text-xs">Your basket is empty.</div>}
                </div>
              </div>
              <div className="pt-4 border-t dark:border-emerald-950/40 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold"><span>Subtotal:</span><span className="text-emerald-500 font-mono text-base">₦{cartTotalSum.toLocaleString()}</span></div>
                <button disabled={cart.length === 0} onClick={() => { toast.success("Checkout Authorized Successfully!"); clearCart(); setCartOpen(false); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer">Authorize Checkout</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}