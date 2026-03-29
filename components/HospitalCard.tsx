"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Hospital } from "@/types";

interface HospitalCardProps {
  readonly hospital: Hospital;
}

const HospitalCard = ({ hospital }: HospitalCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Get gallery images with fallback to main image
  const galleryImages =
    hospital.gallery && hospital.gallery.length > 0
      ? hospital.gallery
      : [hospital.image];

  const hasMultipleImages = galleryImages.length > 1;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setTouchStart(e.targetTouches[0]?.clientX ?? 0);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setTouchEnd(e.changedTouches[0]?.clientX ?? 0);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) =>
        prev === galleryImages.length - 1 ? 0 : prev + 1,
      );
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? galleryImages.length - 1 : prev - 1,
      );
    }
  };

  const handleDotClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <Link
      href={`/hospital/${hospital.id}`}
      prefetch={true}
      className="
        bg-card
        rounded-lg
        overflow-hidden
        border border-border shadow-sm
        h-full
        flex flex-col
      "
    >
      {/* Image with Gallery Support */}
      <div
        className="relative aspect-16/10 overflow-hidden shrink-0 group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={galleryImages[currentImageIndex]}
          alt={hospital.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300"
        />

        {/* Distance Badge */}
        {typeof hospital.distance === "number" && (
          <div className="absolute top-2 right-2 z-10">
            <span
              className="
              px-2 py-0.5
              bg-white/95
              text-foreground
              text-[10px]
              font-medium
              shadow-sm
              flex items-center gap-2
              rounded
            "
            >
              <i className="fa-solid fa-location-arrow text-primary text-[8px]" />
              <span className="whitespace-nowrap">
                {hospital.distance.toFixed(1)} km
              </span>
            </span>
          </div>
        )}

        {/* Gallery Navigation Arrows - Desktop Only, when multiple images */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImageIndex((prev) =>
                  prev === 0 ? galleryImages.length - 1 : prev - 1,
                );
              }}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white text-black rounded-full w-8 h-8 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex"
              aria-label="Previous image"
              title="Gambar Sebelumnya"
            >
              <i className="fa-solid fa-chevron-left text-sm" />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImageIndex((prev) =>
                  prev === galleryImages.length - 1 ? 0 : prev + 1,
                );
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-white/60 hover:bg-white text-black rounded-full w-8 h-8 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex"
              aria-label="Next image"
              title="Gambar Berikutnya"
            >
              <i className="fa-solid fa-chevron-right text-sm" />
            </button>
          </>
        )}

        {/* Gallery Dots - Mobile and Desktop */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
            {galleryImages.map((img, index) => (
              <button
                key={img}
                onClick={(e) => handleDotClick(e, index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-white w-3"
                    : "bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* IGD Badge Landing Page */}
      <div className="relative -mt-1 -ml-1 h-5.5 shrink-0">
        <span
          className={`inline-block px-4 py-1 text-[10px] font-bold text-white ${
            hospital.hasIGD ? "bg-red-600" : "bg-yellow-500"
          }`}
          style={{ transform: "skewX(-15deg)" }}
        >
          <span style={{ display: "inline-block", transform: "skewX(15deg)" }}>
            {hospital.hasIGD ? "IGD 24 Jam" : "UGD Terbatas"}
          </span>
        </span>
      </div>

      {/* Content */}
      <div
        className="
        p-3
        flex flex-col
        flex-1
      "
      >
        {/* Type */}
        <div className="mb-1 shrink-0">
          <span className="text-[10px] font-medium text-muted-foreground">
            {hospital.type}
          </span>
        </div>

        {/* Name */}
        <h3
          className="
          font-bold
          text-foreground
          text-sm
          mb-1
          line-clamp-2
          min-h-10
          font-heading
          sm:line-clamp-1
          sm:min-h-0
        "
        >
          {hospital.name}
        </h3>

        {/* Location */}
        <p
          className="
          text-xs
          text-muted-foreground
          mb-3
          flex items-center gap-1
          shrink-0
        "
        >
          <i className="fa-solid fa-location-dot text-[10px]" />
          {hospital.city}
        </p>

        <div className="flex-1" />

        {/* Quick Info */}
        <div
          className="
    flex items-center gap-2 sm:gap-3 
    text-[10px] 
    text-muted-foreground 
    shrink-0 
    whitespace-nowrap 
    overflow-hidden
  "
        >
          <span className="flex items-center gap-1 shrink-0">
            <i className="fa-solid fa-bed" />
            {hospital.totalBeds}+ Kamar
          </span>

          {hospital.hasICU && (
            <span className="flex items-center gap-1 shrink-0">
              <i className="fa-solid fa-heart-pulse" /> ICU
            </span>
          )}

          <span className="flex items-center gap-1 shrink-0">
            Kelas {hospital.class}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HospitalCard;
