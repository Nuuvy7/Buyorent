"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { HeroBanner } from "@/components/hero-banner";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ItemCard, ItemData } from "@/components/item-card";
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

const INITIAL_ITEMS: ItemData[] = [
  {
    id: "1",
    name: "Kalkulator Ilmiah Casio FX-991EX",
    category: "barang",
    categoryLabel: "Alat Kuliah",
    subLabel: "Casio FX-991EX",
    condition: "like-new",
    description: "Dipakai 2 semester matkul Kalkulus. Layar bening, tombol responsif 100%, bonus baterai cadangan.",
    price: 140000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBGWQVWin4spjXjFKD6SxnAHPNgHv26kfF9qqIi0E-zo4OhYDVZrKJg9SV9M09IbvJXT7pPzXUH8XoRPwcIe0e470Txyzc-iqxJc-hZi9CBSKtZu5SYbmFDAEHqtiz2j5WhOTaQ9pDPSKzosJIlyuWTSO_2IHzUD_Sr5VnmiHdnqh5ZqevmdiOck-viXA7s9XU_b0SePJmUjNcqxdvv2mS6Qe2ZLTtSYPnbrPvrRofY1eO9C9DTPNGFQ",
    badge: "95% Mulus",
    location: "FT UI Depok",
    seller: {
      name: "Rizky M.",
      avatarText: "R",
      campus: "Teknik UI",
      verified: true,
    },
  },
  {
    id: "2",
    name: "Desain PPT Sidang & Poster Skripsi",
    category: "jasa",
    categoryLabel: "Freelance",
    subLabel: "Revisi 2x",
    description: "Layout modern, infografis data rapi siap sidang, file Canva Pro atau PPT editable.",
    price: 35000,
    priceUnit: "/slide",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSIdSKHxgj5QPvunyLR1oMzEuexatWFCxLa5tpx31qALEtd6yVxbEkj9tn9KWT1LSP7fv-ts6Rzi5MMcLeIGLayYOI5_soax9grAy4quEjoFf7s9EC1j3iGZr8yi33jlBsSzv6ZcbvsdpdoUIJXI47pwFzTsx8I1Bt3qw4BFF4S8mWJWXrVAJzUUDCUbMlORtSlA1aaxjqED-_1HPlSX9soGvf76dGInbopEopkxVwwI5Ox7ud1O1jzw",
    badge: "Jasa Desain",
    location: "DKV ITB",
    rating: "4.9 • 42 Portofolio",
    seller: {
      name: "Nadia S.",
      avatarText: "N",
      campus: "DKV ITB",
      verified: true,
    },
  },
  {
    id: "3",
    name: "Kemeja Flanel Uniqlo Vintage",
    category: "barang",
    categoryLabel: "Fashion",
    subLabel: "Size XL",
    condition: "used",
    description: "Warna pekat 90%, katun tebal lembut khas Uniqlo, wangi laundry siap pakai ngampus.",
    price: 65000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd6_OBrPsNEH3YdOXTni5bNxNvaLQ2qazdFX9RrocUCjjEHQYE5pPrkAEPu2SIW7iOiv3RdMfq5uYBuQaOxGqHnnXuXZdqPLtbE1Uh9Xogv18GTxuFfGSkRgqDmc02X3YnBIzkaXgM6qpDpo8m_YY9Ll7C2idEgUYeJxf3xtlaUgmBEIUGVpCBkPQkR79DWUc3VRyE_3mptD41NqwdULCMxzKybfuQTSgzKCr3V0wu8qc1x4w1wXQk9A",
    badge: "Thrifted",
    location: "Halte UI / Halte",
    seller: {
      name: "Alifia",
      avatarText: "A",
      campus: "SMAN 28",
      verified: true,
    },
  },
  {
    id: "4",
    name: "Servis & Install Ulang Laptop",
    category: "jasa",
    categoryLabel: "Tech Support",
    subLabel: "Garansi 14 Hari",
    description: "Install OS bersih, ganti pasta thermal, upgrade SSD, dan install software kuliah lengkap.",
    price: 50000,
    priceUnit: "/sesi",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Rk-m7P92D8sa2Zr2J3RwMhsUNau55-9AuA6mwe4yjbQu5NWkxBT95UPD5DvGszTQ80kZ9rJqwSAnpxAaI-6jRjJQ6WUqMKP-KGyI6AQUFMMpTfTZ7BmiT0HHKMK4KgExH-t57KOOIHogJDXaMm__okUQu968hs4IBNG300aEJyo9Qc92m1-OZOkThHGKZZRAVhEpCJ68dEE3nicqX07i3mjqRzCm0X74PpuLOHLikO7i-6ZbQIEjsg",
    badge: "Teknisi Kampus",
    location: "Siap Datang ke Kost",
    seller: {
      name: "Bima Tech",
      avatarText: "B",
      campus: "Fasilkom UI",
      verified: true,
    },
  },
  {
    id: "5",
    name: "Lampu Meja Belajar Aesthetic",
    category: "barang",
    categoryLabel: "Perlengkapan Kost",
    subLabel: "3 Tingkat Terang",
    condition: "like-new",
    description: "Leher fleksibel, port USB charger HP, sensor sentuh. Dijual karena selesai kuliah & pindah kost.",
    price: 45000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiC-OPADkgOaFC3JvOjS2f3Lze6B7gZJuhZYvP5RMS8PnI6PiBGgK3XkEk40OhEts18ncQOL4GSYuZRsbmqXyTfn98qBU8PrmPWp-Qxl0oeZJxxw8If6ZwhdrdRbghu7PSj1a1cm72YON8k37sEEGi8JBz5gUbQvpWe2F7grh8SBjL6eFFG_pu-Ak0lFW7DpiK68Eq0pwuGQLTBxVXBYE-909YLW7LdaWQm9CnjLfYQL96yFk3hBlPbw",
    badge: "Kost Gear",
    location: "Kukusan Depok",
    seller: {
      name: "Dimas K.",
      avatarText: "D",
      campus: "Kukusan",
      verified: true,
    },
  },
  {
    id: "6",
    name: "Fotografer Wisuda Paket Hemat",
    category: "jasa",
    categoryLabel: "Fotografi Wisuda",
    subLabel: "Sony A7",
    description: "Warna natural estetik, siap foto bersama keluarga/sahabat, file Google Drive di hari H.",
    price: 150000,
    priceUnit: "/2 jam",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvORGLssFRSO5CPoriG3wNBqAH4WeEhIbpAR-ER36dHnE_7DVPpb327FqqzsdBbOzUNMDhCOLeEX68hDkIaOSzUQXZmafCxOpyD3GS9KqE9FXcJWUIxQxn5IseUDBFyd5W6zMV_TwiUWhnV0zQxgjzzhsdKNtueHgljOXICvsCHKxslP_A6gCp5TN5lFbmXw1JqGik63JosiR4H6gDFcwAcXz32irRBO9eJH2ilyakp-sa4F6NGZbbtA",
    badge: "Jasa Foto",
    location: "Softfile + 10 Edit",
    seller: {
      name: "LensKreatif",
      avatarText: "L",
      campus: "UI Depok",
      verified: true,
    },
  },
];

export default function CatalogExplorePage() {
  const [activeTab, setActiveTab] = useState<"all" | "barang" | "jasa">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [campusFilter, setCampusFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("any");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [cartCount, setCartCount] = useState(2);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = () => {
    setCartCount((c) => c + 1);
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
    return INITIAL_ITEMS.filter((item) => {
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
  }, [activeTab, conditionFilter, searchQuery, budgetFilter, sortBy]);

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

  const barangCount = INITIAL_ITEMS.filter((i) => i.category === "barang").length;
  const jasaCount = INITIAL_ITEMS.filter((i) => i.category === "jasa").length;

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans cyber-grid">
      {/* Top Navbar */}
      <Navbar cartCount={cartCount} />

      {/* Main Content Area */}
      <main className="w-full pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
        {/* Live campus ticker ribbon */}
        <div className="w-full bg-cyber-card/80 border border-cyber-border py-2 px-4 rounded-2xl flex items-center justify-between text-xs font-mono backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-signal/10 text-signal font-bold border border-signal/30 shrink-0 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              LIVE DEALS
            </span>
            <span className="truncate text-slate-400">
              Kalkulator Casio baru dipesan di FT UI • Jasa PPT Skripsi (ITB) sisa 2 slot hari ini • Kamera Sony A7 tersewa di Salemba
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
            <span className="text-accent flex items-center gap-1">
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
                  : "text-slate-400 hover:text-white"
              }`}
              type="button"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>SEMUA ({INITIAL_ITEMS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("barang")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "barang"
                  ? "bg-accent text-black shadow-glow"
                  : "text-slate-400 hover:text-white"
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
                  : "text-slate-400 hover:text-white"
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
              <ArrowUpDown className="w-3.5 h-3.5 text-accent" /> URUTKAN:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-cyber-surface text-slate-200 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-cyber-border focus:border-accent focus:outline-none cursor-pointer"
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
                <span className="font-bold text-white uppercase tracking-wider">
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
                  <SearchX className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-sm font-bold text-slate-300 uppercase">
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
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Community Impact Stats Banner */}
            <section className="mt-4 bg-gradient-to-r from-accent/10 via-cyber-card to-accent/10 p-6 rounded-3xl border border-cyber-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/40 text-accent flex items-center justify-center shrink-0 shadow-glow">
                  <Recycle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    DAMPAK EKONOMI SIRKULAR MAHASISWA
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                    420+ transaksi sukses menghemat estimasi Rp 48.5 juta uang saku dan memperpanjang masa pakai alat kuliah.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 bg-cyber-bg/90 px-4 py-2.5 rounded-2xl border border-cyber-border font-mono">
                <div className="text-right">
                  <span className="text-base font-black text-signal block">98.4%</span>
                  <span className="text-[10px] text-slate-400">COD AMAN KAMPUS</span>
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
