"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 right-2 z-[9999] hidden md:block">
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-[#25D366] hover:bg-[#1ebe5d] 
                   text-white rounded-tr-lg shadow-xl overflow-hidden
                   transition-all duration-300"
      >
        {/* Text */}
        <span className="px-4 py-3 text-sm font-medium whitespace-nowrap">
          Butuh Bantuan? Hubungi Kami!
        </span>

        {/* Icon area */}
        <div className="flex items-center justify-center bg-[#1ebe5d] px-4 py-3">
          <FontAwesomeIcon icon={faWhatsapp} className="text-white text-xl" />
        </div>
      </a>
    </div>
  );
}
