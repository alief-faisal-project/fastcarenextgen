"use client";

import React from "react";

const emergencyServices = [
  { icon: "fa-solid fa-truck-medical", label: "Ambulan", number: "119" },
  { icon: "fa-solid fa-heart-crack", label: "Sejiwa", number: "119 ext 8" },
  { icon: "fa-solid fa-triangle-exclamation", label: "Darurat", number: "112" },
  { icon: "fa-solid fa-person-shelter", label: "PPA", number: "129" },
  { icon: "fa-solid fa-building-shield", label: "Polisi", number: "110" },
  { icon: "fa-solid fa-fire-extinguisher", label: "Damkar", number: "113" },
  { icon: "fa-solid fa-road", label: "Jasa Marga", number: "14080" },
  { icon: "fa-solid fa-bolt", label: "PLN", number: "123" },
];

const EmergencyServices = () => {
  return (
    // Section utama dengan background PUTIH penuh
    <section className="bg-white py-8 md:py-12 border-t border-gray-100">
      <div className="container mx-auto px-4">

        {/* Wrapper untuk Grid/Scroll */}
        {/* Mobile: Scroll ke samping (justify-start) */}
        {/* Desktop (md+): Rata Tengah (justify-center) & No Scroll */}
        <div
          className="flex md:flex-wrap gap-4 overflow-x-auto md:overflow-visible justify-start md:justify-center pb-4 md:pb-0 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {emergencyServices.map((service, index) => (
            <div key={index} className="flex-shrink-0">
              <a
                href={`tel:${service.number.replace(/\s/g, "")}`}
                className="flex flex-col items-center justify-between 
                           w-[95px] h-[115px] md:w-[105px] md:h-[125px] 
                           bg-white rounded-3xl border border-gray-100 
                           shadow-sm hover:shadow-lg hover:-translate-y-1 
                           transition-all duration-300 p-3"
              >
                {/* Ikon dengan Background Lingkaran Biru Muda (Soft Blue) */}
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <i className={`${service.icon} text-primary text-xl`} />
                </div>

                {/* Container Teks (Label & Nomor) */}
                <div className="flex flex-col items-center text-center mt-auto w-full">
                  <span className="text-[10px] md:text-[11px] font-medium text-gray-700 leading-tight line-clamp-2">
                    {service.label}
                  </span>
                  <span className="text-[11px] md:text-[12px] font-bold text-primary mt-1">
                    {service.number}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmergencyServices;
