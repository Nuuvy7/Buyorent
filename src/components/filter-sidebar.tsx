"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, School, CheckSquare, ShieldCheck, MapPin } from "lucide-react";

interface FilterSidebarProps {
  onReset: () => void;
  selectedCampus: string;
  onSelectCampus: (c: string) => void;
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
}

export function FilterSidebar({
  onReset,
  selectedCampus,
  onSelectCampus,
  selectedCondition,
  onSelectCondition,
}: FilterSidebarProps) {
  return (
    <aside className="w-full bg-cyber-card/90 p-5 rounded-3xl border border-cyber-border shadow-lg flex flex-col gap-6 font-mono text-xs backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/70">
        <span className="font-bold text-slate-100 flex items-center gap-2 tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          FILTER_PARAMS
        </span>
        <button
          onClick={onReset}
          className="text-[11px] text-accent hover:underline flex items-center gap-1 font-bold"
          type="button"
        >
          <RotateCcw className="w-3 h-3" />
          RESET
        </button>
      </div>

      {/* Campus Nodes */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <School className="w-3.5 h-3.5 text-accent" /> KAMPUS NODE
        </span>
        <div className="space-y-1.5 text-xs text-slate-300">
          <label className="flex items-center justify-between p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <span className="flex items-center gap-2 font-mono">
              <input
                checked={selectedCampus === "all" || selectedCampus === "ui"}
                onChange={() => onSelectCampus(selectedCampus === "ui" ? "all" : "ui")}
                className="w-3.5 h-3.5 rounded bg-cyber-bg border-cyber-border text-accent focus:ring-0"
                type="checkbox"
              />
              UI Depok
            </span>
            <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">182</span>
          </label>
          <label className="flex items-center justify-between p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <span className="flex items-center gap-2 font-mono">
              <input
                checked={selectedCampus === "itb"}
                onChange={() => onSelectCampus(selectedCampus === "itb" ? "all" : "itb")}
                className="w-3.5 h-3.5 rounded bg-cyber-bg border-cyber-border text-accent focus:ring-0"
                type="checkbox"
              />
              ITB Ganesha
            </span>
            <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">95</span>
          </label>
          <label className="flex items-center justify-between p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <span className="flex items-center gap-2 font-mono">
              <input
                checked={selectedCampus === "ugm"}
                onChange={() => onSelectCampus(selectedCampus === "ugm" ? "all" : "ugm")}
                className="w-3.5 h-3.5 rounded bg-cyber-bg border-cyber-border text-accent focus:ring-0"
                type="checkbox"
              />
              UGM Bulaksumur
            </span>
            <span className="text-[10px] text-neon-amber bg-neon-amber/10 px-1.5 py-0.5 rounded">64</span>
          </label>
          <label className="flex items-center justify-between p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <span className="flex items-center gap-2 font-mono">
              <input
                checked={selectedCampus === "sma"}
                onChange={() => onSelectCampus(selectedCampus === "sma" ? "all" : "sma")}
                className="w-3.5 h-3.5 rounded bg-cyber-bg border-cyber-border text-accent focus:ring-0"
                type="checkbox"
              />
              SMA/SMK Sekitar
            </span>
            <span className="text-[10px] text-slate-400 bg-cyber-surface px-1.5 py-0.5 rounded">41</span>
          </label>
        </div>
      </div>

      {/* Item Condition */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-cyber-border/70">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-accent" /> KONDISI FISIK
        </span>
        <div className="space-y-1.5 text-xs text-slate-300 font-mono">
          <label className="flex items-center gap-2 p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <input
              checked={selectedCondition === "all"}
              onChange={() => onSelectCondition("all")}
              name="condition"
              type="radio"
              className="text-accent bg-cyber-bg border-cyber-border"
            />
            Semua Kondisi
          </label>
          <label className="flex items-center gap-2 p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <input
              checked={selectedCondition === "like-new"}
              onChange={() => onSelectCondition("like-new")}
              name="condition"
              type="radio"
              className="text-accent bg-cyber-bg border-cyber-border"
            />
            Like New (90%+)
          </label>
          <label className="flex items-center gap-2 p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <input
              checked={selectedCondition === "used"}
              onChange={() => onSelectCondition("used")}
              name="condition"
              type="radio"
              className="text-accent bg-cyber-bg border-cyber-border"
            />
            Wajar Pakai
          </label>
        </div>
      </div>

      {/* COD Hotspots */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-cyber-border/70">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-neon-orange" /> TITIK COD CAMPUS
        </span>
        <div className="space-y-1.5 text-xs text-slate-300 font-mono">
          <label className="flex items-center gap-2 p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 cursor-pointer">
            <input defaultChecked className="w-3.5 h-3.5 rounded text-accent bg-cyber-bg border-cyber-border" type="checkbox" />
            Kantin & Perpustakaan
          </label>
          <label className="flex items-center gap-2 p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 cursor-pointer">
            <input defaultChecked className="w-3.5 h-3.5 rounded text-accent bg-cyber-bg border-cyber-border" type="checkbox" />
            Stasiun KRL / Halte Kampus
          </label>
          <label className="flex items-center gap-2 p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 cursor-pointer">
            <input className="w-3.5 h-3.5 rounded text-accent bg-cyber-bg border-cyber-border" type="checkbox" />
            Area Kost Mahasiswa
          </label>
        </div>
      </div>

      {/* Guarantee Terminal Pill */}
      <div className="bg-signal/5 border border-signal/30 p-3.5 rounded-2xl flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-signal shrink-0 mt-0.5" />
        <div className="text-[11px]">
          <span className="font-bold text-signal block font-mono">STUDENT VERIFIED ONLY</span>
          <p className="text-slate-400 mt-1 leading-relaxed font-sans">
            Semua penjual terverifikasi menggunakan kartu pelajar/mahasiswa aktif untuk mencegah penipuan.
          </p>
        </div>
      </div>
    </aside>
  );
}
