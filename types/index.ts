export interface Hospital {
  id: string;
  name: string;
  type:
    | "RS Umum"
    | "RS Swasta"
    | "RS Khusus"
    | "RS Ibu & Anak"
    | "RS Jiwa"
    | "Klinik";
  class: "A" | "B" | "C" | "D" | "Tidak Berkelas";
  address: string;
  city: string; // Kabupaten/Kota
  district: string; // Kecamatan
  phone: string;
  email?: string;
  website?: string;
  image: string;
  description: string;
  facilities: string[];
  totalBeds: number;
  hasIGD: boolean;
  hasICU: boolean;
  operatingHours: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsLink?: string;
  distance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: "admin" | "superadmin";
}

export interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
  address?: string;
}

/* =========================================================
   REGION GROUPING (NEW - TANPA MERUBAH LOGIC LAMA)
   ========================================================= */

export const INDONESIA_REGIONS = {
  Banten: [
    "Kota Serang",
    "Kota Cilegon",
    "Kota Tangerang",
    "Kota Tangerang Selatan",
    "Kabupaten Serang",
    "Kabupaten Tangerang",
    "Kabupaten Pandeglang",
    "Kabupaten Lebak",
  ],

  DKI_Jakarta: [
    "Jakarta Pusat",
    "Jakarta Utara",
    "Jakarta Barat",
    "Jakarta Selatan",
    "Jakarta Timur",
  ],

  Jawa_Barat: [
    "Kota Bogor",
    "Kabupaten Bogor",
    "Kota Depok",
    "Kota Bekasi",
    "Kabupaten Bekasi",
    "Kota Bandung",
    "Kabupaten Bandung",
    "Kabupaten Bandung Barat",
    "Kota Cimahi",
    "Kota Cirebon",
    "Kabupaten Cirebon",
    "Kota Sukabumi",
    "Kabupaten Sukabumi",
    "Kota Tasikmalaya",
    "Kabupaten Tasikmalaya",
    "Kota Banjar",
    "Kabupaten Garut",
    "Kabupaten Sumedang",
    "Kabupaten Majalengka",
    "Kabupaten Kuningan",
    "Kabupaten Indramayu",
    "Kabupaten Subang",
    "Kabupaten Purwakarta",
    "Kabupaten Karawang",
    "Kabupaten Cianjur",
    "Kabupaten Pangandaran",
  ],

  Jawa_Tengah: [
    "Kota Semarang",
    "Kabupaten Semarang",
    "Kota Salatiga",
    "Kota Surakarta",
    "Kabupaten Sukoharjo",
    "Kabupaten Karanganyar",
    "Kabupaten Sragen",
    "Kabupaten Wonogiri",
    "Kabupaten Klaten",
    "Kabupaten Boyolali",
    "Kabupaten Grobogan",
    "Kabupaten Blora",
    "Kabupaten Rembang",
    "Kabupaten Pati",
    "Kabupaten Kudus",
    "Kabupaten Jepara",
    "Kabupaten Demak",
    "Kabupaten Kendal",
    "Kabupaten Batang",
    "Kabupaten Pekalongan",
    "Kota Pekalongan",
    "Kabupaten Pemalang",
    "Kabupaten Tegal",
    "Kota Tegal",
    "Kabupaten Brebes",
    "Kabupaten Banyumas",
    "Kabupaten Cilacap",
    "Kabupaten Purbalingga",
    "Kabupaten Banjarnegara",
    "Kabupaten Kebumen",
    "Kabupaten Purworejo",
    "Kabupaten Wonosobo",
    "Kabupaten Magelang",
    "Kota Magelang",
    "Kabupaten Temanggung",
  ],

  DI_Yogyakarta: [
    "Kota Yogyakarta",
    "Kabupaten Sleman",
    "Kabupaten Bantul",
    "Kabupaten Gunungkidul",
    "Kabupaten Kulon Progo",
  ],

  Jawa_Timur: [
    "Kota Surabaya",
    "Kota Malang",
    "Kabupaten Malang",
    "Kota Batu",
    "Kabupaten Sidoarjo",
    "Kabupaten Gresik",
    "Kabupaten Bangkalan",
    "Kabupaten Sampang",
    "Kabupaten Pamekasan",
    "Kabupaten Sumenep",
    "Kabupaten Mojokerto",
    "Kota Mojokerto",
    "Kabupaten Jombang",
    "Kabupaten Kediri",
    "Kota Kediri",
    "Kabupaten Nganjuk",
    "Kabupaten Madiun",
    "Kota Madiun",
    "Kabupaten Magetan",
    "Kabupaten Ngawi",
    "Kabupaten Bojonegoro",
    "Kabupaten Tuban",
    "Kabupaten Lamongan",
    "Kabupaten Pasuruan",
    "Kota Pasuruan",
    "Kabupaten Probolinggo",
    "Kota Probolinggo",
    "Kabupaten Lumajang",
    "Kabupaten Jember",
    "Kabupaten Bondowoso",
    "Kabupaten Situbondo",
    "Kabupaten Banyuwangi",
    "Kabupaten Blitar",
    "Kota Blitar",
    "Kabupaten Tulungagung",
    "Kabupaten Trenggalek",
    "Kabupaten Pacitan",
  ],
} as const;

/* =========================================================
   LEGACY ARRAY (TETAP ADA - BACKWARD COMPATIBLE)
   ========================================================= */

export const BANTEN_CITIES = Object.values(
  INDONESIA_REGIONS,
).flat() as readonly string[];

export type BantenCity = (typeof BANTEN_CITIES)[number];
