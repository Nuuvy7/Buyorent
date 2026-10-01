"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ToastHost, toast } from "@/components/toast";
import { createClient } from "@/lib/supabase/client";
import { saveAccount } from "@/lib/users";
import { UserPlus, IdCard } from "lucide-react";

const inputClass =
  "w-full bg-cyber-surface border border-cyber-border rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:08|628)\d{8,11}$/;

export default function RegisterPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".auth-anim",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 3) return setError("Nama minimal 3 karakter");
    if (!PHONE_RE.test(form.phone.trim()))
      return setError("Nomor HP diawali 08 / 628, total 10–14 digit");
    if (!EMAIL_RE.test(form.email.trim())) return setError("Format email tidak valid");
    if (form.password.length < 6) return setError("Password minimal 6 karakter");

    setLoading(true);
    const supabase = createClient();
    // Trigger handle_new_user (schema.sql) mengisi tabel users dari metadata ini.
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { name: form.name.trim(), phone: form.phone.trim() } },
    });

    if (err) {
      setLoading(false);
      setError(
        err.message.toLowerCase().includes("already registered") ||
          err.code === "user_already_exists"
          ? "Email sudah terdaftar, silakan masuk"
          : err.message ?? "Pendaftaran gagal, coba lagi"
      );
      return;
    }

    if (!data.session) {
      // Verifikasi email ternyata aktif di project — fallback aman.
      setLoading(false);
      toast("Pendaftaran berhasil, silakan masuk");
      router.push("/login");
      return;
    }

    saveAccount({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      campus: "",
      role: "user",
      ktm: false,
    });
    toast("Pendaftaran berhasil — selamat datang di Buyorent!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans cyber-grid" ref={rootRef}>
      <Navbar />

      <main className="w-full flex-1 pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-lg mx-auto flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2 auth-anim">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              {"// "}Registrasi Akun Baru
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight">
              Daftar Buyorent
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Satu akun untuk beli dan jual. Tanpa verifikasi email — langsung aktif.
            </p>
          </div>

          <form
            className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 sm:p-8 shadow-sm flex flex-col gap-4 auth-anim"
            onSubmit={handleRegister}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Nama Lengkap
                </span>
                <input
                  className={inputClass}
                  onChange={set("name")}
                  placeholder="Nama lengkap"
                  type="text"
                  value={form.name}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  No. HP / WA
                </span>
                <input
                  className={inputClass}
                  onChange={set("phone")}
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                  value={form.phone}
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Email
              </span>
              <input
                autoCapitalize="none"
                className={inputClass}
                onChange={set("email")}
                placeholder="nama@kampus.ac.id"
                type="email"
                value={form.email}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Password
              </span>
              <input
                className={inputClass}
                onChange={set("password")}
                placeholder="Minimal 6 karakter"
                type="password"
                value={form.password}
              />
            </label>

            {error && <span className="text-[11px] text-rose-400">{error}</span>}

            <Button className="w-full font-mono mt-1" disabled={loading} type="submit" variant="default">
              <UserPlus className="w-3.5 h-3.5" />
              {loading ? "Memproses…" : "Daftar Sekarang"}
            </Button>

            <p className="text-[11px] text-slate-500 text-center">
              Sudah punya akun?{" "}
              <Link className="text-accent hover:underline font-bold" href="/login">
                Masuk di sini
              </Link>
            </p>
          </form>

          <p className="text-[10px] text-slate-600 text-center font-mono uppercase tracking-widest flex items-center justify-center gap-1.5 auth-anim">
            <IdCard className="w-3 h-3" /> Nama & no. HP dipakai untuk kontak transaksi & jasa
          </p>
        </div>
      </main>

      <Footer />
      <ToastHost />
    </div>
  );
}
