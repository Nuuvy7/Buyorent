"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToastHost, toast } from "@/components/toast";
import { getAccount, saveAccount, type AccountRecord } from "@/lib/users";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Save,
  ShieldCheck,
  UserCog,
} from "lucide-react";

const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:08|628)\d{8,11}$/;

export default function AccountPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [account, setAccount] = useState<AccountRecord | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", campus: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  useEffect(() => {
    const acc = getAccount();
    setAccount(acc);
    setForm({ name: acc.name, email: acc.email, phone: acc.phone, campus: acc.campus });
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

  const handleSave = (e: React.FormEvent) => {
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
      campus: form.campus.trim(),
    };
    setAccount(updated);
    saveAccount(updated);
    toast("Perubahan profil tersimpan");
  };

  const setRole = (role: "user" | "admin") => {
    if (!account || account.role === role) return;
    const updated = { ...account, role };
    setAccount(updated);
    saveAccount(updated);
    toast(role === "admin" ? "Mode Admin aktif — panel moderasi terbuka" : "Mode Pengguna aktif");
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans cyber-grid" ref={rootRef}>
      <Navbar />

      <main className="w-full pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
        {/* Header halaman */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 acct-anim">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              {"// "}
              Pengaturan Akun
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight mt-1">
              Kelola Akun
            </h1>
            <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
              Perbarui identitas yang dipakai saat transaksi — nama tampil di listing dan
              pesanan, no. HP dipakai penjual jasa untuk menghubungi setelah booking ACC.
            </p>
          </div>
          {account?.ktm && (
            <Badge variant="solid">
              <CheckCircle2 className="w-3 h-3" /> KTM Terverifikasi
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Kartu profil (form) */}
          <form className="lg:col-span-2 rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 sm:p-8 shadow-sm flex flex-col gap-5 acct-anim" onSubmit={handleSave}>
            <div className="flex items-center gap-2">
              <UserCog className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-black text-white font-mono uppercase tracking-widest">
                Profil Saya
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
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
                  <span className="text-[11px] text-rose-400">{errors.name}</span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Email Login
                </span>
                <input
                  className={inputClass}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nama@kampus.ac.id"
                  type="email"
                  value={form.email}
                />
                {errors.email && (
                  <span className="text-[11px] text-rose-400">{errors.email}</span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
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
                  <span className="text-[11px] text-rose-400">{errors.phone}</span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Kampus
                </span>
                <input
                  className={inputClass}
                  onChange={(e) => setForm({ ...form, campus: e.target.value })}
                  placeholder="UI Salemba"
                  type="text"
                  value={form.campus}
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-signal" />
                Email & password login dikelola Supabase Auth (menyusul).
              </p>
              <Button className="font-mono" size="sm" type="submit" variant="default">
                <Save className="w-3.5 h-3.5" /> Simpan Perubahan
              </Button>
            </div>
          </form>

          {/* Ringkasan + akses akun */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 shadow-sm flex flex-col items-center text-center gap-3 acct-anim">
              <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/40 text-accent flex items-center justify-center font-mono font-black text-2xl">
                {(account?.name || "A").charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {account?.name ?? "Memuat…"}
                </p>
                <p className="text-[11px] text-slate-500 break-all">{account?.email}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant={account?.role === "admin" ? "default" : "muted"}>
                  {account?.role === "admin" ? "Admin" : "Pengguna"}
                </Badge>
                <Badge variant="muted">
                  <GraduationCap className="w-3 h-3" /> {account?.campus}
                </Badge>
              </div>
            </div>

            <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 shadow-sm flex flex-col gap-4 acct-anim">
              <h2 className="text-sm font-black text-white font-mono uppercase tracking-widest">
                Akses &amp; Peran
              </h2>
              <div className="p-1 bg-cyber-surface border border-cyber-border rounded-2xl flex items-center gap-1">
                {(["user", "admin"] as const).map((r) => (
                  <button
                    className={`flex-1 px-3 py-2 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider transition-all ${
                      account?.role === r
                        ? "bg-accent text-black shadow-glow"
                        : "text-slate-400 hover:text-white"
                    }`}
                    key={r}
                    onClick={() => setRole(r)}
                    type="button"
                  >
                    {r === "user" ? "Pengguna" : "Admin"}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Role menentukan akses panel: moderasi listing &amp; kelola pengguna hanya untuk
                admin.
              </p>
              {account?.role === "admin" && (
                <Button asChild variant="cyan">
                  <Link href="/admin" className="font-mono">
                    Buka Panel Admin <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ToastHost />
    </div>
  );
}
