// src/app/auth/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuthPage() {
  const { theme, setUserRole, setUserName, setVendorName } = useApp();
  const [role, setRole] = useState<"consumer" | "vendor">("consumer");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");

  const isDark = theme === "dark";

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(role);

    if (role === "vendor") {
      setVendorName(businessName || name || "Ogbomosho Commercial Farms");
      window.location.href = "/vendor";
    } else {
      setUserName(name || "Oladimeji Isaac");
      window.location.href = "/consumer";
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden ${isDark ? "bg-[#020b05] text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Return to Marketplace Landing
        </button>

        <div className={`border rounded-3xl p-8 shadow-2xl backdrop-blur-xl ${isDark ? "bg-[#010803]/80 border-emerald-950/80 shadow-emerald-950/20" : "bg-white border-zinc-200"}`}>
          <div className="flex items-center gap-3 mb-6">
            <Image src="/logo-icon.png" alt="Logo" width={32} height={32} />
            <div>
              <span className="font-bricolage text-xl font-black text-emerald-500">farmly</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Ecosystem Security Gateway</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl border dark:border-emerald-950 bg-zinc-500/5 mb-6">
            <button 
              type="button" 
              onClick={() => setRole("consumer")} 
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${role === "consumer" ? "bg-emerald-600 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              Consumer Node
            </button>
            <button 
              type="button" 
              onClick={() => setRole("vendor")} 
              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${role === "vendor" ? "bg-emerald-600 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              Commercial Vendor
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                {role === "vendor" ? "Representative Name" : "Full Name"}
              </label>
              <input 
                type="text" 
                required 
                placeholder={role === "vendor" ? "e.g. Oladimeji Isaac" : "e.g. Sefinat A."} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={`w-full p-3 rounded-xl border text-xs outline-none ${isDark ? "border-emerald-950 bg-emerald-950/10 text-zinc-100" : "border-zinc-200 bg-zinc-50 text-zinc-900"}`} 
              />
            </div>

            {role === "vendor" && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                  Business / Farm Name *(Displays on Dashboard)*
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. GreenValley Agro-Allied Ltd" 
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)} 
                  className={`w-full p-3 rounded-xl border text-xs outline-none ${isDark ? "border-emerald-800 bg-emerald-950/20 text-emerald-300" : "border-emerald-300 bg-emerald-50 text-emerald-900"}`} 
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Secure Inbox Handle</label>
              <input 
                type="email" 
                required 
                placeholder="name@business.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={`w-full p-3 rounded-xl border text-xs outline-none ${isDark ? "border-emerald-950 bg-emerald-950/10 text-zinc-100" : "border-zinc-200 bg-zinc-50 text-zinc-900"}`} 
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              Authorize Terminal Access <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}