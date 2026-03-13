"use client";

import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import HospitalGrid from "@/components/HospitalGrid";
import MobileSearch from "@/components/MobileSearch";
import WhatsAppFloat from "@/components/WhatsAppFloat";
export default function Home() {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <MobileSearch />
      <HospitalGrid />
      <WhatsAppFloat />
    </>
  );
}
