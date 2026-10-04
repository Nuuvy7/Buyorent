import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cyber-bg text-ink flex flex-col font-sans cyber-grid">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-20">
        <div className="bg-cyber-card/90 border border-cyber-border rounded-3xl p-10 max-w-md w-full text-center flex flex-col items-center gap-4 font-mono shadow-lg">
          <span className="text-6xl font-black text-accent leading-none">404</span>
          <h1 className="text-base font-bold text-ink uppercase tracking-wider">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            URL yang kamu buka tidak ada atau sudah dipindahkan. Cek lagi alamatnya atau
            kembali ke katalog.
          </p>
          <Link
            className="bg-accent text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
            href="/"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
