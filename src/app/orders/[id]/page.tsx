"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toast";
import { useStoreTick } from "@/lib/store";
import {
  attachProof,
  fetchOrder,
  fetchSellerContact,
  fmt,
  fmtDate,
  proofUrl,
  shortId,
  statusVariant,
  STATUS_LABEL,
  type Order,
  type OrderStatus,
} from "@/lib/orders";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
} from "lucide-react";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Menunggu Pembayaran" },
  { key: "processing", label: "Diproses" },
  { key: "completed", label: "Selesai" },
];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const tick = useStoreTick();
  const [order, setOrder] = useState<Order | null | undefined>(undefined); // undefined = memuat
  const [busy, setBusy] = useState(false);
  const [contacts, setContacts] = useState<Record<number, string>>({});

  useEffect(() => {
    let alive = true;
    fetchOrder(params.id).then((o) => {
      if (alive) setOrder(o);
    });
    return () => {
      alive = false;
    };
  }, [params.id, tick]);

  const onUpload = async (file: File | null) => {
    if (!file || !order || busy) return;
    setBusy(true);
    const r = await attachProof(order.id, file);
    setBusy(false);
    if (r.ok) {
      toast("Bukti transfer terunggah — penjual akan memverifikasi");
      setOrder({ ...order, payment_proof: r.path });
    } else {
      toast(r.error);
    }
  };

  const showContact = async (orderItemId: number) => {
    const r = await fetchSellerContact(orderItemId);
    if (r.ok) setContacts((c) => ({ ...c, [orderItemId]: r.phone }));
    else toast(r.error);
  };

  const stepIndex = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <>
      <Navbar />
      <main className="w-full pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3 py-6 border-b border-cyber-border">
          <Link
            aria-label="Kembali"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cyber-surface border border-cyber-border text-slate-500 hover:text-ink hover:border-accent/50 transition-all shrink-0"
            href="/orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight">
                Detail Pesanan
              </h1>
              {order && <Badge variant={statusVariant(order.status)}>{STATUS_LABEL[order.status]}</Badge>}
            </div>
            {order && (
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {shortId(order.id)} • {fmtDate(order.created_at)}
              </p>
            )}
          </div>
        </div>

        {order === undefined ? (
          <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-12 text-center font-mono text-xs text-slate-500 uppercase tracking-widest">
            Memuat pesanan…
          </div>
        ) : order === null ? (
          <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-12 text-center">
            <p className="text-sm font-bold text-slate-600 font-mono uppercase">
              Pesanan tidak ditemukan
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Bukan milikmu atau sudah dihapus.
            </p>
            <Button asChild className="mt-4" variant="cyan">
              <Link className="font-mono" href="/orders">
                KE RIWAYAT PESANAN
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Timeline status */}
            <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.key}>
                  {i > 0 && <div className="hidden sm:block flex-1 h-px bg-cyber-border" />}
                  <span
                    className={`flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider ${
                      i <= stepIndex ? "text-signal" : "text-slate-400"
                    }`}
                  >
                    {i <= stepIndex ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <CircleDashed className="w-4 h-4" />
                    )}
                    {s.label}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Item */}
            <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-5">
              <h3 className="text-sm font-bold text-ink font-mono uppercase tracking-wide mb-1">
                Item Pesanan ({order.items.length})
              </h3>
              {order.items.map((it) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-cyber-border/60 last:border-0"
                  key={it.id}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-ink">
                        {it.name ?? "Item dihapus penjual/admin"}
                      </span>
                      <Badge variant={it.is_service ? "orange" : "default"} className="text-[9px]">
                        {it.is_service ? "Sewa Jasa" : "Barang"}
                      </Badge>
                    </div>
                    {it.note && (
                      <p className="text-[11px] text-slate-500 mt-0.5">Catatan: {it.note}</p>
                    )}
                    {it.is_service && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase ${
                            it.service_approved ? "text-signal" : "text-slate-500"
                          }`}
                        >
                          {it.service_approved ? "✓ Disetujui penjual" : "Menunggu persetujuan penjual"}
                        </span>
                        {it.service_approved &&
                          (contacts[it.id] ? (
                            <a
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-signal/10 border border-signal/40 text-signal font-mono text-[11px] font-bold hover:bg-signal/20 transition-colors"
                              href={`tel:${contacts[it.id]}`}
                            >
                              <Phone className="w-3.5 h-3.5" /> {contacts[it.id]}
                            </a>
                          ) : (
                            <button
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyber-surface border border-accent/50 text-ink font-mono text-[11px] font-bold uppercase hover:bg-accent/10 transition-colors"
                              onClick={() => showContact(it.id)}
                              type="button"
                            >
                              <Phone className="w-3.5 h-3.5" /> Tampilkan Kontak Penjual
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-ink shrink-0">
                    {fmt(it.price)}
                    {it.quantity > 1 && <span className="text-[10px] text-slate-500"> ×{it.quantity}</span>}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pengiriman & pembayaran */}
              <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-ink font-mono uppercase tracking-wide">
                  Pengiriman &amp; Kontak
                </h3>
                <p className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                  {order.address}
                </p>
                <p className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" /> {order.phone}
                </p>
                <div className="pt-3 border-t border-cyber-border flex justify-between text-xs">
                  <span className="text-slate-500">Ongkir ({order.shipping_fee > 0 ? "Ekspedisi" : "COD"})</span>
                  <span className="font-semibold text-slate-400">{fmt(order.shipping_fee)}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-500">Total Pembayaran</span>
                  <span className="font-mono text-lg font-black text-ink">{fmt(order.total_price)}</span>
                </div>
              </div>

              {/* Bukti transfer */}
              <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-ink font-mono uppercase tracking-wide">
                  Bukti Transfer
                </h3>
                {order.payment_proof ? (
                  <div className="rounded-2xl border border-signal/40 bg-signal/10 p-4 flex flex-col gap-2.5">
                    <span className="font-mono text-[11px] font-bold text-signal flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> BUKTI TERCATAT
                    </span>
                    <p className="text-[11px] text-slate-600 break-all">
                      {order.payment_proof.split("/").pop()}
                    </p>
                    <ViewProofButton path={order.payment_proof} />
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Belum ada bukti. Transfer sesuai total, lalu unggah struk/ screenshot
                    agar penjual bisa memverifikasi.
                  </p>
                )}
                <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-surface border border-accent/50 text-ink font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:bg-accent/10 transition-colors self-start disabled:opacity-60">
                  <Upload className="w-4 h-4" />
                  {busy ? "Mengunggah…" : order.payment_proof ? "Ganti Bukti Transfer" : "Unggah Bukti Transfer"}
                  <input
                    accept="image/*"
                    className="hidden"
                    disabled={busy}
                    onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
                    type="file"
                  />
                </label>
                <p className="flex items-start gap-1.5 text-[11px] text-slate-500 leading-relaxed">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Hanya pembeli, penjual terkait, dan admin yang bisa melihat bukti ini.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

/** Tombol buka bukti: URL ditandatangani saat diklik (bucket privat, berlaku 1 jam). */
function ViewProofButton({ path }: { path: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border hover:border-accent/50 text-slate-600 hover:text-ink font-mono text-[11px] font-bold uppercase transition-colors self-start"
      onClick={async () => {
        setBusy(true);
        const url = await proofUrl(path);
        setBusy(false);
        if (url) window.open(url, "_blank", "noopener");
        else toast("Gagal membuka bukti — coba lagi");
      }}
      type="button"
    >
      {busy ? "Menyiapkan…" : "Lihat Bukti Transfer"}
    </button>
  );
}
