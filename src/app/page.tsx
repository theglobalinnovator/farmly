// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sun, Moon, Search, ShoppingCart, User, LogOut, ArrowRight, ArrowLeft,
  MapPin, Star, Shield, Users, Layers, TrendingUp, Sparkles, X, 
  ArrowLeftRight, LayoutDashboard, Mail, Globe, ShieldCheck, Trash2, SlidersHorizontal, Navigation, Heart
} from "lucide-react";
import { useApp, Product } from "./context/AppContext";

function RotatingTypingText() {
  const words = ["Verified Fresh.", "Delivered Direct."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 40 : 80;
    
    if (!isDeleting && currentText === fullWord) {
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timer = setTimeout(() => {
        setCurrentText(
          isDeleting 
            ? fullWord.substring(0, currentText.length - 1)
            : fullWord.substring(0, currentText.length + 1)
        );
      }, typingSpeed);
    }
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <span className="relative inline-block min-w-[280px] sm:min-w-[400px] text-left">
      <span className="bg-gradient-to-r bg-clip-text text-transparent from-emerald-600 via-emerald-500 to-teal-500 dark:from-emerald-400 dark:via-emerald-400 dark:to-teal-300">
        {currentText}
      </span>
      <span className="absolute -mr-1 inline-block w-[3px] h-[80%] bottom-2 ml-1 bg-emerald-500 animate-pulse" />
    </span>
  );
}

function ScrollRevealSection({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const {
    theme, setTheme, userRole, setUserRole, userName, vendorName, setVendorName,
    showVendorLoginModal, setShowVendorLoginModal, products,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, favorites, toggleFavorite,
    reviews
  } = useApp();

  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [howItWorksIndex, setHowItWorksIndex] = useState(0);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = theme === "dark";

  const howItWorksSlides = [
    {
      title: "1. Overwhelmed & Volatile Markets",
      desc: "Navigating noisy open markets eats up critical daytime production blocks and subjects your budget to unstructured inflation spikes.",
      illustration: <Layers className="w-12 h-12 text-emerald-800 dark:text-emerald-400" />
    },
    {
      title: "2. Launch a Fractional Cluster",
      desc: "Select institutional scale lots on Farmly. Secure customized micro-portions cleanly while automatically distributing base wholesale costs among a collaborative peer group.",
      illustration: <Users className="w-12 h-12 text-emerald-800 dark:text-emerald-400" />
    },
    {
      title: "3. Escrow Protected Logistics",
      desc: "Your capital balances rest inside secure escrow configurations. Raw harvests transfer seamlessly from automated commercial complexes straight to targeted hubs.",
      illustration: <Shield className="w-12 h-12 text-emerald-800 dark:text-emerald-400" />
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setHowItWorksIndex((prev) => (prev + 1) % howItWorksSlides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [howItWorksSlides.length]);

  if (!mounted) return null;

  const cartItemsCount = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const cartTotalSum = cart ? cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) : 0;

  // Filter products based on search query
  const filteredProducts = products ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];
  
  const featuredProducts = filteredProducts.slice(0, 4);
  const recentlyAddedProducts = [...filteredProducts].reverse().slice(0, 4);

  const handleAddToCart = (p: Product) => {
    if (userRole === "guest") {
      window.location.href = '/auth';
      return;
    }
    addToCart(p);
  };

  return (
    <div className={`min-h-screen flex flex-col overflow-x-hidden transition-all duration-300 antialiased font-sans ${isDark ? "bg-[#020b05] text-zinc-100" : "bg-zinc-50/70 text-zinc-900"}`}>

      {/* STICKY MASTER HEADER NAVBAR */}
      <nav className={`border-b sticky top-0 z-50 transition-colors backdrop-blur-xl ${isDark ? "border-emerald-900/30 bg-[#020b05]/90" : "border-zinc-200/80 bg-white/90"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSearchQuery(""); setShowAllProducts(false); }}>
            <Image src="/logo-icon.png" alt="Logo" width={32} height={32} />
            <span className="font-bricolage text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">farmly</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setTheme(isDark ? "light" : "dark")} className={`p-2.5 rounded-xl transition-all border ${isDark ? "border-emerald-900/40 text-emerald-400 hover:bg-emerald-950/40" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* CART ICON IN NAVBAR */}
            <button onClick={() => setCartOpen(true)} className={`relative p-2.5 rounded-xl transition-all border cursor-pointer ${isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-900/30 hover:bg-emerald-950/50" : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200"}`} title="Open Shopping Basket">
              <ShoppingCart className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-amber-500 text-white rounded-md text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {userRole === "guest" ? (
              <button onClick={() => { window.location.href = '/auth'; }} className="rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:brightness-110 transition-all cursor-pointer">Sign Up / Login</button>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-sm font-bold text-white shadow-md ring-2 ring-white dark:ring-emerald-950 hover:scale-105 transition-all cursor-pointer z-50"
                >
                  {(userRole === "vendor" && vendorName ? vendorName : userName).split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 w-screen h-screen z-40 bg-transparent cursor-default" onClick={() => setDropdownOpen(false)} />
                    
                    <div className={`absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border p-3 shadow-xl z-50 ${isDark ? "border-emerald-900 bg-[#052215]" : "border-zinc-200 bg-white"}`}>
                      <div className={`px-2 py-2 border-b pb-3 ${isDark ? "border-emerald-900/50" : "border-zinc-100"}`}>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Active Account Node</p>
                        <p className={`font-bold truncate text-sm mt-0.5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                          {userRole === "vendor" ? (vendorName || "Commercial Farm") : userName}
                        </p>
                        <span className={`inline-block mt-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${isDark ? "bg-emerald-950 text-emerald-400 border border-emerald-800/30" : "bg-zinc-100 text-zinc-600 border border-zinc-200"}`}>Role: {userRole}</span>
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <button 
                          onClick={() => { 
                            if (userRole === "guest") {
                              window.location.href = '/auth';
                            } else {
                              window.location.href = userRole === "vendor" ? "/vendor" : "/consumer"; 
                            }
                          }} 
                          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold ${isDark ? "text-zinc-300 hover:bg-emerald-950/50" : "text-zinc-700 hover:bg-zinc-100"}`}
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-500" /> Go to Dashboard
                        </button>

                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            if (userRole === "vendor") {
                              setUserRole("consumer");
                              window.location.href = "/consumer";
                            } else {
                              if (!vendorName) {
                                setShowVendorLoginModal(true);
                              } else {
                                setUserRole("vendor");
                                window.location.href = "/vendor";
                              }
                            }
                          }}
                          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold ${isDark ? "text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/50" : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100"}`}
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" /> 
                          {userRole === "vendor" ? "Switch to Consumer Portal" : "Switch to Vendor Portal"}
                        </button>

                        <hr className={isDark ? "border-emerald-900/50 my-1" : "border-zinc-100 my-1"} />
                        <button onClick={() => { setUserRole("guest"); setDropdownOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400">
                          <LogOut className="w-4 h-4" /> Log Out Terminal
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* PUBLIC MARKETING CANVAS */}
      <div className="w-full flex flex-col flex-1">
        <section className="text-center py-20 px-6 max-w-4xl mx-auto space-y-8">
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold border ${isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}>
            <Sparkles className="w-3.5 h-3.5" /> Direct Crop Wholesaling Logistics & Escrow Protect Pipeline
          </span>
          <h1 className={`font-bricolage text-5xl md:text-8xl font-extrabold tracking-tight leading-[1.1] ${isDark ? "text-white" : "text-zinc-900"}`}>
            Wholesale Produce.<br />
            <RotatingTypingText />
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Skip volatile unverified open retail inflation vectors. Secure bulk harvest bundles straight from commercial zones with crowdfunding cluster modules or split portion locks.
          </p>

          {/* SEARCH BAR & ALL PRODUCTS TOGGLE BUTTON */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 pt-4">
            <div className={`relative flex-1 w-full rounded-2xl border shadow-lg ${isDark ? "bg-[#010803]/90 border-emerald-950" : "bg-white border-zinc-200"}`}>
              <Search className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search products by name..." 
                value={searchQuery} 
                onChange={(e) => { setSearchQuery(e.target.value); setShowAllProducts(false); }} 
                className="w-full pl-11 pr-4 py-3.5 bg-transparent text-xs outline-none font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-4 my-auto text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button 
              onClick={() => { setShowAllProducts(!showAllProducts); setSearchQuery(""); }} 
              className={`px-6 py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${showAllProducts ? "bg-emerald-600 text-white border-emerald-500 shadow-md" : isDark ? "bg-emerald-950/30 border-emerald-900 text-emerald-400 hover:bg-emerald-900/40" : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200"}`}
            >
              {showAllProducts ? "Showing All" : "All Products"}
            </button>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button onClick={() => { 
              if (userRole === "guest") window.location.href = '/auth'; 
              else window.location.href = userRole === "vendor" ? "/vendor" : "/consumer"; 
            }} className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-xl text-white text-sm font-bold shadow-lg shadow-emerald-500/10 cursor-pointer">
              Enter Execution Hub <ArrowRight className="w-4 h-4 inline-block ml-1" />
            </button>
          </div>
        </section>

        {/* ALL PRODUCTS VIEW OR SEARCH RESULTS */}
        {showAllProducts || searchQuery ? (
          <ScrollRevealSection id="all-products-view">
            <div className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200/50 dark:border-emerald-950/40 w-full">
              <div className="mb-8 flex justify-between items-center">
                <h3 className="font-bricolage text-2xl font-extrabold">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "Complete Available Inventory"}
                </h3>
                <button onClick={() => { setShowAllProducts(false); setSearchQuery(""); }} className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer">
                  Clear Filter
                </button>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredProducts.map(p => {
                    const isFav = favorites.includes(p.id);
                    return (
                      <div key={p.id} className={`p-4 border rounded-2xl relative ${isDark ? "bg-[#010803]/80 border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                        <div className="h-36 rounded-xl bg-zinc-50 dark:bg-emerald-950/20 flex items-center justify-center overflow-hidden relative">
                          {p.image && (p.image.startsWith("http") || p.image.startsWith("data:")) ? (
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-4xl">{p.image || "📦"}</span>
                          )}
                          <button 
                            onClick={() => toggleFavorite(p.id)} 
                            className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-all ${isFav ? "bg-rose-500 text-white" : "bg-zinc-950/60 text-zinc-300 hover:text-white"}`}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                          </button>
                          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
                            {p.isCluster && <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-white shadow-md">Cluster</span>}
                            {p.tag === "distress" && <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-zinc-950 shadow-md">Clearance</span>}
                          </div>
                        </div>
                        <h4 className="font-bold text-sm truncate mt-3">{p.name}</h4>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-500" /> {p.location || "Ogbomosho Farm Complex"}</p>
                        <div className="flex flex-col gap-2 mt-3 pt-2 border-t dark:border-emerald-950/20">
                          <span className="font-mono font-black text-emerald-500 text-sm">₦{p.price.toLocaleString()}</span>
                          <button onClick={() => handleAddToCart(p)} className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all">Add to Cart</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-24 text-center space-y-3">
                  <p className="font-bricolage text-2xl font-black text-zinc-300">So Sorry, this Product is not Available For now</p>
                  <p className="text-xs text-zinc-500">Try searching for another produce item or check back later when vendors restock.</p>
                  <button onClick={() => { setSearchQuery(""); setShowAllProducts(false); }} className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer">
                    View Available Catalog
                  </button>
                </div>
              )}
            </div>
          </ScrollRevealSection>
        ) : (
          <>
            {/* FEATURED PRODUCTS */}
            <ScrollRevealSection id="featured-products">
              <div className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200/50 dark:border-emerald-950/40 w-full">
                <div className="mb-8"><h3 className="font-bricolage text-2xl font-extrabold">Featured Harvest Batches</h3></div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {featuredProducts.map(p => {
                    const isFav = favorites.includes(p.id);
                    return (
                      <div key={p.id} className={`p-4 border rounded-2xl relative ${isDark ? "bg-[#010803]/80 border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                        <div className="h-36 rounded-xl bg-zinc-50 dark:bg-emerald-950/20 flex items-center justify-center overflow-hidden relative">
                          {p.image && (p.image.startsWith("http") || p.image.startsWith("data:")) ? (
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-4xl">{p.image || "📦"}</span>
                          )}
                          <button 
                            onClick={() => toggleFavorite(p.id)} 
                            className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-all ${isFav ? "bg-rose-500 text-white" : "bg-zinc-950/60 text-zinc-300 hover:text-white"}`}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                          </button>
                          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
                            {p.isCluster && <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-white shadow-md">Cluster</span>}
                            {p.tag === "distress" && <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-zinc-950 shadow-md">Clearance</span>}
                          </div>
                        </div>
                        <h4 className="font-bold text-sm truncate mt-3">{p.name}</h4>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-500" /> {p.location || "Ogbomosho Farm Complex"}</p>
                        <div className="flex flex-col gap-2 mt-3 pt-2 border-t dark:border-emerald-950/20">
                          <span className="font-mono font-black text-emerald-500 text-sm">₦{p.price.toLocaleString()}</span>
                          <button onClick={() => handleAddToCart(p)} className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all">Add to Cart</button>
                        </div>
                      </div>
                    );
                  })}
                  {featuredProducts.length === 0 && <div className="col-span-full py-12 text-center text-zinc-500 text-xs">No active harvest batches available. Visit the vendor portal to deploy inventory.</div>}
                </div>
              </div>
            </ScrollRevealSection>

            {/* RECENTLY ADDED */}
            <ScrollRevealSection id="recently-added">
              <div className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200/50 dark:border-emerald-950/40 w-full">
                <div className="mb-8"><h3 className="font-bricolage text-2xl font-extrabold">Recently Uploaded Influx</h3></div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {recentlyAddedProducts.map(p => {
                    const isFav = favorites.includes(p.id);
                    return (
                      <div key={p.id} className={`p-4 border rounded-2xl relative ${isDark ? "bg-[#010803]/80 border-emerald-950/50" : "bg-white border-zinc-200"}`}>
                        <div className="h-36 rounded-xl bg-zinc-50 dark:bg-emerald-950/20 flex items-center justify-center overflow-hidden relative">
                          {p.image && (p.image.startsWith("http") || p.image.startsWith("data:")) ? (
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-4xl">{p.image || "📦"}</span>
                          )}
                          <button 
                            onClick={() => toggleFavorite(p.id)} 
                            className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-all ${isFav ? "bg-rose-500 text-white" : "bg-zinc-950/60 text-zinc-300 hover:text-white"}`}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                          </button>
                          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
                            {p.isCluster && <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-white shadow-md">Cluster</span>}
                            {p.tag === "distress" && <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-zinc-950 shadow-md">Clearance</span>}
                          </div>
                        </div>
                        <h4 className="font-bold text-sm truncate mt-3">{p.name}</h4>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-500" /> {p.location || "Ogbomosho Farm Complex"}</p>
                        <div className="flex flex-col gap-2 mt-3 pt-2 border-t dark:border-emerald-950/20">
                          <span className="font-mono font-black text-emerald-500 text-sm">₦{p.price.toLocaleString()}</span>
                          <button onClick={() => handleAddToCart(p)} className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all">Add to Cart</button>
                        </div>
                      </div>
                    );
                  })}
                  {recentlyAddedProducts.length === 0 && <div className="col-span-full py-12 text-center text-zinc-500 text-xs">No influx items available.</div>}
                </div>
              </div>
            </ScrollRevealSection>
          </>
        )}

        {/* CONSUMER REVIEWS SECTION (DYNAMIC & NON-DUPLICATED) */}
        {reviews && reviews.length > 0 && (
          <ScrollRevealSection id="customer-reviews-section">
            <div className={`py-20 px-6 border-t overflow-hidden ${isDark ? "bg-[#010602] border-emerald-950/60" : "bg-zinc-100 border-zinc-200"}`}>
              <div className="max-w-7xl mx-auto space-y-10">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">Transparency Logs</span>
                  <h3 className="font-bricolage text-3xl font-black">Consumer Satisfaction & Feedback</h3>
                  <p className="text-xs text-zinc-400 max-w-xl mx-auto">Real-time testimonials shared directly by verified buyers across our wholesale fulfillment network.</p>
                </div>

                <div className="relative w-full overflow-hidden py-4">
                  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
                    {reviews.map((r, i) => (
                      <div 
                        key={i} 
                        className={`w-80 p-6 border rounded-3xl space-y-3 shadow-xl shrink-0 ${isDark ? "bg-[#031508]/90 border-emerald-950/60" : "bg-white border-zinc-200"}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{r.name}</span>
                          <div className="flex text-amber-500">
                            {[...Array(r.stars)].map((_, idx) => (
                              <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 italic leading-relaxed">"{r.comment}"</p>
                        <span className="block text-[9px] text-zinc-500 font-mono">{r.date} • Verified Purchase</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollRevealSection>
        )}

        {/* HOW IT WORKS */}
        <ScrollRevealSection id="how-it-works">
          <div className={`py-20 border-y ${isDark ? "bg-[#010602] border-emerald-950/60" : "bg-zinc-50 border-zinc-200"}`}>
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h2 className="font-bricolage text-3xl font-black">Framework Operations Pipeline</h2>
              <div className={`relative mt-12 overflow-hidden rounded-3xl px-8 py-10 flex flex-col justify-center h-64 border ${isDark ? "bg-[#041208]/40 border-emerald-900/30" : "bg-white border-zinc-200"}`}>
                <AnimatePresence mode="wait">
                  <motion.div key={howItWorksIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center w-full">
                    <div className="mb-4">{howItWorksSlides[howItWorksIndex].illustration}</div>
                    <h4 className="font-bricolage text-base font-bold text-emerald-400">{howItWorksSlides[howItWorksIndex].title}</h4>
                    <p className="text-zinc-400 text-xs mt-2 max-w-md leading-relaxed">{howItWorksSlides[howItWorksIndex].desc}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </ScrollRevealSection>
      </div>

      {/* CORPORATE FOOTER */}
      <footer className={`border-t py-16 px-6 mt-20 ${isDark ? "border-emerald-950/60 bg-[#010602] text-zinc-300" : "border-zinc-200 bg-white text-zinc-600"}`}>
        <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4 items-start">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <Image src="/logo-icon.png" alt="Logo" width={24} height={24} />
              <span className="font-bricolage text-xl font-bold tracking-tight text-emerald-500">farmly</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Decentralized commercial wholesale logistics framework optimizing bulk crop distribution securely.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">Ecosystem Links</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#featured-products" className="hover:text-emerald-400 transition-colors">Featured Catalog</a></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">Cluster Logistics</a></li>
              <li><a href="#recently-added" className="hover:text-emerald-400 transition-colors">Recent Influx</a></li>
              {reviews && reviews.length > 0 && <li><a href="#customer-reviews-section" className="hover:text-emerald-400 transition-colors">Testimonials</a></li>}
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">Compliance & Trust</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Escrow Protected Loops</li>
              <li className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-500" /> Regional Commercial Nodes</li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-1">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">Freshness Log Subscription</h5>
            <p className="text-xs text-zinc-400">Receive weekly wholesale yield pricing reports.</p>
            <div className="flex gap-2 pt-1">
              <input type="email" placeholder="business@domain.com" className="flex-1 p-2.5 rounded-xl border text-xs bg-transparent dark:border-emerald-950/80 outline-none" />
              <button onClick={() => alert("Subscribed successfully!")} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t dark:border-emerald-950/40 border-zinc-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-500 font-mono">
          <p>&copy; 2026 Farmly. Built by **DInnovators Team**. All Rights Reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="hover:underline cursor-pointer">Privacy Protocol</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* INDEPENDENT VENDOR LOGIN MODAL */}
      <AnimatePresence>
        {showVendorLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md rounded-3xl p-8 shadow-2xl border ${isDark ? "bg-[#010803] border-emerald-900" : "bg-white border-zinc-200"}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bricolage text-2xl font-extrabold tracking-tight">Commercial Vendor Access</h3>
                  <p className="text-xs text-zinc-400 mt-1">Provide your independent business credentials to initialize your vendor matrix.</p>
                </div>
                <button onClick={() => setShowVendorLoginModal(false)} className="text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const inputVal = (e.currentTarget.elements.namedItem("bizName") as HTMLInputElement).value;
                if (inputVal) {
                  setVendorName(inputVal);
                  setUserRole("vendor");
                  setShowVendorLoginModal(false);
                  window.location.href = "/vendor";
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Business / Farm Name *(Isolated to Vendor Dashboard)*</label>
                  <input type="text" name="bizName" required placeholder="e.g. GreenValley Agro-Allied Ltd" defaultValue={vendorName} className={`w-full p-3 rounded-xl border text-xs outline-none ${isDark ? "border-emerald-800 bg-emerald-950/20 text-emerald-300" : "border-emerald-300 bg-emerald-50 text-emerald-900"}`} />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer">
                  Launch Vendor Portal Dashboard
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/40 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setCartOpen(false)} />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 220 }} 
              className={`relative w-full max-w-md h-screen border-l p-6 flex flex-col justify-between shadow-2xl overflow-hidden max-sm:h-[80%] max-sm:absolute max-sm:bottom-0 max-sm:rounded-t-3xl border-zinc-200 dark:border-emerald-950/60
                ${isDark ? "bg-[#010703] text-zinc-100" : "bg-white text-zinc-900"}`}
            >
              <div className="space-y-6 flex-1 flex flex-col min-h-0">
                <div className={`flex justify-between items-center pb-3 border-b ${isDark ? "border-emerald-950/40" : "border-zinc-200"}`}>
                  <h4 className="font-bricolage text-base font-bold flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-emerald-500" /> Active Basket Registry</h4>
                  <button onClick={() => setCartOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {cart && cart.map(item => (
                    <div key={item.product.id} className={`p-3 border rounded-xl flex justify-between items-center gap-3 ${isDark ? "bg-zinc-500/5 border-emerald-950/20" : "bg-zinc-50 border-zinc-200"}`}>
                      <div className="h-12 w-12 rounded-lg overflow-hidden relative shrink-0 bg-zinc-800">
                        {item.product.image && (item.product.image.startsWith("http") || item.product.image.startsWith("data:")) ? (
                          <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xl">{item.product.image || "📦"}</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-xs truncate">{item.product.name}</h5>
                        <p className="text-xs font-mono font-bold text-emerald-500 mt-0.5">₦{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-500/10">
                          <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="h-5 w-5 rounded bg-white dark:bg-emerald-950 text-xs font-bold font-mono cursor-pointer flex items-center justify-center">-</button>
                          <span className="text-xs font-bold w-4 text-center font-mono">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="h-5 w-5 rounded bg-white dark:bg-emerald-950 text-xs font-bold font-mono cursor-pointer flex items-center justify-center">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer" title="Remove item"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {(!cart || cart.length === 0) && <div className="py-20 text-center text-zinc-500 text-xs font-medium">Your shopping basket is empty.</div>}
                </div>
              </div>
              <div className={`pt-4 border-t space-y-4 ${isDark ? "border-emerald-950/40" : "border-zinc-200"}`}>
                <div className="flex justify-between items-center text-sm font-bold"><span>Subtotal Amount:</span><span className="text-emerald-500 font-bricolage text-lg font-black font-mono">₦{cartTotalSum.toLocaleString()}</span></div>
                <button disabled={!cart || cart.length === 0} onClick={() => { alert("Checkout Authorized!"); clearCart(); setCartOpen(false); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer transition-all">Authorize Checkout Transaction</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}