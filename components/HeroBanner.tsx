"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";

const HeroBanner = () => {
  const { heroBanners } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);

  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  const activeBanners = heroBanners
    .filter((b) => b.isActive)
    .sort((a, b) => a.order - b.order);

  const maxDesktopSlide =
    activeBanners.length > 3 ? activeBanners.length - 3 : 0;

  const goToPrevious = () => {
    if (currentSlide === 0) return;
    setCurrentSlide((prev) => prev - 1);
  };

  const goToNext = () => {
    if (currentSlide >= maxDesktopSlide) return;
    setCurrentSlide((prev) => prev + 1);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || dragStartXRef.current === null) return;
    dragDeltaRef.current = e.clientX - dragStartXRef.current;
  };

  const onPointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const delta = dragDeltaRef.current;
    if (delta > 40) goToPrevious();
    else if (delta < -40) goToNext();
    dragStartXRef.current = null;
    dragDeltaRef.current = 0;
  };

  // Logic Deteksi Index Mobile saat scroll
  useEffect(() => {
    const container = mobileRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth * 0.85; // Sesuai w-[85%]
      const newIndex = Math.round(scrollLeft / width);
      setMobileActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeBanners.length]);

  return (
    <section className="relative pt-20 md:pt-32 pb-4 overflow-hidden">
      {/* BACKGROUND GRADASI */}
      <div
        className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #00078F 0%, rgba(0, 7, 143, 0.4) 60%, rgba(255, 255, 255, 0) 100%)",
        }}
      />

      {/* DESKTOP ONLY WAVES */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <svg
          className="absolute top-[-120px] w-full h-[600px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#00078F"
            fillOpacity="0.1"
            d="M0,0 L1440,0 L1440,160 C1360,112,1280,128,1120,160 C960,192,800,224,640,256 C480,250.7,320,245,160,203 L80,181.3 L0,160 Z"
          />
        </svg>

        <svg
          className="absolute top-[-100px] w-full h-[650px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#00078F"
            fillOpacity="0.15"
            d="M0,0 L1440,0 L1440,96 L1380,122.7 C1320,149,1200,203,1080,218.7 C960,235,840,213,720,186.7 C600,160,480,128,360,133.3 C240,139,120,181,60,202.7 L0,224 Z"
          />
        </svg>
      </div>

      <div className="relative z-10">
        {/* ================= DESKTOP ================= */}
        {activeBanners.length > 0 && (
          <div className="hidden md:block container mx-auto px-4 mt-4">
            <div className="relative">
              <div className="relative overflow-hidden">
                <div
                  ref={desktopTrackRef}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  className="flex gap-4 transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * (100 / 3)}%)`,
                  }}
                >
                  {activeBanners.map((banner) => (
                    <a
                      key={banner.id}
                      href={banner.link || "#"}
                      className="flex-shrink-0 w-[calc(33.333%-11px)] rounded-3xl overflow-hidden relative shadow-xl"
                    >
                      <div className="aspect-[2/1] relative">
                        <Image
                          src={banner.image}
                          alt={banner.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </a>
                  ))}
                </div>
                {activeBanners.length > 3 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      disabled={currentSlide === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-40 transition-all hover:bg-slate-50"
                    >
                      <i className="fa-solid fa-chevron-left text-lg text-[#00078F]" />
                    </button>
                    <button
                      onClick={goToNext}
                      disabled={currentSlide === maxDesktopSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-40 transition-all hover:bg-slate-50"
                    >
                      <i className="fa-solid fa-chevron-right text-lg text-[#00078F]" />
                    </button>
                  </>
                )}
              </div>

              {/* DESKTOP INDICATOR (Pill Active, Circle Inactive) */}
              {activeBanners.length > 3 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: maxDesktopSlide + 1 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentSlide === idx
                          ? "w-8 bg-primary shadow-sm"
                          : "w-2 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MOBILE ================= */}
        {activeBanners.length > 0 && (
          <div className="md:hidden px-4 pt-1">
            <div
              ref={mobileRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            >
              {activeBanners.map((banner) => (
                <a
                  key={banner.id}
                  href={banner.link || "#"}
                  className="flex-shrink-0 w-[85%] rounded-2xl overflow-hidden relative shadow-lg snap-center"
                >
                  <div className="aspect-[2/1] relative">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </a>
              ))}
            </div>

            {/* MOBILE INDICATOR (Pill Active, Circle Inactive) */}
            {activeBanners.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-5">
                {activeBanners.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      mobileActiveIndex === idx
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
