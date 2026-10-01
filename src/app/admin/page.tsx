"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchItems, type ItemRow } from "@/lib/items";
import { getUsers, type UserRecord } from "@/lib/users";
import { useStoreTick } from "@/lib/store";
import { ArrowRight, Store, Users, History, ShieldCheck, AlertTriangle } from "lucide-react";

export default function AdminDashboardPage() {
  const tick = useStoreTick();
  const [items, setItems] = useState<ItemRow[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);

  useEffect(() => {
    fetchItems().then(setItems);
    setUsers(getUsers());
  }, [tick]);

  const downEntries = items.filter((i) => !i.isApproved);

  const downCount = downEntries.length;
  const blocked = users.filter((u) => u.isBlocked).length;

  return (
    <div className="flex flex-col gap-6 admin-anim">
      {/* Pintasan panel */}
      <div className="grid md:grid-cols-2 gap-5">
        <Link
          className="group rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 flex flex-col gap-4 hover:border-accent/50 transition-colors"
          href="/admin/items"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/30 text-ink flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-ink group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h2 className="text-sm font-black text-ink font-mono uppercase tracking-tight">
              Moderasi Listing
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {items.length} listing di katalog • {downCount} saat ini diturunkan
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
            <ShieldCheck className="w-3.5 h-3.5" /> Buka Antrean Moderasi
          </span>
        </Link>

        <Link
          className="group rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 flex flex-col gap-4 hover:border-accent/50 transition-colors"
          href="/admin/users"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/30 text-ink flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-ink group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h2 className="text-sm font-black text-ink font-mono uppercase tracking-tight">
              Kelola Pengguna
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {users.length} akun terdaftar • {blocked} diblokir
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
            <Users className="w-3.5 h-3.5" /> Lihat, Blokir &amp; Hapus Akun
          </span>
        </Link>
      </div>

      {/* Aktivitas moderasi terakhir */}
      <section className="rounded-3xl bg-cyber-card/90 border border-cyber-border p-6 shadow-sm">
        <h3 className="text-xs font-black text-ink font-mono uppercase tracking-widest flex items-center gap-2 mb-5">
          <History className="w-4 h-4 text-ink" />
          Aktivitas Moderasi Terakhir
        </h3>
        {downEntries.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-3 py-8">
            <ShieldCheck className="w-8 h-8 text-signal" />
            <p className="text-xs text-slate-500">
              Belum ada listing yang diturunkan — seluruh katalog tayang.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {downEntries.map((item) => (
              <li
                className="flex flex-wrap items-center justify-between gap-3 bg-cyber-surface border border-cyber-border rounded-xl px-4 py-3"
                key={item.id}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-ink shrink-0" />
                  <span className="text-xs text-slate-700 font-semibold truncate max-w-[220px] sm:max-w-sm">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    Diturunkan admin
                  </span>
                </div>
                <Link
                  className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink hover:underline shrink-0"
                  href="/admin/items"
                >
                  Tinjau →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
