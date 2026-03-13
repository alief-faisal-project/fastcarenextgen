"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1200);

    // Logic deteksi footer untuk mengubah warna icon chevron
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverFooter(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    const footer =
      document.querySelector("footer") ||
      document.querySelector(".footer") ||
      document.querySelector("#footer");
    if (footer) observer.observe(footer);

    return () => {
      clearTimeout(timer);
      if (footer) observer.unobserve(footer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      /* PERUBAHAN DI SINI: bottom-[-42px] memastikan bar benar-benar sembunyi */
      className={`fixed right-3 z-[9999] hidden md:block transition-all duration-500 ease-in-out ${
        isMinimized ? "bottom-[-42px]" : "bottom-0"
      }`}
    >
      <div className="relative">
        {/* Tombol Toggle Chevron Bulat Merah */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -top-7 -right-2 w-6 h-6 bg-gray-500/50 rounded-full flex items-center justify-center 
                     shadow-md hover:bg-gray-600 transition-all duration-300 z-10 border-none outline-none"
          title={isMinimized ? "Tampilkan" : "Sembunyikan"}
        >
          <FontAwesomeIcon
            icon={isMinimized ? faChevronUp : faChevronDown}
            /* Warna icon reflektif: Putih saat di footer, Hitam saat di layout lain */
            className={`text-[20px] transition-colors duration-300 ${
              isOverFooter ? "text-white" : "text-white"
            }`}
          />
        </button>

        {/* Link WhatsApp */}
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-green-600 hover:bg-green-500 
                     text-white rounded-tl-lg shadow-xl overflow-hidden
                     transition-all duration-300 border-t border-l border-green-400/20"
        >
          {/* Text Content */}
          <span className="px-4 py-2 text-sm font-medium whitespace-nowrap">
            Butuh Bantuan? Hubungi Kami!
          </span>

          {/* WhatsApp Icon Wrapper */}
          <div className="flex items-center justify-center bg-green-500 w-12 h-10">
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="text-white text-2xl"
            />
          </div>
        </a>
      </div>
    </div>
  );
}
