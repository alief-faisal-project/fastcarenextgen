# Hospital Gallery Upload - Update v2

## Changes Made

### Problem yang Dipecahkan

1. ❌ Standalone file input button "Pilih file" - sekarang dihapus
2. ❌ Validasi wajibkan main image - sekarang gallery saja (minimal 1 gambar)
3. ❌ Data lama tidak tersimpan saat edit - sekarang preserve existing data

### Solusi Implementasi

#### 1. Single Upload Interface

**Sebelum:**

- Ada 2 input terpisah untuk upload gambar
- "Gambar Rumah Sakit" (main) + "Galeri Gambar Tambahan" (gallery)

**Sesudah:**

- Hanya 1 section: "Galeri Gambar Rumah Sakit"
- Gambar pertama (gallery[0]) otomatis jadi main image
- ImageGalleryManager handle semua upload/reorder/delete

#### 2. Flexible Validation

**Sebelum:**

```
- image (main) wajib
- gallery (tambahan) opsional
- Error: "Gambar tidak boleh kosong!"
```

**Sesudah:**

```
- Validasi: minimal ada 1 gambar (dari gallery atau existing image)
- Image utama = gallery[0] atau formData.image (old image)
- Error: "Minimal harus ada 1 gambar!"
```

#### 3. Data Preservation

**Sebelum:**

```typescript
image: formData.image.trim(),  // bisa jadi kosong saat edit
gallery: formData.gallery      // replace completely
```

**Sesudah:**

```typescript
const filteredGallery = formData.gallery.filter(img => img.trim());
const mainImage = filteredGallery.length > 0
  ? filteredGallery[0]
  : formData.image;  // preserve old image if gallery empty

image: mainImage,
gallery: filteredGallery
```

### Code Changes

#### File: `app/admin/page.tsx`

**Dihapus:**

- Function `handleImageChange()` - tidak perlu lagi
- State `imagePreview` - tidak perlu lagi
- Ref `fileInputRef` - tidak perlu lagi
- Section "Gambar Rumah Sakit" dengan input file

**Diubah:**

- Validasi di `handleSubmit()`:

  ```typescript
  // OLD: if (!formData.image.trim()) { ... }

  // NEW:
  const filteredGallery = formData.gallery.filter((img) => img.trim());
  const mainImage =
    filteredGallery.length > 0 ? filteredGallery[0] : formData.image;

  if (!mainImage.trim()) {
    alert("Minimal harus ada 1 gambar!");
  }
  ```

- Data saving:

  ```typescript
  image: mainImage,
  gallery: filteredGallery
  ```

- ImageGalleryManager props (hapus `isLoading`):
  ```typescript
  <ImageGalleryManager
    images={formData.gallery}
    onImagesChange={(newImages) =>
      setFormData({ ...formData, gallery: newImages })
    }
    onUpload={uploadHospitalImage}
  />
  ```

### User Flow (Admin Panel)

#### Tambah Rumah Sakit Baru

1. Isi semua field (name, address, phone, dll)
2. Scroll ke "Galeri Gambar Rumah Sakit"
3. Upload 1 gambar atau lebih
4. Atur urutan jika perlu (drag dengan arrow buttons)
5. Klik "Tambah Rumah Sakit"
6. ✅ Gambar pertama = main image
7. ✅ Sisa gambar = gallery

#### Edit Rumah Sakit Existing

1. Klik Edit pada hospital
2. Semua field sudah terisi termasuk gambar existing
3. Opsi edit:
   - **Tambah gambar baru**: Upload di ImageGalleryManager
   - **Reorder**: Gunakan arrow buttons (↑↓)
   - **Delete**: Gunakan trash button (🗑️)
   - **Keep existing**: Biarkan saja, tidak akan dihapus
4. Klik "Simpan Perubahan"
5. ✅ Old images preserved if not deleted
6. ✅ New images added to gallery

### Frontend Impact

**Hospital Detail Page - Tidak berubah**

- Masih gunakan HospitalImageGallery
- Masih ambil dari `hospital.gallery`
- Masih fallback ke `hospital.image`
- Mobile swipe: ✅ Tetap berfungsi
- Desktop arrows: ✅ Tetap berfungsi

### Database/Data Structure

```typescript
Hospital {
  image: string      // Main image (gallery[0] atau lama)
  gallery: string[]  // Array of all images
}
```

**Migrasi:**

- ✅ Backward compatible
- ✅ Old hospitals tetap work
- ✅ Tidak perlu migration

### Testing Checklist

**Admin Panel - Add New:**

- [ ] Upload 1 gambar → save → check main image OK
- [ ] Upload 3+ gambar → save → check all in gallery
- [ ] Upload 0 gambar → error message OK
- [ ] Reorder gambar sebelum save → urutan OK

**Admin Panel - Edit Existing:**

- [ ] Edit tanpa upload → data lama preserve ✅
- [ ] Edit + upload baru → data lama + baru save ✅
- [ ] Edit + delete semua → error message OK
- [ ] Edit + delete 1, keep others → others preserve ✅

**Frontend:**

- [ ] View hospital dengan 1 gambar → OK
- [ ] View hospital dengan 5+ gambar → all visible
- [ ] Swipe mobile → navigate OK
- [ ] Click arrows desktop → navigate OK

### Benefits

✅ **Simplicity**: Single upload interface  
✅ **Safety**: Old data preserved  
✅ **Flexibility**: Optional gallery (1+ images)  
✅ **UX**: Clear validation messages  
✅ **Logic**: Auto-select first image as main

### Breaking Changes

None!

- Backward compatible
- Existing hospitals still work
- Old form structure still supported

### Next Steps (Optional)

1. Add drag-to-reorder for images (current: arrow buttons)
2. Add image preview during upload
3. Add batch upload
4. Add image descriptions per image
5. Add fullscreen gallery view

---

**Status**: ✅ Complete & Ready for Testing
