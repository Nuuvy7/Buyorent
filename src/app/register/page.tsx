"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Footer } from "@/components/footer";
import { ToastHost, toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { flushGuestCart } from "@/lib/cart";
import { ArrowRight, UserPlus } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:08|628)\d{8,11}$/;
const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder:text-slate-600 focus:outline-none focus:border-accent transition-colors";

export default function RegisterPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Tombol aktif hanya saat semua field terisi & T&C dicentang (BUG-08).
  const canSubmit =
    form.name.trim().length >= 3 &&
    form.email.includes("@") &&
    form.phone.length >= 10 &&
    form.password.length >= 6 &&
    agreed;

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

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setFormError(null);
    if (!validate()) return;
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
      setFormError(
        err.message.toLowerCase().includes("already registered") ||
          err.code === "user_already_exists"
          ? "Email sudah terdaftar, silakan masuk."
          : err.message ?? "Pendaftaran gagal, coba lagi."
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

    // Jembatan localStorage tidak perlu: trigger handle_new_user sudah mengisi
    // tabel users (nama/HP dari metadata) — getAccount membacanya langsung (D3).
    void flushGuestCart(); // tulis buffer cart tamu ke server (Tahap D2)
    toast("Pendaftaran berhasil — selamat datang di Buyorent!");
    router.push("/");
    router.refresh();
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
          {formError && (
            <p className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono">
              {formError}
            </p>
          )}
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
              placeholder="nama@email.com"
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
          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-500 font-sans">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded text-ink bg-cyber-bg border-cyber-border"
            />
            <span>
              Saya menyetujui{" "}
              <span className="text-ink font-bold">Syarat &amp; Ketentuan</span> penggunaan Buyorent.
            </span>
          </label>
          <Button type="submit" variant="cyan" className="w-full font-mono" disabled={loading || !canSubmit}>
            {loading ? "Memproses…" : <>Daftar <UserPlus className="w-4 h-4" /></>}
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
