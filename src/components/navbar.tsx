"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import { getAccount, type AccountRecord } from "@/lib/users";
import { useStoreTick } from "@/lib/store";
import { 
  ShoppingCart, 
  PlusCircle, 
  CheckCircle2,
  LogIn,
  Menu,
  X
} from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const cart = useCart();

  const [account, setAccount] = React.useState<AccountRecord | null>(null);
  const tick = useStoreTick();

  React.useEffect(() => {
    const supabase = createClient();
    let alive = true;
    const sync = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const acc = session ? await getAccount() : null;
      if (alive) setAccount(acc);
    };
    void sync();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void sync();
    });
    return () => {
      alive = false;
      void sub.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    let alive = true;
    getAccount().then((acc) => {
      if (alive) setAccount(acc);
    });
    return () => {
      alive = false;
    };
  }, [tick]);

  const nameParts = (account?.name ?? "").trim().split(/\s+/).filter(Boolean);
  const displayName =
    nameParts.length > 1 ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.` : nameParts[0] ?? "Akun";
  const initial = (nameParts[0] ?? "A").charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-cyber-bg/90 backdrop-blur-xl border-b border-cyber-border">
      {/* Top micro ribbon */}
      <div className="bg-gradient-to-r from-accent/40 via-accent/15 to-accent/40 h-[2px] w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent flex items-center justify-center text-ink font-mono font-black text-lg shadow-glow group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-mono font-extrabold tracking-tight text-ink flex items-center gap-1">
                  BUYORENT<span className="text-ink">.SYS</span>
                </span>
                <span className="hidden sm:block text-[9px] font-mono tracking-widest text-slate-500 uppercase -mt-1">
                  Marketplace Pelajar Jakarta
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-accent/50 text-slate-600 hover:text-ink transition-all flex items-center justify-center"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-4 h-4 text-ink" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon-orange text-black font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-glow-orange">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Profile Pill */}
            {account ? (
              <Link
                className="hidden sm:flex items-center gap-2 bg-cyber-surface border border-cyber-border px-2.5 py-1.5 rounded-xl hover:border-accent/50 transition-colors"
                href="/account"
                title="Kelola Akun"
              >
                <div className="w-6 h-6 rounded-lg bg-accent text-black font-mono font-black text-xs flex items-center justify-center">
                  {initial}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-700 leading-tight">{displayName}</span>
                  {account.ktm && (
                    <span className="text-[10px] font-mono text-signal flex items-center gap-0.5 leading-none">
                      <CheckCircle2 className="w-2.5 h-2.5" /> IDENTITAS_VERIFIED
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <Link
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyber-surface border border-cyber-border hover:border-accent/50 text-slate-700 hover:text-ink transition-all font-mono text-xs font-bold uppercase tracking-wider"
                href="/login"
                title="Masuk ke akun"
              >
                <LogIn className="w-3.5 h-3.5 text-accent" /> Masuk
              </Link>
            )}

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

            {/* Hamburger */}
            <button
              className="md:hidden p-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-slate-600 hover:text-ink hover:border-accent/50 transition-all flex items-center justify-center"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Buka menu"
              aria-expanded={menuOpen}
              type="button"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-cyber-border py-4 flex flex-col gap-3 font-mono text-xs">
            {account ? (
              <Link
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyber-surface border border-cyber-border hover:border-accent/50 transition-colors"
                href="/account"
              >
                <div className="w-6 h-6 rounded-lg bg-accent text-black font-black flex items-center justify-center shrink-0">{initial}</div>
                <span className="text-slate-700 font-bold">{displayName}</span>
                {account.ktm && (
                  <span className="text-signal flex items-center gap-1 ml-auto">
                    <CheckCircle2 className="w-3 h-3" /> IDENTITAS_VERIFIED
                  </span>
                )}
                <span className="text-slate-500 text-[10px] uppercase ml-auto">Akun →</span>
              </Link>
            ) : (
              <Link
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyber-surface border border-cyber-border hover:border-accent/50 transition-colors"
                href="/login"
              >
                <LogIn className="w-4 h-4 text-accent shrink-0" />
                <span className="text-slate-700 font-bold">Masuk / Daftar</span>
                <span className="text-slate-500 text-[10px] uppercase ml-auto">Login →</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
