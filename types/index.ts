export interface Hospital {
  id: string;
  name: string;
  type: "RS Umum" | "RS Swasta" | "RS Khusus" | "RS Ibu & Anak" | "RS Jiwa" | "Klinik";
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
  // allow nullable coordinates because some records may not provide exact lat/lng
  // when adding via admin panel (we can parse Google Maps link instead)
  latitude?: number | null;
  longitude?: number | null;
  googleMapsLink?: string;
  distance?: number; // km from user location
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
  password: string; // In real app, this would be hashed
  name: string;
  role: "admin" | "superadmin";
}

export interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
  address?: string;
}

export const BANTEN_CITIES = [
  "Kota Serang",
  "Kota Cilegon",
  "Kota Tangerang",
  "Kota Tangerang Selatan",
  "Kabupaten Serang",
  "Kabupaten Tangerang",
  "Kabupaten Pandeglang",
  "Kabupaten Lebak",
  "Jakarta Pusat",
  "Jakarta Utara",
  "Jakarta Barat",
  "Jakarta Selatan",
  "Jakarta Timur",
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
  "Kota Yogyakarta",
  "Kabupaten Sleman",
  "Kabupaten Bantul",
  "Kabupaten Gunungkidul",
  "Kabupaten Kulon Progo",
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
] as const;

export type BantenCity = (typeof BANTEN_CITIES)[number];
