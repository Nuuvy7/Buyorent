"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Footer } from "@/components/footer";
import { ToastHost, toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:08|628)\d{8,11}$/;
const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors";

export default function RegisterPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    if (!rootRef.current) return;
    const els = rootRef.current.querySelectorAll('[data-acct="section"]');
    gsap.set(els, { y: 30, opacity: 0 });
    gsap.to(els, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out", delay: 0.1 });
  }, []);

  function validate() {
    const e: { [k: string]: string } = {};
    if (form.name.trim().length < 3) e.name = "Nama minimal 3 karakter.";
    if (!EMAIL_RE.test(form.email)) e.email = "Format email tidak valid.";
    if (!PHONE_RE.test(form.phone)) e.phone = "Format no. HP tidak valid.";
    if (form.password.length < 6) e.password = "Password minimal 6 karakter.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    // ponytail: stub sampai fase backend (HANDOFF bagian C) → ganti jadi
    // supabase.auth.signUp({ email, password }, { options: { data: { name, phone } } })
    // — trigger handle_new_user otomatis isi tabel users.
    toast("Akun bisa dibuat setelah backend Supabase tersambung.");
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-cyber-bg cyber-grid relative overflow-hidden">
      <main className="relative z-10 max-w-md mx-auto px-6 py-24">
        <div data-acct="section" className="text-center mb-8">
          <p className="font-mono text-ink text-xs">{"// buat akun baru"}</p>
          <h1 className="font-black text-3xl uppercase text-ink mt-2">Daftar</h1>
        </div>
        <form
          data-acct="section"
          onSubmit={handleSubmit}
          className="rounded-3xl bg-cyber-card border border-cyber-border p-6 space-y-4"
        >
          <label className="block">
            <span className="font-mono text-[10px] text-slate-500">NAMA LENGKAP</span>
            <input
              type="text"
              placeholder="Nama kamu"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
            {errors.name && <p className="text-[11px] text-red-600 font-mono mt-1">{errors.name}</p>}
          </label>
          <label className="block">
            <span className="font-mono text-[10px] text-slate-500">EMAIL</span>
            <input
              type="email"
              placeholder="nama@kampus.ac.id"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
            {errors.email && <p className="text-[11px] text-red-600 font-mono mt-1">{errors.email}</p>}
          </label>
          <label className="block">
            <span className="font-mono text-[10px] text-slate-500">NO. HP / WA</span>
            <input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
            {errors.phone && <p className="text-[11px] text-red-600 font-mono mt-1">{errors.phone}</p>}
          </label>
          <label className="block">
            <span className="font-mono text-[10px] text-slate-500">PASSWORD</span>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
            {errors.password && <p className="text-[11px] text-red-600 font-mono mt-1">{errors.password}</p>}
          </label>
          <Button type="submit" variant="cyan" className="w-full font-mono">
            Daftar <UserPlus className="w-4 h-4" />
          </Button>
          <p className="text-center font-mono text-xs text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-ink underline">
              Masuk <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </p>
        </form>
      </main>
      <Footer />
      <ToastHost />
    </div>
  );
}
