"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Footer } from "@/components/footer";
import { ToastHost, toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors";

export default function LoginPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    if (!rootRef.current) return;
    const els = rootRef.current.querySelectorAll('[data-acct="section"]');
    gsap.set(els, { y: 30, opacity: 0 });
    gsap.to(els, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out", delay: 0.1 });
  }, []);

  function validate() {
    const e: { [k: string]: string } = {};
    if (!EMAIL_RE.test(form.email)) e.email = "Format email tidak valid.";
    if (form.password.length < 6) e.password = "Password minimal 6 karakter.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    // ponytail: stub sampai fase backend (HANDOFF bagian C) → ganti jadi
    // supabase.auth.signInWithPassword + cek is_blocked + router.push("/")
    toast("Login akan aktif setelah backend Supabase tersambung.");
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-cyber-bg cyber-grid relative overflow-hidden">
      <main className="relative z-10 max-w-md mx-auto px-6 py-24">
        <div data-acct="section" className="text-center mb-8">
          <p className="font-mono text-ink text-xs">{"// akses akun"}</p>
          <h1 className="font-black text-3xl uppercase text-ink mt-2">Masuk</h1>
        </div>
        <form
          data-acct="section"
          onSubmit={handleSubmit}
          className="rounded-3xl bg-cyber-card border border-cyber-border p-6 space-y-4"
        >
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
            Masuk <LogIn className="w-4 h-4" />
          </Button>
          <p className="text-center font-mono text-xs text-slate-500">
            Belum punya akun?{" "}
            <Link href="/register" className="text-ink underline">
              Daftar <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </p>
        </form>
      </main>
      <Footer />
      <ToastHost />
    </div>
  );
}
