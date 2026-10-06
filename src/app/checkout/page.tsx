"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
  removeChecked,
  type CartLine,
} from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
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
  "w-full bg-cyber-card border border-cyber-border rounded-xl px-3 py-2 text-xs text-slate-400 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors disabled:opacity-60";

const inputClassArea = inputClass + " min-h-[72px] resize-none leading-relaxed";

interface Entry {
  item: ItemRow;
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
  const spot = line?.codLoc ? { name: line.codLoc } : undefined;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-cyber-border/60 last:border-0">
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-cyber-surface border border-cyber-border shrink-0">
        <img alt={item.name} className="w-full h-full object-cover" src={item.imageUrl} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant={isService ? "orange" : "default"} className="text-[9px]">
            {isService ? "Jasa Pelajar" : "Barang Pre-Loved"}
          </Badge>
          <span className="text-[10px] text-slate-500 truncate">
            {isService ? "Penyedia" : "Penjual"}: {item.seller.name}
          </span>
        </div>
        <p className="text-xs font-bold text-ink truncate mt-1">{item.name}</p>
        {spot && (
          <p className="text-[10px] text-slate-500 truncate">
            COD: <LokasiTitik value={spot.name} />
            {line?.note ? ` — ${line.note}` : ""}
          </p>
        )}
        {isService && !spot && (
          <p className="text-[10px] text-slate-500 truncate">Menunggu ACC penyedia jasa</p>
        )}
      </div>
      <span className="font-mono text-xs font-bold text-ink shrink-0">
        {fmt(item.price)}
        {item.priceUnit && <span className="text-[10px] font-normal text-slate-500">{item.priceUnit}</span>}
      </span>
    </div>
  );
}

export default function CheckoutPage() {
  const cartLines = useCart();
  const rootRef = useRef<HTMLDivElement>(null);

  // katalog Supabase untuk resolusi item yang dipesan
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

  // dibaca sekali di client — hindari useSearchParams/Suspense
  const [q, setQ] = useState<{ item: string | null; ongkir: number } | null>(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ address?: string; phone?: string }>({});
  const [ordered, setOrdered] = useState<Entry[] | null>(null);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);

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
    (!q || !loaded
      ? []
      : q.item
        ? (() => {
            const it = catalog.find((i) => i.id === q.item);
            return it ? [{ item: it }] : [];
          })()
        : cartLines
            .filter((l) => l.checked)
            .map((l) => {
              const it = catalog.find((i) => i.id === l.id);
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
    // fokus ke field error pertama — browser auto-scroll, pesan terlihat (M-5)
    if (e.address) document.getElementById("co-address")?.focus();
    else if (e.phone) document.getElementById("co-phone")?.focus();
    return Object.keys(e).length === 0;
  };

  // Tahap D5: INSERT orders → INSERT order_items → kosongkan cart.
  // Kalau order_items gagal: kompensasi — hapus order yang tadi dibuat
  // (policy "orders: pembeli hapus" — supabase/setup-admin.sql).
  const createOrder = async () => {
    if (creating || !entries.length || !validate()) return;
    setCreating(true);
    setOrderError(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setOrderError("Sesi berakhir — silakan masuk kembali.");
        return;
      }

      // 1. INSERT orders
      const { data: ordRow, error: ordErr } = await supabase
        .from("orders")
        .insert({
          buyer_id: session.user.id,
          total_price: total,
          shipping_fee: ongkir,
          status: "pending",
          address: address.trim(),
          phone: phone.trim(),
        })
        .select("id")
        .single();
      if (ordErr || !ordRow) {
        setOrderError(`Gagal membuat pesanan: ${ordErr?.message ?? "respons kosong"}`);
        return;
      }

      // 2. INSERT order_items (harga snapshot — AI_CONTEXT §8.7)
      const { error: itErr } = await supabase.from("order_items").insert(
        entries.map((e) => {
          const isService = e.item.category === "jasa";
          return {
            order_id: ordRow.id,
            item_id: e.item.id,
            seller_id: e.item.sellerId,
            quantity: 1,
            price: e.item.price,
            is_service: isService,
            service_approved: isService ? false : null,
            note: e.line?.brief || e.line?.note || null,
          };
        })
      );
      if (itErr) {
        // kompensasi: buang order kosong supaya tak meninggalkan pesanan tanpa item
        const { data: delRows } = await supabase
          .from("orders")
          .delete()
          .eq("id", ordRow.id)
          .select("id");
        setOrderError(
          delRows?.length
            ? `Gagal menyimpan item pesanan (${itErr.message}) — pesanan dibatalkan, coba lagi.`
            : `Gagal menyimpan item pesanan (${itErr.message}). Order ${ordRow.id} tersimpan tanpa item — laporkan ke admin.`
        );
        return;
      }

      // 3. kosongkan cart (baris terpilih) — memori lokal + baris server (D2)
      if (!q?.item) removeChecked();

      setOrder({
        id: ordRow.id,
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
      });
      setOrdered(entries);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setCreating(false);
    }
  };

  // Upload bukti ke bucket payment-proofs (privat) → simpan path di orders.payment_proof
  const attachProof = async (file: File | null) => {
    if (!file || !order) return;
    setProofError(null);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setProofError("Sesi berakhir — silakan masuk kembali.");
      return;
    }
    const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(-60) || "bukti.jpg";
    const path = `${session.user.id}/${order.id}/${Date.now()}-${safeName}`;
    const up = await supabase.storage
      .from("payment-proofs")
      .upload(path, file, { contentType: file.type });
    if (up.error) {
      setProofError(`Gagal unggah bukti: ${up.error.message}`);
      return;
    }
    const { error: updErr } = await supabase
      .from("orders")
      .update({ payment_proof: up.data.path })
      .eq("id", order.id);
    if (updErr) {
      setProofError(`Bukti terunggah tapi gagal tercatat: ${updErr.message}`);
      return;
    }
    setOrder({ ...order, paymentProof: up.data.path });
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
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cyber-surface border border-cyber-border text-slate-500 hover:text-ink hover:border-accent/50 transition-all shrink-0"
              href="/"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight">
                  Pembayaran &amp; Checkout
                </h1>
                <Badge variant="default">Transfer Manual</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tanpa payment gateway — transfer manual ke penjual, status tercatat{" "}
                <span className="text-slate-600">Menunggu pembayaran → Diproses → Selesai</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="w-6 h-6 rounded-full bg-cyber-surface border border-cyber-border text-slate-500 flex items-center justify-center">
              1
            </span>
            <span className="text-slate-500">Pilih Item</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                order
                  ? "bg-signal text-[#ffffff] font-bold"
                  : "bg-accent text-black font-bold"
              }`}
            >
              2
            </span>
            <span className={order ? "text-signal font-semibold" : "text-ink font-semibold"}>
              Checkout &amp; Transfer Manual
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: item + form checkout */}
          <div className="lg:col-span-7 flex flex-col gap-6 pay-col">
            {!q || !loaded ? (
              <div className="bg-cyber-card/90 rounded-3xl border border-cyber-border p-8 text-center font-mono text-xs text-slate-500">
                MEMUAT DATA CHECKOUT…
              </div>
            ) : entries.length === 0 ? (
              <div className="bg-cyber-card/90 rounded-3xl border border-cyber-border p-10 flex flex-col items-center text-center gap-4">
                <div>
                  <h2 className="text-sm font-mono font-black text-ink uppercase tracking-widest">
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
                    <h3 className="text-sm font-bold text-ink font-mono uppercase tracking-wide">
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
                  <h3 className="text-sm font-bold text-ink font-mono uppercase tracking-wide">
                    Data Pengiriman &amp; Kontak
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="co-address">
                      Alamat / Titik Serah Terima
                    </label>
                    <textarea
                      className={inputClassArea + (errors.address ? " border-rose-500" : "")}
                      disabled={!!order}
                      id="co-address"
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Kos Melati Jl. Kramat Raya No. 12, Jakarta Pusat — atau titik COD: Stasiun Sudirman (BNI City)"
                      value={address}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-rose-600">{errors.address}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400" htmlFor="co-phone">
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
                    {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
                    <p className="text-[11px] text-slate-500">
                      Dipakai penjual menghubungi kamu untuk janji temu/kirim. Data tidak
                      dipublikasikan.
                    </p>
                  </div>
                </div>

                {/* Catatan jasa (PRD §7) */}
                {hasJasa && (
                  <div className="rounded-3xl bg-accent/5 border border-accent/25 p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/40 text-ink flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink">
                        {jasa} Jasa dalam pesanan — butuh ACC penyedia
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Pesanan jasa masuk dengan status <b className="text-slate-400">Menunggu
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
              <h3 className="text-sm font-bold text-ink font-mono uppercase tracking-wide">
                Ringkasan Transaksi
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>
                    Subtotal Item ({barang} Barang, {jasa} Jasa)
                  </span>
                  <span className="font-semibold text-slate-400">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>
                    Metode Penyerahan — {ongkir > 0 ? "Ekspedisi Reguler" : "COD Titik Aman"}
                  </span>
                  <span className={ongkir === 0 ? "text-signal font-semibold" : "text-slate-400"}>
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

              {/* Instruksi transfer manual */}
              <div className="p-4 bg-cyber-surface/60 rounded-2xl border border-cyber-border/60 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-400">
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
                    <span className="font-mono font-bold text-ink text-base tracking-wide">
                      {fmt(total)}
                    </span>
                  </div>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border hover:border-accent/50 text-slate-600 hover:text-ink font-mono text-[11px] font-bold uppercase transition-colors active:scale-95 shrink-0"
                    onClick={copyTotal}
                    type="button"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-signal" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Tersalin" : "Salin"}
                  </button>
                </div>
                <ol className="flex flex-col gap-1.5 text-[11px] text-slate-500 list-decimal list-inside leading-relaxed">
                  <li>
                    Buat pesanan — status tercatat{" "}
                    <b className="text-slate-400">Menunggu pembayaran</b>.
                  </li>
                  <li>
                    Transfer sesuai nominal ke rekening penjual yang disampaikan lewat chat pesanan.
                  </li>
                  <li>
                    Unggah bukti transfer — penjual menandai lunas →{" "}
                    <b className="text-slate-400">Diproses</b>, lalu{" "}
                    <b className="text-slate-400">Selesai</b> setelah serah terima.
                  </li>
                </ol>
                <p className="flex items-start gap-1.5 text-[11px] text-ink leading-relaxed">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Jangan transfer ke rekening lain di luar kesepakatan pesanan, dan pastikan pesanan
                  sudah tercatat sebelum mengirim dana.
                </p>
              </div>

              {/* Aksi / hasil */}
              {order ? (
                <div className="rounded-2xl border border-signal/40 bg-signal/10 p-4 flex flex-col gap-2.5">
                  <span className="font-mono text-xs font-bold text-signal flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> PESANAN DIBUAT — #
                    {order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Status: <b className="text-signal">MENUNGGU PEMBAYARAN</b>. Transfer manual
                    dulu, lalu unggah bukti bayar supaya penjual bisa memverifikasi.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-surface border border-accent/50 text-ink font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:bg-accent/10 transition-colors self-start">
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
                      ✓ BUKTI TERCATAT: {order.paymentProof.split("/").pop()} — menunggu verifikasi
                      penjual.
                    </span>
                  )}
                  {proofError && (
                    <span className="font-mono text-[11px] text-rose-600">{proofError}</span>
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
                  {orderError && (
                    <p className="font-mono text-[11px] text-rose-600 text-center">{orderError}</p>
                  )}
                  <Button
                    className="w-full whitespace-normal"
                    disabled={entries.length === 0 || creating}
                    onClick={createOrder}
                    size="lg"
                    variant="default"
                  >
                    <span className="flex items-center gap-2 font-mono">
                      {creating ? "MENYIMPAN PESANAN..." : "BUAT PESANAN & LANJUT TRANSFER MANUAL"}
                      {!creating && <ArrowRight className="w-4 h-4" />}
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
                  <ShieldCheck className="w-4 h-4 text-signal" /> Kontak Penjual Terlindungi
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
