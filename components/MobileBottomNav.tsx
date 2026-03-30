"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { INDONESIA_REGIONS, BantenCity } from "@/types";

interface MobileBottomNavProps {
  onLocationDetect?: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onLocationDetect,
}) => {
  const router = useRouter();
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

  const [homeClickCount, setHomeClickCount] = useState(0);
  const homeClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // dropdown wilayah
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [openProvinces, setOpenProvinces] = useState<Record<string, boolean>>(
    {},
  );

  // ===============================
  // LOCATION BUTTON
  // ===============================
  const handleLocationClick = async () => {
    setRefreshCount((prev) => prev + 1);

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    if (refreshCount === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
      setRefreshCount(0);
    } else {
      setRefreshCount(1);
      setIsDetecting(true);
      try {
        if (onLocationDetect) {
          onLocationDetect();
        } else {
          await detectLocation();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
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
  // HOME
  // ===============================
  const handleHomeClick = () => {
    setHomeClickCount((prev) => prev + 1);

    if (homeClickTimeoutRef.current) {
      clearTimeout(homeClickTimeoutRef.current);
    }

    if (homeClickCount === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
      setHomeClickCount(0);
    } else {
      router.push("/");
      setHomeClickCount(0);
      return;
    }

    homeClickTimeoutRef.current = setTimeout(() => {
      setHomeClickCount(0);
    }, 800);
  };

  // ===============================
  // SEARCH BUTTON (DOUBLE TAP CLOSE)
  // ===============================
  const handleSearchClick = () => {
    setSearchClickCount((prev) => prev + 1);

    if (searchClickTimeoutRef.current) {
      clearTimeout(searchClickTimeoutRef.current);
    }

    if (searchClickCount === 1) {
      // double tap → close
      setShowSearchInput(false);
      setSearchClickCount(0);
      return;
    } else {
      // single tap → open
      setShowSearchInput(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }

    searchClickTimeoutRef.current = setTimeout(() => {
      setSearchClickCount(0);
    }, 800);
  };

  // ===============================
  // SEARCH SUBMIT (ENTER ONLY)
  // ===============================
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // ===============================
  // DROPDOWN PROVINSI
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
  // WHATSAPP
  // ===============================
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/?text=Halo%20FastCare", "_blank");
  };

  return (
    <>
      {/* SEARCH BAR */}
      {showSearchInput && (
        <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border px-4 py-3 z-40 lg:hidden">
          <div className="flex flex-col gap-2">
            {/* DROPDOWN WILAYAH */}
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-xl border border-border bg-card"
              >
                <span className="text-sm flex items-center gap-2">
                  <i className="fa-solid fa-globe"></i>
                  {selectedCity === "Semua"
                    ? "Pilih Berdasarkan Wilayah"
                    : selectedCity}
                </span>
                <i className="fa-solid fa-chevron-down text-xs" />
              </button>

              {isLocationOpen && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-xl max-h-60 overflow-y-auto z-50">
                  <button
                    onClick={() => handleCitySelect("Semua")}
                    className="w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2"
                  >
                    <i className="fa-solid fa-globe"></i>
                    <span>Semua Wilayah</span>
                  </button>

                  {Object.entries(INDONESIA_REGIONS).map(
                    ([province, cities]) => {
                      const isOpen = openProvinces[province];

                      return (
                        <div key={province}>
                          <button
                            onClick={() => toggleProvince(province)}
                            className="w-full flex justify-between px-4 py-2 text-xm "
                          >
                            {province}
                            <i
                              className={`fa-solid fa-chevron-down ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isOpen &&
                            cities.map((city) => (
                              <button
                                key={city}
                                onClick={() => handleCitySelect(city)}
                                className="w-full text-left px-6 py-2 hover:bg-accent"
                              >
                                {city}
                              </button>
                            ))}
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            {/* INPUT SEARCH */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari Layanan Medis Terdekat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-full pl-12 pr-4 py-2 border border-border rounded-xl bg-card"
              />
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 lg:hidden">
        <div className="flex items-center justify-around h-20">
          <button
            onClick={handleHomeClick}
            className="flex flex-col items-center w-full"
          >
            <i className="fa-solid fa-home text-xl" />
            <span className="text-xs">Beranda</span>
          </button>

          <button
            onClick={handleSearchClick}
            className="flex flex-col items-center w-full"
          >
            <i className="fa-solid fa-magnifying-glass text-xl" />
            <span className="text-xs">Cari Layanan</span>
          </button>

          <button
            onClick={handleLocationClick}
            className="flex flex-col items-center w-full"
          >
            <i className="fa-solid fa-location-crosshairs text-xl" />
            <span className="text-xs">Lokasi</span>
          </button>

          <button
            onClick={handleWhatsAppClick}
            className="flex flex-col items-center w-full"
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
