"use client";

import React, { useEffect, useRef, useState } from "react";

// Toast mikro ala REFRENCE.md: satu ToastHost, aksi memanggil toast(msg).
export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent("byr-toast", { detail: msg }));
}

export function ToastHost() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const h = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      setShow(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), 3200);
    };
    window.addEventListener("byr-toast", h);
    return () => {
      window.removeEventListener("byr-toast", h);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[60] transition-all duration-300 pointer-events-none ${
        show ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
      role="status"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyber-card border border-accent/40 shadow-glow text-xs font-mono text-ink max-w-[320px]">
        <span className="w-2 h-2 rounded-full bg-signal shrink-0" />
        <span>{msg}</span>
      </div>
    </div>
  );
}
