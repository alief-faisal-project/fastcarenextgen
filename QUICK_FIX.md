# 🚨 URGENT: Jalankan Database Migration

## Masalah

```
Gagal mengupdate: Could not find the 'gallery' column of 'hospitals' in the schema cache
```

## Solusi: 3 Langkah Cepat

### Langkah 1: Buka Supabase Dashboard

- URL: https://app.supabase.com
- Login dengan akun admin

### Langkah 2: Buka SQL Editor

- Klik "SQL Editor" di sidebar kiri
- Klik tombol "+ New Query"

### Langkah 3: Copy & Jalankan SQL Ini

```sql
ALTER TABLE hospitals ADD COLUMN gallery TEXT[] DEFAULT '{}';
CREATE INDEX idx_hospitals_gallery ON hospitals USING GIN(gallery);
COMMENT ON COLUMN hospitals.gallery IS 'Array of image URLs for hospital gallery display.';
```

Klik tombol "Run" atau tekan Ctrl+Enter

---

## ✅ Verifikasi

1. Buka "Table Editor"
2. Pilih tabel `hospitals`
3. Scroll ke kanan
4. Cari kolom `gallery`
5. Jika ada, berarti sukses ✅

---

## 🎉 Sekarang Bisa Test

- Coba tambah hospital dengan gallery
- Coba edit hospital dengan gallery
- Gambar harusnya tersimpan ✅

---

**Jika masih error setelah migration, hubungi developer.**
