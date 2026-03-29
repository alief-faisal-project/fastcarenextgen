# Menambahkan Gallery Column ke Database

## ⚠️ Error yang Terjadi

```
Gagal mengupdate: Could not find the 'gallery' column of 'hospitals' in the schema cache
```

**Penyebab:** Kolom `gallery` belum ada di table `hospitals` di Supabase database.

---

## ✅ Solusi: Menjalankan Migration

### Opsi 1: Menggunakan Supabase Dashboard (Rekomendasi)

1. **Buka Supabase Dashboard:**
   - Masuk ke https://app.supabase.com
   - Pilih project FastCare.id

2. **Buka SQL Editor:**
   - Klik "SQL Editor" di sidebar
   - Klik "+ New Query"

3. **Copy & Paste Script:**

   ```sql
   -- Add gallery column to hospitals table
   ALTER TABLE hospitals
   ADD COLUMN gallery TEXT[] DEFAULT '{}';

   -- Create index for better query performance
   CREATE INDEX idx_hospitals_gallery ON hospitals USING GIN(gallery);

   -- Add comment to document the column
   COMMENT ON COLUMN hospitals.gallery IS 'Array of image URLs for hospital gallery display.';
   ```

4. **Jalankan Query:**
   - Klik tombol "Run" atau tekan `Ctrl+Enter`
   - Tunggu hingga selesai

5. **Verifikasi:**
   - Buka "Table Editor"
   - Pilih tabel `hospitals`
   - Cek apakah kolom `gallery` sudah ada

---

### Opsi 2: Menggunakan Supabase CLI (Jika sudah setup)

```bash
# 1. Login ke Supabase
supabase login

# 2. Link ke project
supabase link --project-ref <PROJECT_ID>

# 3. Jalankan migration
supabase db push

# 4. Verifikasi
supabase db pull
```

---

### Opsi 3: Manual SQL di psql (Direct Database Connection)

Jika Anda punya akses langsung ke PostgreSQL:

```bash
psql postgresql://[user]:[password]@[host]:5432/[database]
```

Kemudian jalankan SQL dari migration file.

---

## 📋 Apa yang Dilakukan Migration

### 1. **Menambah Kolom `gallery`**

- Tipe: `TEXT[]` (Array of text)
- Default: `'{}'` (Empty array)
- Untuk menyimpan array URLs gambar gallery

### 2. **Membuat Index**

- Menggunakan GIN (Generalized Inverted Index)
- Untuk optimasi query dengan array
- Membuat pencarian lebih cepat

### 3. **Menambah Comment**

- Dokumentasi di database
- Membantu developer lain memahami column

---

## ✅ Setelah Migration Berhasil

### Test di Supabase Dashboard:

1. Buka Table Editor → hospitals
2. Lihat kolom `gallery` sudah ada
3. Value default: `{}` (empty array)

### Test di Admin Panel:

1. Coba tambah hospital baru dengan gallery
2. Upload beberapa gambar
3. Klik Save
4. Harusnya berhasil ✅

### Verifikasi Data di Database:

```sql
-- Lihat hospital dengan gallery
SELECT id, name, gallery FROM hospitals LIMIT 5;

-- Lihat detail satu hospital
SELECT id, name, gallery FROM hospitals WHERE id = '<hospital_id>';
```

---

## 🔍 Troubleshooting

### Error: "Column already exists"

- Kolom `gallery` sudah ada
- Skip migration, lanjut ke testing

### Error: "Permission denied"

- User Supabase tidak punya akses
- Gunakan admin account
- Atau contact Supabase support

### Error: "Index cannot be created"

- Shared database limitation
- Skip index creation, hanya jalankan ALTER TABLE

---

## 📝 Dokumentasi Column

| Property      | Value                                  |
| ------------- | -------------------------------------- |
| Column Name   | `gallery`                              |
| Data Type     | `TEXT[]`                               |
| Default Value | `'{}'`                                 |
| Nullable      | No (NOT NULL bisa ditambah jika perlu) |
| Index         | GIN index untuk optimasi               |
| Description   | Array of image URLs for gallery        |

---

## ✨ Setelah Migration

Kolom `gallery` siap untuk menyimpan:

- Array URLs gambar dari Supabase Storage
- Contoh: `{https://..../image1.jpg, https://..../image2.jpg, https://..../image3.jpg}`
- Frontend dapat membaca dan menampilkan gallery
- Mobile bisa swipe, desktop bisa click arrows

---

## 🚀 Next Steps

1. ✅ Jalankan migration di Supabase
2. ✅ Verifikasi kolom `gallery` ada
3. ✅ Test tambah hospital dengan gallery
4. ✅ Test edit hospital dengan gallery
5. ✅ Test display gallery di home page

**Setelah itu semua fitur gallery akan berfungsi dengan baik!**

---

**Catatan:** File migration sudah dibuat di `supabase/migrations/add_gallery_column.sql` untuk referensi.
