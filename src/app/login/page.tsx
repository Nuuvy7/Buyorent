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
import { ArrowRight, LogIn, ShieldAlert } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-700 focus:outline-none focus:border-accent transition-colors";

export default function LoginPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    const els = rootRef.current.querySelectorAll('[data-acct="section"]');
    gsap.set(els, { y: 30, opacity: 0 });
    gsap.to(els, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out", delay: 0.1 });
  }, []);

  // middleware melempar ?blokir=1 setelah signOut paksa — tampilkan pesan
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("blokir") === "1") {
      setBlocked(true);
    }
  }, []);

  // alur forgot-password: ?reset=1 (link terkirim) / ?reset=done (password baru tersimpan)
  useEffect(() => {
    const reset = new URLSearchParams(window.location.search).get("reset");
    if (reset === "1") toast("Link reset dikirim ke email. Cek inbox dan folder spam.");
    if (reset === "done") toast("Password berhasil diubah. Silakan masuk kembali.");
  }, []);

  function validate() {
    const e: { [k: string]: string } = {};
    if (!EMAIL_RE.test(form.email)) e.email = "Format email tidak valid.";
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
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (err || !data.user) {
      setLoading(false);
      setFormError(
        err?.message?.includes("Invalid login credentials")
          ? "Email atau password salah."
          : err?.message ?? "Gagal masuk, coba lagi."
      );
      return;
    }

    // Cek baris profil (terisi trigger handle_new_user) — hanya untuk blokir.
    // Profil & role dibaca langsung dari tabel users oleh getAccount (Tahap D3).
    const { data: profile } = await supabase
      .from("users")
      .select("is_blocked")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile?.is_blocked) {
      await supabase.auth.signOut();
      setLoading(false);
      setBlocked(true);
      setFormError("Akun Anda diblokir oleh admin.");
      return;
    }

    void flushGuestCart(); // tulis buffer cart tamu ke server (Tahap D2)
    toast("Berhasil masuk — selamat datang kembali");
    router.push("/");
    router.refresh();
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
          {blocked && (
            <p className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono leading-relaxed">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              Akun Anda diblokir oleh admin dan tidak dapat masuk. Hubungi admin Buyorent
              jika menurut Anda ini keliru.
            </p>
          )}
          {formError && (
            <p className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono">
              {formError}
            </p>
          )}
          <label className="block">
            <span className="font-mono text-[10px] text-slate-500">EMAIL</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="nama@email.com"
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
              name="password"
              autoComplete="current-password"
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
            {errors.password && <p className="text-[11px] text-red-600 font-mono mt-1">{errors.password}</p>}
          </label>
          <div className="text-right -mt-2">
            <Link className="font-mono text-[11px] text-slate-500 hover:text-ink underline" href="/forgot-password">
              Lupa password?
            </Link>
          </div>
          <Button type="submit" variant="cyan" className="w-full font-mono" disabled={loading}>
            {loading ? "Memproses…" : <>Masuk <LogIn className="w-4 h-4" /></>}
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
