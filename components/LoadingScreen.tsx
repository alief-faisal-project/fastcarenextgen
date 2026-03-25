"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LoadingScreen = ({ onLoadComplete }: { onLoadComplete?: () => void }) => {
  const [step, setStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animasi sekuensial: Munculkan potongan 1 sampai 4
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          // Tunggu sebentar setelah puzzle lengkap, lalu fade out seluruh layar
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => onLoadComplete?.(), 600);
          }, 800);
          return 4;
        }
        return prev + 1;
      });
    }, 300); // Kecepatan muncul antar potongan (500ms)

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  // Definisi potongan puzzle menggunakan clip-path (Atas-Kiri, Atas-Kanan, Bawah-Kiri, Bawah-Kanan)
  const clips = [
    "inset(0 50% 50% 0)", // Top Left
    "inset(0 0 50% 50%)", // Top Right
    "inset(50% 50% 0 0)", // Bottom Left
    "inset(50% 0 0 50%)", // Bottom Right
  ];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-all duration-700 ${
        fadeOut ? "opacity-0 scale-95" : "opacity-100"
      }`}
    >
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        {clips.map((clipPath, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              step > index
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-4 scale-110"
            }`}
            style={{
              clipPath: clipPath,
              // Memberi sedikit jeda halus antar transisi
              transitionDelay: `${index * 50}ms`,
            }}
          >
            <Image
              src="/logo_sigap.png"
              alt="SIGAP Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
