"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LokasiTitik } from "@/components/lokasi-titik";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchItems, type ItemRow } from "@/lib/items";
import { useStoreTick } from "@/lib/store";
import {
  useCart,
  removeFromCart,
  setChecked,
  setAllChecked,
  removeChecked,
  updateLine,
  type CartLine,
} from "@/lib/cart";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Recycle,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
  X,
  AlertTriangle,
} from "lucide-react";

const DELIVERY = [
  {
    id: "cod",
    title: "COD Titik Aman (Rekomendasi)",
    desc: "Serah terima langsung di titik publik yang ramai",
    price: "GRATIS",
    free: true,
  },
  {
    id: "kurir",
    title: "Ekspedisi Reguler / Antaraja",
    desc: "Kirim ke alamatmu di mana saja di DKI Jakarta",
    price: "+Rp 10.000",
    free: false,
  },
] as const;

const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2 text-xs text-slate-700 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors";

/* Satu baris item di keranjang: checkbox penjual, foto + stiker, sub-panel COD/brief */
function LineCard({ line, item }: { line: CartLine; item: ItemRow }) {
  const isService = item.category === "jasa";

  return (
    <div className="bg-cyber-card/90 rounded-3xl border border-cyber-border p-5 flex flex-col gap-4 shadow-sm">
      {/* Header penjual */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-cyber-border/70">
        <label className="flex items-center gap-2.5 cursor-pointer select-none min-w-0">
          <input
            checked={line.checked}
            className="w-4 h-4 accent-[#14213d] shrink-0"
            onChange={(e) => setChecked(item.id, e.target.checked)}
            type="checkbox"
          />
          <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/40 text-ink text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
            {item.seller.avatarText}
          </span>
          <span className="text-xs font-bold text-slate-700 truncate">{item.seller.name}</span>
          <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
            • {item.seller.campus}
          </span>
        </label>
        <Badge variant={isService ? "orange" : "default"} className="shrink-0">
          {isService ? "Jasa Mahasiswa Terkurasi" : "Pre-Loved Bersertifikat"}
        </Badge>
      </div>

      {/* Item */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-cyber-surface border border-cyber-border">
          <img alt={item.name} className="w-full h-full object-cover" src={item.imageUrl} />
          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/75 backdrop-blur-sm text-[#ffffff] rounded font-mono text-[10px]">
            {isService ? item.subLabel : item.badge}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-between gap-2 min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-bold text-ink leading-snug">{item.name}</h2>
              <button
                aria-label="Hapus item"
                className="text-slate-500 hover:text-rose-600 transition-colors p-1 shrink-0"
                onClick={() => removeFromCart(item.id)}
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono font-black text-ink">
              {fmt(item.price)}
              {item.priceUnit && (
                <span className="text-xs font-normal text-slate-500">{item.priceUnit}</span>
              )}
            </span>
            <span className="text-[11px] font-mono text-slate-500">Jumlah: 1 unit</span>
          </div>
        </div>
      </div>

      {/* Sub-panel per tipe item */}
      {isService ? (
        <div className="p-3.5 bg-cyber-surface/60 rounded-2xl border border-cyber-border/60 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700">
              Link Draft Materi / Instruksi Singkat:
            </span>
            <span className="text-[11px] text-slate-500">Google Drive / Notion</span>
          </div>
          <input
            className={inputClass}
            onChange={(e) => updateLine(item.id, { brief: e.target.value })}
            placeholder="https://drive.google.com/... (contoh: Sidang Daffa)"
            type="text"
            value={line.brief ?? ""}
          />
          <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
            <Clock className="w-3.5 h-3.5 text-ink shrink-0 mt-0.5" />
            Nomor WhatsApp penyedia jasa baru terbuka setelah penjual menyetujui pesanan.
          </p>
        </div>
      ) : (
        <div className="p-3.5 bg-cyber-surface/60 rounded-2xl border border-cyber-border/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-ink" />
              Titik Temu COD Bebas Ongkir
            </span>
            <span className="text-[10px] font-mono font-bold text-signal whitespace-nowrap">
              BEBAS BIAYA
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer border transition-colors ${
                line.codLoc === item.location
                  ? "bg-cyber-card border-accent/50"
                  : "bg-cyber-card/50 border-cyber-border hover:border-slate-500"
              }`}
            >
              <input
                checked={line.codLoc === item.location}
                className="accent-[#14213d] shrink-0"
                name={`cod-${item.id}`}
                onChange={() => updateLine(item.id, { codLoc: item.location })}
                type="radio"
              />
              <span className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-700 truncate">
                  {item.location ? (
                    <LokasiTitik value={item.location} fallback="Titik pilihan penjual" />
                  ) : (
                    "Titik pilihan penjual"
                  )}
                </span>
                <span className="text-[10px] text-slate-500">Titik pilihan penjual</span>
              </span>
            </label>
            <label
              className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer border transition-colors ${
                line.codLoc !== undefined && line.codLoc !== item.location
                  ? "bg-cyber-card border-accent/50"
                  : "bg-cyber-card/50 border-cyber-border hover:border-slate-500"
              }`}
            >
              <input
                checked={line.codLoc !== undefined && line.codLoc !== item.location}
                className="accent-[#14213d] shrink-0"
                name={`cod-${item.id}`}
                onChange={() => updateLine(item.id, { codLoc: "" })}
                type="radio"
              />
              <span className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-700 truncate">
                  Lainnya (pilih lokasi manual)
                </span>
                <span className="text-[10px] text-slate-500">Titik di luar daftar</span>
              </span>
            </label>
          </div>
          {line.codLoc !== undefined && line.codLoc !== item.location && (
            <input
              className={inputClass}
              onChange={(e) => updateLine(item.id, { codLoc: e.target.value })}
              placeholder="Tulis titik COD manual (contoh: Halte TransJakarta X, depan lobby)"
              type="text"
              value={line.codLoc}
            />
          )}
          {line.codLoc !== undefined && line.codLoc !== item.location && (
            <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-2.5 leading-relaxed flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Titik di luar daftar tidak diverifikasi. Pilih lokasi umum ramai dengan orang lain di
              sekitar, jangan bawa barang berharga berlebih, dan pilih jam ramai (07.00–21.00 WIB).
            </p>
          )}
          <input
            className={inputClass}
            onChange={(e) => updateLine(item.id, { note: e.target.value })}
            placeholder="Tulis catatan janji temu (contoh: 'Kemeja biru dekat gerbang utama')"
            type="text"
            value={line.note ?? ""}
          />
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  const lines = useCart();
  const router = useRouter();
  const [delivery, setDelivery] = useState<"cod" | "kurir">("cod");
  const rootRef = useRef<HTMLDivElement>(null);

  // katalog Supabase untuk resolusi baris keranjang (tick = muat ulang setelah aksi lain)
  const tick = useStoreTick();
  const [catalog, setCatalog] = useState<ItemRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchItems({ approvedOnly: true }).then((rows) => {
      if (!alive) return;
      setCatalog(rows);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [tick]);

  const rows = lines
    .map((l) => ({ line: l, item: catalog.find((i) => i.id === l.id) }))
    .filter((r): r is { line: CartLine; item: ItemRow } => !!r.item);
  const sel = rows.filter((r) => r.line.checked);
  const barang = sel.filter((r) => r.item.category === "barang").length;
  const jasa = sel.length - barang;
  const subtotal = sel.reduce((s, r) => s + r.item.price, 0);
  const ongkir = delivery === "kurir" && barang > 0 ? 10000 : 0;
  const total = subtotal + ongkir;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cart-col",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // item tercentang → halaman pembayaran (order dibuat di sana)
  const goCheckout = () => {
    if (!sel.length) return;
    router.push(ongkir > 0 ? `/checkout?ongkir=${ongkir}` : "/checkout");
  };

  return (
    <>
      <Navbar />
      <main
        className="w-full pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-6"
        ref={rootRef}
      >
        {/* Header & step indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-cyber-border">
          <div className="flex items-center gap-3">
            <Link
              aria-label="Kembali ke katalog"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cyber-surface border border-cyber-border text-slate-500 hover:text-ink hover:border-accent/50 transition-all shrink-0"
              href="/"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight">
                  Tas Belanja &amp; Checkout Mahasiswa
                </h1>
                <Badge variant="default">Status Tercatat</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pesanan tercatat dengan alur{" "}
                <span className="text-slate-600">Menunggu pembayaran → Diproses → Selesai</span>.
                Pembayaran transfer manual ke penjual.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="w-6 h-6 rounded-full bg-accent text-black font-bold flex items-center justify-center">
              1
            </span>
            <span className="font-semibold text-ink">Pilih Item</span>
            <ChevronRight className="w-3 h-3 text-slate-700" />
            <span className="w-6 h-6 rounded-full bg-cyber-surface border border-cyber-border text-slate-500 flex items-center justify-center">
              2
            </span>
            <span className="text-slate-500">Checkout &amp; Transfer Manual</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: item & persiapan serah terima */}
          <div className="lg:col-span-7 flex flex-col gap-6 cart-col">
            {!loaded ? (
              <div className="bg-cyber-card/90 rounded-3xl border border-cyber-border p-10 text-center font-mono text-xs text-slate-500 uppercase tracking-widest">
                Memuat keranjang…
              </div>
            ) : rows.length === 0 ? (
              <div className="bg-cyber-card/90 rounded-3xl border border-cyber-border p-10 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyber-surface border border-cyber-border flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <h2 className="text-sm font-mono font-black text-ink uppercase tracking-widest">
                    Keranjang Belanja Kosong
                  </h2>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm">
                    Belum ada barang pre-loved atau jasa mahasiswa di keranjang. Jelajahi katalog
                    dulu, lalu tekan tombol keranjang pada item yang kamu mau.
                  </p>
                </div>
                <Button asChild variant="cyan">
                  <Link className="font-mono" href="/">
                    JELAJAHI KATALOG
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Selection bar */}
                <div className="flex items-center justify-between p-4 bg-cyber-card/90 rounded-2xl border border-cyber-border gap-3 flex-wrap">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      checked={rows.length > 0 && sel.length === rows.length}
                      className="w-4 h-4 accent-[#14213d]"
                      onChange={(e) => setAllChecked(e.target.checked)}
                      type="checkbox"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      Pilih Semua Item ({rows.length})
                    </span>
                  </label>
                  <button
                    className="text-xs font-mono text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:hover:text-slate-500"
                    disabled={sel.length === 0}
                    onClick={removeChecked}
                    type="button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    HAPUS TERPILIH ({sel.length})
                  </button>
                </div>

                {rows.map((r) => (
                  <LineCard item={r.item} key={r.line.id} line={r.line} />
                ))}

                {/* Circular economy */}
                <div className="p-5 rounded-3xl bg-accent/5 border border-accent/25 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/40 text-ink flex items-center justify-center shrink-0">
                    <Recycle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">Gerakan Hemat Sirkular</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Dengan memilih pre-loved dari sesama warga Jakarta, kamu memperpanjang masa
                      pakai alat kuliah dan memangkas limbah elektronik di civitas akademika — tanpa
                      harus beli baru.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: ringkasan & checkout */}
          <aside className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start cart-col">
            {/* Metode penyerahan */}
            <div className="bg-cyber-card/90 rounded-3xl p-5 border border-cyber-border flex flex-col gap-3">
              <h3 className="text-sm font-bold text-ink font-mono uppercase tracking-wide flex items-center gap-2">
                <Truck className="w-4 h-4 text-ink" /> Metode Penyerahan
              </h3>
              <div className="flex flex-col gap-2">
                {DELIVERY.map((d) => (
                  <label
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl cursor-pointer transition-colors border ${
                      delivery === d.id
                        ? "bg-cyber-surface border-accent/50"
                        : "bg-cyber-surface/60 border-cyber-border hover:border-slate-500"
                    }`}
                    key={d.id}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        checked={delivery === d.id}
                        className="accent-[#14213d] shrink-0"
                        name="delivery_opt"
                        onChange={() => setDelivery(d.id)}
                        type="radio"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink">{d.title}</p>
                        <p className="text-[11px] text-slate-500">{d.desc}</p>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-[11px] font-bold shrink-0 ${
                        d.free ? "text-signal" : "text-slate-500"
                      }`}
                    >
                      {d.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ringkasan transaksi */}
            <div className="bg-cyber-card/90 rounded-3xl p-5 border border-cyber-border flex flex-col gap-4">
              <h3 className="text-sm font-bold text-ink font-mono uppercase tracking-wide">
                Ringkasan Transaksi
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>
                    Subtotal Item ({barang} Barang, {jasa} Jasa)
                  </span>
                  <span className="font-semibold text-slate-700">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Ongkir COD Mahasiswa</span>
                  <span className={ongkir === 0 ? "text-signal font-semibold" : "text-slate-700"}>
                    {ongkir === 0 ? "Rp 0 (Bebas Ongkir)" : fmt(ongkir)}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-cyber-border flex items-end justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-500">Total Pembayaran</span>
                  <p className="text-xl font-mono font-black text-ink leading-tight">
                    {fmt(total)}
                  </p>
                </div>
                <Badge variant="default">Tanpa Biaya Admin</Badge>
              </div>

              {/* Instruksi pembayaran manual — PRD: belum ada payment gateway */}
              <div className="p-4 bg-cyber-surface/60 rounded-2xl border border-cyber-border/60 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">
                    Pembayaran Manual ke Penjual
                  </span>
                  <span className="text-[10px] font-mono font-bold text-signal">
                    TRANSFER LANGSUNG
                  </span>
                </div>
                <ol className="flex flex-col gap-1.5 text-[11px] text-slate-500 list-decimal list-inside leading-relaxed">
                  <li>
                    Isi data pengiriman di halaman pembayaran — status tercatat{" "}
                    <b className="text-slate-700">Menunggu pembayaran</b>.
                  </li>
                  <li>
                    Transfer manual sesuai total ke rekening penjual yang disampaikan lewat chat
                    pesanan.
                  </li>
                  <li>
                    Penjual menandai lunas → <b className="text-slate-700">Diproses</b>, lalu{" "}
                    <b className="text-slate-700">Selesai</b> setelah serah terima.
                  </li>
                </ol>
                <p className="flex items-start gap-1.5 text-[11px] text-ink leading-relaxed">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Jangan transfer ke rekening lain di luar kesepakatan pesanan, dan pastikan pesanan
                  sudah tercatat sebelum mengirim dana.
                </p>
              </div>

              {/* Aksi utama */}
              <Button
                className="w-full whitespace-normal"
                disabled={sel.length === 0}
                onClick={goCheckout}
                size="lg"
                variant="default"
              >
                <span className="flex items-center gap-2 font-mono">
                  LANJUT KE HALAMAN PEMBAYARAN
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
              {sel.length === 0 && (
                <p className="text-[11px] font-mono text-slate-500 text-center">
                  PILIH MINIMAL 1 ITEM UNTUK CHECKOUT.
                </p>
              )}

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-5 pt-1 text-[11px] text-slate-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-signal" /> Verifikasi KTM Aktif
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-signal" /> Status Transaksi Tercatat
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
