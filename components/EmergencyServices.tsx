"use client";

import React, { useState, useEffect } from "react";

const emergencyServices = [
  { icon: "fa-solid fa-truck-medical", label: "Ambulan", number: "119" },
  { icon: "fa-solid fa-heart-crack", label: "Sejiwa", number: "119 ext 8" },
  { icon: "fa-solid fa-triangle-exclamation", label: "Darurat", number: "112" },
  { icon: "fa-solid fa-person-shelter", label: "PPA", number: "129" },
  { icon: "fa-solid fa-building-shield", label: "Polisi", number: "110" },
  { icon: "fa-solid fa-fire-extinguisher", label: "Damkar", number: "113" },
  { icon: "fa-solid fa-road", label: "Jasa Marga", number: "14080" },
  { icon: "fa-solid fa-bolt", label: "PLN", number: "123" },
  { icon: "fa-solid fa-life-ring", label: "SAR/Basarnas", number: "115" },
  { icon: "fa-solid fa-headset", label: "Halo Kemenkes", number: "1500567" },
];

const EmergencyServices = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Timer untuk menyembunyikan tooltip setelah 3 detik
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

return (
  <section className="bg-white py-8 pb-1 md:py-12 border-t border-gray-100">
    <div className="container mx-auto px-4">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-[12px] md:text-[15px] font-bold text-gray-500 uppercase tracking-widest">
          Nomor Layanan Darurat
        </span>
      </div>

      {/* Wrapper untuk Grid/Scroll */}
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
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <i className={`${service.icon} text-primary text-xl`} />
              </div>

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

      {/* Teks Petunjuk (Sekarang di bawah Tombol) */}
      <div
        className={`md:hidden mt-4 flex justify-end transition-opacity duration-1000 ${
          showTooltip ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <span className="text-[10px] text-gray-400 italic flex items-center gap-1.5">
          <i className="fa-solid fa-arrow-right-long animate-pulse" />
          geser untuk melihat nomor darurat lainnya
        </span>
      </div>
    </div>
  </section>
);
};

export default EmergencyServices;
