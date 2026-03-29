"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

let hasLoaded = false; // GLOBAL FLAG (penting)

export default function LoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(hasLoaded);

  useEffect(() => {
    // Kalau sudah pernah load, langsung skip
    if (hasLoaded) return;

    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // simulasi
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        hasLoaded = true; // tandai sudah pernah load
        setIsReady(true);
      }
    };

    fetchData();
  }, []);

  // Saat loading pertama
  if (!isReady) {
    return <LoadingScreen onLoadComplete={() => setIsReady(true)} />;
  }

  // Setelah ready
  return (
    <div className="opacity-100 transition-opacity duration-500">
      {children}
    </div>
  );
}
