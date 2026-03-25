"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Tambahkan usePathname
import { INDONESIA_REGIONS, BantenCity } from "@/types";
import { toast } from "sonner";

const Navbar = () => {
  const {
    selectedCity,
    setSelectedCity,
    detectLocation,
    isAuthenticated,
    logout,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openProvinces, setOpenProvinces] = useState<Record<string, boolean>>(
    {},
  );

  const locationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname(); // Ambil route saat ini

  // Logic: Cek apakah halaman saat ini adalah hospital
  const isHospitalPage = pathname?.startsWith("/hospital");

  // Penentu apakah navbar harus tampil solid putih
  // Navbar jadi putih jika: sedang discroll ATAU berada di halaman hospital
  const shouldBeSolid = isScrolled || isHospitalPage;

  // ===============================
  // LOGIC: TOGGLE PROVINSI
  // ===============================
  const toggleProvince = (province: string) => {
    setOpenProvinces((prev) => ({
      ...prev,
      [province]: !prev[province],
    }));
  };

  // ===============================
  // LOGIC: DETEKSI SCROLL (PUTIH ABSOLUT)
  // ===============================
  useEffect(() => {
    const handleScroll = () => {
      // Berubah jadi putih setelah scroll 50px
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
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

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    try {
      await detectLocation();
      toast.success("Lokasi Terdeteksi");
      setIsLocationOpen(false);
    } catch (error) {
      console.error("Failed to detect location", error);
      toast.error(
        error instanceof Error && error.message === "Permission denied"
          ? "Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser."
          : "Gagal mendeteksi lokasi. Coba lagi.",
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const handleCitySelect = (city: BantenCity | "Semua") => {
    setSelectedCity(city);
    setIsLocationOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        shouldBeSolid
          ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-17 md:h-25">
          {/* Logo */}
          <div
            className="flex-shrink-0 mr-6 cursor-pointer"
            onClick={() => {
              if (shouldBeSolid && !isHospitalPage) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                router.push("/");
              }
            }}
          >
            <Image
              src="/logo_sigap.png"
              alt="FastCare.id"
              width={160}
              height={80}
              className={`h-14 md:h-20 w-auto object-contain transition-all duration-300 ${
                !shouldBeSolid ? "brightness-0 invert" : ""
              }`}
              priority
            />
          </div>

          {/* Desktop: Location & Search */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-3xl mx-6">
            {/* Location Dropdown */}
            <div className="relative" ref={locationRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/10 outline-none transition-colors min-w-[200px]"
              >
                <i className="fa-solid fa-globe text-primary" />
                <span className="text-sm text-foreground truncate flex-1 text-left">
                  {selectedCity === "Lokasi Terdekat"
                    ? "Lokasi Terdekat"
                    : selectedCity === "Semua"
                      ? "Semua Wilayah"
                      : selectedCity}
                </span>
                <i
                  className={`fa-solid fa-chevron-down text-primary transition-transform duration-500 ${
                    isLocationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isLocationOpen && (
                <div className="absolute top-full left-0 mt-3 bg-white rounded-xl border border-border shadow-lg z-50 py-2 animate-scale-in w-72">
                  {/* Detect Location */}
                  <button
                    onClick={handleDetectLocation}
                    disabled={isDetecting}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                  >
                    <i
                      className={`fa-solid ${
                        isDetecting ? "fa-spinner fa-spin" : "fa-street-view"
                      } text-primary w-5`}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Temukan Lokasi Terdekat
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Deteksi lokasi perangkat
                      </p>
                    </div>
                  </button>

                  <div className="border-t border-border my-2" />

                  {/* All Regions */}
                  <button
                    onClick={() => handleCitySelect("Semua")}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-accent transition-colors text-left ${
                      selectedCity === "Semua" ? "bg-accent" : ""
                    }`}
                  >
                    <span className="text-sm text-foreground">
                      Semua Wilayah
                    </span>
                  </button>

                  <div className="border-t border-border my-2" />

                  {/* Cities Grouped */}
                  <div className="max-h-60 overflow-y-auto scrollbar-hide">
                    {Object.entries(INDONESIA_REGIONS).map(
                      ([province, cities]) => {
                        const isOpen = openProvinces[province];
                        return (
                          <div key={province}>
                            <button
                              onClick={() => toggleProvince(province)}
                              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-muted-foreground uppercase hover:bg-accent transition-colors"
                            >
                              <span>{province.replaceAll("_", " ")}</span>
                              <i
                                className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                              />
                            </button>

                            {isOpen && (
                              <div className="bg-slate-50/50">
                                {cities.map((city) => (
                                  <button
                                    key={city}
                                    onClick={() => handleCitySelect(city)}
                                    className={`w-full flex items-center space-x-3 px-6 py-2.5 hover:bg-accent transition-colors text-left ${
                                      selectedCity === city
                                        ? "bg-accent text-primary font-medium"
                                        : ""
                                    }`}
                                  >
                                    <span className="text-sm text-foreground">
                                      {city}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Layanan medis Terdekat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-primary/10 outline-none text-sm"
              />
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/admin"
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                    shouldBeSolid
                      ? "text-primary hover:text-primary/80"
                      : "text-white hover:text-white/90"
                  }`}
                >
                  <i className="fa-solid fa-sliders"></i>
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className={`text-sm font-medium transition-colors ${
                    shouldBeSolid
                      ? "text-primary hover:text-primary/80 cursor-pointer"
                      : "text-white hover:text-white/90 cursor-pointer"
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 px-5 py-2.5 text-xl font-semibold transition-colors ${
                  shouldBeSolid
                    ? "text-muted-foreground hover:text-primary"
                    : "text-white hover:text-white/80"
                }`}
              >
                <i className="fa-regular fa-user"></i>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 relative w-10 h-10 flex items-center justify-center"
          >
            <div className="relative w-6 h-4">
              <span
                className={`absolute w-full h-1 rounded transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 top-1.5" : "top-0"
                } ${shouldBeSolid || isMobileMenuOpen ? "bg-white" : "bg-white"}`}
              />
              <span
                className={`absolute w-full h-1 rounded transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 top-1.5" : "top-3"
                } ${shouldBeSolid || isMobileMenuOpen ? "bg-white" : "bg-white"}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-in scrollbar-hide bg-none">
            <div className="pt-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 bg-primary text-primary-foreground rounded-lg"
                  >
                    <i className="fa-solid fa-sliders"></i>
                    <span className="font-medium">Dashboard Admin</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-secondary rounded-lg"
                  >
                    <i className="fa-solid fa-right-from-bracket" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg font-medium"
                >
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
