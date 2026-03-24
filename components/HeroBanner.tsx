"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";

const HeroBanner = () => {
  const { heroBanners } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const mobileRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const desktopIndicatorRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const container = mobileRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;
    const updateIndicator = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const progress = maxScroll > 0 ? container.scrollLeft / maxScroll : 0;
      indicator.style.transform = `translate3d(${progress * (64 - 16)}px,0,0)`;
    };
    container.addEventListener("scroll", updateIndicator, { passive: true });
    return () => container.removeEventListener("scroll", updateIndicator);
  }, [activeBanners.length]);

  useEffect(() => {
    const indicator = desktopIndicatorRef.current;
    if (!indicator) return;
    const progress = maxDesktopSlide > 0 ? currentSlide / maxDesktopSlide : 0;
    indicator.style.transform = `translate3d(${progress * (64 - 28)}px,0,0)`;
  }, [currentSlide, maxDesktopSlide]);

  return (
    // pt-20/pt-32 dipertahankan agar konten tidak tertutup fixed navbar
    <section className="relative pt-20 md:pt-32 pb-4 overflow-hidden">
      {/* BACKGROUND GRADASI NAVY PEKAT (#00078F) -> TRANSPARENT */}
      <div
        className=" absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #00078F 0%, rgba(0, 7, 143, 0.4) 60%, rgba(255, 255, 255, 0) 100%)",
        }}
      />

      {/* DESKTOP ONLY WAVES */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        {/* Wave belakang - Navy Soft */}
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

        {/* Wave depan - Navy Dongker Pekat Halus */}
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
                      className="flex-shrink-0 w-[calc(33.333%-11px)] rounded-3xl overflow-hidden relative shadow-xl transition-transform hover:scale-[1.02]"
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
              {/* DESKTOP INDICATOR (Pill/Scroll Style) */}
              {activeBanners.length > 1 && (
                <div className="flex items-center justify-center mt-6">
                  <div className="relative w-16 h-4 rounded-full bg-card overflow-hidden border border-white/10">
                    <div
                      ref={desktopIndicatorRef}
                      className="absolute top-0 left-0 h-full w-7 rounded-full bg-primary will-change-transform shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MOBILE (Clean Gradasi, No Wave) ================= */}
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
            {/* MOBILE INDICATOR (Hapus Celah Putih dengan pt-1, pertahankan w-12/bg-white/30) */}
            {activeBanners.length > 1 && (
              <div className="flex items-center justify-center mt-4">
                <div className="relative w-12 h-2 rounded-full bg-card overflow-hidden">
                  <div
                    ref={indicatorRef}
                    className="absolute top-0 left-0 h-full w-4 rounded-full bg-primary will-change-transform"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
