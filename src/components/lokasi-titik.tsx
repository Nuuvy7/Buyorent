"use client";

import { useEffect, useState } from "react";
import { isPointId, resolveLokasi } from "@/lib/cod-points";

/**
 * Teks lokasi tampilan: point_id (cod_points) → "Nama Titik — Kecamatan, Kota";
 * teks bebas/data lama → langsung tanpa fetch.
 */
export function LokasiTitik({ value, fallback = "" }: { value: string; fallback?: string }) {
  const isId = isPointId(value);
  const [text, setText] = useState(isId ? fallback : value);
  useEffect(() => {
    if (!isId) return;
    let alive = true;
    void resolveLokasi(value).then((t) => {
      if (alive) setText(t);
    });
    return () => {
      alive = false;
    };
  }, [value, isId]);
  return <>{text}</>;
}
