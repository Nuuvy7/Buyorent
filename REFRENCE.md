<!DOCTYPE html>

<html lang="id"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta content="web_dashboard" name="shell-type"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
@layer base {
  html, body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; color: #0f172a; }
  body { overscroll-behavior: none; }
  main > :first-child { margin-top: 0 !important; }
  main > :last-child { margin-bottom: 0 !important; }
}
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
::-webkit-scrollbar-track { background: transparent; }
</style>
<script src="https://cdn.tailwindcss.com"></script>
<script id="tailwind-config">
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#047857",
        "primary-hover": "#065f46",
        "primary-light": "#ecfdf5",
        mint: "#10b981",
        orange: "#ea580c",
        "orange-hover": "#c2410c",
        "orange-light": "#fff7ed",
        surface: "#f8fafc",
        card: "#ffffff",
        "border-hairline": "#e2e8f0"
      }
    }
  }
}
</script>
</head>
<body class="bg-surface text-slate-800 antialiased min-h-screen">
<aside class="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between shadow-[2px_0_12px_rgba(15,23,42,0.02)]">
<div>
<div class="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
<a class="flex items-center gap-2.5" data-path="katalog-utama" href="#">
<div class="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
<svg class="w-4 h-4 fill-none stroke-current stroke-2" viewbox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</div>
<div class="flex flex-col">
<span class="text-base font-extrabold tracking-tight text-slate-900 leading-none">Buyorent</span>
<span class="text-[9px] font-semibold tracking-wider text-emerald-700 uppercase mt-0.5">Campus Panel</span>
</div>
</a>
</div>
<div class="px-4 py-4">
<div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu Mahasiswa</div>
<nav class="space-y-1" data-active-classes="bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/70 shadow-xs">
<a class="flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent" data-path="riwayat-pesanan" href="#">
          Pesanan &amp; Transaksi
        </a>
<a aria-current="page" class="flex items-center px-3.5 py-2.5 rounded-xl transition-all bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/70 shadow-xs" data-path="admin-moderasi" href="#">
          Admin &amp; Moderasi Akun
        </a>
<a class="flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent" data-path="pasang-iklan" href="#">
          Kelola Listing Iklan
        </a>
<a class="flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent" data-path="katalog-utama" href="#">
          Kembali ke Jelajah
        </a>
</nav>
</div>
</div>
<div class="p-4 border-t border-slate-100">
<div class="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex items-center gap-3">
<div class="relative shrink-0">
<img alt="Daffa" class="w-9 h-9 rounded-full object-cover border border-slate-200" src="https://lh3.googleusercontent.com/aida/AEtjO1WTnOa63qq1_aqN1nWgS2_oTAurcKB4EEqQv3pZbVepqsoxpZoy_1yOh3j6lDuI2NUWVX7MY9GE7rRP7J74-62q05I3SLJJNjVqBp3N8qK0RpIKtZb8fzMTC9OLKWJ8gaoUKw8pONPBrpVXTuZ5Xigy5flXQiRvAHxcO1aUv80XgYeJWr_-dExhj33ICsDs-RetDhny9XTQzjdCsHtQ7PmSMZD21wGk-aRbhlj_9zloBCSjIqD7H_V4_EI"/>
<span class="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full w-2.5 h-2.5 ring-2 ring-white"></span>
</div>
<div class="flex flex-col min-w-0">
<span class="text-xs font-semibold text-slate-900 truncate">Daffa Rizky</span>
<span class="text-[10px] text-emerald-700 font-medium truncate">UI Depok • KTM Aktif</span>
</div>
</div>
</div>
</aside>
<div class="pl-64">
<header class="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-40 flex items-center justify-between px-6 shadow-[0_1px_8px_rgba(15,23,42,0.02)]">
<div class="flex items-center gap-3">
<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
<svg class="w-3.5 h-3.5 text-emerald-600 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>Kampus Aktif: UI Depok &amp; Salemba</span>
</div>
</div>
<div class="flex items-center gap-3">
<a class="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-semibold text-xs px-3.5 py-2 rounded-full transition-all shadow-sm shadow-orange-600/20" data-path="pasang-iklan" href="#">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>+ Pasang Iklan</span>
</a>
<a class="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors" data-path="keranjang-checkout" href="#" title="Keranjang">
<svg class="w-5 h-5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span class="absolute top-1 right-1 bg-orange-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none ring-2 ring-white">2</span>
</a>
<div class="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer" title="Notifikasi">
<svg class="w-5 h-5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span class="absolute top-1.5 right-1.5 bg-orange-600 w-2 h-2 rounded-full ring-2 ring-white"></span>
</div>
</div>
</header>
<main class="relative pt-16 bg-surface min-h-screen w-full px-6 py-8">
<div class="flex flex-col w-full">
<div class="flex flex-col gap-8 pb-12">
<!-- Top System Verification Banner -->
<div class="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
<div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
<div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
<div class="flex flex-col gap-2">
<div class="flex items-center gap-3">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary font-label-sm text-label-sm">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
              SafeCampus AI Guard 4.2 Aktif
            </span>
<span class="text-outline-variant text-label-sm">•</span>
<span class="font-label-sm text-label-sm text-outline">Pembaruan otomatis tiap 15 detik</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Pusat Moderasi &amp; Integritas Kampus</h1>
<p class="font-body-md text-body-md text-outline max-w-2xl">
            Sistem pengawasan cerdas katalog peer-to-peer mahasiswa Universitas Indonesia &amp; jejaring kampus Jabodetabek. Menegakkan regulasi kode etik akademik dan pencegahan penipuan sewa-beli.
          </p>
</div>
<div class="flex items-center gap-3 self-start lg:self-center">
<div class="flex flex-col items-end mr-2">
<span class="font-label-sm text-label-sm text-outline">Integritas Jaringan UI</span>
<span class="font-title-md text-title-md text-primary font-bold">99.4% Aman</span>
</div>
<button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all active:scale-95 shadow-sm" id="btn-sync" onclick="handleSync(this)">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" id="sync-icon" viewbox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span id="sync-text">Sinkron Realtime</span>
</button>
</div>
</div>
</div>
<!-- Metric Summary Grid (4 Cards) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
<!-- Metric 1: Total Listing Aktif -->
<div class="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5">
<div class="flex items-center justify-between mb-3">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Total Listing Aktif</span>
<div class="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
<svg class="w-5 h-5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</div>
</div>
<div class="flex items-baseline gap-2">
<span class="font-display-hero-mobile text-display-hero-mobile text-on-surface font-extrabold tracking-tight">1.428</span>
<span class="font-label-sm text-label-sm text-primary flex items-center">+42 mgg ini</span>
</div>
<div class="mt-3 flex items-center gap-1.5 text-outline">
<svg class="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span class="font-body-sm text-body-sm">89% terverifikasi KTM UI</span>
</div>
</div>
<!-- Metric 2: Perlu Moderasi (Kritis) -->
<div class="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5">
<div class="flex items-center justify-between mb-3">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-orange">Perlu Moderasi</span>
<div class="w-9 h-9 rounded-xl bg-orange-light text-orange flex items-center justify-center">
<svg class="w-5 h-5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</div>
</div>
<div class="flex items-baseline gap-2">
<span class="font-display-hero-mobile text-display-hero-mobile text-orange font-extrabold tracking-tight">14</span>
<span class="font-label-sm text-label-sm text-orange bg-orange-light px-2 py-0.5 rounded-full">Antrean Kritis</span>
</div>
<div class="mt-3 flex items-center gap-1.5 text-outline">
<span class="h-1.5 w-1.5 rounded-full bg-orange"></span>
<span class="font-body-sm text-body-sm">Estimasi kliring: 18 menit</span>
</div>
</div>
<!-- Metric 3: Laporan Pelanggaran -->
<div class="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5">
<div class="flex items-center justify-between mb-3">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-error">Laporan Terbuka</span>
<div class="w-9 h-9 rounded-xl bg-error-container text-error flex items-center justify-center">
<svg class="w-5 h-5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</div>
</div>
<div class="flex items-baseline gap-2">
<span class="font-display-hero-mobile text-display-hero-mobile text-error font-extrabold tracking-tight">3</span>
<span class="font-label-sm text-label-sm text-error">Kasus Serius</span>
</div>
<div class="mt-3 flex items-center gap-1.5 text-outline">
<svg class="w-3.5 h-3.5 stroke-current stroke-2 fill-none text-error" viewbox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span class="font-body-sm text-body-sm">2 dugaan scam, 1 joki tugas</span>
</div>
</div>
<!-- Metric 4: Pengguna Terverifikasi -->
<div class="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5">
<div class="flex items-center justify-between mb-3">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Mahasiswa Terverifikasi</span>
<div class="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
<svg class="w-5 h-5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</div>
</div>
<div class="flex items-baseline gap-2">
<span class="font-display-hero-mobile text-display-hero-mobile text-on-surface font-extrabold tracking-tight">3.820</span>
<span class="font-label-sm text-label-sm text-primary">+128 bln ini</span>
</div>
<div class="mt-3 flex items-center gap-1.5 text-outline">
<svg class="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span class="font-body-sm text-body-sm">KTM Valid UI Depok &amp; Salemba</span>
</div>
</div>
</div>
<!-- Navigation Tabs & Filter Bar -->
<div class="flex flex-col gap-4">
<!-- Admin Segmented Tabs -->
<div class="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-surface-container-low">
<div class="flex items-center gap-1 overflow-x-auto">
<button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-xs transition-all">
<span class="w-2 h-2 rounded-full bg-orange"></span>
<span>Moderasi Konten Listing</span>
<span class="px-2 py-0.5 rounded-full bg-orange-light text-orange font-label-sm text-label-sm">14</span>
</button>
<button class="flex items-center gap-2 px-4 py-2 rounded-xl text-outline hover:text-on-surface font-label-md text-label-md transition-all">
<span>Kelola Pengguna (Lihat, Blokir, Hapus)</span>
</button>
<button class="flex items-center gap-2 px-4 py-2 rounded-xl text-outline hover:text-on-surface font-label-md text-label-md transition-all">
<span>Laporan &amp; Dugaan Penipuan</span>
<span class="px-2 py-0.5 rounded-full bg-error-container text-error font-label-sm text-label-sm">3</span>
</button>
</div>
<div class="flex items-center gap-2 px-3 py-1 text-outline font-label-sm text-label-sm">
<span>Sortir:</span>
<span class="text-on-surface font-bold">Risiko Tertinggi Dahulu</span>
</div>
</div>
<!-- Quick Filter Pills & Search Input -->
<div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
<div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
<button class="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md transition-all">
            Semua (14)
          </button>
<button class="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-outline hover:text-on-surface font-label-md text-label-md transition-all shadow-xs">
            Anomali Harga (5)
          </button>
<button class="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-outline hover:text-on-surface font-label-md text-label-md transition-all shadow-xs">
            Pelanggaran Integritas Joki (3)
          </button>
<button class="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-outline hover:text-on-surface font-label-md text-label-md transition-all shadow-xs">
            Akun Belum Verifikasi KTM (6)
          </button>
</div>
<!-- Search Bar -->
<div class="relative min-w-[280px]">
<input class="w-full pl-9 pr-4 py-2 rounded-full bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Cari judul listing, ID, atau username seller..." type="text"/>
<svg class="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</div>
</div>
</div>
<!-- Antrean Moderasi Listing Cards (3 Cards) -->
<div class="flex flex-col gap-5">
<!-- Card 1: Review Ketat / Anomali Harga -->
<div class="rounded-2xl bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md">
<div class="flex flex-col lg:flex-row gap-6">
<!-- Thumbnail & Visual Flag -->
<div class="relative w-full lg:w-48 h-48 rounded-xl overflow-hidden shrink-0 bg-surface-container">
<img class="w-full h-full object-cover" data-alt="High-end smartphone iPhone 11 Pro sleek matte midnight green placed on university dormitory study table beside lecture notes and student planner, clean commercial product aesthetic, soft daylight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo8Rk_ix-eXs2ZOvpo_OYvfrTok05G01zdN4wBA9Je2t3gX2i2s1ZRfgCIBM1o63PN5kRFkgaHd1bdWNu2MFOZVVL14lVYb4Dvubsk_xDoeHMo01IlekD_Zm4Qc2mKM_HstuacMu_qKNBbVl3sVe05gyuJeqHAKF8BYksoFoa1jrV-N0zKWXYxX2BUDW-tmUtkj9N4AkhlfQuHi8oB9Z3Ao1_6-Dx6oISW392E8zKIaE_OFi7iybo3Tw"/>
<span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-orange text-white font-label-sm text-label-sm shadow-sm">
              Anomali Harga Ekstrem
            </span>
<div class="absolute bottom-2.5 left-2.5 right-2.5 px-2 py-1 rounded-lg bg-inverse-surface/85 backdrop-blur-xs text-inverse-on-surface text-center font-label-sm text-label-sm">
              ID: LST-90214
            </div>
</div>
<!-- Listing Information & Seller Context -->
<div class="flex-1 flex flex-col justify-between">
<div>
<div class="flex flex-wrap items-center justify-between gap-2 mb-2">
<div class="flex items-center gap-2">
<span class="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container text-outline">Gadget &amp; Elektronik</span>
<span class="font-body-sm text-body-sm text-outline">• Dibuat 12 menit yang lalu</span>
</div>
<!-- Risk Badge -->
<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-light text-orange">
<svg class="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span class="font-label-sm text-label-sm font-bold">Skor Risiko: 88 / 100</span>
</div>
</div>
<h2 class="font-title-md text-title-md text-on-surface font-bold tracking-tight">iPhone 11 Pro 64GB Space Grey (Mulus &amp; Fullset)</h2>
<div class="mt-1 flex items-baseline gap-3">
<span class="font-headline-sm text-headline-sm text-orange font-extrabold">Rp 1.200.000</span>
<span class="font-body-sm text-body-sm text-outline line-through">Harga wajar pasar kampus: Rp 4.800.000 - Rp 5.500.000</span>
</div>
<!-- AI Flags Explanation Box -->
<div class="mt-4 p-3.5 rounded-xl bg-orange-light/50 flex flex-col gap-1.5">
<div class="flex items-center gap-2 text-orange font-label-sm text-label-sm font-bold">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>Deteksi SafeCampus AI Guard:</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface">
                  Harga listing 75% di bawah batas deviasi normal pasar kampus. Pengguna <span class="font-bold text-on-surface">@anon12</span> mendaftar 40 menit yang lalu dengan email non-universitas (<code class="bg-surface-container px-1 py-0.5 rounded">daffaguest99@gmail.com</code>) dan <strong>belum mengunggah Kartu Tanda Mahasiswa (KTM)</strong>.
                </p>
</div>
<!-- Seller Profile Meta -->
<div class="mt-4 flex flex-wrap items-center gap-4 text-outline font-body-sm text-body-sm">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-sm text-label-sm text-outline">
                    A
                  </div>
<span class="text-on-surface font-medium">@anon12</span>
</div>
<div class="flex items-center gap-1 text-orange font-medium">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>KTM Belum Terverifikasi</span>
</div>
<div class="flex items-center gap-1">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>Kutek, UI Depok (Klaim Lokasi)</span>
</div>
</div>
</div>
<!-- Action Controls -->
<div class="mt-6 pt-4 flex flex-wrap items-center justify-end gap-2.5">
<button class="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all active:scale-95 shadow-xs" onclick="toastNotice('Permintaan verifikasi KTM dikirim ke @anon12')">
                Minta Bukti KTM
              </button>
<button class="px-4 py-2 rounded-full bg-error-container hover:opacity-90 text-error font-label-md text-label-md transition-all active:scale-95" onclick="toastNotice('Listing ditolak dan diamankan dari katalog public')">
                Tolak &amp; Turunkan
              </button>
<button class="px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all active:scale-95 shadow-sm" onclick="toastNotice('Peringatan: Listing disetujui manual oleh admin')">
                Setujui Manual
              </button>
</div>
</div>
</div>
</div>
<!-- Card 2: Terindikasi Valid & Clear -->
<div class="rounded-2xl bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md">
<div class="flex flex-col lg:flex-row gap-6">
<!-- Thumbnail & Safe Flag -->
<div class="relative w-full lg:w-48 h-48 rounded-xl overflow-hidden shrink-0 bg-surface-container">
<img class="w-full h-full object-cover" data-alt="Raymond Chang Chemistry textbook 10th edition standing neatly against campus library background, student study aesthetic, clean soft studio natural lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEHIAlxXoOvpNnuAyP8mK7REsvoSfrXc84ObK4Ei919Itw3HNMUiDMNXy-NXSFaGcMnaQaJlAywGYlyIgVbNNYjikPiD-Wp6Pk6-s2omioPe7kPkSEkyoo8epZfwSOtDosdMJxrdWi0m9X8LOgLkU8AJlzFEphO-cHmfxDBVArjZ4oBmW-iE-amDuwZZeLv0d0Hpqvu-Gh26bUNvWWcJi8GPk0HbyYF2yN2XIDKl2_hl5amxJs7z9E5A"/>
<span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-primary text-white font-label-sm text-label-sm shadow-sm">
              Rekomendasi Lolos Cepat
            </span>
<div class="absolute bottom-2.5 left-2.5 right-2.5 px-2 py-1 rounded-lg bg-inverse-surface/85 backdrop-blur-xs text-inverse-on-surface text-center font-label-sm text-label-sm">
              ID: LST-90215
            </div>
</div>
<!-- Listing Information & Verified Seller -->
<div class="flex-1 flex flex-col justify-between">
<div>
<div class="flex flex-wrap items-center justify-between gap-2 mb-2">
<div class="flex items-center gap-2">
<span class="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container text-outline">Buku &amp; Modul Kuliah</span>
<span class="font-body-sm text-body-sm text-outline">• Dibuat 24 menit yang lalu</span>
</div>
<!-- Risk Badge Safe -->
<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary">
<svg class="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span class="font-label-sm text-label-sm font-bold">Skor Risiko: 4 / 100 (Sangat Aman)</span>
</div>
</div>
<h2 class="font-title-md text-title-md text-on-surface font-bold tracking-tight">Buku Teks Kimia Dasar Edisi 10 - Raymond Chang (Catatan Lengkap)</h2>
<div class="mt-1 flex items-baseline gap-3">
<span class="font-headline-sm text-headline-sm text-primary font-extrabold">Rp 85.000</span>
<span class="font-body-sm text-body-sm text-outline">Harga referensi: Rp 80.000 - Rp 110.000</span>
</div>
<!-- AI Validation Box -->
<div class="mt-4 p-3.5 rounded-xl bg-primary-light/60 flex flex-col gap-1.5">
<div class="flex items-center gap-2 text-primary font-label-sm text-label-sm font-bold">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>SafeCampus AI Match: Mahasiswa &amp; Riwayat Terverifikasi</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface">
                  Pola harga sesuai median buku kuliah bekas Departemen Kimia FMIPA UI. Seller memiliki riwayat 6 transaksi sukses tanpa komplain, rating 4.9/5.0.
                </p>
</div>
<!-- Seller Profile Meta -->
<div class="mt-4 flex flex-wrap items-center gap-4 text-outline font-body-sm text-body-sm">
<div class="flex items-center gap-2">
<img class="w-6 h-6 rounded-full object-cover" data-alt="Student male avatar friendly face university verified portrait." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_FLEx3tgityfdAbc1O7SrBwEzbNx1J9zFFfDx37TkqlsvRnk5N4wsLlP_icJZ24WnA3RTLbfZVeYRlQHb2zdb-ww8nALgmig2TWC1JuH1ANeGaT-gyfAC5JZhHRGAm4uoCZbUOjrttm5RPr-EA97VtxYtspbRiiKinBCC4mw4oASbQgHG5QBaPndrz47Lx61MeRAKsQaMzrEudWp5WNguYeq2c2Boc7KFij-CSjiZ3OzezAbka3QLmw"/>
<span class="text-on-surface font-semibold">Dimas Ramadhan</span>
<span class="text-primary font-label-sm text-label-sm bg-primary-light px-2 py-0.5 rounded-full">FMIPA Kimia '21</span>
</div>
<div class="flex items-center gap-1 text-primary font-medium">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>KTM Valid #210672****</span>
</div>
<div class="flex items-center gap-1">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>Gedung Kimia UI Depok</span>
</div>
</div>
</div>
<!-- Action Controls -->
<div class="mt-6 pt-4 flex flex-wrap items-center justify-end gap-2.5">
<button class="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all active:scale-95 shadow-xs" onclick="toastNotice('Catatan internal staf moderasi tersimpan')">
                Catatan Tim
              </button>
<button class="px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all active:scale-95 shadow-sm" onclick="toastNotice('Berhasil! Listing Dimas Ramadhan langsung dipublish ke marketplace')">
                Setujui Cepat (Publish Langsung)
              </button>
</div>
</div>
</div>
</div>
<!-- Card 3: Pelanggaran Integritas Akademik (Jasa Skripsi / Joki) -->
<div class="rounded-2xl bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md">
<div class="flex flex-col lg:flex-row gap-6">
<!-- Thumbnail & Alert Flag -->
<div class="relative w-full lg:w-48 h-48 rounded-xl overflow-hidden shrink-0 bg-surface-container">
<div class="w-full h-full bg-error-container/40 flex flex-col items-center justify-center p-4 text-center">
<svg class="w-12 h-12 text-error mb-2 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span class="font-label-sm text-label-sm text-error font-bold leading-tight">Konten Melanggar Kode Etik</span>
</div>
<span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-error text-white font-label-sm text-label-sm shadow-sm">
              Pelanggaran Pasal 4
            </span>
<div class="absolute bottom-2.5 left-2.5 right-2.5 px-2 py-1 rounded-lg bg-inverse-surface/85 backdrop-blur-xs text-inverse-on-surface text-center font-label-sm text-label-sm">
              ID: LST-90218
            </div>
</div>
<!-- Listing Information & Offender Seller -->
<div class="flex-1 flex flex-col justify-between">
<div>
<div class="flex flex-wrap items-center justify-between gap-2 mb-2">
<div class="flex items-center gap-2">
<span class="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-error-container text-error font-semibold">Jasa &amp; Freelance (Terlarang)</span>
<span class="font-body-sm text-body-sm text-outline">• Dibuat 48 menit yang lalu</span>
</div>
<!-- Risk Badge Severe -->
<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-error-container text-error">
<svg class="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span class="font-label-sm text-label-sm font-bold">Skor Risiko: 99 / 100 (Kritis)</span>
</div>
</div>
<h2 class="font-title-md text-title-md text-on-surface font-bold tracking-tight">Jasa Pembuatan Skripsi, Olah Data SPSS &amp; Joki Tugas Akhir Cepat</h2>
<div class="mt-1 flex items-baseline gap-3">
<span class="font-headline-sm text-headline-sm text-error font-extrabold">Rp 1.500.000</span>
<span class="font-body-sm text-body-sm text-outline">Target: Mahasiswa S1 Semua Jurusan</span>
</div>
<!-- Severe Academic Violation Explanation -->
<div class="mt-4 p-3.5 rounded-xl bg-error-container/60 flex flex-col gap-1.5">
<div class="flex items-center gap-2 text-error font-label-sm text-label-sm font-bold">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>Pelanggaran Berat Regulasi Kampus &amp; Integritas Akademik:</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface">
                  Layanan melanggar <span class="font-bold text-on-surface">SK Rektor UI Nomor 208/2020 tentang Integritas dan Larangan Praktik Perjokian Akademik</span>. Akun seller <span class="font-bold text-on-surface">@jokicepat_kilat</span> terdeteksi menggunakan nomor WhatsApp virtual dan memposting kata kunci yang diblacklist sistem.
                </p>
</div>
<!-- Seller Meta -->
<div class="mt-4 flex flex-wrap items-center gap-4 text-outline font-body-sm text-body-sm">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-error-container text-error flex items-center justify-center font-label-sm text-label-sm font-bold">
                    !
                  </div>
<span class="text-error font-medium">@jokicepat_kilat</span>
</div>
<div class="flex items-center gap-1 text-error font-medium">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke-linecap="round" stroke-linejoin="round"></path></svg>
<span>Akun Terindikasi Jaringan Joki Eksternal</span>
</div>
<div class="flex items-center gap-1">
<span>Kontak: 0895-3211-**** (Virtual Provider)</span>
</div>
</div>
</div>
<!-- Action Controls (Strict Discipline) -->
<div class="mt-6 pt-4 flex flex-wrap items-center justify-end gap-2.5">
<button class="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all active:scale-95 shadow-xs" onclick="toastNotice('Email panduan etika akademik telah dikirim ke seller')">
                Kirim Email Edukasi
              </button>
<button class="px-4 py-2 rounded-full bg-error text-white hover:opacity-90 font-label-md text-label-md transition-all active:scale-95 shadow-sm" onclick="toastNotice('Akun @jokicepat_kilat dibekukan permanen dari platform Buyorent UI')">
                Blokir Seller
              </button>
<button class="px-5 py-2 rounded-full bg-on-background text-surface font-label-md text-label-md transition-all hover:opacity-90 active:scale-95 shadow-sm" onclick="toastNotice('Listing dihapus permanen dari database Buyorent')">
                Hapus Listing &amp; Peringatan Keras
              </button>
</div>
</div>
</div>
</div>
</div>
<!-- Batch Actions & Pagination Bar -->
<div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-lowest shadow-sm">
<!-- Mass Actions -->
<div class="flex items-center gap-3">
<label class="inline-flex items-center gap-2 cursor-pointer font-label-md text-label-md text-outline">
<input class="w-4 h-4 rounded text-primary focus:ring-primary" type="checkbox"/>
<span>Pilih Semua yang Ditandai Aman (11 item)</span>
</label>
<button class="px-3.5 py-1.5 rounded-full bg-primary-light text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm transition-all font-semibold" onclick="toastNotice('11 listing aman berhasil disetujui sekaligus!')">
          Setujui Massal yang Terverifikasi
        </button>
</div>
<!-- Pagination -->
<div class="flex items-center gap-2">
<span class="font-body-sm text-body-sm text-outline mr-2">Menampilkan 1-3 dari 14 antrean</span>
<button class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface disabled:opacity-40" disabled="">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</button>
<button class="w-8 h-8 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center">1</button>
<button class="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center justify-center">2</button>
<button class="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center justify-center">3</button>
<button class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewbox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</button>
</div>
</div>
</div>
<!-- Micro-interaction Toast Notification Layer -->
<div class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none" id="toast">
<div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl">
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span class="font-label-md text-label-md font-medium" id="toast-text">Tindakan diproses</span>
</div>
</div>
</div>
<script>
  function toastNotice(msg) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    toastText.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
  }

  function handleSync(btn) {
    const icon = document.getElementById('sync-icon');
    const text = document.getElementById('sync-text');
    icon.classList.add('animate-spin');
    text.innerText = 'Menyinkronkan...';
    setTimeout(() => {
      icon.classList.remove('animate-spin');
      text.innerText = 'Sinkron Realtime';
      toastNotice('Katalog moderasi berhasil diperbarui dengan data server terkini!');
    }, 900);
  }
</script>
</main>
</div>
</body></html>
