# Format CSV Import Rumah Sakit (Admin Panel)

Gunakan format dan urutan kolom berikut untuk mengimpor data rumah sakit melalui fitur Import CSV di form admin:

```csv
name,type,class,address,city,phone,image,description,facilities,totalBeds,hasIGD,hasICU,operatingHours,googleMapsLink,latitude,longitude
Contoh RS,RS Umum,C,Jl. Contoh No.1,Kota Serang,0212345678,https://example.com/image.jpg,Deskripsi RS,IGD 24 Jam,100,true,true,24 Jam,https://maps.google.com/?q=...,-6.123456,106.123456
```

**Keterangan Kolom:**

- `name`: Nama Rumah Sakit
- `type`: Tipe RS (RS Umum, RS Swasta, RS Khusus, RS Ibu & Anak, RS Jiwa, Klinik)
- `class`: Kelas RS (A, B, C, D, Klinik)
- `address`: Alamat lengkap
- `city`: Kota/Kabupaten
- `phone`: Nomor telepon
- `image`: URL gambar RS
- `description`: Deskripsi singkat
- `facilities`: Fasilitas (pisahkan dengan koma)
- `totalBeds`: Total tempat tidur (angka)
- `hasIGD`: IGD 24 Jam (true/false)
- `hasICU`: ICU (true/false)
- `operatingHours`: Jam operasional (misal: 24 Jam)
- `googleMapsLink`: Link Google Maps
- `latitude`: Latitude (opsional)
- `longitude`: Longitude (opsional)

**Catatan:**

- Baris pertama harus header, baris kedua dan seterusnya adalah data.
- Fitur import hanya mengisi form, tidak langsung menyimpan ke database. Silakan cek dan klik "Simpan Perubahan" setelah import.
- Kolom `image` dari CSV tidak otomatis mengisi form, silakan upload gambar secara manual setelah import data.
  This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
