"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface HospitalImageGalleryProps {
  readonly images: string[];
  readonly hospitalName: string;
  readonly hasIGD?: boolean;
  readonly showNameOnMobile?: boolean;
}

export default function HospitalImageGallery({
  images,
  hospitalName,
  hasIGD,
  showNameOnMobile = false,
}: Readonly<HospitalImageGalleryProps>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out empty images and ensure we have at least one
  const validImages = images.filter((img) => img && img.trim() !== "");
  const displayImages = validImages.length > 0 ? validImages : [""];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0]?.clientX ?? 0);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.changedTouches[0]?.clientX ?? 0);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Show nothing if no valid images
  if (displayImages.length === 0 || !displayImages[0]) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative aspect-video overflow-hidden rounded-3xl bg-gray-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={displayImages[currentImageIndex]}
          alt={`${hospitalName} - Image ${currentImageIndex + 1}`}
          fill
          sizes="(max-width:768px) 100vw, 66vw"
          className="object-cover transition-opacity duration-500"
          priority={currentImageIndex === 0}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* IGD Badge */}
        {hasIGD && (
          <div className="absolute top-0 right-0 z-10">
            <span className="flex flex-col items-center justify-center bg-red-600 text-white px-3 py-3 rounded-bl-xl shadow-md text-center leading-tight">
              <span className="text-[20px] font-bold">TERSEDIA IGD 24 JAM</span>
            </span>
          </div>
        )}

        {/* Desktop Navigation Arrows - Only show if multiple images */}
        {displayImages.length > 1 && !isMobile && (
          <>
            {/* Left Arrow */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-black rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Previous image"
              title="Gambar Sebelumnya"
            >
              <i className="fa-solid fa-chevron-left text-lg" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-black rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Next image"
              title="Gambar Berikutnya"
            >
              <i className="fa-solid fa-chevron-right text-lg" />
            </button>
          </>
        )}

        {/* Swipe Gesture Indicator for Mobile */}
        {displayImages.length > 1 && isMobile && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white/60 text-center">
              <i className="fa-solid fa-hand-open text-2xl mb-2 block" />
              <span className="text-xs">Geser untuk gambar lain</span>
            </div>
          </div>
        )}

        {/* Hospital Name Overlay - Mobile Only (Bottom Left) */}
        {showNameOnMobile && isMobile && (
          <div className="absolute bottom-4 left-4 z-10 max-w-xs">
            <h2 className="text-lg font-bold text-white line-clamp-2">
              {hospitalName}
            </h2>
          </div>
        )}
      </div>

      {/* Dot Indicators - Always shown if multiple images */}
      {displayImages.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {displayImages.map((img, index) => (
            <button
              key={img}
              onClick={() => goToImage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-primary w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${index + 1}`}
              title={`Gambar ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
