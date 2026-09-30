"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ITEMS } from "@/lib/items";
import {
  COD_SPOTS,
  useCart,
  removeChecked,
  type CartLine,
} from "@/lib/cart";
import type { ItemData } from "@/components/item-card";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Copy,
  ShieldCheck,
  Truck,
  Upload,
} from "lucide-react";

const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const inputClass =
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors disabled:opacity-60";

const inputClassArea = inputClass + " min-h-[72px] resize-none leading-relaxed";

interface Entry {
  item: ItemData;
  line?: CartLine;
}

interface OrderRecord {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  address: string;
  phone: string;
  paymentProof: string | null;
  items: {
    id: string;
    name: string;
    price: number;
    isService: boolean;
    serviceApproved: boolean | null;
  }[];
}

function ItemRow({ entry }: { entry: Entry }) {
  const { item, line } = entry;
  const isService = item.category === "jasa";
  const spot = line?.codLoc ? COD_SPOTS.find((s) => s.id === line.codLoc) : undefined;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-cyber-border/60 last:border-0">
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-cyber-surface border border-cyber-border shrink-0">
        <img alt={item.name} className="w-full h-full object-cover" src={item.imageUrl} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant={isService ? "orange" : "default"} className="text-[9px]">
            {isService ? "Campus Freelance Skill" : "Pre-Loved Beli"}
          </Badge>
          <span className="text-[10px] text-slate-500 truncate">
            {isService ? "Penyedia" : "Penjual"}: {item.seller.name}
          </span>
        </div>
        <p className="text-xs font-bold text-white truncate mt-1">{item.name}</p>
        {spot && (
          <p className="text-[10px] text-slate-500 truncate">
            COD: {spot.name}
            {line?.note ? ` — ${line.note}` : ""}
          </p>
        )}
        {isService && !spot && (
          <p className="text-[10px] text-slate-500 truncate">Menunggu ACC penyedia jasa</p>
        )}
      </div>
      <span className="font-mono text-xs font-bold text-white shrink-0">
        {fmt(item.price)}
        {item.priceUnit && <span className="text-[10px] font-normal text-slate-400">{item.priceUnit}</span>}
      </span>
    </div>
  );
}

export default function CheckoutPage() {
  const cartLines = useCart();
  const rootRef = useRef<HTMLDivElement>(null);

  // dibaca sekali di client — hindari useSearchParams/Suspense
  const [q, setQ] = useState<{ item: string | null; ongkir: number } | null>(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ address?: string; phone?: string }>({});
  const [ordered, setOrdered] = useState<Entry[] | null>(null);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQ({ item: p.get("item"), ongkir: Number(p.get("ongkir") || 0) });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pay-col",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const entries: Entry[] =
    ordered ??
    (!q
      ? []
      : q.item
        ? (() => {
            const it = ITEMS.find((i) => i.id === q.item);
            return it ? [{ item: it }] : [];
          })()
        : cartLines
            .filter((l) => l.checked)
            .map((l) => {
              const it = ITEMS.find((i) => i.id === l.id);
              return it ? [{ item: it, line: l }] : [];
            })
            .flat());

  const ongkir = q?.ongkir ?? 0;
  const barang = entries.filter((e) => e.item.category === "barang").length;
  const jasa = entries.length - barang;
  const subtotal = entries.reduce((s, e) => s + e.item.price, 0);
  const total = subtotal + ongkir;
  const hasJasa = jasa > 0;

  const validate = () => {
    const e: { address?: string; phone?: string } = {};
    if (address.trim().length < 10)
      e.address = "Alamat minimal 10 karakter — tulis alamat kos/kontrakan atau titik COD lengkap.";
    if (!/^(\+62|62|0)8[1-9]\d{6,11}$/.test(phone.replace(/[\s-]/g, "")))
      e.phone = "Nomor HP tidak valid — format 08xx / +628xx (dipakai penjual menghubungi kamu).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const createOrder = () => {
    if (!entries.length || !validate()) return;
    const record: OrderRecord = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      total,
      status: "Menunggu pembayaran",
      createdAt: new Date().toISOString(),
      address: address.trim(),
      phone: phone.trim(),
      paymentProof: null,
      items: entries.map((e) => ({
        id: e.item.id,
        name: e.item.name,
        price: e.item.price, // snapshot harga saat checkout (AI_CONTEXT §8.7)
        isService: e.item.category === "jasa",
        serviceApproved: e.item.category === "jasa" ? false : null,
      })),
    };
    // ponytail: disimpan lokal; ganti ke Supabase orders/order_items saat auth tersambung
    try {
      const prev = JSON.parse(localStorage.getItem("buyorent_orders") || "[]");
      localStorage.setItem("buyorent_orders", JSON.stringify([record, ...prev]));
    } catch {}
    if (!q?.item) removeChecked(); // keranjang dikosongkan setelah checkout
    setOrdered(entries);
    setOrder(record);
  };

  const attachProof = (file: File | null) => {
    if (!file || !order) return;
    const updated = { ...order, paymentProof: file.name };
    try {
      const all = JSON.parse(localStorage.getItem("buyorent_orders") || "[]");
      localStorage.setItem(
        "buyorent_orders",
        JSON.stringify(
          all.map((o: OrderRecord) => (o.id === order.id ? { ...o, paymentProof: file.name } : o))
        )
      );
    } catch {}
    setOrder(updated);
  };

  const copyTotal = async () => {
    try {
      await navigator.clipboard.writeText(String(total));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
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
              aria-label="Kembali"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cyber-surface border border-cyber-border text-slate-400 hover:text-white hover:border-accent/50 transition-all shrink-0"
              href="/"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Pembayaran &amp; Checkout
                </h1>
                <Badge variant="default">Transfer Manual</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tanpa payment gateway — transfer manual ke penjual, status tercatat{" "}
                <span className="text-slate-300">Menunggu pembayaran → Diproses → Selesai</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="w-6 h-6 rounded-full bg-cyber-surface border border-cyber-border text-slate-400 flex items-center justify-center">
              1
            </span>
            <span className="text-slate-400">Pilih Item</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                order
                  ? "bg-signal text-black font-bold"
                  : "bg-accent text-black font-bold"
              }`}
            >
              2
            </span>
            <span className={order ? "text-signal font-semibold" : "text-white font-semibold"}>
              Checkout &amp; Transfer Manual
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: item + form checkout */}
          <div className="lg:col-span-7 flex flex-col gap-6 pay-col">
            {!q ? (
              <div className="bg-cyber-card/90 rounded-3xl border border-cyber-border p-8 text-center font-mono text-xs text-slate-500">
                MEMUAT DATA CHECKOUT…
              </div>
            ) : entries.length === 0 ? (
              <div className="bg-cyber-card/90 rounded-3xl border border-cyber-border p-10 flex flex-col items-center text-center gap-4">
                <div>
                  <h2 className="text-sm font-mono font-black text-white uppercase tracking-widest">
                    Tidak Ada Item
                  </h2>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm">
                    Item tidak ditemukan atau tidak ada item terpilih di keranjang. Pilih dulu item
                    yang mau dibeli atau disewa.
                  </p>
                </div>
                <Button asChild variant="cyan">
                  <Link className="font-mono" href="/">
                    KEMBALI KE KATALOG
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Item dipesan */}
                <div className="bg-cyber-card/90 rounded-3xl border border-cyber-border p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                      Item Dipesan ({entries.length})
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      HARGA SNAPSHOT SAAT CHECKOUT
                    </span>
                  </div>
                  {entries.map((e) => (
                    <ItemRow entry={e} key={e.item.id} />
                  ))}
                </div>

                {/* Form checkout: alamat + no HP (AI_CONTEXT §6.5) */}
                <div className="bg-cyber-card/90 rounded-3xl border border-cyber-border p-5 flex flex-col gap-4 shadow-sm">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                    Data Pengiriman &amp; Kontak
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-200" htmlFor="co-address">
                      Alamat / Titik Serah Terima
                    </label>
                    <textarea
                      className={inputClassArea + (errors.address ? " border-rose-500" : "")}
                      disabled={!!order}
                      id="co-address"
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Kos Melati Jl. Kukusan No. 12, Depok — atau titik COD: Perpustakaan Pusat UI"
                      value={address}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-rose-400">{errors.address}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-200" htmlFor="co-phone">
                      No. HP / WhatsApp
                    </label>
                    <input
                      className={inputClass + (errors.phone ? " border-rose-500" : "")}
                      disabled={!!order}
                      id="co-phone"
                      inputMode="tel"
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812xxxxxxx"
                      type="tel"
                      value={phone}
                    />
                    {errors.phone && <p className="text-[11px] text-rose-400">{errors.phone}</p>}
                    <p className="text-[11px] text-slate-500">
                      Dipakai penjual menghubungi kamu untuk janji temu/kirim. Data tidak
                      dipublikasikan.
                    </p>
                  </div>
                </div>

                {/* Catatan jasa (PRD §7) */}
                {hasJasa && (
                  <div className="rounded-3xl bg-accent/5 border border-accent/25 p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/40 text-accent flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {jasa} Jasa dalam pesanan — butuh ACC penyedia
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Pesanan jasa masuk dengan status <b className="text-slate-200">Menunggu
                        persetujuan</b>. Kontak penyedia (HP/WA) baru terbuka setelah penyedia
                        menyetujui pesananmu.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: ringkasan + pembayaran */}
          <aside className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start pay-col">
            <div className="bg-cyber-card/90 rounded-3xl p-5 border border-cyber-border flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                Ringkasan Transaksi
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>
                    Subtotal Item ({barang} Barang, {jasa} Jasa)
                  </span>
                  <span className="font-semibold text-slate-200">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>
                    Metode Penyerahan — {ongkir > 0 ? "Ekspedisi Reguler" : "COD Kampus Aman"}
                  </span>
                  <span className={ongkir === 0 ? "text-signal font-semibold" : "text-slate-200"}>
                    {ongkir === 0 ? "Rp 0 (Bebas Ongkir)" : fmt(ongkir)}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-cyber-border flex items-end justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-500">Total Pembayaran</span>
                  <p className="text-xl font-mono font-black text-white leading-tight">
                    {fmt(total)}
                  </p>
                </div>
                <Badge variant="default">Tanpa Biaya Admin</Badge>
              </div>

              {/* Instruksi transfer manual */}
              <div className="p-4 bg-cyber-surface/60 rounded-2xl border border-cyber-border/60 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-200">
                    Transfer Manual ke Penjual
                  </span>
                  <span className="text-[10px] font-mono font-bold text-signal">
                    TRANSFER LANGSUNG
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-cyber-card border border-cyber-border rounded-xl px-3 py-2.5">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Nominal Tepat
                    </span>
                    <span className="font-mono font-bold text-white text-base tracking-wide">
                      {fmt(total)}
                    </span>
                  </div>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border hover:border-accent/50 text-slate-300 hover:text-white font-mono text-[11px] font-bold uppercase transition-colors active:scale-95 shrink-0"
                    onClick={copyTotal}
                    type="button"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-signal" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Tersalin" : "Salin"}
                  </button>
                </div>
                <ol className="flex flex-col gap-1.5 text-[11px] text-slate-400 list-decimal list-inside leading-relaxed">
                  <li>
                    Buat pesanan — status tercatat{" "}
                    <b className="text-slate-200">Menunggu pembayaran</b>.
                  </li>
                  <li>
                    Transfer sesuai nominal ke rekening penjual yang disampaikan lewat chat pesanan.
                  </li>
                  <li>
                    Unggah bukti transfer — penjual menandai lunas →{" "}
                    <b className="text-slate-200">Diproses</b>, lalu{" "}
                    <b className="text-slate-200">Selesai</b> setelah serah terima.
                  </li>
                </ol>
                <p className="flex items-start gap-1.5 text-[11px] text-neon-orange leading-relaxed">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Jangan transfer ke rekening lain di luar kesepakatan pesanan, dan pastikan pesanan
                  sudah tercatat sebelum mengirim dana.
                </p>
              </div>

              {/* Aksi / hasil */}
              {order ? (
                <div className="rounded-2xl border border-signal/40 bg-signal/10 p-4 flex flex-col gap-2.5">
                  <span className="font-mono text-xs font-bold text-signal flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> PESANAN DIBUAT — {order.id}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Status: <b className="text-signal">MENUNGGU PEMBAYARAN</b>. Transfer manual
                    dulu, lalu unggah bukti bayar supaya penjual bisa memverifikasi.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-surface border border-accent/50 text-accent font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:bg-accent/10 transition-colors self-start">
                    <Upload className="w-4 h-4" />
                    {order.paymentProof ? "Ganti Bukti Transfer" : "Unggah Bukti Transfer"}
                    <input
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => attachProof(e.target.files?.[0] ?? null)}
                      type="file"
                    />
                  </label>
                  {order.paymentProof && (
                    <span className="font-mono text-[11px] text-signal">
                      ✓ BUKTI TERCATAT: {order.paymentProof} — menunggu verifikasi penjual.
                    </span>
                  )}
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {jasa > 0 &&
                      "Pesanan jasa menunggu ACC penyedia — kontak terbuka setelah disetujui. "}
                    Pantau perubahan status di halaman Riwayat Pesanan.
                  </p>
                  <Button asChild size="sm" variant="cyan">
                    <Link className="font-mono mt-1" href="/">
                      SELESAI — KEMBALI KE KATALOG
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    className="w-full whitespace-normal"
                    disabled={entries.length === 0}
                    onClick={createOrder}
                    size="lg"
                    variant="default"
                  >
                    <span className="flex items-center gap-2 font-mono">
                      BUAT PESANAN &amp; LANJUT TRANSFER MANUAL
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                  {entries.length > 0 && (
                    <p className="text-[11px] font-mono text-slate-500 text-center">
                      PASTIKAN ALAMAT &amp; NO. HP SUDAH DIISI.
                    </p>
                  )}
                </>
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
