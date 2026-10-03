"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { HeroBanner } from "@/components/hero-banner";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ItemCard } from "@/components/item-card";
import { fetchItems, type ItemRow } from "@/lib/items";
import { useStoreTick } from "@/lib/store";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Wrench, 
  Layers, 
  ArrowUpDown, 
  SearchX
} from "lucide-react";

export default function CatalogExplorePage() {
  const [activeTab, setActiveTab] = useState<"all" | "barang" | "jasa">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("any");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const tick = useStoreTick();
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchItems({ approvedOnly: true }).then((rows) => {
      if (!alive) return;
      setItems(rows);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [tick]);

  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setBudgetFilter("any");
    setConditionFilter("all");
    setSortBy("featured");
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab !== "all" && item.category !== activeTab) return false;
      if (conditionFilter !== "all" && item.condition && item.condition !== conditionFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.categoryLabel.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      if (budgetFilter === "u50" && item.price >= 50000) return false;
      if (budgetFilter === "50-200" && (item.price < 50000 || item.price > 200000)) return false;
      if (budgetFilter === "o200" && item.price <= 200000) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [items, activeTab, conditionFilter, searchQuery, budgetFilter, sortBy]);

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

  const baseItems = items;
  const barangCount = baseItems.filter((i) => i.category === "barang").length;
  const jasaCount = baseItems.filter((i) => i.category === "jasa").length;

  return (
    <div className="min-h-screen bg-cyber-bg text-ink flex flex-col font-sans cyber-grid">
      <Navbar />

      <main className="w-full pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
        {/* Info ribbon */}
        <div className="w-full bg-cyber-card/80 border border-cyber-border py-2 px-4 rounded-2xl flex items-center justify-between text-xs font-mono backdrop-blur-md shadow-xs">
          <span className="truncate text-slate-500">
            Platform jual-beli barang pre-loved &amp; jasa sesama pelajar dan mahasiswa Jakarta.
          </span>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-500">
            <span className="text-ink flex items-center gap-1">
              [TRANSFER_MANUAL]
            </span>
            <span className="text-signal flex items-center gap-1">
              [COD]
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <HeroBanner
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          budgetFilter={budgetFilter}
          setBudgetFilter={setBudgetFilter}
          onExplore={() => {
            const el = document.getElementById("catalog-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Catalog Control Bar */}
        <div id="catalog-section" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
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
              <span>SEMUA ({loaded ? baseItems.length : "-"})</span>
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
              <span>PRE-LOVED ({loaded ? barangCount : "-"})</span>
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
              <span>SEWA JASA ({loaded ? jasaCount : "-"})</span>
            </button>
          </div>

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
          <div className="lg:col-span-3 w-full">
            <FilterSidebar
              onReset={handleResetFilters}
              selectedCondition={conditionFilter}
              onSelectCondition={setConditionFilter}
            />
          </div>

          <div className="lg:col-span-9 flex flex-col gap-6">
            <div className="flex items-center justify-between bg-cyber-card/80 p-4 rounded-2xl border border-cyber-border shadow-sm font-mono text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-bold text-ink uppercase tracking-wider">
                  HASIL KATALOG
                </span>
                <span className="text-slate-500">
                  [{filteredItems.length} LISTING DITEMUKAN]
                </span>
              </div>
              <Badge variant="default" className="text-[10px]">
                UPDATED_REALTIME
              </Badge>
            </div>

            <div ref={gridRef}>
              {!loaded ? (
                <div className="bg-cyber-card/60 rounded-3xl p-16 text-center border border-cyber-border font-mono text-xs text-slate-500 uppercase tracking-widest">
                  Memuat katalog…
                </div>
              ) : filteredItems.length === 0 ? (
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
