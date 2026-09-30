"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toast";
import {
  ITEMS,
  getTakedowns,
  setTakedown,
  fmtDownTime,
  type Takedowns,
} from "@/lib/items";
import { useStoreTick } from "@/lib/store";
import type { ItemData } from "@/components/item-card";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  RotateCcw,
  Search,
  SearchX,
} from "lucide-react";

type Filter = "all" | "live" | "down";

const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

/* Satu kartu antrean moderasi — struktur REFRENCE.md, tanpa skor AI karangan:
   status tayang/diturunkan diambil dari store moderasi nyata. */
function ModCard({ item, down, at }: { item: ItemData; down: boolean; at?: string }) {
  const isService = item.category === "jasa";
  return (
    <div className="mod-card rounded-3xl bg-cyber-card/90 border border-cyber-border p-5 sm:p-6 shadow-sm transition-all hover:shadow-md hover:border-accent/40">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Thumbnail + flag status + ID listing */}
        <div className="relative w-full lg:w-52 h-48 rounded-2xl overflow-hidden shrink-0 bg-cyber-surface border border-cyber-border">
          <img alt={item.name} className="w-full h-full object-cover" src={item.imageUrl} />
          <span
            className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest shadow-md backdrop-blur-md ${
              down
                ? "bg-rose-500 text-white"
                : "bg-signal text-black"
            }`}
          >
            {down ? "Diturunkan" : "Tayang"}
          </span>
          <span className="absolute bottom-2.5 left-2.5 right-2.5 px-2 py-1 rounded-lg bg-cyber-bg/85 backdrop-blur-md text-slate-300 text-center font-mono text-[10px] tracking-wider">
            ID: LST-{item.id}
          </span>
        </div>

        {/* Info listing + seller context */}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={isService ? "orange" : "default"}>{item.categoryLabel}</Badge>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {item.location}
                </span>
              </div>
              <Badge variant={down ? "orange" : "solid"}>
                {down ? "Perlu Tinjauan" : "Lolos Moderasi"}
              </Badge>
            </div>

            <h2 className="text-base font-bold text-white tracking-tight">{item.name}</h2>
            <div className="flex flex-wrap items-baseline gap-3 mt-1">
              <span className="font-mono font-black text-lg text-white">
                {fmt(item.price)}
                {item.priceUnit && (
                  <span className="text-xs font-normal text-slate-400">{item.priceUnit}</span>
                )}
              </span>
              <span className="text-[11px] text-slate-500">
                {item.badge} • {item.subLabel}
              </span>
            </div>

            {/* Box status moderasi */}
            <div
              className={`mt-4 p-3.5 rounded-xl border ${
                down
                  ? "bg-rose-500/5 border-rose-500/30"
                  : "bg-signal/5 border-signal/30"
              }`}
            >
              <div
                className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5 ${
                  down ? "text-rose-400" : "text-signal"
                }`}
              >
                {down ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                {down ? "Diturunkan Admin" : "Tayang di Katalog Publik"}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {down
                  ? `Tidak tampil di katalog, pencarian, dan halaman detail publik sejak ${at ? fmtDownTime(at) : "-"} . Siap dipulihkan setelah lolos tinjauan ulang.`
                  : "Terlihat oleh semua pengguna di katalog utama, pencarian, dan halaman detail — siap transaksi."}
              </p>
            </div>

            {/* Meta seller */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-accent/15 border border-accent/40 text-accent flex items-center justify-center font-mono font-bold text-[10px]">
                  {item.seller.avatarText}
                </span>
                <span className="font-semibold text-slate-200">{item.seller.name}</span>
              </span>
              <span
                className={`flex items-center gap-1 font-semibold ${
                  item.seller.verified ? "text-signal" : "text-neon-orange"
                }`}
              >
                {item.seller.verified ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {item.seller.verified ? "KTM Terverifikasi" : "KTM Belum Terverifikasi"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {item.seller.campus}
              </span>
            </div>
          </div>

          {/* Aksi moderasi */}
          <div className="pt-4 border-t border-cyber-border/70 flex flex-wrap items-center justify-end gap-2.5">
            <Button asChild size="sm" variant="secondary">
              <Link href={`/items/${item.id}`}>
                <ArrowUpRight className="w-3.5 h-3.5" /> Lihat Detail
              </Link>
            </Button>
            {down ? (
              <Button
                onClick={() => {
                  setTakedown(item.id, false);
                  toast(`"${item.name}" tayang kembali di katalog`);
                }}
                size="sm"
                variant="default"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Setujui &amp; Tayangkan
              </Button>
            ) : (
              <Button
                className="text-rose-400 border border-rose-500/40 hover:bg-rose-500/10 hover:border-rose-500/60 bg-transparent"
                onClick={() => {
                  setTakedown(item.id, true);
                  toast(`"${item.name}" diturunkan dari katalog publik`);
                }}
                size="sm"
                variant="secondary"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Turunkan Listing
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminModerationPage() {
  const tick = useStoreTick();
  const [takedowns, setTakedowns] = useState<Takedowns>({});
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setTakedowns(getTakedowns());
  }, [tick]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mod-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, [filter, query, tick]);

  const downCount = Object.keys(takedowns).length;
  const liveCount = ITEMS.length - downCount;

  const list = ITEMS.filter((item) => {
    const isDown = !!takedowns[item.id];
    if (filter === "live" && isDown) return false;
    if (filter === "down" && !isDown) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (
        !item.name.toLowerCase().includes(q) &&
        !item.seller.name.toLowerCase().includes(q) &&
        !item.id.includes(q)
      )
        return false;
    }
    return true;
  });

  const restoreAll = () => {
    Object.keys(takedowns).forEach((id) => setTakedown(id, false));
    toast(`${downCount} listing tayang kembali di katalog`);
  };

  const pills: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: ITEMS.length },
    { key: "live", label: "Tayang", count: liveCount },
    { key: "down", label: "Diturunkan", count: downCount },
  ];

  return (
    <div className="flex flex-col gap-5 admin-anim">
      {/* Filter pills + pencarian (pola REFRENCE) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {pills.map((p) => (
            <button
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-bold whitespace-nowrap transition-all ${
                filter === p.key
                  ? "bg-accent text-black shadow-glow"
                  : "bg-cyber-card text-slate-400 hover:text-white border border-cyber-border"
              }`}
              key={p.key}
              onClick={() => setFilter(p.key)}
              type="button"
            >
              {p.label} ({p.count})
            </button>
          ))}
        </div>
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-cyber-card border border-cyber-border text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul listing, nama seller, atau ID…"
            type="text"
            value={query}
          />
        </div>
      </div>

      {/* Antrean kartu moderasi */}
      {list.length === 0 ? (
        <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-12 flex flex-col items-center text-center gap-3">
          <SearchX className="w-10 h-10 text-slate-600" />
          <p className="text-sm font-bold text-slate-300 font-mono uppercase">
            Tidak ada listing pada filter ini
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            Ubah kata kunci atau pilih pill filter lain untuk melihat antrean.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {list.map((item) => (
            <ModCard
              at={takedowns[item.id]}
              down={!!takedowns[item.id]}
              item={item}
              key={item.id}
            />
          ))}
        </div>
      )}

      {/* Bar batch + jumlah baris */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-cyber-card/90 border border-cyber-border shadow-sm">
        <span className="font-mono text-xs text-slate-500">
          Menampilkan {list.length} dari {ITEMS.length} listing
        </span>
        <Button
          disabled={downCount === 0}
          onClick={restoreAll}
          size="sm"
          variant="default"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Pulihkan Semua Diturunkan ({downCount})
        </Button>
      </div>
    </div>
  );
}
