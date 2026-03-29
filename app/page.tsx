"use client";

import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import EmergencyServices from "@/components/EmergencyServices";
import HospitalGrid from "@/components/HospitalGrid";
import MobileSearch from "@/components/MobileSearch";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <EmergencyServices />
      <MobileSearch />
      <HospitalGrid />
      <WhatsAppFloat />
      <MobileBottomNav />
    </>
  );
}
