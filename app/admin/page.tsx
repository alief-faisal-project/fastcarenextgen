"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";
import { sanitizeInput } from "@/lib/security";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Hospital, HeroBanner, BANTEN_CITIES } from "@/types";
import { toast } from "sonner";
import ImageGalleryManager from "@/components/ImageGalleryManager";

type AdminTab = "hospitals" | "banners" | "settings";

const AdminPanel = () => {
  const {
    isAuthenticated,
    currentUser,
    logout,
    hospitals,
    addHospital,
    updateHospital,
    deleteHospital,
    heroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
  } = useApp();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>("hospitals");
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  //usememo

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [hospitals, searchQuery]);

  // Logic mengalihkan jika belum terautentikasi
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleDeleteHospital = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus rumah sakit ini?")) {
      deleteHospital(id);
    }
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus banner ini?")) {
      deleteHeroBanner(id);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top Bar */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo_sigap.png"
                alt="FastCare.id"
                width={120}
                height={32}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold text-foreground">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-card border border-border rounded-xl p-2 sticky top-24">
              <button
                onClick={() => setActiveTab("hospitals")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "hospitals"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <i className="fa-solid fa-hospital w-5" />
                <span className="font-medium">Rumah Sakit</span>
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {hospitals.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("banners")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "banners"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <i className="fa-solid fa-images w-5" />
                <span className="font-medium">Hero Banner</span>
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {heroBanners.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                <i className="fa-solid fa-gear w-5" />
                <span className="font-medium">Pengaturan</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Hospitals Tab */}
            {activeTab === "hospitals" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground font-heading">
                      Kelola Rumah Sakit
                    </h1>
                    <p className="text-muted-foreground">
                      Tambah, edit, atau hapus data rumah sakit
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingHospital(null);
                      setShowHospitalForm(true);
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <i className="fa-solid fa-plus" />
                    <span>Tambah RS</span>
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari rumah sakit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Hospital List */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                            Rumah Sakit
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground hidden md:table-cell">
                            Kota
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground hidden lg:table-cell">
                            Tipe
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground hidden lg:table-cell">
                            Kelas
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-foreground hidden md:table-cell">
                            Jumlah Kamar
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">
                            Edit | Hapus
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHospitals.map((hospital) => (
                          <tr
                            key={hospital.id}
                            className="border-b border-border hover:bg-accent/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={hospital.image}
                                  alt={hospital.name}
                                  width={48}
                                  height={48}
                                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="font-medium text-foreground">
                                    {hospital.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground md:hidden">
                                    {hospital.city}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                              {hospital.city}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                              {hospital.type}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                                Kelas {hospital.class}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm hidden md:table-cell">
                              <span className="text-foreground font-medium">
                                {hospital.totalBeds}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingHospital(hospital);
                                    setShowHospitalForm(true);
                                  }}
                                  className="p-2 text-primary rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteHospital(hospital.id)
                                  }
                                  className="p-2 text-red-500 rounded-lg transition-colors"
                                  title="Hapus"
                                >
                                  <i className="fa-solid fa-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredHospitals.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      <i className="fa-solid fa-hospital text-3xl mb-2" />
                      <p>Tidak ada data rumah sakit</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Banners Tab */}
            {activeTab === "banners" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground font-heading">
                      Kelola Hero Banner
                    </h1>
                    <p className="text-muted-foreground">
                      Atur banner yang tampil di halaman utama
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBanner(null);
                      setShowBannerForm(true);
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <i className="fa-solid fa-plus" />
                    <span>Tambah Banner</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {heroBanners.map((banner) => (
                    <div
                      key={banner.id}
                      className="bg-card border border-border rounded-xl overflow-hidden"
                    >
                      <div className="aspect-video relative bg-gray-300">
                        {banner.image ? (
                          <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-400">
                            <div className="text-center text-white/70">
                              <i className="fa-solid fa-image text-4xl mb-2" />
                              <p className="text-sm">No Image</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {/* Overlay text removed per request; only image displayed */}
                        <div className="absolute top-3 right-3 flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              banner.isActive
                                ? "bg-success text-success-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {banner.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Urutan: {banner.order}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingBanner(banner);
                              setShowBannerForm(true);
                            }}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <i className="fa-solid fa-pen-to-square" />
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground font-heading">
                    Pengaturan
                  </h1>
                  <p className="text-muted-foreground">
                    Konfigurasi sistem dan informasi akun
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Informasi Akun
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Nama
                      </label>
                      <p className="font-medium text-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Role
                      </label>
                      <p className="font-medium text-foreground capitalize">
                        {currentUser?.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Statistik
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-accent rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {hospitals.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Total RS</p>
                    </div>
                    <div className="p-4 bg-accent rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {heroBanners.filter((b) => b.isActive).length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Banner Aktif
                      </p>
                    </div>
                    <div className="p-4 bg-accent rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {hospitals.reduce((a, b) => a + b.totalBeds, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Kamar
                      </p>
                    </div>
                    <div className="p-4 bg-accent rounded-lg">
                      <p className="text-2xl font-bold text-success">
                        {hospitals.filter((h) => h.googleMapsLink).length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dengan Maps
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Hospital Form Modal */}
      {showHospitalForm && (
        <HospitalFormModal
          hospital={editingHospital}
          onClose={() => {
            setShowHospitalForm(false);
            setEditingHospital(null);
          }}
          onSave={async (data) => {
            try {
              if (editingHospital) {
                const result = await updateHospital(editingHospital.id, data);
                if (result?.error) {
                  console.error("Update error:", result.error);
                  toast.error("Gagal mengupdate: " + result.error.message);
                  return;
                }
                toast.success("Rumah sakit berhasil diupdate!", {
                  description: `${data.name} telah diperbarui di database`,
                });
              } else {
                const result = await addHospital(data);
                if (result?.error) {
                  console.error("Add error:", result.error);
                  toast.error("Gagal menambah: " + result.error.message);
                  return;
                }
                toast.success("Rumah sakit berhasil ditambahkan!", {
                  description: `${data.name} telah ditambahkan ke database`,
                });
              }

              // hanya tutup jika sukses
              setShowHospitalForm(false);
              setEditingHospital(null);
            } catch (error) {
              console.error("Unexpected error:", error);
              const errorMsg =
                error instanceof Error
                  ? error.message
                  : "Error tidak diketahui";
              toast.error("Error: " + errorMsg);
            }
          }}
        />
      )}

      {/* Banner Form Modal */}
      {showBannerForm && (
        <BannerFormModal
          banner={editingBanner}
          onClose={() => {
            setShowBannerForm(false);
            setEditingBanner(null);
          }}
          onSave={async (data) => {
            try {
              if (editingBanner) {
                await updateHeroBanner(editingBanner.id, data);
                toast.success("✅ Banner berhasil diupdate!", {
                  description: "Perubahan telah disimpan ke database",
                });
              } else {
                await addHeroBanner(data as HeroBanner);
                toast.success("✅ Banner berhasil ditambahkan!", {
                  description: "Banner baru telah ditambahkan",
                });
              }
              setShowBannerForm(false);
              setEditingBanner(null);
            } catch (error: unknown) {
              console.error("Banner error:", error);
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Gagal menyimpan banner";
              toast.error("Error: " + errorMessage);
              // Jangan tutup modal jika ada error, biarkan user retry
            }
          }}
        />
      )}
    </div>
  );
};

// Hospital Form Modal Component
interface HospitalFormModalProps {
  hospital: Hospital | null;
  onClose: () => void;
  onSave: (data: Partial<Hospital>) => Promise<void>;
}

const HospitalFormModal = ({
  hospital,
  onClose,
  onSave,
}: HospitalFormModalProps) => {
  const { uploadHospitalImage } = useApp();

  type FormState = {
    name: string;
    type: Hospital["type"];
    class: Hospital["class"];
    address: string;
    city: string;
    district: string;
    phone: string;
    image: string;
    gallery: string[];
    description: string;
    facilities: string;
    totalBeds: number;
    hasIGD: boolean;
    hasICU: boolean;
    operatingHours: string;
    googleMapsLink: string;
    latitude: string;
    longitude: string;
  };

  const [formData, setFormData] = useState<FormState>({
    name: hospital?.name || "",
    type: hospital?.type || "RS Umum",
    class: hospital?.class || "C",
    address: hospital?.address || "",
    city: hospital?.city || "Kota Serang",
    district: hospital?.district || "",
    phone: hospital?.phone || "",
    image: hospital?.image || "",
    gallery: hospital?.gallery || [],
    description: hospital?.description || "",
    facilities:
      hospital?.facilities && Array.isArray(hospital.facilities)
        ? hospital.facilities.join(", ")
        : "",
    totalBeds: hospital?.totalBeds || 100,
    hasIGD: hospital?.hasIGD ?? true,
    hasICU: hospital?.hasICU ?? true,
    operatingHours: hospital?.operatingHours || "24 Jam",
    googleMapsLink: hospital?.googleMapsLink || "",
    latitude:
      hospital?.latitude !== null && hospital?.latitude !== undefined
        ? String(hospital.latitude)
        : "",
    longitude:
      hospital?.longitude !== null && hospital?.longitude !== undefined
        ? String(hospital.longitude)
        : "",
  });

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  // CSV Import
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Helper: Parse CSV row to FormState
  function parseCsvRow(row: string[]): Partial<FormState> {
    // Urutan kolom harus sama dengan format di README
    return {
      name: row[0] || "",
      type: (row[1] as Hospital["type"]) || "RS Umum",
      class: (row[2] as Hospital["class"]) || "C",
      address: row[3] || "",
      city: row[4] || "Kota Serang",
      phone: row[5] || "",
      // image: row[6] || "", // JANGAN auto isi image dari CSV
      description: row[7] || "",
      facilities: row[8] || "",
      totalBeds: row[9] ? Number(row[9]) : 0,
      hasIGD: row[10] ? row[10].toLowerCase() === "true" : true,
      hasICU: row[11] ? row[11].toLowerCase() === "true" : true,
      operatingHours: row[12] || "24 Jam",
      googleMapsLink: row[13] || "",
      latitude: row[14] || "",
      longitude: row[15] || "",
    };
  }

  // CSV Handler
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Simple CSV parse (no quoted commas)
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        toast.error("File CSV harus memiliki header dan minimal 1 data!");
        return;
      }
      const dataRow = lines[1].split(",");
      const parsed = parseCsvRow(dataRow);
      setFormData((prev) => ({ ...prev, ...parsed }));
      // Tidak auto set imagePreview, biarkan gambar tetap manual
      toast.success(
        "Data dari CSV berhasil dimasukkan ke form! (Gambar tidak otomatis diisi)",
      );
    };
    reader.readAsText(file);
    // Reset input agar bisa upload file sama lagi
    if (csvInputRef.current) csvInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!formData.name.trim()) {
      alert("Nama Rumah Sakit tidak boleh kosong!");
      return;
    }
    if (!formData.address.trim()) {
      alert("Alamat tidak boleh kosong!");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Telepon tidak boleh kosong!");
      return;
    }
    if (!formData.description.trim()) {
      alert("Deskripsi tidak boleh kosong!");
      return;
    }

    // Validasi gambar: minimal harus ada 1 gambar (dari gallery atau main image lama)
    const filteredGallery = formData.gallery.filter((img) => img.trim());
    const mainImage =
      filteredGallery.length > 0 ? filteredGallery[0] : formData.image;

    if (!mainImage.trim()) {
      alert(
        "Minimal harus ada 1 gambar! Silakan upload gambar di bagian Galeri Gambar.",
      );
      return;
    }

    // convert string "IGD, ICU" → ["IGD", "ICU"]
    const formattedFacilities = formData.facilities
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const dataToSave: Partial<Hospital> = {
      name: formData.name.trim(),
      type: formData.type,
      class: formData.class,
      address: formData.address.trim(),
      city: formData.city,
      phone: formData.phone.trim(),
      image: mainImage,
      gallery: filteredGallery,
      description: formData.description.trim(),
      facilities: formattedFacilities,
      totalBeds: formData.totalBeds || 0,
      hasIGD: formData.hasIGD,
      hasICU: formData.hasICU,
      operatingHours: formData.operatingHours,
      googleMapsLink: formData.googleMapsLink?.trim() || "",
      // include latitude/longitude if provided by admin (convert to number)
      latitude: formData.latitude.trim()
        ? Number.parseFloat(formData.latitude.trim())
        : undefined,
      longitude: formData.longitude.trim()
        ? Number.parseFloat(formData.longitude.trim())
        : undefined,
    };

    // Sanitize text fields before sending
    if (dataToSave.name) dataToSave.name = sanitizeInput(dataToSave.name);
    if (dataToSave.address)
      dataToSave.address = sanitizeInput(dataToSave.address);
    if (dataToSave.description)
      dataToSave.description = sanitizeInput(dataToSave.description);

    console.log("📝 Submitting data:", dataToSave);

    try {
      await onSave(dataToSave);
    } catch (error) {
      console.error("❌ Error dalam handleSubmit:", error);
      alert(
        "Gagal menyimpan data: " +
          (error instanceof Error ? error.message : "Error tidak diketahui"),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground font-heading">
            {hospital ? "Edit Rumah Sakit" : "Tambah Rumah Sakit"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-3xl">
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Nama Rumah Sakit *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipe</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Hospital["type"],
                  })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="RS Umum">RS Umum</option>
                <option value="RS Swasta">RS Swasta</option>
                <option value="RS Khusus">RS Khusus</option>
                <option value="RS Ibu & Anak">RS Ibu & Anak</option>
                <option value="RS Jiwa">RS Jiwa</option>
                <option value="Klinik">Klinik</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kelas</label>
              <select
                value={formData.class}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    class: e.target.value as Hospital["class"],
                  })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="A">Kelas A</option>
                <option value="B">Kelas B</option>
                <option value="C">Kelas C</option>
                <option value="D">Kelas D</option>
                <option value="Klinik">Klinik</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Kota/Kabupaten *
              </label>
              <select
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                required
              >
                {BANTEN_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            {/* Kecamatan removed from admin form because column removed in Supabase */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Alamat *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Telepon *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
            {/* Email field removed per admin request */}
            {/* Website removed per request - use Google Maps link field instead */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Galeri Gambar Rumah Sakit *
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Upload minimal 1 gambar. Gambar pertama akan menjadi gambar
                utama.
              </p>
              <ImageGalleryManager
                images={formData.gallery}
                onImagesChange={(newImages) =>
                  setFormData({ ...formData, gallery: newImages })
                }
                onUpload={uploadHospitalImage}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Deskripsi *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                rows={3}
                required
                placeholder="Isi deskripsi rumah sakit.."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Fasilitas (pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={formData.facilities}
                onChange={(e) =>
                  setFormData({ ...formData, facilities: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                placeholder="IGD 24 Jam, ICU, Laboratorium, ..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Tempat Tidur
              </label>
              <input
                type="number"
                value={formData.totalBeds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalBeds: Number.parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            {/* Latitude & Longitude (float8) */}
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                placeholder="-6.123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                placeholder="106.123456"
              />
            </div>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasIGD}
                  onChange={(e) =>
                    setFormData({ ...formData, hasIGD: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">IGD 24 Jam</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasICU}
                  onChange={(e) =>
                    setFormData({ ...formData, hasICU: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm">ICU</span>
              </label>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 mt-6 pt-6 border-t border-border">
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvImport}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => csvInputRef.current?.click()}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm flex items-center gap-2"
              title="Import dari CSV"
            >
              <i className="fa-solid fa-file-csv" /> Import CSV
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Isi Otomatis dengan AI"
              disabled={isLoadingAI}
              onClick={async () => {
                const hospitalName = prompt(
                  "Masukkan nama rumah sakit:\n(misal: Siloam Lippo Karawaci, RSUD Serang, dll)",
                  formData.name || "",
                );

                if (!hospitalName || hospitalName.trim() === "") {
                  return;
                }

                setIsLoadingAI(true);
                console.log(`[AI FORM] Starting AI fetch for: ${hospitalName}`);

                try {
                  const encodedName = encodeURIComponent(hospitalName.trim());
                  const res = await fetch(
                    `/api/aiHospital?name=${encodedName}`,
                  );

                  if (!res.ok) {
                    const errorData = (await res.json().catch(() => ({}))) as {
                      error?: string;
                    };
                    throw new Error(errorData?.error || `HTTP ${res.status}`);
                  }

                  const data = (await res.json()) as {
                    name?: string;
                    address?: string;
                    city?: string;
                    phone?: string;
                    description?: string;
                    type?: string;
                    website?: string;
                    province?: string;
                    emergency?: boolean;
                    image?: string;
                    facilities?: string;
                    latitude?: number;
                    longitude?: number;
                  };

                  console.log("[AI FORM] AI Result:", data);

                  // Validasi response
                  if (!data || typeof data !== "object") {
                    throw new Error("Response format invalid");
                  }

                  // Update form dengan smart merging
                  setFormData((prev) => {
                    const updated = { ...prev };

                    // Update name jika ada dari AI
                    if (data.name?.trim()) {
                      updated.name = data.name.trim();
                    }

                    // Update address jika ada dari AI
                    if (data.address?.trim()) {
                      updated.address = data.address.trim();
                    }

                    // Update city jika ada dari AI dan valid
                    if (data.city?.trim()) {
                      const cityExists = BANTEN_CITIES.some(
                        (c) => c.toLowerCase() === data.city!.toLowerCase(),
                      );
                      if (cityExists) {
                        updated.city = data.city.trim();
                      }
                    }

                    // Update phone jika ada dari AI
                    if (data.phone?.trim()) {
                      updated.phone = data.phone.trim();
                    }

                    // Update description jika ada dari AI
                    if (data.description?.trim()) {
                      updated.description = data.description.trim();
                    }

                    // Update type jika ada dari AI
                    if (data.type?.trim()) {
                      updated.type = data.type.trim() as Hospital["type"];
                    }

                    // Website → googleMapsLink (untuk kompatibilitas)
                    if (data.website?.trim()) {
                      updated.googleMapsLink = data.website.trim();
                    }

                    // Update facilities dari AI
                    if (data.facilities?.trim()) {
                      updated.facilities = data.facilities.trim();
                    }

                    // Update latitude dari AI
                    if (
                      typeof data.latitude === "number" &&
                      data.latitude !== 0
                    ) {
                      updated.latitude = String(data.latitude);
                    }

                    // Update longitude dari AI
                    if (
                      typeof data.longitude === "number" &&
                      data.longitude !== 0
                    ) {
                      updated.longitude = String(data.longitude);
                    }

                    return updated;
                  });

                  toast.success(
                    `✅ Data rumah sakit "${hospitalName}" berhasil diisi otomatis!`,
                  );
                  console.log("[AI FORM] Form updated successfully");
                } catch (error) {
                  const errorMsg =
                    error instanceof Error ? error.message : "Unknown error";
                  console.error("[AI FORM] Error:", errorMsg);
                  toast.error(`❌ Gagal mengambil data AI: ${errorMsg}`);
                } finally {
                  setIsLoadingAI(false);
                }
              }}
            >
              {isLoadingAI ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin" />
                  Sedang mengambil data...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-robot" />
                  Isi Otomatis dengan AI
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hospital ? "Simpan Perubahan" : "Tambah Rumah Sakit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Banner Form Modal Component
interface BannerFormModalProps {
  banner: HeroBanner | null;
  onClose: () => void;
  onSave: (data: Partial<HeroBanner>) => Promise<void>;
}

const BannerFormModal = ({ banner, onClose, onSave }: BannerFormModalProps) => {
  const { uploadBannerImage } = useApp();
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    image: banner?.image || "",
    link: banner?.link || "",
    isActive: banner?.isActive ?? true,
    order: banner?.order || 1,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(banner?.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Pilih file gambar yang valid");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB");
      return;
    }

    try {
      setIsUploading(true);
      console.log("📤 Starting image upload...");

      // Upload to Supabase
      const imageUrl = await uploadBannerImage(file);

      setFormData({ ...formData, image: imageUrl });
      setImagePreview(imageUrl);
      console.log(" Image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error(" Upload failed:", error);
      alert(
        "Gagal upload gambar: " +
          (error instanceof Error ? error.message : "Error"),
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi input
    if (!formData.title.trim()) {
      alert("Judul tidak boleh kosong!");
      return;
    }

    try {
      // Buat payload dengan format internal (camelCase)
      // yang akan di-map ke snake_case di AppContext
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        image: formData.image,
        link: formData.link || null,
        isActive: formData.isActive, // camelCase, bukan snake_case
        order: formData.order,
      };

      console.log("Sending banner payload:", payload);
      console.log(
        "isActive value:",
        formData.isActive,
        "Type:",
        typeof formData.isActive,
      );
      await onSave(payload as Partial<HeroBanner>);
    } catch (error) {
      console.error("Error dalam handleSubmit banner:", error);
      alert(
        "Gagal menyimpan banner: " +
          (error instanceof Error ? error.message : "Error tidak diketahui"),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground font-heading">
            {banner ? "Edit Banner" : "Tambah Banner"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subjudul</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Gambar *</label>

            {/* Preview */}
            {imagePreview && (
              <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Upload Options */}
            <div className="space-y-2">
              {/* File Upload */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Upload Gambar Lokal
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="w-full px-4 py-2 border border-border rounded-lg text-sm cursor-pointer hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isUploading && (
                  <p className="text-xs text-primary mt-1">📤 Uploading...</p>
                )}
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  atau Gunakan URL Gambar
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Link (opsional)
            </label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Urutan</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: Number.parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <label className="flex items-center space-x-2 cursor-pointer pt-6">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm">Aktif</span>
            </label>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(() => {
                if (isUploading) return "Uploading...";
                return banner ? "Simpan" : "Tambah";
              })()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
