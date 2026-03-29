# Hospital Image Gallery Integration Guide

## Overview

This document explains the new hospital image gallery feature integrated into FastCare.id. The feature allows admin users to upload multiple hospital images that will be displayed as an interactive carousel on the hospital detail page.

## Features

### 1. Admin Panel - Image Upload

**Location:** Admin Panel → Rumah Sakit Tab → Hospital Form (Edit/Add)

The admin can:

- Upload a main hospital image (required)
- Add up to unlimited additional images via the Gallery section
- Reorder images by dragging or using arrow buttons
- Remove unwanted images
- See image count and preview

**Upload Options:**

- Drag and drop images
- Click to select from file browser
- Supported formats: JPG, PNG, WebP
- Max file size: 5MB per image

### 2. Frontend Display - Hospital Detail Page

#### Desktop View

- **Arrow Buttons**: Left/right arrows appear on hover to navigate between images
- **Dot Indicators**: Dots at the bottom show current position and allow direct navigation
- **Image Counter**: Shows current image number (e.g., "2 / 5")

#### Mobile View

- **Swipe Gesture**: Users can swipe left/right to navigate
- **Swipe Indicator**: Visual hint showing swipe gesture is available
- **Dot Indicators**: Same dots for navigation as desktop
- **Image Counter**: Same counter display

#### Features on Both Platforms

- IGD 24 Hour badge on first image
- Smooth image transitions
- Image information preserved

## Database Schema

### Hospital Table Update

Added new optional field to the `Hospital` interface:

```typescript
gallery?: string[];  // Array of image URLs
```

The `gallery` field:

- Is optional (backwards compatible)
- Stores array of image URLs
- If empty, falls back to displaying main `image` field
- Is automatically filtered to remove empty strings

## Component Structure

### 1. HospitalImageGallery.tsx

**Location:** `components/HospitalImageGallery.tsx`

Main carousel display component used on hospital detail pages.

**Props:**

```typescript
interface HospitalImageGalleryProps {
  readonly images: string[]; // Array of image URLs
  readonly hospitalName: string; // For alt text
  readonly hasIGD?: boolean; // Show IGD badge
}
```

**Features:**

- Auto-detects mobile vs desktop
- Responsive arrow buttons (desktop only)
- Touch-swipe support (mobile only)
- Dot indicators for all images
- IGD badge display
- Image counter

### 2. ImageGalleryManager.tsx

**Location:** `components/ImageGalleryManager.tsx`

Admin panel component for managing hospital gallery images.

**Props:**

```typescript
interface ImageGalleryManagerProps {
  readonly images: string[];
  readonly onImagesChange: (images: string[]) => void;
  readonly isLoading?: boolean;
  readonly onUpload: (file: File) => Promise<string>;
}
```

**Features:**

- Drag and drop upload
- File validation (type and size)
- Image preview grid
- Move up/down buttons
- Delete buttons
- Image count display
- Empty state messaging

### 3. Hospital Detail Page Update

**Location:** `app/hospital/[id]/page.tsx`

Updated to use `HospitalImageGallery` component for both:

- Desktop layout
- Mobile layout

Uses `hospital.gallery` array with fallback to main `hospital.image`.

## Usage Examples

### Admin Panel - Adding Images

1. Navigate to Admin Panel → Rumah Sakit
2. Click "Edit" on a hospital or "Tambah RS" to create new one
3. Upload main image (required)
4. Scroll to "Galeri Gambar Tambahan" section
5. Upload gallery images via:
   - Drag and drop
   - Click to browse files
6. Reorder images using arrow buttons (hover over image)
7. Remove images using trash icon
8. Save hospital data

### Frontend - Viewing Gallery

**Desktop:**

- Hover over image to see arrow buttons
- Click arrows or dots to navigate
- Images transition smoothly

**Mobile:**

- Swipe left/right to navigate
- Tap dots to jump to specific image
- See swipe indicator on first view

## Technical Integration

### Type Updates

Updated `types/index.ts` to include:

```typescript
export interface Hospital {
  // ... existing fields ...
  gallery?: string[]; // New field
}
```

### Component Imports

Added import in admin page:

```typescript
import ImageGalleryManager from "@/components/ImageGalleryManager";
```

Added import in hospital detail page:

```typescript
import HospitalImageGallery from "@/components/HospitalImageGallery";
```

### Form State

Extended admin form state to handle gallery:

```typescript
type FormState = {
  // ... existing fields ...
  gallery: string[]; // New field
};
```

### Data Submission

Gallery data is submitted with hospital data:

```typescript
const dataToSave: Partial<Hospital> = {
  // ... existing fields ...
  gallery: formData.gallery.filter((img) => img.trim()),
};
```

## Backwards Compatibility

- Gallery field is optional
- If gallery is empty or undefined, shows main image
- Existing hospitals without gallery still work
- No database migrations required (gallery is just array of URLs)

## Mobile Responsiveness

### Image Container

- Aspect ratio: 16:9 (video aspect)
- Full width on mobile
- Limited width on desktop
- Rounded corners (3xl)

### Controls

- **Desktop**: Arrow buttons on sides, dots below
- **Mobile**: Dots below, swipe gesture hint overlay

### Indicators

- Dot size: 2.5x2.5 (normal) or 8x2.5 (active)
- Transitions: 300ms
- Counter: bottom-left position

## Performance Considerations

1. **Image Optimization**
   - Use optimized image formats (WebP, JPEG)
   - Compress before uploading
   - Max 5MB per file

2. **Lazy Loading**
   - Currently displays selected image
   - Other images not preloaded
   - Good for large galleries

3. **Caching**
   - Images cached by browser
   - Supabase CDN handles distribution

## Browser Support

- Modern browsers with:
  - ES6 support
  - CSS flexbox
  - CSS grid
  - Touch events (mobile)
  - Drag events

## Future Enhancements

Potential improvements:

- Add image captions/descriptions
- Fullscreen gallery view
- Image lazy loading
- Keyboard navigation (arrow keys)
- Image analytics (which image is viewed most)
- Batch upload
- Image cropping/editing
- Filter by image type (exterior, interior, lab, etc.)

## Troubleshooting

### Images not showing

- Check file URLs are valid
- Verify images are stored in Supabase
- Check browser console for errors

### Upload fails

- Verify file size < 5MB
- Check file format is image
- Ensure Supabase storage is configured

### Mobile swipe not working

- Check viewport width < 768px
- Verify touch events enabled
- Test in mobile browser dev tools

### Admin form not saving

- Verify gallery array format
- Check main image is provided
- Verify Supabase permissions

## Code Examples

### Using HospitalImageGallery

```typescript
<HospitalImageGallery
  images={galleryImages}
  hospitalName={hospital.name}
  hasIGD={hospital.hasIGD}
/>
```

### Using ImageGalleryManager

```typescript
<ImageGalleryManager
  images={formData.gallery}
  onImagesChange={(newImages) =>
    setFormData({ ...formData, gallery: newImages })
  }
  isLoading={isUploading}
  onUpload={uploadHospitalImage}
/>
```

## Related Files

- `types/index.ts` - Hospital type definition
- `components/HospitalImageGallery.tsx` - Carousel component
- `components/ImageGalleryManager.tsx` - Admin upload component
- `app/hospital/[id]/page.tsx` - Hospital detail page
- `app/admin/page.tsx` - Admin panel

## Support

For issues or questions:

1. Check component console logs
2. Review browser developer tools
3. Verify Supabase storage configuration
4. Check component prop types
