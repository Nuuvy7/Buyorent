"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  MapPin, 
  ShoppingCart, 
  Bell, 
  PlusCircle, 
  ChevronDown, 
  CheckCircle2,
  Terminal,
  Menu,
  X
} from "lucide-react";

interface NavbarProps {
  cartCount: number;
}

export function Navbar({ cartCount }: NavbarProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-cyber-bg/90 backdrop-blur-xl border-b border-cyber-border">
      {/* Top micro ribbon */}
      <div className="bg-gradient-to-r from-accent/40 via-accent/15 to-accent/40 h-[2px] w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Campus badge */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent flex items-center justify-center text-accent font-mono font-black text-lg shadow-glow group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-mono font-extrabold tracking-tight text-white flex items-center gap-1">
                  BUYORENT<span className="text-accent">.SYS</span>
                </span>
                <span className="hidden sm:block text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
                  Campus Circular Economy
                </span>
              </div>
            </Link>

            {/* Campus Selector */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-slate-500 transition-colors cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-neon-orange" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono text-slate-400 uppercase">Campus Hub</span>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1 font-mono">
                  UI DEPOK & SALEMBA
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Terminal Ticker Pill */}
          <div className="hidden md:flex items-center gap-2 bg-cyber-surface/80 border border-cyber-border px-3 py-1.5 rounded-full text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
            </span>
            <span className="text-slate-400">NETWORK:</span>
            <span className="text-signal font-semibold">420+ DEALS CLOSED</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">EST. SAVINGS: Rp 48.5M</span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-accent/50 text-slate-300 hover:text-white transition-all flex items-center justify-center"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-4 h-4 text-accent" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon-orange text-black font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-glow-orange">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notification Bell */}
            <button
              className="hidden sm:flex relative p-2.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-slate-500 text-slate-300 hover:text-white transition-all items-center justify-center"
              title="Notifikasi"
              type="button"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-signal ring-2 ring-cyber-bg"></span>
            </button>

            {/* User Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-cyber-surface border border-cyber-border px-2.5 py-1.5 rounded-xl hover:border-slate-500 transition-colors cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-accent text-black font-mono font-black text-xs flex items-center justify-center">
                D
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-200 leading-tight">Daffa R.</span>
                <span className="text-[10px] font-mono text-signal flex items-center gap-0.5 leading-none">
                  <CheckCircle2 className="w-2.5 h-2.5" /> KTM_VERIFIED
                </span>
              </div>
            </div>

            {/* Post Ad CTA Button */}
            <Button
              variant="default"
              size="default"
              asChild
              className="shadow-glow-signal px-3 sm:px-4"
            >
              <Link href="/items/new" className="flex items-center gap-1.5 font-mono">
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">PASANG IKLAN</span>
              </Link>
            </Button>

            {/* Hamburger: elemen navbar terlalu padat di layar kecil */}
            <button
              className="md:hidden p-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-slate-300 hover:text-white hover:border-accent/50 transition-all flex items-center justify-center"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Buka menu"
              aria-expanded={menuOpen}
              type="button"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Panel menu mobile: campus, statistik live, profil */}
        {menuOpen && (
          <div className="md:hidden border-t border-cyber-border py-4 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyber-surface border border-cyber-border">
              <MapPin className="w-3.5 h-3.5 text-neon-orange shrink-0" />
              <span className="text-slate-400 uppercase text-[9px]">Campus Hub</span>
              <span className="text-slate-200 font-bold ml-auto">UI DEPOK &amp; SALEMBA</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyber-surface border border-cyber-border">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
              </span>
              <span className="text-slate-400">NETWORK:</span>
              <span className="text-signal font-semibold">420+ DEALS CLOSED</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyber-surface border border-cyber-border">
              <div className="w-6 h-6 rounded-lg bg-accent text-black font-black flex items-center justify-center shrink-0">D</div>
              <span className="text-slate-200 font-bold">Daffa R.</span>
              <span className="text-signal flex items-center gap-1 ml-auto">
                <CheckCircle2 className="w-3 h-3" /> KTM_VERIFIED
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
