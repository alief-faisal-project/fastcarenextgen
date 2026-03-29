# Quick Start Guide - Hospital Image Gallery

## For Administrators

### Adding Images to a Hospital

1. **Navigate to Admin Panel**
   - Go to `/admin`
   - Click on "Rumah Sakit" tab

2. **Add New Hospital or Edit Existing**
   - Click "Tambah RS" for new hospital
   - Click Edit icon for existing hospital

3. **Upload Main Image**
   - Scroll to "Gambar Rumah Sakit"
   - Click upload area or select file
   - Main image is required

4. **Add Gallery Images**
   - Scroll to "Galeri Gambar Tambahan"
   - Upload additional images via:
     - Click upload area
     - Drag & drop files
   - See image preview after upload

5. **Organize Images**
   - Hover over images to see buttons
   - Use ↑↓ arrows to reorder
   - Use 🗑️ to delete

6. **Save**
   - Click "Simpan" button
   - Gallery automatically saves with hospital

## For End Users

### Desktop View

**Viewing Images:**

- Main image displays automatically
- Hover over image to reveal arrow buttons
- Click ← → arrows to navigate
- Click dots below image to jump to specific image

**Features:**

- Image counter shows current position (e.g., "2 / 5")
- Smooth transitions between images
- Red badge shows "TERSEDIA IGD 24 JAM" if available

### Mobile View

**Viewing Images:**

- Swipe left → to next image
- Swipe right ← to previous image
- Tap dots below to jump to image
- Swipe hint visible on first load

**Features:**

- Image counter shows position
- Responsive layout
- Touch-friendly controls
- All features from desktop

## Technical Details

### What's New

**Files Added:**

- `components/HospitalImageGallery.tsx` - Main carousel
- `components/ImageGalleryManager.tsx` - Admin manager

**Files Modified:**

- `types/index.ts` - Added gallery field
- `app/admin/page.tsx` - Added gallery manager
- `app/hospital/[id]/page.tsx` - Uses gallery component

### Gallery Field

```typescript
// In Hospital type
gallery?: string[];  // Array of image URLs
```

### Usage in Forms

```typescript
<ImageGalleryManager
  images={formData.gallery}
  onImagesChange={(newImages) =>
    setFormData({ ...formData, gallery: newImages })
  }
  onUpload={uploadHospitalImage}
/>
```

### Display in Frontend

```typescript
<HospitalImageGallery
  images={galleryImages}
  hospitalName={hospital.name}
  hasIGD={hospital.hasIGD}
/>
```

## Features Summary

### ✅ Admin Panel

- Upload multiple images
- Drag & drop support
- Reorder images
- Delete images
- File validation
- Real-time preview

### ✅ Desktop Display

- Arrow buttons (left/right)
- Dot indicators
- Image counter
- Smooth transitions

### ✅ Mobile Display

- Swipe navigation
- Dot indicators
- Image counter
- Touch-friendly

### ✅ General

- Backwards compatible
- Optional gallery
- Fallback to main image
- Error handling

## Troubleshooting

### Upload Issues

**File rejected as invalid:**

- Ensure file is image (JPG, PNG, WebP)
- Check file size < 5MB

**Upload hangs:**

- Check internet connection
- Verify Supabase storage is accessible
- Try smaller file size

### Display Issues

**Images not showing:**

- Check image URLs are valid
- Verify images are in Supabase storage
- Check browser console for errors

**Swipe not working (mobile):**

- Update browser to latest version
- Test on actual mobile device
- Check touch events are enabled

**Arrows not showing (desktop):**

- Hover over image (should appear)
- Check browser zoom is 100%
- Try different browser

## Examples

### Admin - Adding Hospital with Gallery

```
1. Go to /admin
2. Click "Tambah RS"
3. Fill in hospital details
4. Upload main image (required)
5. Scroll to "Galeri Gambar Tambahan"
6. Upload 3-5 additional images
7. Reorder if needed
8. Click "Simpan"
```

### User - Viewing Gallery

**Desktop:**

```
1. Click hospital card
2. See main image
3. Hover to see arrows
4. Click arrow or dot to navigate
```

**Mobile:**

```
1. Tap hospital card
2. See main image
3. Swipe to navigate
4. Tap dot to jump to image
```

## Important Notes

- Gallery is optional (works with or without)
- Main image still required for compatibility
- Gallery saves automatically with hospital
- Images displayed in upload order (can reorder)
- Empty gallery shows only main image
- Unlimited images per hospital (performance may vary)

## Support

For issues or questions:

1. Check browser console for errors
2. Verify Supabase connection
3. Test on different browser
4. Try clearing browser cache
5. Review detailed guides in repository

## Next Steps

1. **Test Admin Panel:**
   - Add images to a test hospital
   - Try reordering and deleting
   - Verify images save correctly

2. **Test Frontend:**
   - View hospital on desktop
   - Test arrow navigation
   - View hospital on mobile
   - Test swipe navigation

3. **Test Backwards Compatibility:**
   - View old hospitals without gallery
   - Add images to old hospital
   - Verify main image still displays

4. **Review Documentation:**
   - Read GALLERY_IMPLEMENTATION_GUIDE.md for detailed info
   - Check GALLERY_IMPLEMENTATION_SUMMARY.md for overview
   - Review component code for technical details
