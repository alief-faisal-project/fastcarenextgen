"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { sanitizeInput } from "@/lib/security";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import HospitalImageGallery from "@/components/HospitalImageGallery";
import MobileBottomNav from "@/components/MobileBottomNav";

const HospitalDetail = () => {
  const params = useParams();
  const { getHospitalById } = useApp();

  const id = useMemo(() => params?.id as string, [params]);

  const hospital = useMemo(() => {
    if (!id) return null;
    return getHospitalById(id);
  }, [id, getHospitalById]);

  // Get gallery images
  const getGalleryImages = () => {
    if (!hospital) return [];
    if (hospital.gallery && hospital.gallery.length > 0) {
      return hospital.gallery;
    }
    return [hospital.image];
  };
  const galleryImages = getGalleryImages();

  if (!hospital) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="fa-solid fa-hospital text-6xl text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Rumah Sakit Tidak Ditemukan
            </h1>
            <p className="text-muted-foreground mb-6">
              Data rumah sakit yang Anda cari tidak tersedia.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const directionsUrl =
    hospital.latitude && hospital.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`
      : hospital.googleMapsLink ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          hospital.name + " " + hospital.address,
        )}`;

  // Determine ownership type based on hospital name
  const getOwnership = () => {
    if (hospital.name.includes("RSUD") || hospital.name.includes("RSU ")) {
      return "Pemerintah";
    }
    return "Swasta";
  };

  const phoneNumber = (hospital.phone || "").replaceAll(/\s+/g, "");

  return (
    <div className="min-h-screen flex flex-col bg-background pt-8 lg:pt-20">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 pb-12">
        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info (Desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <HospitalImageGallery
              images={galleryImages}
              hospitalName={hospital.name}
              hasIGD={hospital.hasIGD}
            />

            {/* Hospital Name - Below Gallery (Desktop) */}
            <div>
              <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
                {hospital.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <i className="fa-solid fa-location-dot" />
                <p>
                  {hospital.address}, {hospital.city}
                </p>
              </div>
            </div>

            {/* Facilities & Services */}
            <div className="bg-card border border-border p-6 rounded-3xl">
              <h2 className="text-lg font-semibold text-foreground mb-4 font-heading flex items-center gap-2">
                <i className="fa-solid fa-stethoscope" />
                <span>Fasilitas & Layanan</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(hospital.facilities ?? []).map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-accent/50"
                  >
                    <i className="fa-solid fa-circle-check text-primary" />
                    <span className="text-sm text-foreground">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description - Desktop (Below Facilities) */}
            {hospital.description && (
              <div className="bg-card border border-border p-6 rounded-3xl">
                <h2 className="text-lg font-semibold text-foreground mb-4 font-heading flex items-center gap-2">
                  <i className="fa-solid fa-align-left" />
                  <span>Deskripsi</span>
                </h2>
                <p className="text-foreground leading-relaxed text-justify">
                  {hospital.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar (Desktop) */}
          <div className="space-y-6">
            {/* Information */}
            <div className="bg-card border border-border p-6 rounded-3xl">
              <h3 className="text-lg font-semibold text-foreground mb-4 font-heading flex items-center gap-2">
                <i className="fa-solid fa-circle-info" />
                <span>Informasi</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Kelas RS
                  </span>
                  <span className="font-medium text-primary">
                    Tipe {hospital.class}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Total Kamar
                  </span>
                  <span className="font-medium text-primary">
                    {hospital.totalBeds}+
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Kota</span>
                  <span className="font-medium text-primary">
                    {hospital.city}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Kepemilikan
                  </span>
                  <span className="font-medium text-primary">
                    {getOwnership()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">
                    IGD 24 Jam
                  </span>
                  <span
                    className={`font-medium ${hospital.hasIGD ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {hospital.hasIGD ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="bg-card border border-border p-3 rounded-3xl">
              <div className="flex flex-col gap-3 w-full">
                {/* Phone Button */}
                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full h-14 flex items-center justify-center gap-3 rounded-3xl bg-secondary text-primary text-sm font-medium transition-colors hover:bg-secondary/60 border"
                >
                  <i className="fa-solid fa-phone-volume w-5 text-base text-center" />
                  <span className="text-center leading-none">Telepon</span>
                </a>

                {/* Maps Button */}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-14 flex items-center justify-center gap-3 rounded-3xl bg-secondary text-primary text-sm font-medium transition-colors hover:bg-secondary/60 border"
                >
                  <i className="fa-solid fa-location-arrow w-5 text-base text-center" />
                  <span className="text-center leading-none">Peta Lokasi</span>
                </a>

                {/* Email */}
                {hospital.email && (
                  <a
                    href={`mailto:${sanitizeInput(hospital.email)}`}
                    className="w-full h-14 flex items-center justify-center gap-3 rounded-3xl bg-card text-foreground border border-border font-semibold text-sm transition-colors duration-300 hover:bg-secondary/10"
                  >
                    <i className="fa-solid fa-envelope w-5 text-base text-center" />
                    <span className="text-center leading-none">Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* MOBILE LAYOUT */}
        <div className="lg:hidden space-y-4">
          {/* Image Gallery - with hospital name overlay for mobile */}
          <HospitalImageGallery
            images={galleryImages}
            hospitalName={hospital.name}
            hasIGD={hospital.hasIGD}
            showNameOnMobile={true}
          />

          {/* Action Buttons (Mobile) */}
          <div className="bg-card border border-border p-3 rounded-3xl">
            <div className="flex gap-3">
              {/* Maps Button */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-12 flex items-center justify-center gap-2 rounded-3xl bg-secondary text-primary text-sm font-medium transition-colors hover:bg-secondary/60"
              >
                <i className="fa-solid fa-location-arrow text-base" />
                <span className="text-center leading-none">Peta</span>
              </a>

              {/* Phone Button */}
              <a
                href={`tel:${phoneNumber}`}
                className="flex-1 h-12 flex items-center justify-center gap-2 rounded-3xl bg-secondary text-primary text-sm font-medium transition-colors hover:bg-secondary/60"
              >
                <i className="fa-solid fa-phone-volume text-base" />
                <span className="text-center leading-none">Telepon</span>
              </a>
            </div>
          </div>

          {/* Facilities & Services */}
          <div className="bg-card border border-border p-6 rounded-3xl">
            <h2 className="text-lg font-semibold text-foreground mb-4 font-heading flex items-center gap-2">
              <i className="fa-solid fa-stethoscope" />
              <span>Fasilitas & Layanan</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(hospital.facilities ?? []).map((facility) => (
                <div
                  key={facility}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-accent/50"
                >
                  <i className="fa-solid fa-circle-check text-primary" />
                  <span className="text-sm text-foreground">{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Information (full width on mobile) */}
          <div className="space-y-6">
            <div className="bg-card border border-border p-4 rounded-2xl">
              <h3 className="text-base font-semibold text-foreground mb-3 font-heading flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-primary" />
                <span>Informasi</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Kelas RS
                  </span>
                  <span className="font-medium text-primary text-sm">
                    Tipe {hospital.class}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Total Kamar
                  </span>
                  <span className="font-medium text-primary text-sm">
                    {hospital.totalBeds}+
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Kota</span>
                  <span className="font-medium text-primary text-sm">
                    {hospital.city}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">
                    Kepemilikan
                  </span>
                  <span className="font-medium text-primary text-sm">
                    {getOwnership()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">
                    IGD 24 Jam
                  </span>
                  <span
                    className={`font-medium text-sm ${
                      hospital.hasIGD ? "text-red-600" : "text-muted-foreground"
                    }`}
                  >
                    {hospital.hasIGD ? "Tersedia" : "Tidak Tersedia"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description - Mobile (Below Everything) */}
          {hospital.description && (
            <div className="bg-card border border-border p-6 rounded-3xl">
              <h2 className="text-lg font-semibold text-foreground mb-4 font-heading flex items-center gap-2">
                <i className="fa-solid fa-align-left" />
                <span>Deskripsi</span>
              </h2>
              <p className="text-foreground leading-relaxed text-sm text-justify">
                {hospital.description}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default HospitalDetail;
