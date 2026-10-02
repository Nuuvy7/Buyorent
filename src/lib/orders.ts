import { createClient } from "@/lib/supabase/client";
import { emitStore } from "@/lib/store";

// Tahap E — sumber data pesanan (orders + order_items), RLS aktif.

export type OrderStatus = "pending" | "processing" | "completed";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Menunggu Pembayaran",
  processing: "Diproses",
  completed: "Selesai",
};

/** Badge variant per status (cocokkan src/components/ui/badge). */
export function statusVariant(s: string): "amber" | "default" | "solid" | "muted" {
  if (s === "pending") return "amber";
  if (s === "processing") return "default";
  if (s === "completed") return "solid";
  return "muted";
}

export interface OrderItem {
  id: number; // order_items.id (bigserial) — kunci RPC seller_contact
  item_id: string;
  name: string | null; // items.name via embed; null bila listing sudah dihapus admin
  price: number;
  quantity: number;
  is_service: boolean;
  service_approved: boolean | null;
  note: string | null;
}

export interface Order {
  id: string;
  status: OrderStatus;
  total_price: number;
  shipping_fee: number;
  address: string;
  phone: string;
  payment_proof: string | null;
  created_at: string;
  items: OrderItem[];
}

type OrderDbRow = Omit<Order, "items" | "total_price" | "shipping_fee"> & {
  total_price: number | string;
  shipping_fee: number | string;
  items: (Omit<OrderItem, "price"> & { price: number | string; item?: { name: string | null } | null })[];
};

function mapOrder(r: OrderDbRow): Order {
  return {
    ...r,
    total_price: Number(r.total_price),
    shipping_fee: Number(r.shipping_fee),
    items: (r.items ?? []).map((i) => ({ ...i, price: Number(i.price), name: i.item?.name ?? null })),
  };
}

const ORDER_SELECT =
  "*, items:order_items(id, item_id, price, quantity, is_service, service_approved, note, item:items(name))";

/** Riwayat pesanan milik sesi (RLS: pembeli melihat pesanannya sendiri). */
export async function fetchMyOrders(): Promise<Order[]> {
  const { data, error } = await createClient()
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchMyOrders:", error.message);
    return [];
  }
  return ((data ?? []) as unknown as OrderDbRow[]).map(mapOrder);
}

/** Satu pesanan by id (0 baris = bukan milikmu / tidak ada — RLS diam). */
export async function fetchOrder(id: string): Promise<Order | null> {
  const { data, error } = await createClient()
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("fetchOrder:", error.message);
    return null;
  }
  return data ? mapOrder(data as unknown as OrderDbRow) : null;
}

/** Item yang dijual sesi ini + induknya — untuk halaman /seller/orders. */
export interface SellerOrderItem extends OrderItem {
  order: Pick<Order, "id" | "status" | "total_price" | "shipping_fee" | "address" | "phone" | "payment_proof" | "created_at">;
}

type SellerDbRow = Omit<SellerOrderItem, "price" | "order"> & {
  price: number | string;
  item?: { name: string | null } | null;
  order: Record<string, unknown> | null;
};

export async function fetchSellerOrderItems(): Promise<SellerOrderItem[]> {
  const { data, error } = await createClient()
    .from("order_items")
    .select(
      "id, item_id, price, quantity, is_service, service_approved, note, item:items(name), order:orders(id, status, total_price, shipping_fee, address, phone, payment_proof, created_at)"
    )
    .order("id", { ascending: true });
  if (error) {
    console.error("fetchSellerOrderItems:", error.message);
    return [];
  }
  return ((data ?? []) as unknown as SellerDbRow[]).map((r) => ({
    ...r,
    price: Number(r.price),
    name: r.item?.name ?? null,
    order: {
      ...(r.order as SellerOrderItem["order"]),
      total_price: Number((r.order as { total_price: number | string }).total_price),
      shipping_fee: Number((r.order as { shipping_fee: number | string }).shipping_fee),
    },
  }));
}

type Result = { ok: false; error: string };

/** Penjual ubah status: pending → processing → completed. 0 baris = RLS tolak. */
export async function setOrderStatus(orderId: string, status: OrderStatus): Promise<{ ok: true } | Result> {
  const { data, error } = await createClient()
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id");
  if (error) return { ok: false, error: error.message };
  if (!data?.length) return { ok: false, error: "Tidak ada izin atau pesanan tidak ditemukan" };
  emitStore();
  return { ok: true };
}

/** Penjual ACC pesanan jasa → kontak penjual terbuka ke pembeli. */
export async function approveService(orderItemId: number): Promise<{ ok: true } | Result> {
  const { data, error } = await createClient()
    .from("order_items")
    .update({ service_approved: true })
    .eq("id", orderItemId)
    .select("id");
  if (error) return { ok: false, error: error.message };
  if (!data?.length) return { ok: false, error: "Tidak ada izin atau item tidak ditemukan" };
  emitStore();
  return { ok: true };
}

/** RPC: no. HP penjual — hanya untuk pembeli & hanya setelah service_approved. */
export async function fetchSellerContact(
  orderItemId: number
): Promise<{ ok: true; phone: string } | Result> {
  const { data, error } = await createClient().rpc("seller_contact", {
    p_order_item_id: orderItemId,
  });
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Kontak terbuka setelah penjual menyetujui pesanan jasa" };
  return { ok: true, phone: data as string };
}

/** Unggah bukti transfer ke bucket privat payment-proofs → catat path di orders. */
export async function attachProof(orderId: string, file: File): Promise<{ ok: true; path: string } | Result> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { ok: false, error: "Sesi berakhir — silakan masuk kembali." };
  const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(-60) || "bukti.jpg";
  const path = `${session.user.id}/${orderId}/${Date.now()}-${safeName}`;
  const up = await supabase.storage.from("payment-proofs").upload(path, file, { contentType: file.type });
  if (up.error) return { ok: false, error: `Gagal unggah bukti: ${up.error.message}` };
  const { error: updErr } = await supabase
    .from("orders")
    .update({ payment_proof: up.data.path })
    .eq("id", orderId);
  if (updErr) return { ok: false, error: `Bukti terunggah tapi gagal tercatat: ${updErr.message}` };
  emitStore();
  return { ok: true, path: up.data.path };
}

/** URL sementara untuk membuka bukti transfer (bucket privat, berlaku 1 jam). */
export async function proofUrl(path: string): Promise<string | null> {
  const { data, error } = await createClient().storage.from("payment-proofs").createSignedUrl(path, 3600);
  if (error) {
    console.error("proofUrl:", error.message);
    return null;
  }
  return data.signedUrl;
}

export const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
export const shortId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
