// E2E Tahap E — data layer (supabase-js, cakupan sama persis dengan yang dipanggil halaman).
// Kredensial test: dibuat programatik, disimpan di file terpisah, TIDAK dicetak.
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const env = readFileSync(".env.local", "utf8");
const URL_ = env.match(/NEXT_PUBLIC_SUPABASE_URL=(\S+)/)?.[1];
const KEY = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(\S+)/)?.[1];
if (!URL_ || !KEY) { console.error("FAIL: .env.local"); process.exit(1); }

const CREDS = process.env.HOME + "/.hermes/cache/scratch/buyorent-e2e-creds.json";
let creds;
try { creds = JSON.parse(readFileSync(CREDS, "utf8")); }
catch {
  const pw = randomBytes(12).toString("base64url");
  creds = {
    penjual: { email: "tes-penjual-e2e@buyorent.test", password: pw },
    pembeli: { email: "tes-pembeli-e2e@buyorent.test", password: pw },
  };
  writeFileSync(CREDS, JSON.stringify(creds), { mode: 0o600 });
}

let pass = 0, fail = 0;
const ok = (cond, label) => { cond ? pass++ : fail++; console.log(`${cond ? "OK  " : "FAIL"} ${label}`); };

async function ensureUser(u, name, phone) {
  const anon = createClient(URL_, KEY);
  const { data, error } = await anon.auth.signUp({
    email: u.email, password: u.password, options: { data: { name, phone } },
  });
  if (error && !/already/i.test(error.message)) { console.log("signup error:", error.message); }
  // sign in (auto-confirm aktif — bila signUp tidak balik session, signIn tetap jalan)
  const { data: s, error: se } = await anon.auth.signInWithPassword({ email: u.email, password: u.password });
  if (se) { console.log("signin error:", se.message); process.exit(1); }
  return { db: anon, session: s.session, uid: s.session.user.id };
}

// cleanup order lama dari run sebelumnya (idempoten)
async function cleanOrders(db) {
  const { data: mine } = await db.from("orders").select("id").eq("address", "Jl. E2E Tes No. 1, Jakarta Pusat");
  if (mine?.length) {
    const ids = mine.map((o) => o.id);
    await db.from("order_items").delete().in("order_id", ids);
    await db.from("orders").delete().in("id", ids);
  }
}

const B = await ensureUser(creds.penjual, "Tes Penjual E2E", "081200000001");
const A = await ensureUser(creds.pembeli, "Tes Pembeli E2E", "081200000002");
console.log("akun siap (id tidak dicetak)");

// --- Tahap: penjual punya 2 listing (barang + jasa) ---
await B.db.from("items").delete().eq("seller_id", B.uid).eq("location", "Jakarta E2E");
const barang = { seller_id: B.uid, category_id: 1, name: "Barang Tes E2E", description: "hapus otomatis", price: 50000, condition: "used", location: "Jakarta E2E", seller_name: "Tes Penjual E2E", seller_kecamatan: "Universitas Trisakti", seller_ktm: true, is_approved: true };
const jasa = { ...barang, category_id: 2, name: "Jasa Tes E2E", price: 75000, condition: null };
const { data: iB, error: e1 } = await B.db.from("items").insert([barang, jasa]).select("id, category_id");
ok(!e1 && iB?.length === 2, `penjual insert 2 listing${e1 ? " — " + e1.message : ""}`);
const [itBarang, itJasa] = iB;

// --- Pembeli checkout 1 barang + 1 jasa dalam 1 order ---
await cleanOrders(A.db);
const total = barang.price + jasa.price;
const { data: ord, error: e2 } = await A.db.from("orders").insert({
  buyer_id: A.uid, total_price: total, shipping_fee: 0, status: "pending",
  address: "Jl. E2E Tes No. 1, Jakarta Pusat", phone: "081200000002",
}).select("id").single();
ok(!e2 && !!ord, `pembeli INSERT orders${e2 ? " — " + e2.message : ""}`);

const { data: ois, error: e3 } = await A.db.from("order_items").insert([
  { order_id: ord.id, item_id: itBarang.id, seller_id: B.uid, quantity: 1, price: barang.price, is_service: false, service_approved: null, note: null },
  { order_id: ord.id, item_id: itJasa.id, seller_id: B.uid, quantity: 1, price: jasa.price, is_service: true, service_approved: false, note: "buat presentasi" },
]).select("id, is_service");
ok(!e3 && ois?.length === 2, `pembeli INSERT 2 order_items${e3 ? " — " + e3.message : ""}`);
const oiBarang = ois.find((r) => !r.is_service), oiJasa = ois.find((r) => r.is_service);

// --- RLS: pembeli hanya lihat pesanannya; penjual lihat item jualannya ---
const aOrders = await A.db.from("orders").select("id").eq("id", ord.id);
ok((aOrders.data ?? []).length === 1, "pembeli bisa baca pesanannya sendiri");
const sRows = await B.db.from("order_items")
  .select("id, order:orders(id, status, total_price, address, phone, payment_proof, created_at)")
  .eq("seller_id", B.uid).eq("order_id", ord.id);
ok((sRows.data ?? []).length === 2, "penjual membaca item jualannya + embed order");

// --- RPC kontak: SEBELUM ACC → null; SESUDAH ACC → HP penjual ---
const before = await A.db.rpc("seller_contact", { p_order_item_id: oiJasa.id });
ok(before.data === null || before.data === undefined, "kontak terkunci sebelum ACC penjual");
const acc = await B.db.from("order_items").update({ service_approved: true }).eq("id", oiJasa.id).select("id");
ok((acc.data ?? []).length === 1, "penjual ACC jasa (order_items UPDATE)");
const after = await A.db.rpc("seller_contact", { p_order_item_id: oiJasa.id });
ok(after.data === "081200000001", "kontak terbuka setelah ACC → HP penjual");

// --- Bukti transfer: upload ke bucket privat + catat path (cakupan attachProof) ---
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const proofPath = `${A.uid}/${ord.id}/${Date.now()}-bukti-e2e.png`;
const up = await A.db.storage.from("payment-proofs").upload(proofPath, png, { contentType: "image/png" });
ok(!up.error, `upload bukti ke payment-proofs${up.error ? " — " + up.error.message : ""}`);
const upUpd = await A.db.from("orders").update({ payment_proof: proofPath }).eq("id", ord.id).select("id");
ok((upUpd.data ?? []).length === 1, "orders.payment_proof tercatat");
const signed = await A.db.storage.from("payment-proofs").createSignedUrl(proofPath, 60);
ok(!!signed.data?.signedUrl, "signed URL bukti bisa dibuat");

// --- Penjual ubah status: pending → processing → completed; pembeli melihat ---
const s1 = await B.db.from("orders").update({ status: "processing" }).eq("id", ord.id).select("id");
ok((s1.data ?? []).length === 1, "penjual UPDATE status → processing");
const s2 = await B.db.from("orders").update({ status: "completed" }).eq("id", ord.id).select("id");
ok((s2.data ?? []).length === 1, "penjual UPDATE status → completed");
const aView = await A.db.from("orders").select("status, payment_proof").eq("id", ord.id).single();
ok(aView.data?.status === "completed" && !!aView.data?.payment_proof, "pembeli melihat status final + bukti");

// --- Negatif: pembeli TIDAK bisa ubah status / ACC jasa orang lain ---
const evil = await A.db.from("orders").update({ status: "pending" }).eq("id", ord.id).select("id");
ok((evil.data ?? []).length === 0, "pembeli DITOLAK ubah status (0 baris — RLS)");
const evil2 = await A.db.from("order_items").update({ service_approved: false }).eq("id", oiJasa.id).select("id");
ok((evil2.data ?? []).length === 0, "pembeli DITOLAK sentuh service_approved (0 baris — RLS)");

// --- cleanup: katalog & pesanan uji tidak boleh nyisa di DB publik (akun dibiarkan) ---
await A.db.from("order_items").delete().eq("order_id", ord.id);
await A.db.from("orders").delete().eq("id", ord.id);
await B.db.from("items").update({ is_approved: false }).eq("seller_id", B.uid).eq("location", "Jakarta E2E");
const leftover = await B.db.from("items").select("id, is_approved").eq("location", "Jakarta E2E");
ok(
  (leftover.data ?? []).every((r) => !r.is_approved),
  "cleanup: listing uji sudah turun dari katalog publik"
);

console.log(`\n${fail ? `${fail} GAGAL` : "SEMUA LULUS"} (${pass} pass)`);
process.exit(fail ? 1 : 0);