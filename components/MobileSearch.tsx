"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { INDONESIA_REGIONS, BantenCity } from "@/types";

const MobileSearch = () => {
  const {
    selectedCity,
    setSelectedCity,
    detectLocation,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // ===============================
  // STATE UNTUK DROPDOWN PROVINSI
  // ===============================
  const [openProvinces, setOpenProvinces] = useState<Record<string, boolean>>(
    {},
  );

  const toggleProvince = (province: string) => {
    setOpenProvinces((prev) => ({
      ...prev,
      [province]: !prev[province],
    }));
  };

  // Tutup dropdown kalau klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Deteksi lokasi perangkat
  const handleDetectLocation = async () => {
    setIsDetecting(true);
    try {
      await detectLocation();
      toast.success("Lokasi terdeteksi");
      setIsLocationOpen(false);
    } catch (error) {
      console.error("Gagal mendeteksi lokasi", error);
      toast.error(
        error instanceof Error && error.message === "Permission denied"
          ? "Izin lokasi ditolak. Aktifkan izin lokasi di browser."
          : "Gagal mendeteksi lokasi. Coba lagi.",
      );
    } finally {
      setIsDetecting(false);
    }
  };

  // Pilih kota atau semua wilayah
  const handleCitySelect = (city: BantenCity | "Semua") => {
    setSelectedCity(city);
    setIsLocationOpen(false);
  };

  return (
    <div className="md:hidden px-4 py-3 bg-background border-b border-border -mt-8">
      <div className="flex flex-col gap-3">
        {/* Input pencarian */}
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari Layanan Medis Terdekat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-card text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileSearch;
