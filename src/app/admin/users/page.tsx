"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toast";
import {
  getUsers,
  saveUsers,
  getAccount,
  type AccountRecord,
  type UserRecord,
} from "@/lib/users";
import { useStoreTick } from "@/lib/store";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronDown,
  Eye,
  Search,
  SearchX,
  Trash2,
  Unlock,
} from "lucide-react";

type Filter = "all" | "active" | "blocked";

export default function AdminUsersPage() {
  const tick = useStoreTick();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [self, setSelf] = useState<AccountRecord | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const refresh = () => {
    setUsers(getUsers());
    setSelf(getAccount());
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  // Baris "akun ini" disematkan di atas daftar — akun yang sedang dipakai
  // tidak bisa diblokir/dihapus diri sendiri dari sini.
  const selfRow: UserRecord | null = self
    ? {
        id: "self",
        name: self.name,
        email: self.email,
        phone: self.phone,
        campus: self.campus,
        role: self.role,
        ktm: self.ktm,
        isBlocked: false,
        createdAt: "—",
      }
    : null;

  const merged = [...(selfRow ? [selfRow] : []), ...users];

  const rows = merged.filter((u) => {
    if (filter === "active" && u.isBlocked) return false;
    if (filter === "blocked" && !u.isBlocked) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const toggleBlock = (u: UserRecord) => {
    if (u.id === "self") return;
    saveUsers(users.map((x) => (x.id === u.id ? { ...x, isBlocked: !x.isBlocked } : x)));
    toast(
      u.isBlocked
        ? `Blokir ${u.name} dicabut — akun bisa login kembali`
        : `${u.name} diblokir — tidak bisa login`
    );
  };

  const removeUser = (u: UserRecord) => {
    if (u.id === "self") return;
    const ok = window.confirm(
      `Hapus permanen akun ${u.name} (${u.email})?\n\nTindakan ini tidak bisa dibatalkan.`
    );
    if (!ok) return;
    saveUsers(users.filter((x) => x.id !== u.id));
    toast(`Akun ${u.name} dihapus permanen`);
  };

  const pills: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: merged.length },
    { key: "active", label: "Aktif", count: merged.filter((u) => !u.isBlocked).length },
    { key: "blocked", label: "Diblokir", count: merged.filter((u) => u.isBlocked).length },
  ];

  return (
    <div className="flex flex-col gap-5 admin-anim">
      {/* Filter pills + pencarian */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {pills.map((p) => (
            <button
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-bold whitespace-nowrap transition-all ${
                filter === p.key
                  ? "bg-accent text-black shadow-glow"
                  : "bg-cyber-card text-slate-400 hover:text-white border border-cyber-border"
              }`}
              key={p.key}
              onClick={() => setFilter(p.key)}
              type="button"
            >
              {p.label} ({p.count})
            </button>
          ))}
        </div>
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-cyber-card border border-cyber-border text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau email pengguna…"
            type="text"
            value={query}
          />
        </div>
      </div>

      {/* Tabel kelola pengguna: lihat, blokir, hapus (PRD §8) */}
      <div className="rounded-3xl bg-cyber-card/90 border border-cyber-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="bg-cyber-surface border-b border-cyber-border font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Pengguna</th>
                <th className="px-5 py-3.5">Kampus</th>
                <th className="px-5 py-3.5">Peran</th>
                <th className="px-5 py-3.5">KTM</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td className="px-5 py-10 text-center text-slate-500" colSpan={6}>
                    <span className="inline-flex flex-col items-center gap-2">
                      <SearchX className="w-8 h-8 text-slate-600" />
                      Tidak ada pengguna yang cocok.
                    </span>
                  </td>
                </tr>
              )}
              {rows.map((u) => (
                <React.Fragment key={u.id}>
                  <tr className="border-b border-cyber-border/60 hover:bg-cyber-surface/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                            u.role === "admin"
                              ? "bg-signal/15 border border-signal/40 text-signal"
                              : "bg-accent/15 border border-accent/40 text-accent"
                          }`}
                        >
                          {u.name.charAt(0)}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="font-semibold text-slate-100 truncate">
                              {u.name}
                            </span>
                            {u.id === "self" && (
                              <Badge className="text-[9px]">Akun Ini</Badge>
                            )}
                          </span>
                          <span className="block text-[11px] text-slate-500 truncate">
                            {u.email}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{u.campus}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={u.role === "admin" ? "default" : "muted"}>
                        {u.role === "admin" ? "Admin" : "Pengguna"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          u.ktm ? "text-signal" : "text-neon-orange"
                        }`}
                      >
                        {u.ktm ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        {u.ktm ? "Valid" : "Belum"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border ${
                          u.isBlocked
                            ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                            : "bg-signal/10 border-signal/40 text-signal"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isBlocked ? "bg-rose-400" : "bg-signal"
                          }`}
                        />
                        {u.isBlocked ? "Diblokir" : "Aktif"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                          size="sm"
                          variant="ghost"
                        >
                          <Eye className="w-3.5 h-3.5" /> Lihat
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${
                              expanded === u.id ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                        {u.id !== "self" && (
                          <>
                            <Button
                              className={
                                u.isBlocked
                                  ? "text-signal hover:bg-signal/10"
                                  : "text-neon-orange hover:bg-neon-orange/10"
                              }
                              onClick={() => toggleBlock(u)}
                              size="sm"
                              variant="ghost"
                            >
                              {u.isBlocked ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" /> Buka Blokir
                                </>
                              ) : (
                                <>
                                  <Ban className="w-3.5 h-3.5" /> Blokir
                                </>
                              )}
                            </Button>
                            <Button
                              className="text-rose-400 hover:bg-rose-500/10"
                              onClick={() => removeUser(u)}
                              size="sm"
                              variant="ghost"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === u.id && (
                    <tr className="bg-cyber-surface/60 border-b border-cyber-border/60">
                      <td className="px-5 py-4" colSpan={6}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px]">
                          <div>
                            <span className="block text-slate-500 uppercase text-[9px] tracking-widest mb-1">
                              ID Akun
                            </span>
                            <span className="text-slate-200">{u.id}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 uppercase text-[9px] tracking-widest mb-1">
                              No. HP / WA
                            </span>
                            <span className="text-slate-200">{u.phone}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 uppercase text-[9px] tracking-widest mb-1">
                              Email Login
                            </span>
                            <span className="text-slate-200">{u.email}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 uppercase text-[9px] tracking-widest mb-1">
                              Bergabung
                            </span>
                            <span className="text-slate-200">{u.createdAt}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-cyber-border bg-cyber-surface/50 font-mono text-[11px] text-slate-500 flex items-center justify-between flex-wrap gap-2">
          <span>
            Menampilkan {rows.length} dari {merged.length} akun
          </span>
          <span className="text-slate-600">
            Blokir = tidak bisa login • Hapus = permanen
          </span>
        </div>
      </div>
    </div>
  );
}
