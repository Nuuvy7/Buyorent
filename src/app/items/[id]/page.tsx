"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import gsap from "gsap";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/item-card";
import { fetchItems, fetchItem, type ItemRow } from "@/lib/items";
import { addToCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import { ToastHost, toast } from "@/components/toast";
import {
  Home,
  ChevronRight,
  Heart,
  MapPin,
  ShoppingCart,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Star,
  Wrench,
  Clock,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";

const REVIEWS = [
  {
    initials: "AN",
    name: "Adinda Nurul",
    campus: "Jakarta Selatan",
    text: "COD lancar di Perpustakaan Pusat. Penjual sabar nungguin ngetes fungsi satu per satu. Barang beneran sesuai deskripsi.",
    context: "Beli Diktat Kimia • 2 minggu lalu",
  },
  {
    initials: "BP",
    name: "Bagas Pratama",
    campus: "Jakarta Barat",
    text: "Komunikasi via chat ramah dan tepat waktu. Booking jasa diproses cepat, hasil sesuai ekspektasi sidang.",
    context: "Pakai Jasa Desain • 1 bulan lalu",
  },
  {
    initials: "FH",
    name: "Farhan Harahap",
    campus: "Jakarta Barat",
    text: "Teman seangkatan terpercaya. Nego wajar dan barang sesuai deskripsi, tidak ada yang disembunyikan.",
    context: "Beli Alat Lab • 2 bulan lalu",
  },
];

const HANDOVER = [
  {
    id: "cod",
    title: "COD Titik Aman Bebas Ongkir",
    price: "Gratis",
    desc: "Titik temu: stasiun / halte / lobby gedung publik sesuai daftar COD kota.",
  },
  {
    id: "kurir",
    title: "Kurir Instan Mahasiswa (GoSend / Grab)",
    price: "Rp 12.000",
    desc: "Kirim aman ke area Kost Tebet, Kramat, atau Salemba (±30 menit tiba).",
  },
];

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);
  const [handover, setHandover] = useState("cod");
  const [activeTab, setActiveTab] = useState<"spec" | "history" | "reviews">("spec");
  const [item, setItem] = useState<ItemRow | null>(null);
  const [allItems, setAllItems] = useState<ItemRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchItem(params.id), fetchItems({ approvedOnly: true })]).then(
      ([found, catalog]) => {
        if (!alive) return;
        setItem(found);
        setAllItems(catalog);
        setLoaded(true);
      }
    );
    return () => {
      alive = false;
    };
  }, [params.id]);

  // BELI / BOOKING → langsung halaman pembayaran; + KERANJANG → keranjang dulu
  const goCheckout = () => {
    if (!item) return;
    router.push(`/checkout?item=${item.id}`);
  };
  const goCart = () => {
    if (!item) return;
    addToCart(item.id);
    router.push("/cart");
  };

  // BUG-05: tombol TANYA → WhatsApp penjual (keputusan nuuvy7 3 Okt 2026).
  // Nomor HP penjual tidak bisa dibaca langsung (RLS users ketat) — lewat RPC
  // public_seller_phone(item_id) yang harus dipasang via supabase/tanya-penjual.sql.
  const askSeller = async () => {
    if (!item) return;
    const supabase = createClient();
    const { data, error } = await supabase.rpc("public_seller_phone", {
      p_item_id: item.id,
    });
    const phone = (data as string | null) ?? "";
    if (error || !phone) {
      toast("Kontak penjual belum tersedia. Coba lagi nanti.");
      return;
    }
    const wa = phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
    window.open(`https://wa.me/${wa}`, "_blank", "noopener,noreferrer");
  };

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded || !leftRef.current || !rightRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [leftRef.current, rightRef.current],
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, [loaded]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-cyber-bg text-ink flex flex-col font-sans cyber-grid">
        <Navbar />
        <main className="w-full pt-32 pb-20 max-w-7xl mx-auto px-4 flex-1 font-mono text-xs text-slate-500 uppercase tracking-widest text-center">
          Memuat listing…
        </main>
        <Footer />
      </div>
    );
  }
  if (!item) return notFound();

  const isService = item.category === "jasa";
  // Listing tayang/diturunkan ada di flag RLS — yang non-tayang hanya terlihat
  // penjual/admin, jadi banner "Diturunkan Admin" hanya mungkin untuk mereka.
  const isDown = !item.isApproved;
  const related = [
    ...allItems.filter((i) => i.category === item.category && i.id !== item.id),
    ...allItems.filter((i) => i.category !== item.category && i.id !== item.id),
  ].slice(0, 4);

  // ponytail: derive health % from condition string; move to real DB fields when Supabase items land
  const kondisiPct = item.condition === "like-new" ? 95 : 80;

  const specRows: [string, string][] = isService
    ? [
        ["Kategori", item.categoryLabel],
        ["Tipe", "Jasa Mahasiswa"],
        ["Cakupan", item.subLabel],
        ["Area", item.location],
        ["Tarif", `Rp ${item.price.toLocaleString("id-ID")}${item.priceUnit ?? ""}`],
        ["Penyedia", `${item.seller.name} • ${item.seller.campus}`],
      ]
    : [
        ["Kategori", item.categoryLabel],
        ["Tipe", "Barang Pre-loved"],
        ["Kondisi", item.badge],
        ["Kelengkapan", item.subLabel],
        ["Lokasi", item.location],
        ["Harga", `Rp ${item.price.toLocaleString("id-ID")}`],
        ["Penjual", `${item.seller.name} • ${item.seller.campus}`],
      ];

  return (
    <div className="min-h-screen bg-cyber-bg text-ink flex flex-col font-sans cyber-grid">
      <Navbar />

      <main className="w-full pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col gap-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-mono text-xs text-slate-500 pt-2">
          <Link href="/" className="hover:text-ink transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/" className="hover:text-ink transition-colors">
            {item.categoryLabel}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-md">{item.name}</span>
        </nav>

        {/* Listing diturunkan admin: tetap bisa dilihat, tapi tidak bisa dibeli */}
        {isDown && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-4">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-600 font-mono uppercase tracking-wider">
                Listing Diturunkan Admin
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Listing ini tidak tampil di katalog publik dan tidak bisa dibeli sampai lolos
                moderasi admin.
              </p>
            </div>
          </div>
        )}

        {/* Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Gallery + Trust */}
          <div ref={leftRef} className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative bg-cyber-card/90 rounded-3xl p-4 border border-cyber-border shadow-sm overflow-hidden">
              {/* Floating badges */}
              <div className="absolute top-7 left-7 z-10 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-bg/85 backdrop-blur-md font-mono text-[10px] font-bold uppercase tracking-wider text-signal border border-signal/40 shadow-glow-signal">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified Real Pic
                </span>
                <Badge variant="default" className="bg-cyber-bg/85 backdrop-blur-md">
                  {isService ? "Slot Tersedia" : "COD Titik Aman"}
                </Badge>
              </div>

              {/* Wishlist */}
              <button
                aria-label="Simpan ke favorit"
                onClick={() => setFavorite((f) => !f)}
                className={`absolute top-7 right-7 z-10 w-10 h-10 rounded-full bg-cyber-bg/85 backdrop-blur-md border flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
                  favorite ? "text-rose-600 border-rose-500/50" : "text-slate-500 border-cyber-border hover:text-ink"
                }`}
                type="button"
              >
                <Heart className={`w-5 h-5 ${favorite ? "fill-rose-500" : ""}`} />
              </button>

              {/* Main image */}
              <div className="w-full aspect-[4/3] rounded-2xl bg-cyber-surface overflow-hidden relative">
                <img alt={item.name} className="w-full h-full object-cover" src={item.imageUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg/70 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Trust card */}
            <div className="bg-cyber-card/90 rounded-3xl p-6 border border-cyber-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/40 text-ink flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-sm font-bold text-ink font-mono uppercase tracking-wide">
                    Jaminan Serah Terima Titik Aman
                  </h2>
                  <Badge variant="muted" className="text-[10px]">
                    Cek Dulu
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isService
                    ? "Kontak penyedia hanya terbuka setelah booking disetujui. Pembayaran mengikuti alur pesanan Buyorent — tanpa pembayaran di muka di luar platform."
                    : "Unit diperiksa langsung saat serah terima COD. Cek fungsi dan fisik sebelum konfirmasi terima — status pesanan baru berpindah ke Selesai setelah Anda menerima barang."}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Product intelligence + transaction control */}
          <div ref={rightRef} className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-cyber-card/90 rounded-3xl p-6 sm:p-8 border border-cyber-border shadow-sm flex flex-col">
              {/* Taxonomy badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/50 text-ink font-mono text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {isService ? "Sewa Jasa" : "Barang Pre-loved"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyber-surface border border-cyber-border text-slate-500 font-mono text-[10px] font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-ink" />
                    {item.location}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 shrink-0">UPDATE 2 jam lalu</span>
              </div>

              {/* Title & description */}
              <h1 className="text-2xl sm:text-3xl font-black text-ink leading-tight mb-3">{item.name}</h1>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">{item.description}</p>

              {/* Pricing block */}
              <div className="bg-cyber-surface rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border border-cyber-border">
                <div>
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    {isService ? "Tarif Mulai" : "Harga Kesepakatan COD"}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-mono font-black text-ink tracking-tight">
                      Rp {item.price.toLocaleString("id-ID")}
                      {item.priceUnit && (
                        <span className="text-sm font-normal text-slate-500">{item.priceUnit}</span>
                      )}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-signal border border-signal/40 bg-signal/10 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Escrow Aktif
                </span>
              </div>

              {/* Health meters (barang only) */}
              {!isService && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-cyber-surface p-3.5 rounded-xl border border-cyber-border">
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-600">Kondisi Fisik</span>
                      <span className="font-bold text-ink">{kondisiPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-cyber-bg rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${kondisiPct}%` }} />
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1.5">Sesuai foto, tanpa kerusakan fatal</span>
                  </div>
                  <div className="bg-cyber-surface p-3.5 rounded-xl border border-cyber-border">
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-600">Kelengkapan</span>
                      <span className="font-bold text-ink">100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-cyber-bg rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: "100%" }} />
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1.5">{item.subLabel}</span>
                  </div>
                </div>
              )}

              {/* Seller micro-card */}
              <div className="bg-cyber-surface rounded-2xl p-4 border border-cyber-border mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 text-ink flex items-center justify-center font-mono font-bold">
                        {item.seller.avatarText}
                      </div>
                      {item.seller.verified && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-signal ring-2 ring-cyber-surface" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-ink">{item.seller.name}</h3>
                        {item.seller.verified && <BadgeCheck className="w-4 h-4 text-signal" />}
                      </div>
                      <p className="text-xs text-slate-500">{item.seller.campus}</p>
                    </div>
                  </div>
                  <Badge variant="solid" className="text-[10px]">
                    KTM Aktif
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-cyber-border text-center font-mono">
                  <div>
                    <span className="text-xs font-bold text-ink flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-neon-amber text-ink" />
                      {isService ? (item.rating ?? "Baru") : "4.9"}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Rating</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-ink">~10 mnt</span>
                    <span className="text-[10px] text-slate-500 block">Respon Chat</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-ink">19 Sukses</span>
                    <span className="text-[10px] text-slate-500 block">Transaksi</span>
                  </div>
                </div>
              </div>

              {/* Handover / booking selection */}
              {isService ? (
                <div className="mb-6">
                  <label className="font-mono text-xs text-ink font-bold mb-2 block uppercase tracking-wider">
                    Alur Booking Jasa
                  </label>
                  <div className="p-3 rounded-2xl bg-cyber-surface border border-accent/40">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="text-ink font-bold">Kontak penjual (HP/WA) terbuka setelah penjual menyetujui booking.</span>{" "}
                      Setujui → jadwal disepakati → serah terima hasil → status Selesai.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="font-mono text-xs text-ink font-bold mb-2 block uppercase tracking-wider">
                    Metode Penyerahan Barang
                  </label>
                  <div className="space-y-2">
                    {HANDOVER.map((h) => (
                      <label
                        key={h.id}
                        className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-colors border ${
                          handover === h.id
                            ? "bg-cyber-surface border-accent/50"
                            : "bg-cyber-surface/60 border-cyber-border hover:border-slate-500"
                        }`}
                      >
                        <input
                          checked={handover === h.id}
                          className="mt-1 accent-[#14213d]"
                          name="handover"
                          onChange={() => setHandover(h.id)}
                          type="radio"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-ink">{h.title}</span>
                            <span
                              className={`font-mono text-[11px] font-semibold ${
                                h.price === "Gratis" ? "text-signal" : "text-slate-500"
                              }`}
                            >
                              {h.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{h.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full font-mono"
                  disabled={isDown}
                  onClick={goCheckout}
                  size="lg"
                  variant="default"
                >
                  {isService ? (
                    <span className="flex items-center gap-2">
                      <Wrench className="w-4 h-4" /> BOOKING JASA
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" /> BELI SEKARANG
                    </span>
                  )}
                </Button>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 font-mono"
                    disabled={isDown}
                    onClick={goCart}
                    size="lg"
                    variant="cyan"
                  >
                    {/* + keranjang: simpan dulu, baru ke halaman keranjang */}
                    <ShoppingCart className="w-4 h-4" /> + KERANJANG
                  </Button>
                  <Button
                    className="flex-1 font-mono"
                    size="lg"
                    variant="secondary"
                    onClick={askSeller}
                  >
                    <MessageSquare className="w-4 h-4" /> TANYA
                  </Button>
                </div>
              </div>

            </div>

            {/* Escrow / transaction timeline — follows PRD order status flow */}
            <div className="bg-cyber-card/90 rounded-3xl p-6 border border-cyber-border shadow-sm">
              <h3 className="text-sm font-bold text-ink font-mono mb-4 flex items-center gap-2 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-ink" />
                Alur Transaksi Aman Antarmahasiswa
              </h3>
              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyber-border">
                {[
                  ["Checkout — status Menunggu Pembayaran", "Pesanan tercatat rapi di riwayat, belum ada transfer."],
                  ["Transfer manual ke penjual", "Penjual mengonfirmasi pembayaran lunas lalu memproses pesanan."],
                  ["Serah terima: COD di titik kesepakatan / jadwal jasa", "Cek unit atau hasil kerja sebelum konfirmasi terima."],
                  ["Penjual tandai Selesai", "Rekam jejak transaksi bertambah untuk kedua pihak."],
                ].map(([title, desc], i) => (
                  <div className="relative" key={title}>
                    <span
                      className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-cyber-card ${
                        i === 0 ? "bg-signal" : "bg-accent"
                      }`}
                    />
                    <p className="text-xs text-ink font-semibold">
                      {i + 1}. {title}
                    </p>
                    <p className="text-[11px] text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: specs / history / reviews */}
        <div className="w-full bg-cyber-card/90 rounded-3xl p-6 sm:p-10 border border-cyber-border shadow-sm">
          <div className="border-b border-cyber-border flex items-center gap-6 overflow-x-auto mb-8">
            {(
              [
                ["spec", isService ? "Spesifikasi Layanan" : "Spesifikasi Teknis"],
                ["history", "Riwayat Pemakaian & Alasan Dijual"],
                ["reviews", "Ulasan (24)"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-3 font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === key ? "text-ink border-accent" : "text-slate-500 hover:text-ink border-transparent"
                }`}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "spec" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-sm font-bold text-ink mb-4 font-mono uppercase">
                  {isService ? "Detail Layanan" : "Detail Unit"}
                </h4>
                <dl className="space-y-3 text-xs">
                  {specRows.map(([dt, dd]) => (
                    <div className="flex justify-between py-2 border-b border-cyber-border/70 gap-4" key={dt}>
                      <dt className="text-slate-500 font-mono">{dt}</dt>
                      <dd className="text-ink font-semibold text-right">{dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-ink mb-2 font-mono uppercase">
                    {isService ? "Cara Kerja" : "Riwayat Penggunaan oleh Mahasiswa"}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isService
                      ? `${item.description} Pengerjaan dievaluasi bersama sebelum status pesanan berpindah ke Selesai.`
                      : `${item.description} Barang dirawat selama dipakai dan disimpan dengan pelindung saat tidak dipakai.`}
                  </p>
                </div>
                <div className="bg-cyber-surface p-4 rounded-2xl border border-cyber-border">
                  <h5 className="text-xs font-bold text-ink mb-1 flex items-center gap-1.5 font-mono uppercase">
                    <CheckCircle2 className="w-4 h-4 text-signal" />
                    Rekomendasi
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Cocok untuk kebutuhan kuliah di DKI Jakarta — khususnya mahasiswa baru yang
                    butuh {isService ? "bantuan profesional dengan budget mahasiswa" : item.categoryLabel.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-sm font-bold text-ink mb-4 font-mono uppercase">Alasan Dijual</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-3">
                  {isService
                    ? "Penyedia menawarkan slot terbatas tiap minggu karena masih aktif kuliah — booking lebih awal disarankan."
                    : "Dijual karena kebutuhan kuliah sudah berganti — tidak ada niat menyembunyikan kekurangan, calon pembeli dipersilakan cek langsung saat COD."}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-ink mb-4 font-mono uppercase">Catatan Kondisi</h4>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-signal shrink-0 mt-0.5" /> Sesuai foto asli, bukan foto katalog toko.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-signal shrink-0" /> Boleh dites dulu saat serah terima.
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-ink shrink-0" /> Biasanya dibalas dalam ±10 menit pada jam aktif (07.00–21.00 WIB).
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS.map((r) => (
                <div className="bg-cyber-surface p-5 rounded-2xl border border-cyber-border flex flex-col justify-between" key={r.name}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-cyber-bg flex items-center justify-center font-mono font-bold text-xs text-ink border border-accent/40">
                          {r.initials}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-ink">{r.name}</p>
                          <p className="text-[11px] text-slate-500">{r.campus}</p>
                        </div>
                      </div>
                      <div className="flex text-ink">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star className="w-3.5 h-3.5 fill-neon-amber" key={i} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">&quot;{r.text}&quot;</p>
                  </div>
                  <span className="text-[11px] text-slate-700 mt-4 block font-mono">{r.context}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related items */}
        <section className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-6 rounded-full bg-accent" />
            <div>
              <h3 className="text-lg font-bold text-ink">Koleksi Terkait</h3>
              <p className="text-xs text-slate-500">Barang serupa dan perlengkapan kuliah yang siap COD hari ini</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => (
              <ItemCard
                key={r.id}
                item={r}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <ToastHost />
    </div>
  );
}
