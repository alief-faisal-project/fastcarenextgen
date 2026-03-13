"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons"; // Tambahkan ikon close

export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  const [isClosed, setIsClosed] = useState(false); // State untuk handle tutup manual

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Jika state show belum true atau user sudah klik close, jangan tampilkan apa-apa
  if (!show || isClosed) return null;

  return (
    <div className="fixed bottom-0 right-2 z-[9999] hidden md:block group">
      <div className="relative">
        {/* Tombol Close (X) */}
        <button
          onClick={() => setIsClosed(true)}
          className="absolute -top-3 -right-1 bg-red-500 hover:bg-red-600 text-white 
                     w-6 h-6 rounded-full flex items-center justify-center shadow-lg 
                     transition-all duration-200 z-[10000] border-2 border-white"
          title="Tutup"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xs" />
        </button>

        {/* Link WhatsApp */}
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-green-600 hover:bg-green-500 
                     text-white rounded-t-lg shadow-xl overflow-hidden
                     transition-all duration-300"
        >
          {/* Text */}
          <span className="px-3 py-2 text-sm font-medium whitespace-nowrap">
            Butuh Bantuan? Hubungi Kami!
          </span>

          {/* Icon area */}
          <div className="flex items-center justify-center bg-green-500 w-12 h-10 ">
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
