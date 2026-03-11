"use client";

import { useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function LoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  const handleComplete = () => {
    setIsLoaded(true);
    // Hapus LoadingScreen dari DOM setelah animasi fade selesai
    setTimeout(() => setShouldHide(true), 500);
  };

  return (
    <>
      {!shouldHide && <LoadingScreen onLoadComplete={handleComplete} />}

      {/* Gunakan opacity agar konten sudah ter-render di latar belakang */}
      <div
        className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </>
  );
}
