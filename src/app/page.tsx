"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { HeroBanner } from "@/components/hero-banner";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ItemCard } from "@/components/item-card";
import { ITEMS, getTakedowns } from "@/lib/items";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Wrench, 
  Layers, 
  ArrowUpDown, 
  Recycle, 
  CheckCircle2, 
  SearchX
} from "lucide-react";

export default function CatalogExplorePage() {
  const [activeTab, setActiveTab] = useState<"all" | "barang" | "jasa">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [campusFilter, setCampusFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("any");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  // listing yang diturunkan admin tidak boleh tampil di katalog
  const [takedowns, setTakedowns] = useState<Record<string, string>>({});

  useEffect(() => {
    setTakedowns(getTakedowns());
  }, []);

  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setCampusFilter("all");
    setBudgetFilter("any");
    setConditionFilter("all");
    setSortBy("featured");
  };

  const filteredItems = useMemo(() => {
    return ITEMS.filter((item) => {
      // Moderasi admin: listing diturunkan disembunyikan dari katalog
      if (takedowns[item.id]) return false;
      // Category filter
      if (activeTab !== "all" && item.category !== activeTab) {
        return false;
      }
      // Condition filter
      if (conditionFilter !== "all" && item.condition && item.condition !== conditionFilter) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.categoryLabel.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      // Budget filter
      if (budgetFilter === "u50" && item.price >= 50000) return false;
      if (budgetFilter === "50-200" && (item.price < 50000 || item.price > 200000)) return false;
      if (budgetFilter === "o200" && item.price <= 200000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [activeTab, conditionFilter, searchQuery, budgetFilter, sortBy, takedowns]);

  // GSAP stagger animation on card list updates
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".item-card-anim");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 25, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
      }
    }
  }, [activeTab, conditionFilter, budgetFilter, sortBy, searchQuery]);

  const baseItems = ITEMS.filter((i) => !takedowns[i.id]);
  const barangCount = baseItems.filter((i) => i.category === "barang").length;
  const jasaCount = baseItems.filter((i) => i.category === "jasa").length;

  return (
    <div className="min-h-screen bg-cyber-bg text-ink flex flex-col font-sans cyber-grid">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="w-full pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
        {/* Live campus ticker ribbon */}
        <div className="w-full bg-cyber-card/80 border border-cyber-border py-2 px-4 rounded-2xl flex items-center justify-between text-xs font-mono backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-signal/10 text-signal font-bold border border-signal/30 shrink-0 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              LIVE DEALS
            </span>
            <span className="truncate text-slate-500">
              Kalkulator Casio baru dipesan di UI Salemba • Jasa PPT Skripsi (Trisakti) sisa 2 slot hari ini • Kamera Sony A7 tersewa di Salemba
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-500">
            <span className="text-ink flex items-center gap-1">
              [ESCROW_AKTIF]
            </span>
            <span className="text-signal flex items-center gap-1">
              [COD_VERIFIED]
            </span>
          </div>
        </div>

        {/* Hero Banner with GSAP entrance */}
        <HeroBanner
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          campusFilter={campusFilter}
          setCampusFilter={setCampusFilter}
          budgetFilter={budgetFilter}
          setBudgetFilter={setBudgetFilter}
          onExplore={() => {
            const el = document.getElementById("catalog-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Catalog Control Bar: Tabs & Sort */}
        <div id="catalog-section" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          {/* Mode Switch Tabs */}
          <div className="p-1 bg-cyber-surface border border-cyber-border rounded-2xl flex items-center gap-1 w-full sm:w-auto shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "all"
                  ? "bg-accent text-black shadow-glow"
                  : "text-slate-500 hover:text-ink"
              }`}
              type="button"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>SEMUA ({baseItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("barang")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "barang"
                  ? "bg-accent text-black shadow-glow"
                  : "text-slate-500 hover:text-ink"
              }`}
              type="button"
            >
              <Package className="w-3.5 h-3.5" />
              <span>PRE-LOVED ({barangCount})</span>
            </button>
            <button
              onClick={() => setActiveTab("jasa")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "jasa"
                  ? "bg-accent text-black shadow-glow"
                  : "text-slate-500 hover:text-ink"
              }`}
              type="button"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>SEWA JASA ({jasaCount})</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-center font-mono text-xs">
            <span className="text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-ink" /> URUTKAN:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-cyber-surface text-slate-700 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-cyber-border focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="featured">Paling Relevan</option>
              <option value="price-asc">Harga Terhemat (Low &gt; High)</option>
              <option value="price-desc">Harga Tertinggi (High &gt; Low)</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Sidebar + Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 w-full">
            <FilterSidebar
              onReset={handleResetFilters}
              selectedCampus={campusFilter}
              onSelectCampus={setCampusFilter}
              selectedCondition={conditionFilter}
              onSelectCondition={setConditionFilter}
            />
          </div>

          {/* Right Catalog Grid */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {/* Header info bar */}
            <div className="flex items-center justify-between bg-cyber-card/80 p-4 rounded-2xl border border-cyber-border shadow-sm font-mono text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-bold text-ink uppercase tracking-wider">
                  HASIL KATALOG KAMPUS
                </span>
                <span className="text-slate-500">
                  [{filteredItems.length} LISTING DITEMUKAN]
                </span>
              </div>
              <Badge variant="default" className="text-[10px]">
                UPDATED_REALTIME
              </Badge>
            </div>

            {/* Item Card Grid with Ref */}
            <div ref={gridRef}>
              {filteredItems.length === 0 ? (
                <div className="bg-cyber-card/60 rounded-3xl p-16 text-center border border-cyber-border flex flex-col items-center justify-center font-mono">
                  <SearchX className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-sm font-bold text-slate-600 uppercase">
                    TIDAK ADA HASIL YANG COCOK
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Parameter filter atau kata kunci tidak menemukan listing aktif. Coba reset parameter filter.
                  </p>
                  <Button
                    onClick={handleResetFilters}
                    variant="neon"
                    size="sm"
                    className="mt-4 font-mono"
                  >
                    RESET SEMUA FILTER
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isFavorite={!!favorites[item.id]}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Community Impact Stats Banner */}
            <section className="mt-4 bg-gradient-to-r from-accent/10 via-cyber-card to-accent/10 p-6 rounded-3xl border border-cyber-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/40 text-ink flex items-center justify-center shrink-0 shadow-glow">
                  <Recycle className="w-6 h-6 text-ink" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink font-mono flex items-center gap-2">
                    DAMPAK EKONOMI SIRKULAR MAHASISWA
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
                    420+ transaksi sukses menghemat estimasi Rp 48.5 juta uang saku dan memperpanjang masa pakai alat kuliah.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 bg-cyber-bg/90 px-4 py-2.5 rounded-2xl border border-cyber-border font-mono">
                <div className="text-right">
                  <span className="text-base font-black text-signal block">98.4%</span>
                  <span className="text-[10px] text-slate-500">COD AMAN KAMPUS</span>
                </div>
                <CheckCircle2 className="w-6 h-6 text-signal" />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
