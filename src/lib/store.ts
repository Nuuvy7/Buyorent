import { useEffect, useState } from "react";

// Bus event mini satu-satunya: perubahan localStorage antar-halaman
// (moderasi listing, kelola pengguna) disebarkan lewat satu event window.
const STORE_EVENT = "byr-store";

export function emitStore() {
  window.dispatchEvent(new Event(STORE_EVENT));
}

// Re-render halaman yang bergantung pada data store setelah aksi di halaman lain.
export function useStoreTick() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener(STORE_EVENT, h);
    return () => window.removeEventListener(STORE_EVENT, h);
  }, []);
  return tick;
}
