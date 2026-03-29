# Mobile Bottom Navigation Bar Implementation

## Overview

Telah ditambahkan Mobile Bottom Navigation Bar yang menyediakan akses cepat ke fitur-fitur utama aplikasi pada tampilan mobile.

## Komponen yang Ditambahkan

### 1. MobileBottomNav Component (`components/MobileBottomNav.tsx`)

Komponen bottom navigation bar yang menampilkan 4 menu utama dengan FontAwesome icons:

#### Menu Items:

1. **Beranda** (Home)
   - Icon: `fa-solid fa-home`
   - Route: `/` (Link ke halaman home)
   - Fungsi: Membawa pengguna ke halaman utama

2. **Cari** (Search)
   - Icon: `fa-solid fa-magnifying-glass`
   - Fungsi: Membuka search input field dengan keyboard otomatis
   - Route: Search parameter ditambahkan ke URL (`/?search=...`)
   - Cara kerja: Tekan Enter setelah mengetik untuk mencari

3. **Lokasi** (Location)
   - Icon: `fa-solid fa-location-crosshairs`
   - Fungsi:
     - **Single tap**: Mendeteksi lokasi terdekat dan menampilkan rumah sakit terdekat
     - **Double tap (dalam 800ms)**: Me-refresh halaman dengan urutan rumah sakit yang acak
   - Menampilkan loading state saat mendeteksi lokasi
   - Scroll ke atas otomatis setelah selesai

4. **Chat** (WhatsApp)
   - Icon: `fa-brands fa-whatsapp`
   - Fungsi: Membuka WhatsApp chat
   - URL: `https://wa.me/?text=Halo%20FastCare`

## Features

### ✅ Search dengan Keyboard

- Saat menu Search diklik, input field muncul di atas bottom nav
- Keyboard otomatis terbuka untuk input
- Tekan Enter untuk melakukan pencarian
- Klik X atau click di luar untuk menutup search

### ✅ Double Tap Refresh

- Single tap pada menu Lokasi: Deteksi lokasi terdekat
- Double tap (2x dalam 800ms): Refresh halaman dengan urutan acak

### ✅ Location Detection

- Menggunakan browser's Geolocation API
- Menampilkan loading state dengan spinning icon
- Automatic scroll ke atas setelah deteksi selesai
- Error handling jika izin lokasi ditolak

### ✅ Random Hospital Order pada Refresh

- Saat `router.refresh()` dipanggil, server akan me-shuffle urutan rumah sakit
- Urutan tidak akan sesuai dengan input awal

### ✅ Clean Design

- Fixed position di bawah layar mobile
- Border top untuk pemisahan
- Icons dari FontAwesome
- Responsive hover effects
- Hanya muncul di layar mobile (hidden di desktop dengan `lg:hidden`)

## File yang Dimodifikasi

### 1. `app/page.tsx`

- Tambah import: `import MobileBottomNav from "@/components/MobileBottomNav"`
- Tambah komponen di JSX untuk menampilkan bottom nav

### 2. `app/hospital/[id]/page.tsx`

- Tambah import: `import MobileBottomNav from "@/components/MobileBottomNav"`
- Tambah komponen di JSX untuk menampilkan bottom nav

## Styling & Responsiveness

### Desktop (lg: breakpoint)

- Bottom nav tersembunyi dengan `lg:hidden` dan `hidden lg:...`
- Tidak ada spacer untuk desktop

### Mobile

- Fixed positioning di bottom
- Height: `h-20` (80px)
- Full width dengan border top
- Z-index: 50 (di atas konten)
- Search input memiliki z-index: 40 (di bawah nav)
- Spacer div `h-20` untuk mencegah content overlap

### Colors & Styling

- Background: `bg-background` (sesuai theme)
- Border: `border-t border-border`
- Text: `text-muted-foreground` default, `text-primary` on hover
- Transition: `transition-colors duration-200`

## Location Detection Flow

```
User clicks "Lokasi"
  ↓
First tap (0-800ms)
  → Triggers location detection
  → Shows loading state
  → Calls detectLocation() from AppContext
  → Fetches user coordinates
  → Sets hospitals distance
  → Filters & sorts by distance
  → Scroll to top

Second tap (within 800ms)
  → Triggers router.refresh()
  → Shuffles hospital order
  → Shows new random order
  → Scroll to top
```

## Search Flow

```
User clicks "Cari"
  ↓
Search input appears above nav
  ↓
User types query
  ↓
User presses Enter
  ↓
Navigate to /?search=<query>
  ↓
HospitalGrid filters & displays results
  ↓
Search input closes automatically
```

## Error Handling

- Location detection errors: Alert message ditampilkan
- Search: Empty queries diabaikan
- Fallback untuk browser tanpa Geolocation support

## Integration Points

### AppContext

- Menggunakan `detectLocation()` function untuk geolocation
- Setting hospitals dengan distance calculations

### Next.js Router

- `router.push()` untuk navigation
- `router.refresh()` untuk refresh dengan shuffle

### FontAwesome

- Menggunakan `fa-brands` untuk WhatsApp
- Menggunakan `fa-solid` untuk icon lainnya

## Usage

Bottom nav otomatis tersedia di semua halaman yang mengimport komponen:

- Home page (`/`)
- Hospital detail page (`/hospital/[id]`)

Dapat dengan mudah ditambahkan ke halaman lain dengan:

```tsx
import MobileBottomNav from "@/components/MobileBottomNav";

// Di component JSX:
<MobileBottomNav />;
```

## Future Enhancements

- Customize WhatsApp number di component props
- Add analytics tracking untuk menu clicks
- Add notification badge untuk chat
- Persist search history
- Add more navigation items sesuai kebutuhan
