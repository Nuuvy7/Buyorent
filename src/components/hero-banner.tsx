"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Wallet, Zap, ArrowRight } from "lucide-react";

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  budgetFilter: string;
  setBudgetFilter: (b: string) => void;
  onExplore: () => void;
}

export function HeroBanner({
  searchQuery,
  setSearchQuery,
  budgetFilter,
  setBudgetFilter,
  onExplore,
}: HeroBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const omnibarRef = useRef<HTMLDivElement>(null);
  const stickersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          titleRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.3"
        )
        .from(
          subtitleRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          omnibarRef.current,
          {
            scale: 0.95,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.2)",
          },
          "-=0.3"
        )
        .from(
          stickersRef.current?.children || [],
          {
            y: 10,
            opacity: 0,
            stagger: 0.08,
            duration: 0.4,
          },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-xl cyber-grid-glow"
    >
      {/* Neon Glow orbs in background */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Corner Markers */}
      <div className="absolute top-3 left-3 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
        [SYS_CORE // V2.0]
      </div>
      <div className="absolute top-3 right-3 font-mono text-[9px] text-signal uppercase tracking-widest flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
        NODE_STATUS: ONLINE
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
        {/* Hologram Sticker Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2">
          <Badge variant="default" className="text-xs px-3 py-1 font-mono tracking-widest shadow-glow">
            <Zap className="w-3.5 h-3.5 text-ink fill-accent" />
            CIRCULAR ECONOMY JAKARTA
          </Badge>
        </div>

        {/* Hero Title */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-ink tracking-tight leading-[1.1] font-sans"
        >
          THRIFT GEAR IDAMAN <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink via-ink to-accent neon-glow-cyan">
            &amp; SEWA SKILL TEMAN
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed font-mono"
        >
          Katalog terpusat barang pre-loved &amp; jasa kreatif sesama pelajar Jakarta.
          Transaksi transparan, hemat uang saku, dan COD aman di titik kesepakatan.
        </p>

        {/* Omnibar Search Container */}
        <div
          ref={omnibarRef}
          className="w-full max-w-3xl bg-cyber-surface/95 rounded-2xl p-2.5 border border-cyber-border shadow-glow flex flex-col md:flex-row items-stretch gap-2.5"
        >
          {/* Search Input */}
          <div className="flex-1 flex items-center px-3.5 bg-cyber-bg rounded-xl border border-cyber-border/80 focus-within:border-accent transition-colors">
            <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 focus:outline-none text-xs text-ink placeholder:text-slate-500 py-2.5 font-mono"
              placeholder="Cari kalkulator, kamera, jasa PPT, servis..."
              type="text"
            />
          </div>

          {/* Budget Range */}
          <div className="flex items-center gap-1.5 bg-cyber-bg px-3.5 py-2.5 rounded-xl border border-cyber-border/80">
            <Wallet className="w-4 h-4 text-ink shrink-0" />
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="bg-transparent text-xs font-mono font-semibold text-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="any" className="bg-cyber-surface text-ink">Semua Budget</option>
              <option value="u50" className="bg-cyber-surface text-ink">&lt; Rp 50.000</option>
              <option value="50-200" className="bg-cyber-surface text-ink">Rp 50rb - 200rb</option>
              <option value="o200" className="bg-cyber-surface text-ink">&gt; Rp 200.000</option>
            </select>
          </div>

          {/* Explore Action Button */}
          <Button
            onClick={onExplore}
            variant="default"
            size="lg"
            className="rounded-xl px-5 font-mono gap-1.5"
          >
            <span>EKSPLOR</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Filter Stickers */}
        <div ref={stickersRef} className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-mono text-[11px] uppercase tracking-wider">
            FILTER CEPAT:
          </span>
          <button
            onClick={() => setBudgetFilter("u50")}
            className={`px-3 py-1 rounded-lg font-mono text-xs transition-all border ${
              budgetFilter === "u50"
                ? "bg-accent text-black border-accent font-bold shadow-glow"
                : "bg-cyber-surface text-slate-600 border-cyber-border hover:border-slate-500"
            }`}
            type="button"
          >
            [≤ Rp 50rb]
          </button>
          <button
            onClick={() => setBudgetFilter("50-200")}
            className={`px-3 py-1 rounded-lg font-mono text-xs transition-all border ${
              budgetFilter === "50-200"
                ? "bg-accent text-black border-accent font-bold shadow-glow"
                : "bg-cyber-surface text-slate-600 border-cyber-border hover:border-slate-500"
            }`}
            type="button"
          >
            [Rp 50rb - 200rb]
          </button>
          <button
            onClick={() => setBudgetFilter("o200")}
            className={`px-3 py-1 rounded-lg font-mono text-xs transition-all border ${
              budgetFilter === "o200"
                ? "bg-accent text-black border-accent font-bold shadow-glow"
                : "bg-cyber-surface text-slate-600 border-cyber-border hover:border-slate-500"
            }`}
            type="button"
          >
            [&gt; Rp 200rb]
          </button>
        </div>
      </div>
    </section>
  );
}
