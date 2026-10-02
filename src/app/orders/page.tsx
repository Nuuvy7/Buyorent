"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStoreTick } from "@/lib/store";
import {
  fetchMyOrders,
  fmt,
  fmtDate,
  shortId,
  statusVariant,
  STATUS_LABEL,
  type Order,
} from "@/lib/orders";
import { ArrowLeft, ArrowRight, PackageOpen, ReceiptText } from "lucide-react";

export default function OrdersPage() {
  const tick = useStoreTick();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchMyOrders().then((rows) => {
      if (alive) setOrders(rows);
    });
    return () => {
      alive = false;
    };
  }, [tick]);

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
                Riwayat Pesanan
              </h1>
              <Badge variant="default">
                {orders ? orders.length : 0} Pesanan
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Status: <span className="text-slate-600">Menunggu Pembayaran → Diproses → Selesai</span>
            </p>
          </div>
        </div>

        {/* Daftar pesanan */}
        {orders === null ? (
          <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-12 text-center font-mono text-xs text-slate-500 uppercase tracking-widest">
            Memuat riwayat pesanan…
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-12 flex flex-col items-center text-center gap-4">
            <PackageOpen className="w-10 h-10 text-slate-700" />
            <div>
              <p className="text-sm font-bold text-slate-600 font-mono uppercase">
                Belum ada pesanan
              </p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Beli atau sewa sesuatu dari katalog — pesananmu akan tercatat di sini.
              </p>
            </div>
            <Button asChild variant="cyan">
              <Link className="font-mono" href="/">
                BUKA KATALOG
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((o) => (
              <Link
                className="group rounded-3xl bg-cyber-card/90 border border-cyber-border p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/40 flex flex-col gap-3"
                href={`/orders/${o.id}`}
                key={o.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-ink">
                      {shortId(o.id)}
                    </span>
                    <span className="text-[11px] text-slate-500">{fmtDate(o.created_at)}</span>
                  </div>
                  <Badge variant={statusVariant(o.status)}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {o.items
                    .map((i) => i.name ?? "Item dihapus penjual/admin")
                    .join(" • ")}
                </p>
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-cyber-border/60">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <ReceiptText className="w-3.5 h-3.5" />
                    {o.items.length} item •{" "}
                    {o.items.some((i) => i.is_service) ? "ada jasa" : "barang"}
                    {o.payment_proof ? " • bukti terunggah" : ""}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-ink">{fmt(o.total_price)}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
