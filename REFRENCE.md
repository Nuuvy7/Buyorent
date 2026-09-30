<!DOCTYPE html>

<html lang="id"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta content="web_standard" name="shell-type"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
    @layer base {
      html, body { margin: 0; padding: 0; }
      body { overscroll-behavior: none; }
      main > :first-child { margin-top: 0 !important; }
      main > :last-child { margin-bottom: 0 !important; }
    }
    ::-webkit-scrollbar { display: none; }
  </style>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            primary: "#047857",
            "primary-dark": "#065f46",
            "primary-container": "#10b981",
            "primary-light": "#ecfdf5",
            teal: {
              50: "#f0fdfa",
              100: "#ccfbf1",
              200: "#99f6e4",
              600: "#0d9488",
              700: "#0f766e",
              800: "#115e59",
              900: "#134e4a"
            },
            amber: {
              500: "#f59e0b",
              600: "#d97706"
            },
            coral: "#ea580c"
          },
          fontFamily: {
            sans: ["'Plus Jakarta Sans'", "sans-serif"]
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#f8fafc] text-slate-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
<!-- TOP APP HEADER -->
<header class="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<!-- Primary Spacious Navigation Bar -->
<div class="py-3.5 flex items-center justify-between gap-4 lg:gap-6">
<!-- Left: Logo & Campus Selector (Amazon style 'Deliver to') -->
<div class="flex items-center gap-5 shrink-0">
<div class="flex items-center gap-2.5">
<img alt="Buyorrent logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1VtRB0LsH3nbz7JGuD3hgpWBUdVrAYvHgvJBjRA1Rzj7l7NsC_7VgpAviJKEontSUZbmcJPG-2xPgZspHxEJrddPGXRoT9OaZQj8_Eww-uoJHAioortZE3O5AuSSPnQBeguZjDVBvAkSgoJ70NEu0uULCw3MBjBVNJYARYcc-z5_8M_tzfdqtP-Yx6ARJjdNdG38xz_uE7VjXSzAQ3567xuLpggf0k_B3iJ7fL5n4lIdSMdtrdgz2RPLso"/>
<span class="text-xl font-extrabold tracking-tight text-slate-900">Buyorrent</span>
<span class="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Student Hub
          </span>
</div>
<!-- Campus Delivery / Location Pill (Amazon inspired) -->
<div class="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer">
<span class="material-symbols-outlined text-[#ea580c] text-lg">location_on</span>
<div class="flex flex-col text-left">
<span class="text-[10px] text-slate-400 font-medium leading-none">Kampus Aktif</span>
<span class="text-xs font-bold text-slate-800 leading-tight flex items-center gap-0.5">
              UI Depok &amp; Salemba
              <span class="material-symbols-outlined text-xs text-slate-400">expand_more</span>
</span>
</div>
</div>
</div>
<!-- Center: Wide & Sleek Search Bar (Amazon / Apple hybrid) -->
<div class="flex-1 max-w-2xl hidden md:block">
<div class="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-xs focus-within:border-[#f97316] focus-within:ring-2 focus-within:ring-[#ea580c]/20 focus-within:bg-white transition-all">
<!-- Category Dropdown Pill -->
<div class="relative flex items-center shrink-0">
<select class="bg-white text-slate-700 text-xs font-semibold pl-3 pr-7 py-2 rounded-xl border border-slate-200/80 cursor-pointer focus:outline-none appearance-none hover:bg-slate-50 transition-colors">
<option value="all">Semua</option>
<option value="barang">Barang Pre-loved</option>
<option value="jasa">Jasa &amp; Skill</option>
<option value="buku">Buku Kuliah</option>
<option value="kost">Kost Gear</option>
</select>
<span class="material-symbols-outlined text-slate-400 text-sm absolute right-2 pointer-events-none">unfold_more</span>
</div>
<!-- Input Textfield -->
<div class="flex-1 flex items-center px-3">
<span class="material-symbols-outlined text-slate-400 text-lg mr-2">search</span>
<input class="w-full bg-transparent border-0 focus:outline-none text-xs text-slate-800 placeholder:text-slate-400 py-1.5" placeholder="Cari buku kuliah, kalkulator, jasa desain, kamera, kost..." type="text"/>
</div>
<!-- Vibrant Warm Orange Search Action Button -->
<button class="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 shrink-0" type="button">
<span>Cari</span>
<span class="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
<!-- Right: Utility Items & Orange CTA -->
<div class="flex items-center gap-2 sm:gap-3">
<!-- Cart with Orange Badge -->
<a class="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center" href="#" title="Keranjang Belanja">
<span class="material-symbols-outlined text-xl">shopping_cart</span>
<span class="absolute top-1 right-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">2</span>
</a>
<!-- Notification with Orange Dot -->
<a class="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center" href="#" title="Notifikasi">
<span class="material-symbols-outlined text-xl">notifications</span>
<span class="absolute top-1.5 right-1.5 bg-[#ea580c] w-2 h-2 rounded-full ring-2 ring-white"></span>
</a>
<!-- User Profile Pill with DATA:IMAGE:IMAGE_20 -->
<div class="flex items-center gap-2 pl-2 border-l border-slate-200">
<div class="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-2xl transition-all cursor-pointer border border-slate-200/80">
<img alt="Profile Avatar" class="w-7 h-7 rounded-full object-cover ring-2 ring-[#f97316]/30 shadow-xs" src="https://lh3.googleusercontent.com/aida/AEtjO1WTnOa63qq1_aqN1nWgS2_oTAurcKB4EEqQv3pZbVepqsoxpZoy_1yOh3j6lDuI2NUWVX7MY9GE7rRP7J74-62q05I3SLJJNjVqBp3N8qK0RpIKtZb8fzMTC9OLKWJ8gaoUKw8pONPBrpVXTuZ5Xigy5flXQiRvAHxcO1aUv80XgYeJWr_-dExhj33ICsDs-RetDhny9XTQzjdCsHtQ7PmSMZD21wGk-aRbhlj_9zloBCSjIqD7H_V4_EI"/>
<div class="hidden lg:flex flex-col text-left">
<span class="text-xs font-semibold text-slate-800 leading-tight">Daffa Rizky</span>
<span class="text-[11px] text-[#ea580c] font-medium flex items-center gap-0.5 leading-tight">
<span class="material-symbols-outlined text-[12px] text-emerald-600">verified</span> UI Depok
              </span>
</div>
<span class="material-symbols-outlined text-slate-400 text-sm hidden sm:block">expand_more</span>
</div>
</div>
<!-- Warm Orange CTA Button -->
<a class="flex items-center gap-1.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:brightness-105 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm active:scale-95 transition-all ml-1" href="#">
<span class="material-symbols-outlined text-base">add_circle</span>
<span class="hidden sm:inline">+ Pasang Iklan</span>
<span class="sm:hidden">Pasang</span>
</a>
</div>
</div>
<!-- Secondary Clean Sub-Navigation Bar (Apple / Amazon Inspired) -->
<div class="flex items-center justify-between pb-3 pt-1 border-t border-slate-100 gap-4 overflow-x-auto text-xs">
<nav class="flex items-center gap-1 sm:gap-2 text-slate-600 whitespace-nowrap font-medium">
<a class="px-3 py-1 rounded-full bg-slate-900 text-white font-semibold transition-colors" href="#">Semua Kategori</a>
<a class="px-3 py-1 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors" href="#">Buku &amp; Modul Kuliah</a>
<a class="px-3 py-1 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors" href="#">Elektronik &amp; Gadget</a>
<a class="px-3 py-1 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors" href="#">Fashion &amp; Thrift</a>
<a class="px-3 py-1 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors" href="#">Jasa Desain &amp; Foto</a>
<a class="px-3 py-1 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors" href="#">Jasa Servis &amp; Les</a>
<a class="px-3 py-1 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors" href="#">Perlengkapan Kost</a>
</nav>
<!-- Right Mode Toggle with Orange Active Indicator -->
<div class="flex items-center gap-2 shrink-0">
<div class="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl">
<button class="px-3 py-1 rounded-lg bg-white text-slate-900 font-bold shadow-xs text-xs flex items-center gap-1" type="button">
<span class="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
            Mode Beli
          </button>
<button class="px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors" type="button">Mode Sewa Jasa</button>
</div>
</div>
</div>
</div>
</header>
<!-- MAIN BODY -->
<main class="w-full pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex flex-col gap-8">
<!-- Streamlined Campus Ticker (Clean Icon Pills) -->
<div class="w-full bg-white border border-slate-200/80 py-2.5 px-4 sm:px-6 rounded-2xl flex items-center justify-between text-xs shadow-xs">
<div class="flex items-center gap-3 overflow-hidden">
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shrink-0">
<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE KAMPUS
          </span>
<span class="truncate text-slate-600 font-medium">
            Tripod Beike di UI Depok baru saja tersewa • Jasa PPT Skripsi Kilat (ITB) sisa 2 slot
          </span>
</div>
<div class="hidden sm:flex items-center gap-4 shrink-0 text-slate-600">
<span class="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-100">
<span class="material-symbols-outlined text-sm text-emerald-600">savings</span> Hemat Mahasiswa
          </span>
<span class="inline-flex items-center gap-1 font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
<span class="material-symbols-outlined text-sm text-teal-600">verified_user</span> Rekber Escrow Aman
          </span>
</div>
</div>
<!-- Hero Banner (Fresh Teal/Emerald & Amber Palette) -->
<section class="relative w-full rounded-3xl bg-gradient-to-br from-emerald-50/60 via-slate-50 to-teal-50/70 border p-8 sm:p-12 overflow-hidden shadow-xs border-slate-100">
<div class="absolute -right-16 -top-16 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>
<div class="absolute -left-16 -bottom-16 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none"></div>
<div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-5">
<div class="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full shadow-xs border text-xs font-semibold text-slate-700 border-slate-100">
<span class="material-symbols-outlined text-emerald-600 text-sm">eco</span>
<span>Campus Circular Economy #1 di Indonesia</span>
<span class="inline-flex items-center gap-1 bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
<span class="material-symbols-outlined text-[12px]">verified</span> KTM Verified
            </span>
</div>
<h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-2xl mx-auto">Thrift Barang Idaman <span class="font-light text-slate-400">&amp;</span> <span class="text-emerald-700 font-extrabold">Sewa Jasa Kampus</span></h1>
<p class="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
            Marketplace pre-loved &amp; keahlian teman sekampus. Hemat uang saku, transparan, dan COD aman di lingkungan kampus.
          </p>
<!-- Omnibar Search -->
<div class="w-full max-w-2xl bg-white rounded-2xl p-2 shadow-lg shadow-slate-200/50 border border-slate-200/80 flex flex-col md:flex-row items-stretch gap-2">
<div class="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
<span class="material-symbols-outlined text-emerald-700 text-lg">school</span>
<div class="flex flex-col text-left">
<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kampus</span>
<select class="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-4" id="campusFilterSelect">
<option value="all">Semua Kampus</option>
<option selected="" value="ui">UI Depok &amp; Salemba</option>
<option value="itb">ITB Ganesha &amp; Jatinangor</option>
<option value="ugm">UGM Bulaksumur</option>
<option value="sma">SMA/SMK Sekitar</option>
</select>
</div>
</div>
<div class="flex-1 flex items-center px-3 bg-slate-50 rounded-xl border border-slate-200/60">
<span class="material-symbols-outlined text-slate-400 mr-2 text-lg">search</span>
<input class="w-full bg-transparent border-0 focus:outline-none text-xs text-slate-800 placeholder:text-slate-400 py-2" id="keywordInput" placeholder="Ketik kalkulator, kamera, jasa PPT, servis..." type="text"/>
</div>
<div class="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
<span class="material-symbols-outlined text-amber-600 text-base">payments</span>
<select class="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer" id="heroBudgetRange">
<option value="any">Semua Budget</option>
<option value="u50">&lt; Rp 50.000</option>
<option value="50-200">Rp 50rb - 200rb</option>
<option value="o200">&gt; Rp 200.000</option>
</select>
</div>
<button class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5" type="button">
<span>Eksplor</span>
<span class="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
<!-- Quick Filter Badges -->
<div class="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
<span class="text-slate-400 font-medium">Filter Cepat:</span>
<button class="px-3 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold shadow-xs border border-slate-200/80 transition-all" type="button">≤ Rp 50rb</button>
<button class="px-3 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold shadow-xs border border-slate-200/80 transition-all" type="button">Rp 50rb - 200rb</button>
<button class="px-3 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold shadow-xs border border-slate-200/80 transition-all" type="button">&gt; Rp 200rb</button>
</div>
</div>
</section>
<!-- Dual Mode Selector + Sorting -->
<section class="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
<div class="p-1 bg-slate-100 rounded-2xl flex items-center gap-1 w-full sm:w-auto shadow-xs"><button class="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 shadow-sm text-xs font-bold transition-all" id="tabModeBuy" type="button"><svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewbox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" x2="21" y1="6" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg><span>Beli Barang Pre-loved</span><span class="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">248</span></button><button class="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all" id="tabModeRent" type="button"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewbox="0 0 24 24"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg><span>Sewa Jasa &amp; Skill</span><span class="bg-slate-200 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-full">94</span></button></div>
<div class="flex items-center gap-2 self-end sm:self-center">
<span class="text-xs text-slate-400 font-medium">Urutkan:</span>
<select class="bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs focus:outline-none cursor-pointer" id="sortSelect">
<option value="featured">Paling Relevan</option>
<option value="price-asc">Harga Terhemat</option>
<option value="price-desc">Harga Tertinggi</option>
<option value="closest">Jarak Terdekat (COD Kampus)</option>
</select>
</div>
</section>
<!-- Grid Layout: Sidebar + Cards -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
<!-- LEFT SIDEBAR: STREAMLINED FILTERS -->
<aside class="lg:col-span-3 w-full bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-6">
<div class="flex items-center justify-between pb-3 border-b border-slate-100">
<span class="text-sm font-bold text-slate-900 flex items-center gap-2">
<span class="material-symbols-outlined text-emerald-700 text-lg">tune</span> Filter
            </span>
<button class="text-xs text-emerald-700 hover:underline font-semibold" type="button">Reset</button>
</div>
<!-- Kampus -->
<div class="flex flex-col gap-2">
<span class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
<span class="material-symbols-outlined text-sm text-slate-400">school</span> Kampus
            </span>
<div class="space-y-1 text-xs">
<label class="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer">
<span class="flex items-center gap-2 text-slate-700 font-medium">
<input checked="" class="w-3.5 h-3.5 rounded text-emerald-700 focus:ring-0" type="checkbox"/> UI Depok
                </span>
<span class="text-[11px] text-slate-400 font-semibold">182</span>
</label>
<label class="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer">
<span class="flex items-center gap-2 text-slate-700 font-medium">
<input checked="" class="w-3.5 h-3.5 rounded text-emerald-700 focus:ring-0" type="checkbox"/> ITB Ganesha
                </span>
<span class="text-[11px] text-slate-400 font-semibold">95</span>
</label>
<label class="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer">
<span class="flex items-center gap-2 text-slate-700 font-medium">
<input class="w-3.5 h-3.5 rounded text-emerald-700 focus:ring-0" type="checkbox"/> UGM
                </span>
<span class="text-[11px] text-slate-400 font-semibold">64</span>
</label>
<label class="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer">
<span class="flex items-center gap-2 text-slate-700 font-medium">
<input class="w-3.5 h-3.5 rounded text-emerald-700 focus:ring-0" type="checkbox"/> SMA/SMK Sekitar
                </span>
<span class="text-[11px] text-slate-400 font-semibold">41</span>
</label>
</div>
</div>
<!-- Kondisi -->
<div class="flex flex-col gap-2 pt-2 border-t border-slate-100">
<span class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
<span class="material-symbols-outlined text-sm text-slate-400">check_circle</span> Kondisi
            </span>
<div class="space-y-1 text-xs">
<label class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-700 font-medium">
<input checked="" class="w-3.5 h-3.5 text-emerald-700" name="cond" type="radio"/> Semua Kondisi
              </label>
<label class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-700 font-medium">
<input class="w-3.5 h-3.5 text-emerald-700" name="cond" type="radio"/> Like New (90%+)
              </label>
<label class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-700 font-medium">
<input class="w-3.5 h-3.5 text-emerald-700" name="cond" type="radio"/> Wajar Pakai
              </label>
</div>
</div>
<!-- Titik COD -->
<div class="flex flex-col gap-2 pt-2 border-t border-slate-100">
<span class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
<span class="material-symbols-outlined text-sm text-slate-400">location_on</span> Titik COD
            </span>
<div class="space-y-1 text-xs text-slate-700">
<label class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer font-medium">
<input checked="" class="w-3.5 h-3.5 rounded text-emerald-700" type="checkbox"/> Kantin / Perpus
              </label>
<label class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer font-medium">
<input checked="" class="w-3.5 h-3.5 rounded text-emerald-700" type="checkbox"/> Stasiun KRL / Halte
              </label>
<label class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer font-medium">
<input class="w-3.5 h-3.5 rounded text-emerald-700" type="checkbox"/> Kawasan Kost Mahasiswa
              </label>
</div>
</div>
<!-- Student Verified Pill -->
<div class="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-2.5">
<span class="material-symbols-outlined text-emerald-700 text-xl shrink-0 mt-0.5">verified_user</span>
<div>
<span class="text-xs font-bold text-emerald-900 block">Student Verified Only</span>
<p class="text-[11px] text-emerald-800/80 mt-0.5 leading-snug">
                Semua penjual terverifikasi menggunakan KTM resmi aktif.
              </p>
</div>
</div>
</aside>
<!-- RIGHT CATALOG GRID -->
<div class="lg:col-span-9 flex flex-col gap-6">
<!-- Section Heading -->
<div class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
<h2 class="text-base font-bold text-slate-900">Rekomendasi Terhangat</h2>
<span class="text-xs text-slate-400 font-medium hidden sm:inline">(6 listing pilihan)</span>
</div>
<div class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
<span class="material-symbols-outlined text-xs text-emerald-600">schedule</span> Baru diupdate
            </div>
</div>
<!-- Cards Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
<!-- CARD 1: Kalkulator Ilmiah Casio -->
<article class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col">
<div class="relative w-full h-48 bg-slate-100 overflow-hidden">
<img alt="Kalkulator Ilmiah Casio" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBGWQVWin4spjXjFKD6SxnAHPNgHv26kfF9qqIi0E-zo4OhYDVZrKJg9SV9M09IbvJXT7pPzXUH8XoRPwcIe0e470Txyzc-iqxJc-hZi9CBSKtZu5SYbmFDAEHqtiz2j5WhOTaQ9pDPSKzosJIlyuWTSO_2IHzUD_Sr5VnmiHdnqh5ZqevmdiOck-viXA7s9XU_b0SePJmUjNcqxdvv2mS6Qe2ZLTtSYPnbrPvrRofY1eO9C9DTPNGFQ"/>
<!-- Minimal Badge -->
<span class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
<span class="material-symbols-outlined text-xs text-emerald-600">verified</span> 95% Mulus
                </span>
<button aria-label="Favorit" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-500 flex items-center justify-center transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-base">favorite</span>
</button>
<div class="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
<span class="material-symbols-outlined text-xs">near_me</span> FT UI Depok
                </div>
</div>
<div class="p-5 flex-1 flex flex-col justify-between gap-4">
<div>
<div class="flex items-center justify-between mb-1.5">
<span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Alat Kuliah</span>
<span class="text-[11px] text-slate-400 font-medium">Casio FX-991EX</span>
</div>
<h3 class="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    Kalkulator Ilmiah Casio FX-991EX
                  </h3>
<p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    Dipakai 2 semester matkul Kalkulus. Layar bening, tombol responsif 100%, bonus baterai cadangan.
                  </p>
</div>
<div class="pt-3 border-t border-slate-100 flex flex-col gap-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">R</div>
<span class="text-xs font-semibold text-slate-700">Rizky M.</span>
<span class="material-symbols-outlined text-emerald-600 text-xs">verified</span>
</div>
<span class="text-[11px] text-slate-400">Teknik UI</span>
</div>
<div class="flex items-center justify-between">
<div>
<span class="text-[10px] text-slate-400 block font-semibold">Harga</span>
<span class="text-base font-extrabold text-slate-900">Rp 140.000</span>
</div>
<div class="flex items-center gap-1.5">
<button class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors" title="Keranjang" type="button">
<span class="material-symbols-outlined text-base">shopping_cart</span>
</button>
<button class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95" type="button">
                        Beli
                      </button>
</div>
</div>
</div>
</div>
</article>
<!-- CARD 2: Jasa Desain Poster & PPT Sidang (Clean Teal / Emerald) -->
<article class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col">
<div class="relative w-full h-48 bg-slate-100 overflow-hidden">
<img alt="Desain Poster &amp; PPT Sidang" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSIdSKHxgj5QPvunyLR1oMzEuexatWFCxLa5tpx31qALEtd6yVxbEkj9tn9KWT1LSP7fv-ts6Rzi5MMcLeIGLayYOI5_soax9grAy4quEjoFf7s9EC1j3iGZr8yi33jlBsSzv6ZcbvsdpdoUIJXI47pwFzTsx8I1Bt3qw4BFF4S8mWJWXrVAJzUUDCUbMlORtSlA1aaxjqED-_1HPlSX9soGvf76dGInbopEopkxVwwI5Ox7ud1O1jzw"/>
<span class="absolute top-3 left-3 bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
<span class="material-symbols-outlined text-xs text-teal-600">palette</span> Jasa Desain
                </span>
<button aria-label="Favorit" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-500 flex items-center justify-center transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-base">favorite</span>
</button>
<div class="absolute bottom-3 left-3 bg-teal-800/90 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
<span class="material-symbols-outlined text-xs text-amber-300">star</span> 4.9 • 42 Portofolio
                </div>
</div>
<div class="p-5 flex-1 flex flex-col justify-between gap-4">
<div>
<div class="flex items-center justify-between mb-1.5">
<span class="text-[11px] font-bold uppercase tracking-wider text-teal-700">Freelance</span>
<span class="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">Revisi 2x</span>
</div>
<h3 class="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
                    Desain PPT Sidang &amp; Poster Skripsi
                  </h3>
<p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    Layout modern, infografis data rapi siap sidang, file Canva Pro atau PPT editable.
                  </p>
</div>
<div class="pt-3 border-t border-slate-100 flex flex-col gap-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">N</div>
<span class="text-xs font-semibold text-slate-700">Nadia S.</span>
<span class="material-symbols-outlined text-emerald-600 text-xs">verified</span>
</div>
<span class="text-[11px] text-slate-400">DKV ITB</span>
</div>
<div class="flex items-center justify-between">
<div>
<span class="text-[10px] text-slate-400 block font-semibold">Mulai</span>
<span class="text-base font-extrabold text-teal-800">Rp 35.000<span class="text-xs font-normal text-slate-400">/slide</span></span>
</div>
<button class="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1" type="button">
<span>Request</span>
<span class="material-symbols-outlined text-xs">chat</span>
</button>
</div>
</div>
</div>
</article>
<!-- CARD 3: Kemeja Flanel Uniqlo Vintage -->
<article class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col">
<div class="relative w-full h-48 bg-slate-100 overflow-hidden">
<img alt="Kemeja Flanel Uniqlo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd6_OBrPsNEH3YdOXTni5bNxNvaLQ2qazdFX9RrocUCjjEHQYE5pPrkAEPu2SIW7iOiv3RdMfq5uYBuQaOxGqHnnXuXZdqPLtbE1Uh9Xogv18GTxuFfGSkRgqDmc02X3YnBIzkaXgM6qpDpo8m_YY9Ll7C2idEgUYeJxf3xtlaUgmBEIUGVpCBkPQkR79DWUc3VRyE_3mptD41NqwdULCMxzKybfuQTSgzKCr3V0wu8qc1x4w1wXQk9A"/>
<span class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
<span class="material-symbols-outlined text-xs text-emerald-600">checkroom</span> Thrifted
                </span>
<button aria-label="Favorit" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-500 flex items-center justify-center transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-base">favorite</span>
</button>
<div class="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
<span class="material-symbols-outlined text-xs">handshake</span> Halte UI / Sekolah
                </div>
</div>
<div class="p-5 flex-1 flex flex-col justify-between gap-4">
<div>
<div class="flex items-center justify-between mb-1.5">
<span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Fashion</span>
<span class="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">Size XL</span>
</div>
<h3 class="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    Kemeja Flanel Uniqlo Vintage
                  </h3>
<p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    Warna pekat 90%, katun tebal lembut khas Uniqlo, wangi laundry siap pakai ngampus.
                  </p>
</div>
<div class="pt-3 border-t border-slate-100 flex flex-col gap-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">A</div>
<span class="text-xs font-semibold text-slate-700">Alifia</span>
<span class="material-symbols-outlined text-emerald-600 text-xs">verified</span>
</div>
<span class="text-[11px] text-slate-400">SMAN 28</span>
</div>
<div class="flex items-center justify-between">
<div>
<span class="text-[10px] text-slate-400 block font-semibold">Harga</span>
<span class="text-base font-extrabold text-slate-900">Rp 65.000</span>
</div>
<div class="flex items-center gap-1.5">
<button class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors" title="Keranjang" type="button">
<span class="material-symbols-outlined text-base">shopping_cart</span>
</button>
<button class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95" type="button">
                        Beli
                      </button>
</div>
</div>
</div>
</div>
</article>
<!-- CARD 4: Jasa Servis Laptop (Clean Slate/Teal) -->
<article class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col">
<div class="relative w-full h-48 bg-slate-100 overflow-hidden">
<img alt="Servis Laptop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-Rk-m7P92D8sa2Zr2J3RwMhsUNau55-9AuA6mwe4yjbQu5NWkxBT95UPD5DvGszTQ80kZ9rJqwSAnpxAaI-6jRjJQ6WUqMKP-KGyI6AQUFMMpTfTZ7BmiT0HHKMK4KgExH-t57KOOIHogJDXaMm__okUQu968hs4IBNG300aEJyo9Qc92m1-OZOkThHGKZZRAVhEpCJ68dEE3nicqX07i3mjqRzCm0X74PpuLOHLikO7i-6ZbQIEjsg"/>
<span class="absolute top-3 left-3 bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
<span class="material-symbols-outlined text-xs text-teal-600">build</span> Teknisi Kampus
                </span>
<button aria-label="Favorit" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-500 flex items-center justify-center transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-base">favorite</span>
</button>
<div class="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
<span class="material-symbols-outlined text-xs">location_on</span> Siap Datang ke Kost
                </div>
</div>
<div class="p-5 flex-1 flex flex-col justify-between gap-4">
<div>
<div class="flex items-center justify-between mb-1.5">
<span class="text-[11px] font-bold uppercase tracking-wider text-teal-700">Tech Support</span>
<span class="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Garansi 14 Hari</span>
</div>
<h3 class="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
                    Servis &amp; Install Ulang Laptop
                  </h3>
<p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    Install OS bersih, ganti pasta thermal, upgrade SSD, dan install software kuliah lengkap.
                  </p>
</div>
<div class="pt-3 border-t border-slate-100 flex flex-col gap-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold">B</div>
<span class="text-xs font-semibold text-slate-700">Bima Tech</span>
<span class="material-symbols-outlined text-emerald-600 text-xs">verified</span>
</div>
<span class="text-[11px] text-slate-400">Fasilkom UI</span>
</div>
<div class="flex items-center justify-between">
<div>
<span class="text-[10px] text-slate-400 block font-semibold">Tarif</span>
<span class="text-base font-extrabold text-teal-800">Rp 50.000<span class="text-xs font-normal text-slate-400">/sesi</span></span>
</div>
<button class="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1" type="button">
<span>Booking</span>
<span class="material-symbols-outlined text-xs">calendar_today</span>
</button>
</div>
</div>
</div>
</article>
<!-- CARD 5: Lampu Meja Belajar Aesthetic -->
<article class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col">
<div class="relative w-full h-48 bg-slate-100 overflow-hidden">
<img alt="Lampu Meja Belajar" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiC-OPADkgOaFC3JvOjS2f3Lze6B7gZJuhZYvP5RMS8PnI6PiBGgK3XkEk40OhEts18ncQOL4GSYuZRsbmqXyTfn98qBU8PrmPWp-Qxl0oeZJxxw8If6ZwhdrdRbghu7PSj1a1cm72YON8k37sEEGi8JBz5gUbQvpWe2F7grh8SBjL6eFFG_pu-Ak0lFW7DpiK68Eq0pwuGQLTBxVXBYE-909YLW7LdaWQm9CnjLfYQL96yFk3hBlPbw"/>
<span class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
<span class="material-symbols-outlined text-xs text-emerald-600">light</span> Kost Gear
                </span>
<button aria-label="Favorit" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-500 flex items-center justify-center transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-base">favorite</span>
</button>
<div class="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
<span class="material-symbols-outlined text-xs">cottage</span> Kukusan Depok
                </div>
</div>
<div class="p-5 flex-1 flex flex-col justify-between gap-4">
<div>
<div class="flex items-center justify-between mb-1.5">
<span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Perlengkapan Kost</span>
<span class="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">3 Tingkat Terang</span>
</div>
<h3 class="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    Lampu Meja Belajar Aesthetic
                  </h3>
<p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    Leher fleksibel, port USB charger HP, sensor sentuh. Dijual karena selesai kuliah &amp; pindah kost.
                  </p>
</div>
<div class="pt-3 border-t border-slate-100 flex flex-col gap-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">D</div>
<span class="text-xs font-semibold text-slate-700">Dimas K.</span>
<span class="material-symbols-outlined text-emerald-600 text-xs">verified</span>
</div>
<span class="text-[11px] text-slate-400">Kukusan</span>
</div>
<div class="flex items-center justify-between">
<div>
<span class="text-[10px] text-slate-400 block font-semibold">Harga</span>
<span class="text-base font-extrabold text-slate-900">Rp 45.000</span>
</div>
<div class="flex items-center gap-1.5">
<button class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors" title="Keranjang" type="button">
<span class="material-symbols-outlined text-base">shopping_cart</span>
</button>
<button class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95" type="button">
                        Beli
                      </button>
</div>
</div>
</div>
</div>
</article>
<!-- CARD 6: Fotografer Wisuda (Clean Teal/Emerald) -->
<article class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col">
<div class="relative w-full h-48 bg-slate-100 overflow-hidden">
<img alt="Fotografer Wisuda" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvORGLssFRSO5CPoriG3wNBqAH4WeEhIbpAR-ER36dHnE_7DVPpb327FqqzsdBbOzUNMDhCOLeEX68hDkIaOSzUQXZmafCxOpyD3GS9KqE9FXcJWUIxQxn5IseUDBFyd5W6zMV_TwiUWhnV0zQxgjzzhsdKNtueHgljOXICvsCHKxslP_A6gCp5TN5lFbmXw1JqGik63JosiR4H6gDFcwAcXz32irRBO9eJH2ilyakp-sa4F6NGZbbtA"/>
<span class="absolute top-3 left-3 bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
<span class="material-symbols-outlined text-xs text-teal-600">photo_camera</span> Jasa Foto
                </span>
<button aria-label="Favorit" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-500 flex items-center justify-center transition-colors shadow-xs" type="button">
<span class="material-symbols-outlined text-base">favorite</span>
</button>
<div class="absolute bottom-3 left-3 bg-teal-800/90 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
<span class="material-symbols-outlined text-xs">auto_awesome</span> Softfile + 10 Edit
                </div>
</div>
<div class="p-5 flex-1 flex flex-col justify-between gap-4">
<div>
<div class="flex items-center justify-between mb-1.5">
<span class="text-[11px] font-bold uppercase tracking-wider text-teal-700">Fotografi Wisuda</span>
<span class="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">Sony A7</span>
</div>
<h3 class="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
                    Fotografer Wisuda Paket Hemat
                  </h3>
<p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    Warna natural estetik, siap foto bersama keluarga/sahabat, file Google Drive di hari H.
                  </p>
</div>
<div class="pt-3 border-t border-slate-100 flex flex-col gap-3">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">L</div>
<span class="text-xs font-semibold text-slate-700">LensKreatif</span>
<span class="material-symbols-outlined text-emerald-600 text-xs">verified</span>
</div>
<span class="text-[11px] text-slate-400">UI Depok</span>
</div>
<div class="flex items-center justify-between">
<div>
<span class="text-[10px] text-slate-400 block font-semibold">Paket 2 Jam</span>
<span class="text-base font-extrabold text-teal-800">Rp 150.000</span>
</div>
<button class="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1" type="button">
<span>Booking</span>
<span class="material-symbols-outlined text-xs">calendar_month</span>
</button>
</div>
</div>
</div>
</article>
</div>
<!-- Impact Banner (Harmonized Emerald & Teal) -->
<section class="mt-4 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-slate-50 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-100/80 shadow-xs">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-700/20">
<span class="material-symbols-outlined text-2xl">recycling</span>
</div>
<div>
<h4 class="text-sm font-bold text-slate-900">Dampak Nyata Komunitas Buyorrent</h4>
<p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  420+ transaksi berhasil menghemat ±Rp 48.5jt uang saku dan mengurangi limbah alat kuliah.
                </p>
</div>
</div>
<div class="flex items-center gap-3 shrink-0 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
<div class="text-right">
<span class="text-base font-extrabold text-emerald-700 leading-none block">98.4%</span>
<span class="text-[10px] text-slate-400 font-medium">COD Aman</span>
</div>
<svg class="w-8 h-8 text-emerald-600" viewbox="0 0 36 36">
<path class="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4"></path>
<path class="text-emerald-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="98.4, 100" stroke-linecap="round" stroke-width="4"></path>
</svg>
</div>
</section>
</div>
</div>
</div>
</main>
<!-- FOOTER (Clean Mint/Sage + Slate) -->
<footer class="w-full bg-white border-t border-slate-200/80 py-12">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
<div>
<div class="flex items-center gap-2 mb-3">
<span class="text-lg font-extrabold text-emerald-800 tracking-tight">Buyorrent</span>
<span class="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">Kampus Hub</span>
</div>
<p class="text-xs text-slate-500 leading-relaxed">
            Marketplace amanah kantong ramah khusus pelajar &amp; mahasiswa. Transaksi pre-loved hemat dan sewa keahlian teman satu kampus.
          </p>
</div>
<div>
<h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Jelajah</h4>
<ul class="space-y-2 text-xs text-slate-500">
<li><a class="hover:text-emerald-700 transition-colors" href="#">Semua Listing Barang</a></li>
<li><a class="hover:text-emerald-700 transition-colors" href="#">Jasa &amp; Freelance Mahasiswa</a></li>
<li><a class="hover:text-emerald-700 transition-colors" href="#">Area Kampus Terdaftar</a></li>
<li><a class="hover:text-emerald-700 transition-colors" href="#">Bursa Modul &amp; Diktat</a></li>
</ul>
</div>
<div>
<h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Bantuan &amp; Keamanan</h4>
<ul class="space-y-2 text-xs text-slate-500">
<li><a class="hover:text-emerald-700 transition-colors" href="#">Panduan Aman COD Kampus</a></li>
<li><a class="hover:text-emerald-700 transition-colors" href="#">Verifikasi KTM</a></li>
<li><a class="hover:text-emerald-700 transition-colors" href="#">Pusat Bantuan &amp; FAQ</a></li>
<li><a class="hover:text-emerald-700 transition-colors" href="#">Kebijakan Komunitas</a></li>
</ul>
</div>
<div>
<h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Jaminan Pelajar</h4>
<div class="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
<div class="flex items-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
<span class="material-symbols-outlined text-base text-emerald-600">verified_user</span>
<span>Proteksi Dompet Pelajar</span>
</div>
<p class="text-[11px] text-slate-500 leading-relaxed">
              Escrow aman: dana baru diteruskan setelah barang diperiksa saat COD atau sesi jasa terselesaikan.
            </p>
</div>
</div>
</div>
<div class="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
<p>© 2025 Buyorrent Indonesia. Circular economy for campuses.</p>
<div class="flex items-center gap-2">
<span class="text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[11px]">
            Depok • Grogol • Jatinangor • Bulaksumur
          </span>
</div>
</div>
</div>
</footer>
</body></html>
