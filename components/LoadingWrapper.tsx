"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

export default function LoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulasi pengambilan data API nyata (misal: config, user profile, dll)
    const fetchData = async () => {
      try {
        // Contoh: await fetch('/api/config');
        // Atau: await Promise.all([data1, data2]);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulasi network delay
        setIsReady(true);
      } catch (error) {
        console.error("Gagal memuat data:", error);
        setIsReady(true); // Tetap masuk agar user tidak terjebak di loading screen
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {!isReady && <LoadingScreen />}
      <div
        className={
          !isReady
            ? "opacity-0 hidden"
            : "opacity-100 transition-opacity duration-500"
        }
      >
        {children}
      </div>
    </>
  );
}
