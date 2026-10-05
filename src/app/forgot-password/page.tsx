"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Mail, ShieldAlert } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-700 focus:outline-none focus:border-accent transition-colors";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setErr(null);
    if (!EMAIL_RE.test(email)) {
      setErr("Format email tidak valid.");
      return;
    }
    setLoading(true);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      // respons error (rate limit dsb) — jangan bocorkan status email
      setErr("Gagal mengirim email. Coba lagi beberapa menit lagi.");
      return;
    }
    // respons seragam terdaftar/tidak (standard Supabase) — jangan diubah
    router.push("/login?reset=1");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid relative overflow-hidden">
      <main className="relative z-10 max-w-md mx-auto px-6 py-24">
        <div className="text-center mb-8">
          <p className="font-mono text-ink text-xs">{"// pemulihan akun"}</p>
          <h1 className="font-black text-3xl uppercase text-ink mt-2">Lupa Password</h1>
        </div>
        <form onSubmit={handleSubmit} className="rounded-3xl bg-cyber-card border border-cyber-border p-6 space-y-4">
          {err && (
            <p className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono leading-relaxed">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              {err}
            </p>
          )}
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Masukkan email akunmu. Kami kirimkan link untuk membuat password baru —
            berlaku terbatas, cek juga folder spam.
          </p>
          <label className="block">
            <span className="font-mono text-[10px] text-slate-500">EMAIL</span>
            <input
              className={inputClass}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
            />
          </label>
          <Button className="w-full font-mono" disabled={loading} type="submit" variant="cyan">
            {loading ? "Mengirim…" : <>Kirim Link Reset <Mail className="w-4 h-4" /></>}
          </Button>
          <p className="text-center font-mono text-xs text-slate-500">
            Ingat password?{" "}
            <Link className="text-ink underline" href="/login">
              Masuk <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
