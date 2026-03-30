"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { INDONESIA_REGIONS, BantenCity } from "@/types";

interface MobileBottomNavProps {
  onLocationDetect?: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onLocationDetect,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    detectLocation,
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
  } = useApp();

  // ===============================
  // STATE
  // ===============================
  const [refreshCount, setRefreshCount] = useState(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchClickCount, setSearchClickCount] = useState(0);
  const searchClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isDetecting, setIsDetecting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [homeClickCount, setHomeClickCount] = useState(0);
  const homeClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dropdown wilayah
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [openProvinces, setOpenProvinces] = useState<Record<string, boolean>>(
    {},
  );

  const locationBtnRef = useRef<HTMLButtonElement>(null);

  // ===============================
  // FORMAT TEXT (HAPUS UNDERSCORE)
  // ===============================
  const formatRegionName = (name: string) => {
    return name.replace(/_/g, " ");
  };

  // ===============================
  // LOCATION BUTTON
  // ===============================
  const handleLocationClick = async () => {
    setRefreshCount((prev) => prev + 1);

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    if (refreshCount === 1) {
      // Double click → refresh
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
      setRefreshCount(0);
    } else {
      // Single click → detect location
      setRefreshCount(1);
      setIsDetecting(true);

      try {
        if (onLocationDetect) {
          await onLocationDetect();
        } else {
          await detectLocation();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      } catch (error) {
        alert("Gagal mendeteksi lokasi.");
      } finally {
        setIsDetecting(false);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        setRefreshCount(0);
      }, 800);
    }
  };

  // ===============================
  // HOME BUTTON
  // ===============================
  const handleHomeClick = () => {
    setHomeClickCount((prev) => prev + 1);

    if (homeClickTimeoutRef.current) {
      clearTimeout(homeClickTimeoutRef.current);
    }

    if (pathname !== "/") {
      router.push("/");
      setHomeClickCount(0);
      return;
    }

    if (homeClickCount === 1) {
      router.refresh();
      setHomeClickCount(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    homeClickTimeoutRef.current = setTimeout(() => {
      setHomeClickCount(0);
    }, 800);
  };

  // ===============================
  // SEARCH BUTTON
  // ===============================
  const handleSearchClick = () => {
    setSearchClickCount((prev) => prev + 1);

    if (searchClickTimeoutRef.current) {
      clearTimeout(searchClickTimeoutRef.current);
    }

    if (searchClickCount === 1) {
      // Double tap → close
      setShowSearchInput(false);
      setSearchClickCount(0);
      return;
    } else {
      // Single tap → open
      setShowSearchInput(true);
    }

    searchClickTimeoutRef.current = setTimeout(() => {
      setSearchClickCount(0);
    }, 800);
  };

  // ===============================
  // SEARCH SUBMIT
  // ===============================
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // ===============================
  // DROPDOWN PROVINCE
  // ===============================
  const toggleProvince = (province: string) => {
    setOpenProvinces((prev) => ({
      ...prev,
      [province]: !prev[province],
    }));
  };

  const handleCitySelect = (city: BantenCity | "Semua") => {
    setSelectedCity(city);
    setIsLocationOpen(false);
  };

  // ===============================
  // WHATSAPP BUTTON
  // ===============================
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/?text=Halo%20FastCare", "_blank");
  };

  return (
    <>
      {/* ===============================
          SEARCH BAR
      =============================== */}
      {showSearchInput && (
        <div className="fixed bottom-20 left-0 right-0 z-40 lg:hidden flex justify-center px-3">
          <div className="w-full max-w-xs bg-background border border-border shadow-sm">
            {/* DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="w-full flex items-center px-3 py-2 text-xs border-b border-border transition-all duration-150 hover:bg-accent active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-globe w-4 text-center"></i>
                  {selectedCity === "Semua"
                    ? "Pilih Wilayah"
                    : formatRegionName(selectedCity)}
                </span>

                <i
                  className={`fa-solid fa-chevron-down text-[10px] ml-auto ${
                    isLocationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLocationOpen && (
                <div className="absolute bottom-full left-0 w-full bg-background border border-border max-h-52 overflow-y-auto z-50 no-scrollbar">
                  {/* Semua Wilayah */}
                  <button
                    onClick={() => handleCitySelect("Semua")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs border-b border-border transition-all duration-150 hover:bg-accent active:scale-95"
                  >
                    <i className="fa-solid fa-globe w-4 text-center"></i>
                    Semua Wilayah
                  </button>

                  {Object.entries(INDONESIA_REGIONS).map(
                    ([province, cities]) => {
                      const isOpen = openProvinces[province];

                      return (
                        <div key={province}>
                          <button
                            onClick={() => toggleProvince(province)}
                            className="w-full flex items-center px-3 py-2 text-xs border-b border-border transition-all duration-150 hover:bg-accent active:scale-95"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-4"></span>
                              {formatRegionName(province)}
                            </span>

                            <i
                              className={`fa-solid fa-chevron-down text-[10px] ml-auto ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isOpen &&
                            cities.map((city) => (
                              <button
                                key={city}
                                onClick={() => handleCitySelect(city)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs border-b border-border transition-all duration-150 hover:bg-accent active:scale-95"
                              >
                                <span className="w-4"></span>
                                {formatRegionName(city)}
                              </button>
                            ))}
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===============================
          TOOLTIP LOKASI
      =============================== */}
      {/* Ubah nilai bottom untuk atur posisi */}
      {showTooltip && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-black text-white text-xs px-3 py-1">
            Lokasi terdeteksi
          </div>
        </div>
      )}

      {/* ===============================
          BOTTOM NAVIGATION
      =============================== */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 lg:hidden">
        <div className="flex items-center justify-around h-20">
          <button
            onClick={handleHomeClick}
            className="flex flex-col items-center w-full transition-all duration-150 hover:opacity-80 active:scale-95"
          >
            <i className="fa-solid fa-home text-xl" />
            <span className="text-xs">Beranda</span>
          </button>

          <button
            onClick={handleSearchClick}
            className="flex flex-col items-center w-full transition-all duration-150 hover:opacity-80 active:scale-95"
          >
            <i className="fa-solid fa-globe text-xl" />
            <span className="text-xs">Pilih Wilayah</span>
          </button>

          <button
            ref={locationBtnRef}
            onClick={handleLocationClick}
            className="flex flex-col items-center w-full transition-all duration-150 hover:opacity-80 active:scale-95"
          >
            <i
              className={`fa-solid fa-location-crosshairs text-xl ${
                isDetecting ? "animate-spin" : ""
              }`}
            />
            <span className="text-xs">Deteksi Lokasi</span>
          </button>

          <button
            onClick={handleWhatsAppClick}
            className="flex flex-col items-center w-full transition-all duration-150 hover:opacity-80 active:scale-95"
          >
            <i className="fa-solid fa-headset text-xl" />
            <span className="text-xs">Bantuan</span>
          </button>
        </div>
      </nav>

      <div className="h-20 lg:hidden" />
    </>
  );
};

export default MobileBottomNav;
