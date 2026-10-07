# Software Requirements Specification (SRS)
# Buyorent

**Versi**: 1.0  
**Tanggal**: 6 Oktober 2026  
**Status**: Draft  
**Referensi**: PRD v1.0, BRD v1.0

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen ini mendefinisikan spesifikasi teknis dan persyaratan perangkat lunak untuk platform Buyorent. Dokumen ini ditujukan untuk tim pengembang, QA, dan stakeholder teknis lainnya.

### 1.2 Ruang Lingkup
Sistem yang akan dibangun adalah website/platform untuk jual beli barang bekas dan sewa jasa, dengan target pengguna utama pelajar dan anak muda.

### 1.3 Referensi
- PRD.md - Product Requirement Document
- BRD.md - Business Requirement Document
- AI_CONTEXT.md - Konteks pengembangan AI

---

## 2. Deskripsi Sistem

### 2.1 Visi Sistem
Membangun platform terpusat yang menggantikan metode jual beli informal melalui media sosial dengan sistem terstruktur yang memiliki katalog, pencarian, dan tracking transaksi.

### 2.2 Teknologi Stack

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| **Frontend** | Next.js 14+ (React) | Framework utama dengan App Router |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Backend** | Supabase | Database, Authentication, Storage |
| **Database** | PostgreSQL | Relational database via Supabase |
| **Authentication** | Supabase Auth | Email/password, session management |
| **Storage** | Supabase Storage | Penyimpanan file (foto listing) |
| **Deployment** | Vercel | Hosting frontend |
| **Version Control** | Git | Repository management |

### 2.3 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                         │
│  Next.js App (Pages, Components, API Routes)               │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ HTTP/HTTPS
                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Ecosystem                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Auth    │  │ Database │  │ Storage  │                  │
│  │ (Users)  │  │ (Tables) │  │ (Files)  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│       │             │              │                        │
│       │             │              │                        │
│  ┌────────────────────────────────────────────┐             │
│  │         PostgreSQL Database Schema         │             │
│  └────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Persyaratan Fungsional

### 3.1 Manajemen Pengguna

#### 3.1.1 Registrasi Pengguna (FR-001)
**Deskripsi**: Pengguna dapat membuat akun baru.
**Prioritas**: High

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Email, password, konfirmasi password |
| **Validasi** | Email format valid, password min 8 karakter, password match |
| **Proses** | Create user record di Supabase Auth, tanpa verifikasi email |
| **Output** | Akun aktif, redirect ke dashboard |
| **Error Handling** | Email sudah terdaftar, password tidak memenuhi syarat |

#### 3.1.2 Login Pengguna (FR-002)
**Deskripsi**: Pengguna yang terdaftar dapat login ke sistem.
**Prioritas**: High

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Email, password |
| **Validasi** | Kredensial valid, akun aktif (tidak diblokir) |
| **Proses** | Autentikasi via Supabase Auth, create session |
| **Output** | Session token, redirect ke dashboard |
| **Error Handling** | Kredensial salah, akun diblokir |

### 3.2 Manajemen Listing

#### 3.2.1 Buat Listing Barang/Jasa (FR-003)
**Deskripsi**: Pengguna dapat membuat listing baru.
**Prioritas**: High

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Nama item, harga (numeric), deskripsi, kategori (barang/jasa), foto (1-5 gambar) |
| **Validasi** | Semua field required kecuali foto (min 1), harga > 0, kategori valid |
| **Proses** | Upload foto ke Supabase Storage, insert record ke tabel `items` |
| **Output** | Listing dibuat, redirect ke halaman detail |
| **Error Handling** | Field kosong, format foto tidak didukung, ukuran foto terlalu besar |

#### 3.2.2 Edit Listing (FR-004)
**Deskripsi**: Pemilik listing dapat mengedit listing miliknya.
**Prioritas**: Medium

#### 3.2.3 Hapus Listing (FR-005)
**Deskripsi**: Pemilik listing dapat menghapus listing miliknya.
**Prioritas**: Medium

### 3.3 Pencarian dan Filter

#### 3.3.1 Search Bar (FR-006)
**Deskripsi**: Pengguna dapat mencari listing berdasarkan kata kunci.
**Prioritas**: High

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Kata kunci pencarian |
| **Validasi** | Min 1 karakter, max 100 karakter |
| **Proses** | Query ke tabel `items` dengan ILIKE pada kolom nama dan deskripsi |
| **Output** | Daftar listing yang match, dengan pagination (20 per halaman) |
| **Error Handling** | Tidak ada hasil, tampilkan pesan "Tidak ditemukan" |

#### 3.3.2 Filter Listing (FR-007)
**Deskripsi**: Pengguna dapat memfilter hasil pencarian.
**Prioritas**: High

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Kategori (barang/jasa/semua), rentang harga (min, max) |
| **Validasi** | Harga min <= max, kategori valid |
| **Proses** | Apply filter pada query SQL dengan WHERE conditions |
| **Output** | Daftar listing terfilter |
| **Error Handling** | Filter tidak valid, kembali ke default |

### 3.4 Keranjang Belanja

#### 3.4.1 Tambah ke Keranjang (FR-008)
**Deskripsi**: Pembeli dapat menambahkan item ke keranjang.
**Prioritas**: High

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Item ID, quantity (default 1) |
| **Validasi** | Item exists, stock available (jika barang), user authenticated |
| **Proses** | Insert/update record di tabel `cart` |
| **Output** | Item added to cart, update cart counter |
| **Error Handling** | Item tidak ditemukan, user belum login |

#### 3.4.2 Lihat Keranjang (FR-009)
**Deskripsi**: Pembeli dapat melihat isi keranjang.
**Prioritas**: High

#### 3.4.3 Hapus dari Keranjang (FR-010)
**Deskripsi**: Pembeli dapat menghapus item dari keranjang.
**Prioritas**: Medium

#### 3.4.4 Checkout (FR-011)
**Deskripsi**: Pembeli dapat checkout semua item di keranjang.
**Prioritas**: High

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Alamat pengiriman, nomor telepon/WhatsApp, catatan (opsional) |
| **Validasi** | Keranjang tidak kosong, alamat dan telepon required |
| **Proses** | Create order di `orders`, create order_items, clear cart, set status "Menunggu Pembayaran" |
| **Output** | Order ID, redirect ke halaman konfirmasi |
| **Error Handling** | Keranjang kosong, data tidak lengkap |

### 3.5 Transaksi dan Pembayaran

#### 3.5.1 Upload Bukti Transfer (FR-012)
**Deskripsi**: Pembeli dapat mengunggah bukti transfer.
**Prioritas**: Medium

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Order ID, file bukti transfer (image) |
| **Validasi** | Order exists, status "Menunggu Pembayaran", file image valid |
| **Proses** | Upload file ke Supabase Storage, update `orders.payment_proof_url` |
| **Output** | Bukti terupload, status tetap "Menunggu Pembayaran" |
| **Error Handling** | Order tidak ditemukan, file invalid |

#### 3.5.2 Konfirmasi Pembayaran (FR-013)
**Deskripsi**: Penjual dapat mengonfirmasi pembayaran untuk order.
**Prioritas**: Medium

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Order ID |
| **Validasi** | Order exists, user adalah penjual dari order tersebut, status "Menunggu Pembayaran" |
| **Proses** | Update `orders.status` menjadi "Diproses" |
| **Output** | Status updated, notifikasi ke pembeli (jika ada sistem notifikasi) |
| **Error Handling** | Order tidak ditemukan, user bukan penjual, status tidak valid |

#### 3.5.3 Selesaikan Order (FR-014)
**Deskripsi**: Penjual dapat menandai order sebagai selesai.
**Prioritas**: Medium

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Order ID |
| **Validasi** | Order exists, user adalah penjual, status "Diproses" |
| **Proses** | Update `orders.status` menjadi "Selesai" |
| **Output** | Status updated |
| **Error Handling** | Order tidak ditemukan, status tidak valid |

### 3.6 Sewa Jasa (Khusus)

#### 3.6.1 Approval Pesanan Jasa (FR-015)
**Deskripsi**: Penjual jasa harus menyetujui pesanan sebelum kontak dibuka.
**Prioritas**: High

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Order ID, action (approve/reject) |
| **Validasi** | Order exists, item adalah jasa, user adalah penjual |
| **Proses** | Jika approve: update `orders.jasa_approved` = true, buka kontak penjual. Jika reject: update status menjadi "Ditolak" |
| **Output** | Status updated, kontak terbuka (jika approve) |
| **Error Handling** | Order bukan jasa, sudah di-approve |

### 3.7 Panel Admin

#### 3.7.1 Moderasi Listing (FR-016)
**Deskripsi**: Admin dapat menyetujui atau menurunkan listing.
**Prioritas**: High

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | Item ID, action (approve/takedown) |
| **Validasi** | User adalah admin, item exists |
| **Proses** | Update `items.approved` (true/false), `items.moderation_reason` (jika takedown) |
| **Output** | Listing visibility updated |
| **Error Handling** | User bukan admin |

#### 3.7.2 Kelola Pengguna (FR-017)
**Deskripsi**: Admin dapat melihat, memblokir, dan menghapus akun.
**Prioritas**: Medium

| Parameter | Persyaratan |
|-----------|-------------|
| **Input** | User ID, action (view/block/delete) |
| **Validasi** | User adalah admin, target user exists |
| **Proses** | Block: update `users.blocked` = true. Delete: soft delete dari Supabase Auth dan set flag di database |
| **Output** | User status updated |
| **Error Handling** | User bukan admin, target tidak ditemukan |

---

## 4. Persyaratan Non-Fungsional

### 4.1 Keamanan

| ID | Persyaratan | Metrik | Implementasi |
|----|-------------|--------|--------------|
| SEC-001 | Authentication | Supabase Auth dengan password hashing | Gunakan Supabase Auth untuk semua operasi user |
| SEC-002 | Authorization | RBAC (Pembeli, Penjual, Admin) | Implement role-based checks di API routes |
| SEC-003 | Data Protection | HTTPS only, secure cookies | Konfigurasi Supabase dan Vercel dengan HTTPS |
| SEC-004 | File Upload Security | File type validation, size limits | Validasi di frontend dan backend (Supabase Storage rules) |
| SEC-005 | SQL Injection Prevention | Parameterized queries | Gunakan Supabase client dengan parameter binding |

### 4.2 Performa

| ID | Persyaratan | Metrik | Implementasi |
|----|-------------|--------|--------------|
| PERF-001 | Page Load Time | < 3 detik untuk halaman utama | Optimize images, code splitting, CDN |
| PERF-002 | Search Response | < 2 detik untuk query dengan 1000 records | Database indexing, query optimization |
| PERF-003 | Concurrent Users | Support 100+ concurrent users | Stateless architecture, connection pooling |
| PERF-004 | API Response Time | < 1 detik untuk 95% requests | Cache frequent queries, optimize joins |

### 4.3 Usability

| ID | Persyaratan | Metrik | Implementasi |
|----|-------------|--------|--------------|
| USE-001 | Responsive Design | Mobile-friendly, desktop-optimized | Tailwind responsive utilities, mobile-first approach |
| USE-002 | Accessibility | WCAG 2.1 AA compliant | Semantic HTML, ARIA labels, keyboard navigation |
| USE-003 | Error Messages | Clear, actionable error messages | User-friendly error handling di frontend |
| USE-004 | Loading States | Skeleton screens, progress indicators | Implement loading states untuk async operations |

### 4.4 Reliability

| ID | Persyaratan | Metrik | Implementasi |
|----|-------------|--------|--------------|
| REL-001 | Uptime | > 95% monthly uptime | Monitoring dengan Vercel Analytics, error tracking |
| REL-002 | Data Backup | Daily automated backups | Gunakan Supabase backup features |
| REL-003 | Error Recovery | Graceful degradation | Error boundaries di React, fallback UI |
| REL-004 | Data Consistency | ACID compliance | PostgreSQL transactional queries |

---

## 5. Model Data

### 5.1 Database Schema

```sql
-- Users table (extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'admin'
  blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'barang', 'jasa'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[], -- Array of image URLs
  approved BOOLEAN DEFAULT TRUE, -- Admin approval
  moderation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart table
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  item_id INTEGER NOT NULL REFERENCES items(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id), -- Buyer
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'menunggu_pembayaran', -- 'menunggu_pembayaran', 'diproses', 'selesai', 'ditolak'
  shipping_address TEXT,
  phone TEXT,
  notes TEXT,
  payment_proof_url TEXT,
  jasa_approved BOOLEAN DEFAULT FALSE, -- For jasa items only
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  item_id INTEGER NOT NULL REFERENCES items(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL, -- Price snapshot
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Relasi Data

```
users (1) ──── (many) items
users (1) ──── (many) orders
users (1) ──── (many) cart
categories (1) ──── (many) items
orders (1) ──── (many) order_items
items (1) ──── (many) order_items
```

### 5.3 Indexes

```sql
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_approved ON items(approved) WHERE approved = TRUE;
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

---

## 6. Antarmuka Pengguna

### 6.1 Wireframe (High-Level)

1. **Halaman Utama**
   - Navigation bar (Logo, Search, Login/Profile, Cart)
   - Hero section dengan CTA
   - Featured listings grid
   - Categories section

2. **Halaman Pencarian**
   - Search bar dengan auto-suggest
   - Filter sidebar (kategori, harga)
   - Results grid dengan pagination

3. **Halaman Detail Item**
   - Item images carousel
   - Item details (nama, harga, deskripsi, penjual)
   - Add to cart button
   - Related items

4. **Dashboard Pengguna**
   - Profile section
   - My listings
   - My orders (as buyer and seller)
   - Settings

5. **Panel Admin**
   - Dashboard dengan stats
   - Moderation queue
   - User management
   - System settings

### 6.2 Design System

- **Colors**: Primary (#3B82F6), Success (#10B981), Warning (#F59E0B), Danger (#EF4444)
- **Typography**: Inter font family
- **Spacing**: 4px base unit, Tailwind spacing scale
- **Components**: Button, Card, Input, Modal, Alert, etc.

---

## 7. Integrasi dan API

### 7.1 Supabase Integration

**Authentication API**
```javascript
// Client-side auth
import { supabase } from '@/lib/supabase'

// Sign up
await supabase.auth.signUp({ email, password })

// Sign in
await supabase.auth.signInWithPassword({ email, password })

// Get session
const { data: { session } } = await supabase.auth.getSession()
```

**Database API**
```javascript
// Query items with filters
const { data: items, error } = await supabase
  .from('items')
  .select(`
    *,
    categories(*),
    users(full_name, avatar_url)
  `)
  .eq('approved', true)
  .ilike('name', `%${searchTerm}%`)
  .gte('price', minPrice)
  .lte('price', maxPrice)
```

**Storage API**
```javascript
// Upload image
const { data, error } = await supabase.storage
  .from('item-images')
  .upload(`public/${fileName}`, file)
```

### 7.2 API Routes (Next.js)

**Pattern**: `/api/[resource]/route.ts`
- `POST /api/items` - Create new item
- `GET /api/items` - Get items with filters
- `PUT /api/items/[id]` - Update item
- `POST /api/orders` - Create order (checkout)
- `PUT /api/orders/[id]/confirm-payment` - Confirm payment
- `GET /api/admin/users` - Get users (admin only)

---

## 8. Deployment dan DevOps

### 8.1 Environment Variables

```
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 8.2 Deployment Process

1. **Development**: Local with hot reload
2. **Staging**: Vercel preview deployment for each PR
3. **Production**: Vercel production deployment from main branch

### 8.3 Monitoring dan Maintenance

- **Error Tracking**: Sentry or Vercel Analytics
- **Performance Monitoring**: Vercel Speed Insights
- **Database Monitoring**: Supabase Dashboard
- **Logs**: Vercel Logs + Supabase Logs

---

## 9. Testing Requirements

### 9.1 Unit Testing
- Component testing dengan React Testing Library
- Utility function testing dengan Jest
- Test coverage target: 80%

### 9.2 Integration Testing
- API route testing
- Database operation testing
- Auth flow testing

### 9.3 End-to-End Testing
- Critical user flows dengan Playwright
- Flow: Register → Login → Create listing → Search → Add to cart → Checkout

### 9.4 Acceptance Criteria
Semua persyaratan fungsional (FR-001 hingga FR-017) harus memiliki test case yang sesuai.

---

## 10. Constraints dan Asumsi

### 10.1 Technical Constraints
- Tidak ada server-side rendering untuk halaman yang memerlukan auth (gunakan client-side fetching)
- File upload limited to 5MB per image
- No real-time features (websockets) pada fase MVP
- No offline capability

### 10.2 Business Constraints
- Tidak ada payment gateway integration pada MVP
- Tidak ada sistem rating/review pada MVP
- Tidak ada notifikasi real-time pada MVP
- Admin moderation dilakukan manual

### 10.3 Assumptions
- Pengguna memiliki akses internet yang stabil
- Pengguna memiliki browser modern (Chrome 90+, Firefox 88+, Safari 14+)
- Pengguna memahami proses transfer manual
- Admin tersedia untuk moderation tasks

---

## 11. Glossary

| Istilah | Definisi |
|---------|----------|
| **Listing** | Item yang dipasang di platform (barang atau jasa) |
| **Kategori** | Klasifikasi item: "barang" atau "jasa" |
| **Keranjang** | Temporary storage untuk item sebelum checkout |
| **Order** | Transaksi yang sudah di-checkout |
| **Status Order** | State machine: Menunggu Pembayaran → Diproses → Selesai |
| **Bukti Transfer** | Screenshot/image bukti pembayaran transfer manual |
| **Jasa Approval** | Persetujuan penjual jasa sebelum kontak dibuka |
| **Moderasi** | Proses admin menyetujui/menurunkan listing |

---

## 12. Approval

**Disetujui oleh:**

| Nama | Peran | Tanggal |
|------|-------|---------|
| Muhamad Jundi Al Hafidz | Project Lead & Full Stack Developer | 29 September 2026 |
| Zariel Waleed Hidayat | UI/UX Designer & Frontend Developer | 29 September 2026 |
| Fauzunnajah Attamam | Backend Developer | 29 September 2026 |
| Sultan Doven Hagi | Database Developer | 29 September 2026 |
| Muhammad Salim Umar | Developer OPS | 29 September 2026 |
| Wildan Haibatur Rohim | Assistant UI/UX Designer | 29 September 2026 |

**Dokumen ini harus direview dan diperbarui sesuai perubahan requirement selama pengembangan.**

---

*Dokumen ini merupakan spesifikasi teknis lengkap untuk pengembangan platform Buyorent dan harus diikuti oleh seluruh tim pengembangan.*
