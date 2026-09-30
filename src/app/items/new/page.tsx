"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemCard } from "@/components/item-card";
import type { ItemData } from "@/components/item-card";
import { ITEMS } from "@/lib/items";
import {
  Plus,
  Package,
  Wrench,
  Upload,
  X,
  Check,
  ChevronDown,
  MapPin,
  ShieldCheck,
  Save,
  Send,
  ImageOff,
} from "lucide-react";

const KATEGORI_BARANG = [
  "Gadget & Alat Hitung Kuliah",
  "Buku & Diktat Kuliah",
  "Sewa Kamera & Lensa",
  "Perlengkapan Kost & Kamar",
  "Fashion & Jas Lab / Almamater",
];
const KATEGORI_JASA = [
  "Jasa Desain, Ketik & Analisis Data",
  "Jasa Fotografi & Videografi",
  "Jasa Les & Bimbel",
  "Jasa Teknis & Servis",
];
const KONDISI = [
  { label: "Like New 95%+", condition: "like-new" },
  { label: "Wajar Pakai", condition: "used" },
  { label: "Minus Sedikit", condition: "used" },
];
const KAMPUS = [
  "Universitas Indonesia (Depok)",
  "Universitas Indonesia (Salemba)",
  "ITB Kampus Ganesha",
  "Unpad Jatinangor",
];
const TITIK_COD = [
  "Perpustakaan Pusat UI (Crystal Building)",
  "Kantin Teknik UI (Kantek)",
  "Balairung / Perpustakaan FIB",
  "Kantin Dallas FISIP UI",
  "Stasiun UI / Stasiun Pondok Cina",
];

const DRAFT_KEY = "buyorent_listing_draft";
const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%230f1624'/><text x='50%' y='50%' fill='%2338bdf8' font-family='monospace' font-size='14' text-anchor='middle'>FOTO BELUM ADA</text></svg>"
)}`;

  const selectClass =
  "w-full appearance-none bg-cyber-surface border border-cyber-border rounded-xl px-4 py-3 pr-10 text-xs text-slate-100 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors cursor-pointer";

const Select = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <div className="relative">
    <select className={selectClass} onChange={(e) => onChange(e.target.value)} value={value}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
  </div>
);

interface Draft {
  type: "barang" | "jasa";
  title: string;
  kategori: string;
  kondisi: number;
  price: string;
  desc: string;
  kampus: string;
  titik: string;
  wa: string;
  bayarCod: boolean;
  bayarTransfer: boolean;
}

const EMPTY: Draft = {
  type: "barang",
  title: "",
  kategori: KATEGORI_BARANG[0],
  kondisi: 0,
  price: "",
  desc: "",
  kampus: KAMPUS[0],
  titik: TITIK_COD[0],
  wa: "",
  bayarCod: true,
  bayarTransfer: true,
};

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    /* draft rusak — pakai default */
  }
  return EMPTY;
}

interface Photo {
  url: string;
  name: string;
}

export default function PasangIklanPage() {
  const [form, setForm] = useState<Draft>(EMPTY);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [postedId, setPostedId] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // entrance animation sekali saat mount
  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [leftRef.current, rightRef.current],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // run pertama = restore draft; run berikutnya = autosave.
  // Guard ref: StrictMode menjalankan efek dobel — tanpa guard, autosave
  // menimpa storage dengan form kosong selesai restore sempat membacanya.
  const booted = useRef(false);
  useEffect(() => {
    if (!booted.current) {
      booted.current = true;
      setForm(loadDraft());
      return;
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setDraftSaved(true);
    } catch {
      /* storage penuh/di-block — draft hilang, form tetap jalan */
    }
  }, [form]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isService = form.type === "jasa";
  const kategoriList = isService ? KATEGORI_JASA : KATEGORI_BARANG;
  const priceNum = parseInt(form.price || "0", 10) || 0;

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    const errs = list.filter((f) => f.size > 10 * 1024 * 1024);
    if (errs.length) setErrors((e) => ({ ...e, photo: "Foto maksimal 10MB per file." }));
    const ok = list
      .filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024)
      .slice(0, 5 - photos.length)
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setPhotos((p) => [...p, ...ok].slice(0, 5));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 10) e.title = "Judul minimal 10 karakter — sebutkan nama produk/jasa.";
    if (priceNum <= 0) e.price = "Harga harus lebih dari Rp 0.";
    if (form.desc.trim().length < 20) e.desc = "Deskripsi minimal 20 karakter — jelaskan kondisi & alasan jual.";
    if (photos.length === 0) e.photo = "Wajib minimal 1 foto asli (real pict).";
    if (!/^[0-9\s-]{9,}$/.test(form.wa.trim())) e.wa = "Nomor WhatsApp minimal 9 digit (angka, spasi, atau strip).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const item: ItemData = {
      id: `local-${Date.now()}`,
      name: form.title.trim(),
      category: form.type,
      categoryLabel: form.kategori,
      subLabel: isService ? "Baru Tayang" : KONDISI[form.kondisi].label,
      ...(isService ? {} : { condition: KONDISI[form.kondisi].condition }),
      description: form.desc.trim(),
      price: priceNum,
      ...(isService ? { priceUnit: "/sesi" } : {}),
      imageUrl: photos[0].url,
      badge: isService ? "Jasa Baru" : KONDISI[form.kondisi].label,
      location: isService ? form.kampus : form.titik,
      seller: {
        name: "Daffa R.",
        avatarText: "D",
        campus: form.kampus,
        verified: true,
      },
    };
    // ponytail: demo lokal — unshift ke ITEMS hanya hidup selama sesi browser.
    // Ganti dengan insert Supabase (items) + upload Storage saat auth tersambung.
    ITEMS.unshift(item);
    localStorage.removeItem(DRAFT_KEY);
    setPostedId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAll = () => {
    setForm(EMPTY);
    setPhotos([]);
    setErrors({});
    setPostedId(null);
  };

  // ItemCard dipakai sebagai live preview — nonaktifkan interaksi klik (masih prerender)
  const previewItem: ItemData = {
    id: "preview",
    name: form.title.trim() || "Judul Barang / Jasa",
    category: form.type,
    categoryLabel: form.kategori,
    subLabel: isService ? "Baru Tayang" : KONDISI[form.kondisi].label,
    ...(isService ? {} : { condition: KONDISI[form.kondisi].condition }),
    description: form.desc.trim() || "Deskripsi lengkap akan tampil persis seperti ini bagi calon pembeli.",
    price: priceNum,
    ...(isService ? { priceUnit: "/sesi" } : {}),
    imageUrl: photos[0]?.url ?? PLACEHOLDER,
    badge: isService ? "Jasa Baru" : KONDISI[form.kondisi].label,
    location: isService ? form.kampus : form.titik,
    seller: { name: "Daffa R.", avatarText: "D", campus: form.kampus, verified: true },
  };

  const stepHeader = (n: string, title: string, sub: string) => (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-7 h-7 rounded-xl bg-accent text-black font-mono text-xs flex items-center justify-center font-bold shrink-0">
        {n}
      </span>
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
    </div>
  );

  const err = (key: string) =>
    errors[key] && <p className="text-[11px] text-rose-400 font-mono">{errors[key]}</p>;

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans cyber-grid">
      <Navbar />

      <main className="w-full pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
        {/* Header stepper */}
        <section className="pt-6 pb-6 border-b border-cyber-border flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/40 text-accent font-mono text-[10px] font-bold uppercase tracking-wider mb-3">
              <Plus className="w-3.5 h-3.5" />
              Portal Pasang Iklan Mahasiswa
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Jual Barang Pre-loved atau Tawarkan Skill & Jasamu
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              Putar kembali barang kuliah yang tak terpakai atau monetisasi keahlianmu. 100% bebas biaya komisi
              antarmahasiswa kampus.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-cyber-card border border-cyber-border px-4 py-2.5 rounded-2xl shrink-0 font-mono">
            <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/40 text-accent flex items-center justify-center text-xs font-bold">
              1
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Tahap Publikasi</span>
              <span className="text-xs font-semibold text-white">
                {draftSaved ? "Draft Otomatis Tersimpan" : "Draft Belum Tersimpan"}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse ml-2" />
          </div>
        </section>

        {postedId ? (
          /* Sukses tayang */
          <section className="bg-cyber-card border border-signal/40 rounded-3xl p-10 flex flex-col items-center text-center shadow-glow-signal">
            <div className="w-16 h-16 rounded-2xl bg-signal/15 border border-signal/40 text-signal flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white font-mono uppercase">Listing Tayang</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-md">
              &quot;{form.title.trim()}&quot; sudah masuk katalog kampus dan bisa ditemukan lewat search & filter
              sekarang juga.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto">
              <Button asChild size="lg" variant="default">
                <Link className="font-mono" href={`/items/${postedId}`}>
                  LIHAT HALAMAN DETAIL
                </Link>
              </Button>
              <Button onClick={resetAll} size="lg" variant="cyan">
                <span className="font-mono">PASANG LAGI</span>
              </Button>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: form */}
            <div className="lg:col-span-7 flex flex-col gap-8" ref={leftRef}>
              {/* 01 Tipe listing */}
              <div className="bg-cyber-card/90 rounded-3xl p-6 sm:p-8 border border-cyber-border">
                {stepHeader("01", "Pilih Tipe Listing", "Tentukan format transaksi yang paling sesuai")}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      ["barang", Package, "Jual Barang Pre-loved", "Kalkulator, buku kuliah, gawai, pakaian thrift, atau furnitur kost siap pakai."],
                      ["jasa", Wrench, "Tawarkan Jasa & Skill", "Desain poster, fotografi wisuda, terjemahan jurnal, atau les privat sesama kawan."],
                    ] as const
                  ).map(([key, Icon, title, desc]) => {
                    const active = form.type === key;
                    return (
                      <button
                        className={`cursor-pointer rounded-2xl p-5 transition-all flex flex-col justify-between relative text-left border ${
                          active
                            ? "bg-accent/10 border-accent/60"
                            : "bg-cyber-surface/60 border-cyber-border hover:border-slate-500"
                        }`}
                        key={key}
                        onClick={() => {
                          set("type", key as Draft["type"]);
                          set("kategori", (key === "jasa" ? KATEGORI_JASA : KATEGORI_BARANG)[0]);
                        }}
                        type="button"
                      >
                        <span
                          className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center ${
                            active ? "bg-accent text-black" : "border border-cyber-border text-transparent"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </span>
                        <span
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                            active ? "bg-accent text-black shadow-glow" : "bg-cyber-bg text-slate-400 border border-cyber-border"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                        <span>
                          <span className="font-bold text-white block text-sm">{title}</span>
                          <p className="text-xs text-slate-500 mt-1">{desc}</p>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 02 Upload foto */}
              <div className="bg-cyber-card/90 rounded-3xl p-6 sm:p-8 border border-cyber-border">
                <div className="flex items-center justify-between mb-6 gap-2">
                  {stepHeader("02", "Upload Foto Real Pict", "Maksimal 5 foto asli. Foto pertama jadi sampul utama.")}
                  <Badge variant="solid" className="text-[10px] shrink-0">
                    Wajib Foto Asli
                  </Badge>
                </div>
                <div
                  className="bg-cyber-surface/60 hover:bg-cyber-surface transition-colors rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer group border border-dashed border-cyber-light"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    addFiles(e.dataTransfer.files);
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyber-card text-slate-400 border border-cyber-border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <span className="text-sm text-slate-300 font-semibold">
                    Tarik & lepas foto di sini, atau <span className="text-accent underline underline-offset-4">jelajahi file</span>
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Format JPG, PNG, atau WEBP hingga 10MB per foto.</p>
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 mt-4 text-[11px] text-slate-500 font-mono">
                    {["Cahaya Alami Cukup", "Foto Sudut Minus/Lecet", "Bukan Foto Katalog Toko"].map((t) => (
                      <span className="inline-flex items-center gap-1.5" key={t}>
                        <Check className="w-4 h-4 text-signal" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                  ref={fileRef}
                  type="file"
                />
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {photos.map((p, i) => (
                    <div className="relative group rounded-xl overflow-hidden aspect-square bg-cyber-surface border border-cyber-border" key={p.url}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt={p.name} className="w-full h-full object-cover" src={p.url} />
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 text-[10px] bg-cyber-bg/90 text-accent px-1.5 py-0.5 rounded backdrop-blur-sm font-mono">
                          Sampul
                        </span>
                      )}
                      <button
                        aria-label="Hapus foto"
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setPhotos((ps) => ps.filter((x) => x.url !== p.url))}
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {Array.from({ length: 5 - photos.length }).map((_, i) => (
                    <button
                      className="rounded-xl aspect-square bg-cyber-surface/60 border border-cyber-border flex flex-col items-center justify-center text-slate-500 hover:text-accent hover:border-accent/50 transition-colors cursor-pointer"
                      key={`slot-${i}`}
                      onClick={() => fileRef.current?.click()}
                      type="button"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-[10px] mt-1 font-mono">Slot {photos.length + i + 1}</span>
                    </button>
                  ))}
                </div>
                {err("photo")}
              </div>

              {/* 03 Detail listing */}
              <div className="bg-cyber-card/90 rounded-3xl p-6 sm:p-8 border border-cyber-border flex flex-col gap-6">
                {stepHeader("03", "Detail Informasi Listing", "Beri deskripsi transparan agar calon pembeli langsung percaya")}

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider" htmlFor="input-title">
                      Judul Barang / Jasa
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">{form.title.length} / 70 Karakter</span>
                  </div>
                  <Input
                    id="input-title"
                    maxLength={70}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder='Contoh: "Kalkulator Casio FX-991EX ClassWiz Original FT UI"'
                    value={form.title}
                  />
                  <span className="text-[11px] text-slate-500">
                    Gunakan nama model spesifik dan fakultas asal jika relevan (misal: &quot;Buku Kalkulus Thomas Edisi 14 FMIPA&quot;).
                  </span>
                  {err("title")}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Kategori</label>
                    <Select onChange={(v) => set("kategori", v)} options={kategoriList} value={form.kategori} />
                  </div>
                  {!isService && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Kondisi Barang</label>
                      <div className="flex items-center gap-2 pt-0.5">
                        {KONDISI.map((k, i) => (
                          <button
                            className={`flex-1 py-3 px-2 rounded-xl text-[11px] font-mono transition-all text-center ${
                              form.kondisi === i
                                ? "bg-accent text-black font-bold shadow-glow"
                                : "bg-cyber-surface border border-cyber-border text-slate-400 font-semibold hover:border-slate-500"
                            }`}
                            key={k.label}
                            onClick={() => set("kondisi", i)}
                            type="button"
                          >
                            {k.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider" htmlFor="input-price">
                    {isService ? "Tarif Jasa Mahasiswa (Rp)" : "Harga Jual Mahasiswa (Rp)"}
                  </label>
                  <div className="flex items-center bg-cyber-surface border border-cyber-border rounded-xl px-4 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors">
                    <span className="text-lg font-bold text-slate-500 mr-2 font-mono">Rp</span>
                    <input
                      className="w-full bg-transparent py-3 text-white text-lg font-bold focus:outline-none font-mono"
                      id="input-price"
                      min={0}
                      onChange={(e) => set("price", e.target.value.replace(/[^\d]/g, ""))}
                      placeholder="0"
                      type="text"
                      value={form.price}
                    />
                    <span className="text-[11px] text-slate-500 shrink-0 font-mono">Nett / Boleh Nego</span>
                  </div>
                  {err("price")}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider" htmlFor="input-desc">
                    Deskripsi Lengkap & Catatan Khusus
                  </label>
                  <textarea
                    className="w-full min-h-[110px] bg-cyber-surface border border-cyber-border rounded-xl p-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    id="input-desc"
                    maxLength={1000}
                    onChange={(e) => set("desc", e.target.value)}
                    placeholder="Jelaskan pemakaian, kelengkapan (box/manual), minus jika ada, dan alasan jual."
                    value={form.desc}
                  />
                  <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                    <span>Sertakan alasan jual, kelengkapan, dan minus jika ada.</span>
                    <span className="font-mono">
                      {form.desc.trim() ? form.desc.trim().split(/\s+/).length : 0} Kata
                    </span>
                  </div>
                  {err("desc")}
                </div>
              </div>

              {/* 04 COD & kontak */}
              <div className="bg-cyber-card/90 rounded-3xl p-6 sm:p-8 border border-cyber-border flex flex-col gap-6">
                {stepHeader(
                  "04",
                  isService ? "Lokasi, Kontak & Pembayaran" : "Titik Temu COD Kampus & Kontak",
                  isService
                    ? "Jadwal & lokasi disepakati setelah pembeli checkout dan Anda menyetujui"
                    : "Jaminan transaksi aman di area publik kampus yang terpantau"
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Kampus Terdaftar</label>
                    <Select onChange={(v) => set("kampus", v)} options={KAMPUS} value={form.kampus} />
                  </div>
                  {!isService && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                        Rekomendasi Titik Temu COD
                      </label>
                      <Select onChange={(v) => set("titik", v)} options={TITIK_COD} value={form.titik} />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider" htmlFor="input-wa">
                      Nomor WhatsApp Aktif
                    </label>
                    <div className="flex items-center bg-cyber-surface border border-cyber-border rounded-xl px-4 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors">
                      <span className="text-xs text-slate-500 mr-2 font-mono">+62</span>
                      <input
                        className="w-full bg-transparent py-3 text-slate-100 text-xs focus:outline-none font-mono"
                        id="input-wa"
                        onChange={(e) => set("wa", e.target.value)}
                        placeholder="812-9844-3211"
                        type="text"
                        value={form.wa}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {isService
                        ? "Nomor terbuka setelah Anda menyetujui booking pesanan jasa."
                        : "Nomor hanya tampak setelah pembeli klik tombol Chat Penjual."}
                    </span>
                    {err("wa")}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                      Pilihan Terima Pembayaran
                    </label>
                    <div className="flex flex-col gap-2 pt-0.5">
                      {(
                        [
                          ["bayarCod", "COD Tunai saat serah terima", "Uji coba & cek fisik langsung di hadapan penjual"],
                          ["bayarTransfer", "Transfer manual (bank / e-wallet)", "Penjual konfirmasi pembayaran lunas lalu memproses pesanan"],
                        ] as const
                      ).map(([key, title, desc]) => (
                        <label
                          className="flex items-center gap-3 p-3 rounded-xl bg-cyber-surface/60 hover:bg-cyber-surface cursor-pointer transition-colors border border-cyber-border"
                          key={key}
                        >
                          <input
                            checked={form[key]}
                            className="w-4 h-4 accent-sky-400"
                            onChange={(e) => set(key, e.target.checked)}
                            type="checkbox"
                          />
                          <span className="flex flex-col text-left">
                            <span className="text-[11px] font-bold text-slate-200">{title}</span>
                            <span className="text-[10px] text-slate-500">{desc}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                <Button
                  className="font-mono"
                  onClick={() => setDraftSaved(true)}
                  size="lg"
                  variant="secondary"
                >
                  <Save className="w-4 h-4" /> SIMPAN SEBAGAI DRAFT
                </Button>
                <Button className="font-mono" onClick={submit} size="lg" variant="default">
                  <Send className="w-4 h-4" /> TAYANGKAN LISTING (GRATIS)
                </Button>
              </div>
            </div>

            {/* RIGHT: live preview + guidelines */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-36" ref={rightRef}>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Live Preview Katalog
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Tampilan calon pembeli</span>
              </div>

              <div className="pointer-events-none select-none">
                <ItemCard isFavorite={false} item={previewItem} onToggleFavorite={() => {}} />
              </div>

              {/* Community guidelines */}
              <div className="bg-cyber-surface rounded-3xl p-6 flex flex-col gap-4 border border-cyber-border">
                <div className="flex items-center gap-2.5 text-white text-sm font-bold font-mono uppercase">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  Standar Etika Komunitas Kampus
                </div>
                <ul className="space-y-3 text-xs text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-200">Anti-Joki Tugas & Skripsi:</strong> dilarang menawarkan
                      pengerjaan tugas akademik. Pelanggaran berakibat pencabutan akses KTM.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-200">Barang Ilegal & Bajakan:</strong> software crack, barang
                      tanpa izin, atau produk ilegal dilarang tayang.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-200">Verifikasi Mahasiswa:</strong> identitas KTM aktif
                      melindungi setiap transaksi di platform.
                    </span>
                  </li>
                </ul>
                <div className="pt-3 border-t border-cyber-border flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Butuh bantuan tim moderasi?</span>
                  <span className="text-accent hover:underline font-semibold cursor-pointer">Pusat Bantuan</span>
                </div>
              </div>

              <div className="bg-cyber-card/90 rounded-3xl p-5 border border-cyber-border flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neon-orange shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isService
                    ? "Untuk jasa: pesanan masuk dengan status Menunggu Persetujuan Penjual — kontak Anda baru terbuka setelah Anda menyetujui booking."
                    : "Setelah tayang, pembeli menambahkan ke keranjang dan checkout. Pembayaran dilakukan transfer manual langsung ke Anda, lalu Anda tandai lunas."}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
