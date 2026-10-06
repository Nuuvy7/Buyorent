"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { HeroBanner } from "@/components/hero-banner";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ItemCard } from "@/components/item-card";
import { fetchItems, type ItemRow } from "@/lib/items";
import { fetchCodPoints, KOTA_ADMINISTRASI, KECAMATAN_COD, type CodPoint } from "@/lib/cod-points";
import { useStoreTick } from "@/lib/store";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Wrench, 
  Layers, 
  ArrowUpDown, 
  MapPin,
  SearchX
} from "lucide-react";

export default function CatalogExplorePage() {
  const [activeTab, setActiveTab] = useState<"all" | "barang" | "jasa">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("any");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [filterKota, setFilterKota] = useState(""); // "" = semua kota
  const [filterKec, setFilterKec] = useState(""); // "" = semua kecamatan
  const PAGE_SIZE = 24;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE); // #6: tampil per batch
  const [codPoints, setCodPoints] = useState<CodPoint[] | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const tick = useStoreTick();
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  // titik COD dari tabel (fallback daftar statis bila belum di-apply)
  useEffect(() => {
    void fetchCodPoints().then(setCodPoints);
  }, []);

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
    setFilterKota("");
    setFilterKec("");
  };

  // opsi dropdown dari tabel cod_points; fallback statis bila belum di-apply
  const kotaList = useMemo(
    () => (codPoints ? Array.from(new Set(codPoints.map((p) => p.kota))) : [...KOTA_ADMINISTRASI]),
    [codPoints]
  );
  const kecList = useMemo(() => {
    const base = codPoints
      ? Array.from(
          new Map(codPoints.map((p) => [p.kecamatan, p.kota] as [string, string])),
          ([nama, kota]) => ({ nama, kota })
        )
      : KECAMATAN_COD.map((k) => ({ nama: k.nama, kota: k.kota }));
    return filterKota ? base.filter((k) => k.kota === filterKota) : base;
  }, [codPoints, filterKota]);

  const pointsById = useMemo(
    () => new Map((codPoints ?? []).map((p) => [p.id, p])),
    [codPoints]
  );
  // nama kecamatan (lowercase) → kota, utk item berteks (jasa location = kecamatan)
  const kecToKota = useMemo(() => {
    const m = new Map<string, { kec: string; kota: string }>();
    for (const k of KECAMATAN_COD) m.set(k.nama.toLowerCase(), { kec: k.nama, kota: k.kota });
    return m;
  }, []);
  /** Lokasi item → {kecamatan, kota, score}; null = teks lawas (lokasi/titik manual) */
  const lokasiInfo = useCallback(
    (item: ItemRow): { kec: string; kota: string; score: number | null } | null => {
      const p = pointsById.get(item.location);
      if (p) return { kec: p.kecamatan, kota: p.kota, score: p.safety_score };
      const hit = kecToKota.get(item.location.trim().toLowerCase());
      if (hit) return { ...hit, score: null };
      return null;
    },
    [pointsById, kecToKota]
  );
  const lokasiAktif = filterKota !== "" || filterKec !== "";

  // Filter semua param TANPA tab — dipakai counter tab & turunan filteredItems.
  const nonTabFiltered = useMemo(() => {
    return items.filter((item) => {
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
      if (lokasiAktif) {
        // listing lawas tanpa titik (location teks manual) hanya tampil tanpa filter lokasi
        const info = lokasiInfo(item);
        if (!info) return false;
        if (filterKec && info.kec !== filterKec) return false;
        if (filterKota && info.kota !== filterKota) return false;
      }
      return true;
    }).sort((a, b) => {
      // sortir harga = pilihan eksplisit user, selalu dihormati dulu
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (lokasiAktif) {
        // "Paling Relevan" + lokasi: safety_score DESC (teks tanpa titik → -1, di bawah)
        const sa = lokasiInfo(a)?.score ?? -1;
        const sb = lokasiInfo(b)?.score ?? -1;
        if (sa !== sb) return sb - sa;
      }
      return 0;
    });
  }, [items, conditionFilter, searchQuery, budgetFilter, sortBy, filterKota, filterKec, lokasiAktif, lokasiInfo]);

  // Tab diterapkan belakangan supaya counter kategori tetap mencerminkan filter.
  const filteredItems = useMemo(
    () => (activeTab === "all" ? nonTabFiltered : nonTabFiltered.filter((i) => i.category === activeTab)),
    [nonTabFiltered, activeTab]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE); // filter berubah → kembali ke batch pertama
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
  }, [activeTab, conditionFilter, budgetFilter, sortBy, searchQuery, filterKota, filterKec]);

  const barangCount = nonTabFiltered.filter((i) => i.category === "barang").length;
  const jasaCount = nonTabFiltered.filter((i) => i.category === "jasa").length;

  return (
    <div className="min-h-screen bg-cyber-bg text-ink flex flex-col font-sans cyber-grid">
      <Navbar />

      <main className="w-full pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
        {/* Info ribbon */}
        <div className="w-full bg-cyber-card/80 border border-cyber-border py-2 px-4 rounded-2xl flex items-center justify-between text-xs font-mono backdrop-blur-md shadow-xs">
          <span className="truncate text-slate-500">
            Platform jual-beli barang pre-loved &amp; jasa sesama pelajar Jakarta.
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
              <span>SEMUA ({loaded ? nonTabFiltered.length : "-"})</span>
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

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto self-stretch sm:self-center justify-start sm:justify-end font-mono text-xs">
            <span className="text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-ink" /> LOKASI:
            </span>
            <select
              onChange={(e) => {
                const v = e.target.value;
                setFilterKota(v);
                // kecamatan lama mungkin tidak ada di kota baru → reset
                if (filterKec && !kecList.some((k) => k.nama === filterKec && k.kota === v))
                  setFilterKec("");
              }}
              value={filterKota}
              className="bg-cyber-surface text-slate-400 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-cyber-border focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="">Semua Kota</option>
              {kotaList.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <select
              onChange={(e) => setFilterKec(e.target.value)}
              value={filterKec}
              className="bg-cyber-surface text-slate-400 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-cyber-border focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="">Semua Kecamatan</option>
              {kecList.map((k) => (
                <option key={k.nama} value={k.nama}>{k.nama}</option>
              ))}
            </select>
            <span className="text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-ink" /> URUTKAN:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-cyber-surface text-slate-400 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-cyber-border focus:border-accent focus:outline-none cursor-pointer"
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
                  <SearchX className="w-12 h-12 text-slate-400 mb-3" />
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
                <>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
                    {filteredItems.slice(0, visibleCount).map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        isFavorite={!!favorites[item.id]}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                  {filteredItems.length > visibleCount && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        variant="neon"
                        size="sm"
                        className="font-mono"
                      >
                        MUAT LEBIH BANYAK ({filteredItems.length - visibleCount} SISA)
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
