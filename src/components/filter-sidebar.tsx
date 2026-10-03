"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, CheckSquare } from "lucide-react";

interface FilterSidebarProps {
  onReset: () => void;
  selectedCondition: string;
  onSelectCondition: (cond: string) => void;
}

export function FilterSidebar({
  onReset,
  selectedCondition,
  onSelectCondition,
}: FilterSidebarProps) {
  return (
    <aside className="w-full bg-cyber-card/90 p-5 rounded-3xl border border-cyber-border shadow-lg flex flex-col gap-6 font-mono text-xs backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/70">
        <span className="font-bold text-ink flex items-center gap-2 tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-ink" />
          FILTER_PARAMS
        </span>
        <button
          onClick={onReset}
          className="text-[11px] text-ink hover:underline flex items-center gap-1 font-bold"
          type="button"
        >
          <RotateCcw className="w-3 h-3" />
          RESET
        </button>
      </div>

      {/* Item Condition */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-ink" /> KONDISI FISIK
        </span>
        <div className="space-y-1.5 text-xs text-slate-600 font-mono">
          <label className="flex items-center gap-2 p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <input
              checked={selectedCondition === "all"}
              onChange={() => onSelectCondition("all")}
              name="condition"
              type="radio"
              className="text-ink bg-cyber-bg border-cyber-border"
            />
            Semua Kondisi
          </label>
          <label className="flex items-center gap-2 p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <input
              checked={selectedCondition === "like-new"}
              onChange={() => onSelectCondition("like-new")}
              name="condition"
              type="radio"
              className="text-ink bg-cyber-bg border-cyber-border"
            />
            Like New (90%+)
          </label>
          <label className="flex items-center gap-2 p-2 rounded-xl bg-cyber-surface/60 border border-cyber-border/60 hover:border-slate-500 cursor-pointer">
            <input
              checked={selectedCondition === "used"}
              onChange={() => onSelectCondition("used")}
              name="condition"
              type="radio"
              className="text-ink bg-cyber-bg border-cyber-border"
            />
            Wajar Pakai
          </label>
        </div>
      </div>
    </aside>
  );
}
