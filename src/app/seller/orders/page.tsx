"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toast";
import { useStoreTick } from "@/lib/store";
import {
  approveService,
  fetchSellerOrderItems,
  fmt,
  fmtDate,
  setOrderStatus,
  shortId,
  statusVariant,
  STATUS_LABEL,
  type OrderStatus,
  type SellerOrderItem,
} from "@/lib/orders";
import { ArrowLeft, CheckCircle2, Inbox, MapPin, Phone, Truck } from "lucide-react";

interface Group {
  order: SellerOrderItem["order"];
  items: SellerOrderItem[];
}

export default function SellerOrdersPage() {
  const tick = useStoreTick();
  const [rows, setRows] = useState<SellerOrderItem[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchSellerOrderItems().then((r) => {
      if (alive) setRows(r);
    });
    return () => {
      alive = false;
    };
  }, [tick]);

  // kelompokkan item per pesanan (satu pesanan bisa memuat item dari beberapa penjual;
  // status & aksi berlaku untuk pesanan secara utuh — ponytail: batasi per-item bila perlu)
  const groups = useMemo<Group[]>(() => {
    if (!rows) return [];
    const map = new Map<string, Group>();
    for (const r of rows) {
      const g = map.get(r.order.id) ?? { order: r.order, items: [] };
      g.items.push(r);
      map.set(r.order.id, g);
    }
    return Array.from(map.values()).sort((a, b) =>
      b.order.created_at.localeCompare(a.order.created_at)
    );
  }, [rows]);

  const advance = async (g: Group) => {
    const next: OrderStatus = g.order.status === "pending" ? "processing" : "completed";
    setBusyId(g.order.id);
    const r = await setOrderStatus(g.order.id, next);
    setBusyId(null);
    if (r.ok) toast(`Pesanan ${shortId(g.order.id)} → ${STATUS_LABEL[next]}`);
    else toast(`Gagal memperbarui: ${r.error}`);
  };

  const acceptService = async (item: SellerOrderItem) => {
    setBusyId(`oi-${item.id}`);
    const r = await approveService(item.id);
    setBusyId(null);
    if (r.ok) toast(`Jasa "${item.name ?? "item"}" disetujui — kontak penjual terbuka ke pembeli`);
    else toast(`Gagal menyetujui: ${r.error}`);
  };

  return (
    <>
      <Navbar />
      <main className="w-full pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3 py-6 border-b border-cyber-border">
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
                Pesanan Masuk
              </h1>
              <Badge variant="default">{groups ? groups.length : 0} Pesanan</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Terima pesanan jasa, lalu ubah status: <span className="text-slate-600">Menunggu Pembayaran → Diproses → Selesai</span>
            </p>
          </div>
        </div>

        {rows === null ? (
          <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-12 text-center font-mono text-xs text-slate-500 uppercase tracking-widest">
            Memuat pesanan masuk…
          </div>
        ) : groups.length === 0 ? (
          <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-12 flex flex-col items-center text-center gap-4">
            <Inbox className="w-10 h-10 text-slate-700" />
            <div>
              <p className="text-sm font-bold text-slate-600 font-mono uppercase">
                Belum ada pesanan masuk
              </p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Saat ada pembeli membeli/menyewa listingmu, pesanannya muncul di sini.
              </p>
            </div>
            <Button asChild variant="cyan">
              <Link className="font-mono" href="/items/new">
                PASANG IKLAN
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {groups.map((g) => {
              const hasPendingService = g.items.some(
                (i) => i.is_service && !i.service_approved
              );
              const nextLabel =
                g.order.status === "pending"
                  ? "TANDAI DIPROSES"
                  : g.order.status === "processing"
                    ? "TANDAI SELESAI"
                    : null;
              return (
                <div
                  className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-5 shadow-sm flex flex-col gap-4"
                  key={g.order.id}
                >
                  {/* Atas: id, tanggal, status, bukti */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-ink">
                        {shortId(g.order.id)}
                      </span>
                      <span className="text-[11px] text-slate-500">{fmtDate(g.order.created_at)}</span>
                      <Badge variant={statusVariant(g.order.status)}>
                        {STATUS_LABEL[g.order.status]}
                      </Badge>
                      <Badge variant={g.order.payment_proof ? "solid" : "muted"} className="text-[9px]">
                        {g.order.payment_proof ? "Bukti bayar ✓" : "Belum ada bukti"}
                      </Badge>
                    </div>
                    <span className="font-mono text-sm font-black text-ink">
                      {fmt(g.order.total_price)}
                    </span>
                  </div>

                  {/* Info pembeli (wajib buat serah terima) */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-slate-600 bg-cyber-surface/60 border border-cyber-border/60 rounded-xl px-3.5 py-2.5">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {g.order.address}
                    </span>
                    <a className="flex items-center gap-1.5 hover:text-ink" href={`tel:${g.order.phone}`}>
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {g.order.phone}
                    </a>
                  </div>

                  {/* Item milikku */}
                  <div className="flex flex-col">
                    {g.items.map((it) => (
                      <div
                        className="flex flex-wrap items-center justify-between gap-3 py-2.5 border-b border-cyber-border/60 last:border-0"
                        key={it.id}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-ink">
                              {it.name ?? "Item dihapus"}
                            </span>
                            <Badge variant={it.is_service ? "orange" : "default"} className="text-[9px]">
                              {it.is_service ? "Sewa Jasa" : "Barang"}
                            </Badge>
                            {it.is_service && (
                              <span
                                className={`text-[10px] font-mono font-bold uppercase ${
                                  it.service_approved ? "text-signal" : "text-slate-500"
                                }`}
                              >
                                {it.service_approved ? "✓ Disetujui" : "Menunggu ACC"}
                              </span>
                            )}
                          </div>
                          {it.note && (
                            <p className="text-[11px] text-slate-500 mt-0.5">Catatan: {it.note}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-xs font-bold text-ink">
                            {fmt(it.price)}
                            {it.quantity > 1 && (
                              <span className="text-[10px] text-slate-500"> ×{it.quantity}</span>
                            )}
                          </span>
                          {it.is_service && !it.service_approved && (
                            <Button
                              disabled={busyId === `oi-${it.id}`}
                              onClick={() => acceptService(it)}
                              size="sm"
                              variant="cyan"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Setujui Jasa
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Aksi status */}
                  <div className="pt-3 border-t border-cyber-border/70 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      {g.order.status === "pending" &&
                        (g.order.payment_proof
                          ? "Bukti bayar sudah masuk — verifikasi lalu proses."
                          : "Menunggu pembeli mentransfer & mengunggah bukti.")}
                      {g.order.status === "processing" && "Barang/jasa sedang diproses — tandai selesai setelah serah terima."}
                      {g.order.status === "completed" && "Pesanan selesai. Terima kasih!"}
                    </span>
                    {nextLabel && (
                      <Button
                        className="flex items-center gap-2"
                        disabled={busyId === g.order.id || hasPendingService}
                        onClick={() => advance(g)}
                        size="sm"
                        variant="default"
                        title={hasPendingService ? "Setujui dulu pesanan jasa-nya" : undefined}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        {busyId === g.order.id ? "MENYIMPAN…" : nextLabel}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
