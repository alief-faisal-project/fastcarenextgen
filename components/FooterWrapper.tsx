"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Logic: Jangan tampilkan footer jika berada di route hospital detail
  // Contoh path: /hospital/123 atau /hospital/abc
  const isHospitalDetail = pathname?.includes("/hospital/");

  if (isHospitalDetail) return null;

  return <Footer />;
}
