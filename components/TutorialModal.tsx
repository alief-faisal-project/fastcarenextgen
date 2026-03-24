"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface TutorialModalProps {
  image1: string;
  image2: string;
}

const TutorialModal = ({ image1, image2 }: TutorialModalProps) => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!pathname) return;

    if (pathname !== "/") {
      setIsOpen(false);
      return;
    }

    // Ambil waktu terakhir modal ditampilkan dari localStorage
    const lastShown = localStorage.getItem("tutorial_last_shown");
    const now = Date.now();

    if (!lastShown) {
      // Jika belum pernah ditampilkan, tampilkan modal
      setIsOpen(true);
      setStep(1);
      localStorage.setItem("tutorial_last_shown", now.toString());
    } else {
      const lastShownTime = parseInt(lastShown, 10);
      const diff = now - lastShownTime;

      // 24 jam = 86400000 ms
      if (diff >= 86400000) {
        setIsOpen(true);
        setStep(1);
        localStorage.setItem("tutorial_last_shown", now.toString());
      }
    }
  }, [pathname]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-xl text-center">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        {step === 1 && (
          <>
            <h2 className="text-base sm:text-lg font-semibold mb-3">
              Selamat Datang di Sigap
            </h2>

            <Image
              src={image1}
              alt="Tutorial Step 1"
              width={500}
              height={300}
              className="w-full rounded-lg mb-3"
            />

            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Temukan pertolongan medis terdekat dari lokasi anda.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-base sm:text-lg font-semibold mb-3">
              Fitur Deteksi Lokasi Perangkat
            </h2>

            <Image
              src={image2}
              alt="Tutorial Step 2"
              width={500}
              height={300}
              className="w-full rounded-lg mb-3"
            />

            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Fitur deteksi lokasi untuk mengetahui jarak Anda dengan rumah
              sakit atau klinik terdekat secara real-time.
            </p>
          </>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-primary text-white py-2 rounded-lg text-sm sm:text-base transition"
        >
          {step === 1 ? "Lanjut" : "Mulai Sekarang"}
        </button>
      </div>
    </div>
  );
};

export default TutorialModal;
