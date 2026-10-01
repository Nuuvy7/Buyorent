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
import { KeyRound, LogIn, ShieldAlert } from "lucide-react";

const inputClass =
  "w-full bg-cyber-surface border border-cyber-border rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
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

  // middleware melempar ?blokir=1 setelah signOut paksa — tampilkan pesan
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("blokir") === "1") {
      setBlocked(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email.trim())) {
      setError("Format email tidak valid");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err || !data.user) {
      setLoading(false);
      setError(
        err?.message?.includes("Invalid login credentials")
          ? "Email atau password salah"
          : err?.message ?? "Gagal masuk, coba lagi"
      );
      return;
    }

    // Ambil baris profil (terisi trigger handle_new_user) → jembatani ke
    // localStorage sampai Tahap D memigrasi users.ts ke Supabase penuh.
    const { data: profile } = await supabase
      .from("users")
      .select("name, email, phone, campus, role, ktm, is_blocked")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile?.is_blocked) {
      await supabase.auth.signOut();
      setLoading(false);
      setBlocked(true);
      setError("Akun Anda diblokir oleh admin");
      return;
    }

    saveAccount({
      name: profile?.name ?? "",
      email: profile?.email ?? email.trim(),
      phone: profile?.phone ?? "",
      campus: profile?.campus ?? "",
      role: profile?.role === "admin" ? "admin" : "user",
      ktm: profile?.ktm ?? false,
    });
    toast("Berhasil masuk — selamat datang kembali");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans cyber-grid" ref={rootRef}>
      <Navbar />

      <main className="w-full flex-1 pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2 auth-anim">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              {"// "}Terminal Akses
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight">
              Masuk ke Buyorent
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Gunakan email dan password yang terdaftar. Semua akun bisa beli sekaligus jual.
            </p>
          </div>

          <form
            className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 sm:p-8 shadow-sm flex flex-col gap-4 auth-anim"
            onSubmit={handleLogin}
          >
            {blocked && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] leading-relaxed">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                Akun Anda diblokir oleh admin dan tidak dapat masuk. Hubungi admin kampus
                jika menurut Anda ini keliru.
              </div>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Email
              </span>
              <input
                autoCapitalize="none"
                className={inputClass}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@kampus.ac.id"
                type="email"
                value={email}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Password
              </span>
              <input
                className={inputClass}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                type="password"
                value={password}
              />
            </label>

            {error && <span className="text-[11px] text-rose-400">{error}</span>}

            <Button className="w-full font-mono mt-1" disabled={loading} type="submit" variant="default">
              <LogIn className="w-3.5 h-3.5" />
              {loading ? "Memproses…" : "Masuk"}
            </Button>

            <p className="text-[11px] text-slate-500 text-center">
              Belum punya akun?{" "}
              <Link className="text-accent hover:underline font-bold" href="/register">
                Daftar di sini
              </Link>
            </p>
          </form>

          <p className="text-[10px] text-slate-600 text-center font-mono uppercase tracking-widest flex items-center justify-center gap-1.5 auth-anim">
            <KeyRound className="w-3 h-3" /> Sesi dikelola Supabase Auth — tanpa verifikasi email
          </p>
        </div>
      </main>

      <Footer />
      <ToastHost />
    </div>
  );
}
