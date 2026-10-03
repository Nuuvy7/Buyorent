import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-cyber-bg border-t border-cyber-border py-12 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-black text-ink tracking-tight flex items-center gap-1">
                BUYORENT<span className="text-ink">.SYS</span>
              </span>
              <span className="bg-accent/10 text-ink border border-accent/30 text-[9px] font-bold px-2 py-0.5 rounded">
                v2.0
              </span>
            </div>
            <p className="text-slate-500 font-sans leading-relaxed text-xs">
              Platform jual beli barang pre-loved &amp; keahlian sesama pelajar dan mahasiswa Jakarta. Amanah, hemat, dan transparan.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest mb-3 text-[11px] text-ink">
              {"// JELAJAH_KATALOG"}
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <Link href="/items?category=barang" className="hover:text-ink transition-colors">
                  &gt; Semua Barang Pre-loved
                </Link>
              </li>
              <li>
                <Link href="/items?category=jasa" className="hover:text-ink transition-colors">
                  &gt; Jasa &amp; Freelance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest mb-3 text-[11px] text-ink">
              {"// PROTOKOL_KEAMANAN"}
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <Link href="/login" className="hover:text-ink transition-colors">
                  &gt; Masuk / Daftar Akun
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-ink transition-colors">
                  &gt; Kelola Akun
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest mb-3 text-[11px] text-ink">
              {"// JAMINAN_PRIVASI"}
            </h4>
            <div className="bg-cyber-surface border border-cyber-border p-3.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-ink font-bold mb-1">
                <Shield className="w-4 h-4 text-ink" />
                <span>Kerahasiaan Kontak Jasa</span>
              </div>
              <p className="text-slate-500 font-sans text-[11px] leading-relaxed">
                Nomor kontak WA penjual jasa baru dirilis ke pembeli setelah permintaan disetujui untuk menjaga privasi.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-cyber-border/70 flex flex-col md:flex-row items-center justify-between text-slate-500 gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} BUYORENT INDONESIA // ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
