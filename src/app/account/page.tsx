"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToastHost, toast } from "@/components/toast";
import { getAccount, saveAccount, clearAccount, type AccountRecord } from "@/lib/users";
import { KECAMATAN_COD } from "@/lib/cod-points";
import { resetCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  CheckCircle2,
  LogOut,
  Save,
  ShieldCheck,
  UserCog,
} from "lucide-react";

const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2.5 text-xs font-semibold text-ink placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:08|628)\d{8,11}$/;

export default function AccountPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [account, setAccount] = useState<AccountRecord | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", kecamatan: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  useEffect(() => {
    let alive = true;
    getAccount().then((acc) => {
      if (!alive || !acc) return;
      setAccount(acc);
      setForm({ name: acc.name, email: acc.email, phone: acc.phone, kecamatan: acc.kecamatan ?? "" });
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".acct-anim",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    const next: typeof errors = {};
    if (form.name.trim().length < 3) next.name = "Nama minimal 3 karakter";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Format email tidak valid";
    if (!PHONE_RE.test(form.phone.trim()))
      next.phone = "Nomor HP diawali 08 / 628, total 10–14 digit";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const updated: AccountRecord = {
      ...account,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      kecamatan: form.kecamatan.trim(), // pilihan kecamatan profil (menggantikan field kampus lama)
    };
    const r = await saveAccount(updated);
    if (!r.ok) {
      toast(`Gagal menyimpan: ${r.error}`);
      return;
    }
    setAccount(updated);
    toast("Perubahan profil tersimpan");
  };

  // Role = kolom users di database; promosi admin hanya via supabase/setup-admin.sql
  // (RLS WITH CHECK memblokir promosi diri) — toggle demo sudah dihapus (Tahap D3).

  // Tahap C: keluar dari sesi Supabase + hapus jembatan localStorage.
  const handleLogout = async () => {
    await createClient().auth.signOut();
    clearAccount();
    resetCart(); // state cart lokal — user berikutnya mulai bersih (Tahap D2)
    toast("Anda telah keluar dari akun");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-ink flex flex-col font-sans cyber-grid" ref={rootRef}>
      <Navbar />

      <main className="w-full pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
        {/* Header halaman */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 acct-anim">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink">
              {"// "}
              Pengaturan Akun
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-ink font-mono uppercase tracking-tight mt-1">
              Kelola Akun
            </h1>
            <p className="text-xs text-slate-500 mt-2 max-w-xl leading-relaxed">
              Perbarui identitas yang dipakai saat transaksi — nama tampil di listing dan
              pesanan, no. HP dipakai penjual jasa untuk menghubungi setelah booking ACC.
            </p>
          </div>
          {account?.ktm && (
            <Badge variant="solid">
              <CheckCircle2 className="w-3 h-3" /> Identitas Terverifikasi
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Kartu profil (form) */}
          <form className="lg:col-span-2 rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 sm:p-8 shadow-sm flex flex-col gap-5 acct-anim" onSubmit={handleSave}>
            <div className="flex items-center gap-2">
              <UserCog className="w-4 h-4 text-ink" />
              <h2 className="text-sm font-black text-ink font-mono uppercase tracking-widest">
                Profil Saya
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                  Nama Lengkap
                </span>
                <input
                  className={inputClass}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama lengkap"
                  type="text"
                  value={form.name}
                />
                {errors.name && (
                  <span className="text-[11px] text-rose-600">{errors.name}</span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                  Email Login
                </span>
                <input
                  className={inputClass}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nama@email.com"
                  type="email"
                  value={form.email}
                />
                {errors.email && (
                  <span className="text-[11px] text-rose-600">{errors.email}</span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                  No. HP / WA
                </span>
                <input
                  className={inputClass}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                  value={form.phone}
                />
                {errors.phone && (
                  <span className="text-[11px] text-rose-600">{errors.phone}</span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                  Wilayah / Kecamatan
                </span>
                <select
                  className={inputClass}
                  onChange={(e) => setForm({ ...form, kecamatan: e.target.value })}
                  value={form.kecamatan}
                >
                  <option value="">Belum dipilih</option>
                  {KECAMATAN_COD.map((k) => (
                    <option key={k.nama} value={k.nama}>
                      {k.nama} — {k.kota}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-signal" />
                Email & password login dikelola Supabase Auth (menyusul).
              </p>
              <Button className="font-mono font-bold tracking-wider" size="sm" type="submit" variant="default">
                <Save className="w-3.5 h-3.5" /> Simpan Perubahan
              </Button>
            </div>
          </form>

          {/* Ringkasan + akses akun */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 shadow-sm flex flex-col items-center text-center gap-3 acct-anim">
              <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/40 text-ink flex items-center justify-center font-mono font-black text-2xl">
                {(account?.name || "A").charAt(0)}
              </div>
              <div>
                <p className="text-base font-black text-ink">
                  {account?.name ?? "Memuat…"}
                </p>
                <p className="text-xs font-semibold text-slate-300 break-all">{account?.email}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant={account?.role === "admin" ? "default" : "muted"}>
                  {account?.role === "admin" ? "Admin" : "Pengguna"}
                </Badge>
              </div>
            </div>

            <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 shadow-sm flex flex-col gap-4 acct-anim">
              <h2 className="text-sm font-black text-ink font-mono uppercase tracking-widest">
                Akses &amp; Peran
              </h2>
              <div className="p-1 bg-cyber-surface border border-cyber-border rounded-2xl flex items-center gap-1">
                {(["user", "admin"] as const).map((r) => (
                  <span
                    className={`flex-1 px-3 py-2 rounded-xl font-mono text-[11px] font-black uppercase tracking-wider text-center transition-all ${
                      account?.role === r
                        ? "bg-accent text-black shadow-glow"
                        : "text-slate-400 font-bold"
                    }`}
                    key={r}
                  >
                    {r === "user" ? "Pengguna" : "Admin"}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Role menentukan akses panel: moderasi listing &amp; kelola pengguna hanya untuk
                admin. Perubahan role diatur tim pengelola lewat database.
              </p>
              {account?.role === "admin" && (
                <Button asChild variant="cyan">
                  <Link href="/admin" className="font-mono">
                    Buka Panel Admin <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              )}
              <div className="pt-1 border-t border-cyber-border mt-1">
                <button
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyber-surface border border-rose-500/40 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors active:scale-[0.98]"
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut className="w-3.5 h-3.5" /> Keluar dari Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ToastHost />
    </div>
  );
}
