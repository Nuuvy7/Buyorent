import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key || url.includes("PROJECT-REF")) {
  console.error("FAIL: .env.local belum diisi");
  process.exit(1);
}
const db = createClient(url, key);

// [tabel, kolom wajib] — probe per kolom: error = kolom tidak ada
const PROBES = [
  ["users", ["id", "email", "name", "phone", "kecamatan", "ktm", "role", "is_blocked", "created_at"]],
  ["categories", ["id", "name"]],
  ["items", ["id", "seller_id", "category_id", "sub_category", "name", "description", "price",
    "condition", "location", "image_url", "seller_name", "seller_kecamatan", "seller_ktm",
    "is_approved", "created_at"]],
  ["cart", ["id", "user_id", "item_id", "quantity", "cod_spot", "note", "brief"]],
  ["orders", ["id", "buyer_id", "total_price", "shipping_fee", "status", "payment_proof", "address", "phone"]],
  ["order_items", ["id", "order_id", "item_id", "seller_id", "quantity", "price",
    "is_service", "service_approved", "note"]],
];

let failed = 0;
for (const [table, cols] of PROBES) {
  const { error } = await db.from(table).select(cols.join(",")).limit(1);
  if (error) { console.log(`FAIL ${table}: ${error.message}`); failed++; }
  else console.log(`OK   ${table} (${cols.length} kolom)`);
}
const { count } = await db.from("categories").select("id", { count: "exact", head: true });
if (count !== 2) { console.log(`FAIL categories seed: ${count} (harus 2)`); failed++; }
else console.log("OK   seed categories = 2");

console.log(failed ? `\n${failed} gagal` : "\nSEMUA LULUS");
process.exit(failed ? 1 : 0);
