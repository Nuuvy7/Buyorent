"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, KeyRound, ShieldAlert } from "lucide-react";

const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-700 focus:outline-none focus:border-accent transition-colors";

// Tujuan link email reset. Client (PKCE, detectSessionInUrl=true) menukar ?code=
// / fragment #access_token otomatis jadi sesi recovery — halaman ini tinggal
// menunggu sesi muncul lalu memanggil updateUser.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    let tries = 0;
    async function check() {
      const { data } = await createClient().auth.getSession();
      if (!alive) return;
      if (data.session) {
        setStatus("ready");
        return;
      }
      // tukar code bersifat async — beri kesempatan beberapa detik
      if (tries++ < 10) setTimeout(check, 500);
      else setStatus("invalid");
    }
    void check();
    return () => {
      alive = false;
    };
  }, []);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setErr(null);
    if (pw.length < 6) return setErr("Password minimal 6 karakter.");
    if (pw !== pw2) return setErr("Konfirmasi password tidak sama.");
    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password: pw });
    setLoading(false);
    if (error) {
      setErr(
        error.message?.includes("should be different")
          ? "Password baru harus beda dari password lama."
          : error.message || "Gagal mengubah password. Minta link baru."
      );
      return;
    }
    router.push("/login?reset=done");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid relative overflow-hidden">
      <main className="relative z-10 max-w-md mx-auto px-6 py-24">
        <div className="text-center mb-8">
          <p className="font-mono text-ink text-xs">{"// pemulihan akun"}</p>
          <h1 className="font-black text-3xl uppercase text-ink mt-2">Password Baru</h1>
        </div>

        {status === "checking" && (
          <div className="rounded-3xl bg-cyber-card border border-cyber-border p-6 text-center font-mono text-xs text-slate-500">
            Memverifikasi link…
          </div>
        )}

        {status === "invalid" && (
          <div className="rounded-3xl bg-cyber-card border border-cyber-border p-6 flex flex-col items-center gap-4 text-center">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Link tidak valid atau sudah kedaluwarsa. Minta link baru —
              dan pastikan membukanya di browser yang sama tempat kamu meminta reset.
            </p>
            <Link
              className="bg-accent text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              href="/forgot-password"
            >
              Minta Link Baru
            </Link>
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit} className="rounded-3xl bg-cyber-card border border-cyber-border p-6 space-y-4">
            {err && (
              <p className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono leading-relaxed">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                {err}
              </p>
            )}
            <label className="block">
              <span className="font-mono text-[10px] text-slate-500">PASSWORD BARU</span>
              <input
                className={inputClass}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Minimal 6 karakter"
                type="password"
                value={pw}
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] text-slate-500">ULANGI PASSWORD</span>
              <input
                className={inputClass}
                onChange={(e) => setPw2(e.target.value)}
                placeholder="Sama dengan di atas"
                type="password"
                value={pw2}
              />
            </label>
            <Button className="w-full font-mono" disabled={loading} type="submit" variant="cyan">
              {loading ? "Menyimpan…" : <>Simpan Password Baru <KeyRound className="w-4 h-4" /></>}
            </Button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
