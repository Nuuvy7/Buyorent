import type { ItemData } from "@/components/item-card";
import { emitStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

/** Baris `items` dari Supabase + flag moderasi (dipakai panel admin). */
export interface ItemRow extends ItemData {
  isApproved: boolean;
  /** uuid penjual — dibutuhkan checkout (order_items.seller_id, Tahap D5). */
  sellerId: string;
}

/* Metadata tampilan 6 listing seed. Kolom display (categoryLabel/badge/rating/
   priceUnit) sengaja tidak ada di schema (HANDOFF Bagian 6) — daftarkan di sini
   dengan uuid TETAP yang dipakai saat seeding (scripts/seed-items.mjs).
   Listing baru tanpa entri memakai nilai derive di mapRow(). */
const SEED_META: Record<
  string,
  Partial<Pick<ItemData, "categoryLabel" | "badge" | "rating" | "priceUnit">>
> = {
  "00000000-0000-4000-8000-000000000001": { categoryLabel: "Alat Kuliah", badge: "95% Mulus" },
  "00000000-0000-4000-8000-000000000002": {
    categoryLabel: "Freelance",
    badge: "Jasa Desain",
    rating: "4.9 • 42 Portofolio",
    priceUnit: "/slide",
  },
  "00000000-0000-4000-8000-000000000003": { categoryLabel: "Fashion", badge: "Thrifted" },
  "00000000-0000-4000-8000-000000000004": {
    categoryLabel: "Tech Support",
    badge: "Teknisi Terkurasi",
    priceUnit: "/sesi",
  },
  "00000000-0000-4000-8000-000000000005": { categoryLabel: "Perlengkapan Kost", badge: "Kost Gear" },
  "00000000-0000-4000-8000-000000000006": {
    categoryLabel: "Fotografi Wisuda",
    badge: "Jasa Foto",
    priceUnit: "/2 jam",
  },
};

const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%230f1624'/><text x='50%' y='50%' fill='%2338bdf8' font-family='monospace' font-size='14' text-anchor='middle'>FOTO BELUM ADA</text></svg>"
)}`;

interface ItemDbRow {
  id: string;
  category_id: number;
  category?: { name: string } | null;
  seller_id: string;
  sub_category: string | null;
  name: string;
  description: string;
  price: number | string;
  condition: string | null;
  location: string | null;
  image_url: string | null;
  seller_name: string;
  seller_campus: string;
  seller_ktm: boolean;
  is_approved: boolean;
}

function mapRow(r: ItemDbRow): ItemRow {
  const catName = (r.category?.name ?? (r.category_id === 2 ? "Jasa" : "Barang")).toLowerCase();
  const category: "barang" | "jasa" = catName.includes("jasa") ? "jasa" : "barang";
  const meta = SEED_META[r.id];
  const badge =
    meta?.badge ??
    (category === "jasa"
      ? "Jasa Baru"
      : r.condition === "like-new"
        ? "Like New"
        : "Pre-loved");
  // Listing baru (D4): sub_category menyimpan pilihan KATEGORI form Pasang
  // Iklan → tampil sebagai label kategori (ikut pencarian home). Listing seed
  // memakai sub_category sebagai detail varian (Cakupan) — kasus meta dulu.
  const categoryLabel =
    meta?.categoryLabel ?? r.sub_category ?? (category === "jasa" ? "Jasa" : "Barang");
  const subLabel = meta
    ? r.sub_category ?? (category === "jasa" ? "Baru Tayang" : "Pre-loved")
    : category === "jasa"
      ? "Baru Tayang"
      : r.condition === "like-new"
        ? "Like New"
        : "Pre-loved";
  return {
    id: r.id,
    sellerId: r.seller_id,
    name: r.name,
    category,
    categoryLabel,
    subLabel,
    condition: r.condition ?? undefined,
    description: r.description,
    price: Number(r.price),
    priceUnit: meta?.priceUnit,
    imageUrl: r.image_url ?? PLACEHOLDER,
    badge,
    location: r.location ?? "",
    rating: meta?.rating,
    seller: {
      name: r.seller_name,
      avatarText: (r.seller_name.trim()[0] ?? "?").toUpperCase(),
      campus: r.seller_campus,
      verified: r.seller_ktm,
    },
    isApproved: r.is_approved,
  };
}

/**
 * Ambil listing. `approvedOnly` = hanya yang tayang (katalog publik).
 * Tanpa opsi = semua yang terlihat menurut RLS (admin/penjual melihat punyanya).
 */
export async function fetchItems(opts?: { approvedOnly?: boolean }): Promise<ItemRow[]> {
  let query = createClient().from("items").select("*, category:categories(name)");
  if (opts?.approvedOnly) query = query.eq("is_approved", true);
  const { data, error } = await query
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (error) {
    console.error("fetchItems:", error.message);
    return [];
  }
  return ((data ?? []) as unknown as ItemDbRow[]).map(mapRow);
}

/** Satu listing by id (RLS: publik hanya melihat yang tayang; penjual/admin juga punyanya). */
export async function fetchItem(id: string): Promise<ItemRow | null> {
  const { data, error } = await createClient()
    .from("items")
    .select("*, category:categories(name)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("fetchItem:", error.message);
    return null;
  }
  return data ? mapRow(data as unknown as ItemDbRow) : null;
}

/**
 * Moderasi admin: tayangkan / turunkan listing (UPDATE is_approved).
 * RLS item update = penjual atau admin; baris yang tak tersentuh RLS
 * dilaporkan sebagai "tidak ada izin" (PostgREST tidak error, hanya 0 baris).
 */
export async function setItemApproved(
  id: string,
  approved: boolean
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await createClient()
    .from("items")
    .update({ is_approved: approved })
    .eq("id", id)
    .select("id");
  if (error) return { ok: false, error: error.message };
  if (!data?.length) return { ok: false, error: "Tidak ada izin atau listing tidak ditemukan" };
  emitStore();
  return { ok: true };
}
