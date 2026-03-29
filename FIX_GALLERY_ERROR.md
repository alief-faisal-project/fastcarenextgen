# ⚠️ Database Column Missing - Instant Fix

## Masalah yang Terjadi

```
Gagal mengupdate: Could not find the 'gallery' column of 'hospitals' in the schema cache
```

Artinya: Kolom `gallery` belum ada di table `hospitals` di Supabase database.

---

## ✅ Cara Memperbaiki (3 Langkah Mudah)

### 1️⃣ Buka Supabase Dashboard

- Masuk ke app.supabase.com
- Pilih project FastCare.id

### 2️⃣ Buka SQL Editor

- Di sidebar, klik "SQL Editor"
- Klik "+ New Query"

### 3️⃣ Copy Paste & Jalankan Script Ini

```sql
ALTER TABLE hospitals ADD COLUMN gallery TEXT[] DEFAULT '{}';
CREATE INDEX idx_hospitals_gallery ON hospitals USING GIN(gallery);
COMMENT ON COLUMN hospitals.gallery IS 'Array of image URLs for hospital gallery display.';
```

**TEKAN ENTER / KLIK RUN**

---

## 🎯 Verifikasi Berhasil

1. Buka "Table Editor"
2. Pilih tabel `hospitals`
3. Scroll ke kanan
4. Cari kolom `gallery` → jika ada = **SUKSES ✅**

---

## 🚀 Sekarang Bisa Lanjut Test

- [x] Kolom `gallery` sudah ada di database ✅
- [ ] Coba tambah hospital dengan gallery
- [ ] Coba edit hospital dengan gallery
- [ ] Coba display di home page
- [ ] Coba swipe di mobile/desktop

---

## 📝 Apa yang Dilakukan Script SQL

| Baris                                             | Fungsi                          |
| ------------------------------------------------- | ------------------------------- |
| `ALTER TABLE hospitals ADD COLUMN gallery TEXT[]` | Tambah kolom gallery tipe array |
| `DEFAULT '{}'`                                    | Nilai default empty array       |
| `CREATE INDEX idx_hospitals_gallery`              | Buat index untuk performa query |
| `COMMENT ON COLUMN`                               | Dokumentasi kolom di database   |

---

## ❌ Jika Masih Error

Kemungkinan:

- User Supabase tidak punya akses → gunakan admin account
- Kolom sudah ada → skip script, lanjut test
- Database read-only → contact Supabase support

---

## 📚 File Referensi

- `QUICK_FIX.md` ← instruksi singkat
- `DATABASE_MIGRATION_GUIDE.md` ← penjelasan lengkap
- `supabase/migrations/add_gallery_column.sql` ← script SQL

---

**PENTING:** Jangan lanjut development sampai kolom `gallery` sukses ditambahkan! ⚠️

Setelah itu semua fitur gallery akan jalan dengan baik.
