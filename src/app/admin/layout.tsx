"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ToastHost, toast } from "@/components/toast";
import { ITEMS, getTakedowns, type Takedowns } from "@/lib/items";
import {
  getUsers,
  getAccount,
  saveAccount,
  type AccountRecord,
  type UserRecord,
} from "@/lib/users";
import { useStoreTick, emitStore } from "@/lib/store";
import {
  AlertTriangle,
  Flag,
  LayoutDashboard,
  Package,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

function Metric({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  tone: "accent" | "orange" | "rose" | "signal";
}) {
  const tones = {
    accent: { box: "bg-accent/10 border-accent/30 text-accent", text: "text-accent" },
    orange: {
      box: "bg-neon-orange/10 border-neon-orange/30 text-neon-orange",
      text: "text-neon-orange",
    },
    rose: { box: "bg-rose-500/10 border-rose-500/30 text-rose-400", text: "text-rose-400" },
    signal: { box: "bg-signal/10 border-signal/30 text-signal", text: "text-signal" },
  }[tone];
  return (
    <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-5 shadow-sm transition-transform hover:-translate-y-0.5 admin-anim">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${tones.box}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-mono font-black tracking-tight ${tones.text}`}>
          {value}
        </span>
      </div>
      <p className="text-[11px] text-slate-500 mt-2 font-sans">{sub}</p>
    </div>
  );
}

const TABS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/items", label: "Moderasi Listing", icon: Store },
  { href: "/admin/users", label: "Kelola Pengguna", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tick = useStoreTick();
  const [account, setAccount] = useState<AccountRecord | null>(null);
  const [takedowns, setTakedowns] = useState<Takedowns>({});
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [syncing, setSyncing] = useState(false);

  const refresh = () => {
    setAccount(getAccount());
    setTakedowns(getTakedowns());
    setUsers(getUsers());
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".admin-anim",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // Role gate (AI_CONTEXT §4): moderasi & kelola user = admin saja.
  // ponytail: gate localStorage sebagai demo — ganti cek session Supabase saat auth aktif.
  if (account && account.role !== "admin") {
    return (
      <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans cyber-grid">
        <Navbar />
        <main className="w-full pt-32 pb-20 max-w-2xl mx-auto px-4 sm:px-6 flex-1">
          <div className="bg-cyber-card/90 border border-cyber-border rounded-3xl p-8 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-lg font-black text-white font-mono uppercase tracking-tight">
              Akses Terbatas — Role Admin
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Halaman moderasi listing dan kelola pengguna hanya untuk akun dengan role{" "}
              <span className="text-accent font-bold">admin</span>. Aktifkan Mode Admin di
              halaman Kelola Akun untuk melihat panel ini (demo sebelum Supabase auth
              tersambung).
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
              <button
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-signal text-black font-mono text-xs font-extrabold uppercase tracking-wider shadow-glow-signal active:scale-[0.98] transition-transform"
                onClick={() => {
                  saveAccount({ ...account, role: "admin" });
                  refresh();
                  toast("Mode Admin aktif — panel moderasi terbuka");
                }}
                type="button"
              >
                Aktifkan Mode Admin (Demo)
              </button>
              <Link
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-slate-300 hover:text-white hover:border-slate-500 font-mono text-xs text-center uppercase tracking-wider transition-colors"
                href="/account"
              >
                Ke Halaman Akun
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <ToastHost />
      </div>
    );
  }

  if (!account) {
    // render pertama (SSR + hydrasi) belum baca localStorage — tampilkan shell kosong
    return (
      <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans cyber-grid">
        <Navbar />
        <main className="flex-1" />
        <Footer />
      </div>
    );
  }

  const total = ITEMS.length;
  const downCount = Object.keys(takedowns).length;
  const live = total - downCount;
  const verified = users.filter((u) => u.ktm && !u.isBlocked).length;

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      refresh();
      emitStore();
      toast("Data moderasi dimuat ulang dari penyimpanan lokal");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans cyber-grid">
      <Navbar />

      <main className="w-full pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-6">
        {/* Banner verifikasi sistem (ikonik REFRENCE, angka diambil dari data nyata) */}
        <section className="relative overflow-hidden rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 sm:p-8 shadow-sm admin-anim">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-signal/10 text-signal border border-signal/40 font-mono text-[10px] font-bold uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
                  </span>
                  Panel Admin — Akses Khusus
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                  Sumber: katalog &amp; pengguna lokal
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono uppercase">
                Pusat Moderasi &amp; Integritas Kampus
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Setujui atau turunkan listing serta lihat, blokir, dan hapus akun pengguna
                Buyorrent. Katalog hanya menampilkan listing yang tayang.
              </p>
            </div>
            <div className="flex items-center gap-4 self-start lg:self-center">
              <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Katalog Tayang
                </span>
                <span className="text-xl font-mono font-black text-signal">
                  {live}/{total}
                </span>
              </div>
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-slate-200 hover:border-accent/50 font-mono text-xs uppercase tracking-wider transition-colors active:scale-[0.98]"
                onClick={handleSync}
                type="button"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Menyinkronkan…" : "Sinkron Data"}
              </button>
            </div>
          </div>
        </section>

        {/* Grid metrik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Metric
            icon={<Package className="w-5 h-5" />}
            label="Listing Tayang"
            sub={`${downCount} diturunkan admin • ${total} total listing`}
            tone="accent"
            value={String(live)}
          />
          <Metric
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Diturunkan"
            sub={downCount ? "Bisa dipulihkan kapan saja" : "Tidak ada — bersih"}
            tone="orange"
            value={String(downCount)}
          />
          <Metric
            icon={<Flag className="w-5 h-5" />}
            label="Laporan Terbuka"
            sub="Fitur laporan pelanggaran menyusul"
            tone="rose"
            value="0"
          />
          <Metric
            icon={<ShieldCheck className="w-5 h-5" />}
            label="Pengguna Terverifikasi"
            sub={`KTM valid & belum diblokir • ${users.length} total akun`}
            tone="signal"
            value={`${verified}`}
          />
        </div>

        {/* Tab navigasi admin (aktif mengikuti route, sesuai AI_CONTEXT §7) */}
        <nav className="p-1.5 bg-cyber-surface border border-cyber-border rounded-2xl flex flex-wrap items-center gap-1 font-mono text-xs admin-anim">
          {TABS.map((t) => {
            const active = pathname === t.href;
            const badge =
              t.href === "/admin/items" ? total : t.href === "/admin/users" ? users.length : null;
            return (
              <Link
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  active
                    ? "bg-accent text-black font-bold shadow-glow"
                    : "text-slate-400 hover:text-white hover:bg-cyber-card border border-transparent"
                }`}
                href={t.href}
                key={t.href}
              >
                <t.icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      active ? "bg-black/15" : "bg-cyber-bg text-slate-400 border border-cyber-border"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {children}
      </main>

      <Footer />
      <ToastHost />
    </div>
  );
}
