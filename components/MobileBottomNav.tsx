"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useApp } from "@/context/AppContext";

interface MobileBottomNavProps {
  onLocationDetect?: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onLocationDetect,
}) => {
  const router = useRouter();
  const { detectLocation } = useApp();
  const [refreshCount, setRefreshCount] = useState(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [homeClickCount, setHomeClickCount] = useState(0);
  const homeClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle location detection / refresh
  const handleLocationClick = async () => {
    setRefreshCount((prev) => prev + 1);

    // Clear existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // If this is the second tap within 800ms, refresh
    if (refreshCount === 1) {
      // Double tap - refresh the page
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
      setRefreshCount(0);
    } else {
      // Single tap - detect location
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
        console.error("Error detecting location:", error);
        alert("Gagal mendeteksi lokasi. Pastikan izin lokasi diaktifkan.");
      } finally {
        setIsDetecting(false);
      }

      // Reset counter after 800ms if only single tap
      refreshTimeoutRef.current = setTimeout(() => {
        setRefreshCount(0);
      }, 800);
    }
  };

  // Handle home button - double click to refresh
  const handleHomeClick = () => {
    setHomeClickCount((prev) => prev + 1);

    // Clear existing timeout
    if (homeClickTimeoutRef.current) {
      clearTimeout(homeClickTimeoutRef.current);
    }

    // If this is the second tap within 800ms, refresh
    if (homeClickCount === 1) {
      // Double tap - refresh the page
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
      setHomeClickCount(0);
    } else {
      // Single tap - go to home
      router.push("/");
      setHomeClickCount(0);
      return;
    }

    // Reset counter after 800ms if only single tap
    homeClickTimeoutRef.current = setTimeout(() => {
      setHomeClickCount(0);
    }, 800);
  };

  // Handle search
  const handleSearchClick = () => {
    setShowSearchInput(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(`/?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      setShowSearchInput(false);
    }
  };

  const handleSearchClose = () => {
    setSearchValue("");
    setShowSearchInput(false);
  };

  const handleWhatsAppClick = () => {
    // Open WhatsApp - dapat disesuaikan dengan nomor tertentu
    const whatsappUrl = "https://wa.me/?text=Halo%20FastCare";
    window.open(whatsappUrl, "_blank");
  };

  // Close search input when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showSearchInput &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        // Check if click is not on the search button
        const target = e.target as HTMLElement;
        if (!target.closest("[data-search-button]")) {
          handleSearchClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchInput]);

  return (
    <>
      {/* Search Bar - Full width when active */}
      {showSearchInput && (
        <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border px-4 py-3 z-40 lg:hidden">
          <div className="flex gap-2 items-center">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari Layanan Medis Terdekat..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="flex-1 px-4 py-2 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={handleSearchClose}
              className="px-3 py-2 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 lg:hidden">
        <div className="flex items-center justify-around h-20">
          {/* Home */}
          <button
            onClick={handleHomeClick}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-primary transition-colors duration-200"
            title="Beranda (Dobel klik untuk refresh)"
          >
            <i className="fa-solid fa-home text-xl" />
            <span className="text-xs font-medium">Beranda</span>
          </button>

          {/* Search */}
          <button
            onClick={handleSearchClick}
            data-search-button
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-primary transition-colors duration-200"
            title="Cari"
          >
            <i className="fa-solid fa-magnifying-glass text-xl" />
            <span className="text-xs font-medium">Cari</span>
          </button>

          {/* Detect Nearest Location / Refresh */}
          <button
            onClick={handleLocationClick}
            disabled={isDetecting}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-primary transition-colors duration-200 disabled:opacity-50"
            title="Deteksi Lokasi Terdekat (Dobel klik untuk refresh)"
          >
            <i
              className={`fa-solid fa-location-crosshairs text-xl ${isDetecting ? "animate-spin" : ""}`}
            />
            <span className="text-xs font-medium">
              {isDetecting ? "Deteksi..." : "Lokasi"}
            </span>
          </button>

          {/* Chat / WhatsApp */}
          <button
            onClick={handleWhatsAppClick}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-primary transition-colors duration-200"
            title="Chat"
          >
            <i className="fa-solid fa-headset text-xl" />
            <span className="text-xs font-medium">Bantuan</span>
          </button>
        </div>
      </nav>

      {/* Spacer to prevent content overlap on mobile */}
      <div className="h-20 lg:hidden" />
    </>
  );
};

export default MobileBottomNav;
