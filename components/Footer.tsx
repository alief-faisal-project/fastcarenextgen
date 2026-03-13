"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ViewType = "menu" | "dukung";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewType>("menu");
  const [showRek, setShowRek] = useState(false);

  const noRek = "1961828503";
  const maskedRek = noRek.slice(0, -3) + "***";

  // Fungsi untuk membuka dialog dengan menentukan view target
  const openDialog = (targetView: ViewType) => {
    setView(targetView);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setView("menu");
      setShowRek(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* MOBILE FOOTER */}
      <footer className="md:hidden bg-primary py-5 mt-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-white text-xs gap-4">
            {/* HUBUNGI KAMI */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => openDialog("menu")}
                className="hover:text-gray-200"
              >
                Hubungi Kami
              </button>
            </div>

            {/* SUMBER DATA */}
            <a
              href="https://sirs.kemkes.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition text-center"
            >
              Sumber Data: SIRS Kemkes RI
            </a>

            {/* COPYRIGHT AUTO YEAR */}
            <div className="text-gray-200">
              © {new Date().getFullYear()} FastCare
            </div>
          </div>
        </div>
      </footer>

      {/* TOP FOOTER DESKTOP */}
      <section className="hidden md:block bg-blue-400 text-white mt-16">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center gap-6">
          <div className="text-5xl text-white">
            <i className="fa-regular fa-comments" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold">Layanan Bantuan</h3>

            <p className="text-sm text-white">
              Jika ada pertanyaan atau membutuhkan bantuan, atau ingin
              memberikan kritik dan saran silahkan hubungi kami melalui tombol
              hubungi kami dibawah.
            </p>
          </div>
        </div>
      </section>

      {/* DESKTOP FOOTER */}
      <footer className="hidden md:block bg-[#1f1f1f] text-white border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="grid grid-cols-3 divide-x divide-white">
            {/* BRAND */}
            <div className="pr-10 space-y-4">
              <Image
                src="/fastcare-logo-footer.webp"
                alt="FastCare Logo"
                width={120}
                height={40}
                className="object-contain brightness-0 invert"
              />

              <p className="text-sm text-gray-300 leading-relaxed">
                Platform untuk membantu masyarakat menemukan fasilitas kesehatan
                dengan cepat dan praktis. Informasi rumah sakit, layanan
                darurat, dan lokasi tersedia dalam satu tempat.
              </p>
            </div>

            {/* BANTUAN */}
            <div className="px-10 flex flex-col items-start space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Bantuan
                <div className="w-10 h-0.5 bg-yellow-400 mt-1" />{" "}
                {/* Garis Kuning */}
              </h3>

              <button
                onClick={() => openDialog("menu")}
                className="text-sm hover:text-gray-200 cursor-pointer"
              >
                Hubungi Kami
              </button>

              <button
                onClick={() => openDialog("dukung")}
                className="text-sm  hover:text-gray-200 cursor-pointer"
              >
                Dukung Pengembangan
              </button>
            </div>

            {/* KONTAK */}
            <div className="pl-10 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Kontak
                <div className="w-10 h-0.5 bg-yellow-400 mt-1" />{" "}
                {/* Garis Kuning */}
              </h3>

              <div className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-white" />
                <a
                  href="mailto:info@fastcare.id"
                  className="text-sm hover:text-gray-200 cursor-pointer"
                >
                  info@fastcare.id
                </a>
              </div>

              <div className="flex items-center gap-3">
                <i className="fa-brands fa-whatsapp text-white" />
                <a
                  href="https://wa.me/6283120996468"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-gray-200 cursor-pointer"
                >
                  +62 831-2099-6468
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER PALING BAWAH */}
        <div className="bg-[#161616] ">
          <div className="relative w-full px-20 py-2 flex items-center justify-center text-xs text-gray-400">
            <span className="absolute left-0 pl-8 ">
              © {new Date().getFullYear()} FastCare. Semua hak dilindungi.
            </span>
            <a
              href="https://sirs.kemkes.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white pl-280 "
            >
              Sumber Data: SIRS Kemkes RI
            </a>
          </div>
        </div>
      </footer>

      {/* DIALOG BANTUAN */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <i
                className={`fa-solid ${view === "menu" ? "fa-headset" : "fa-qrcode"} text-primary`}
              />
              {view === "menu" ? "Butuh Bantuan?" : "Dukung Pengembangan"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {view === "menu" && (
              <p className="text-muted-foreground text-sm">
                Kami siap membantu Anda, silahkan pilih bantuan yang dibutuhkan:
              </p>
            )}

            {view === "menu" ? (
              <div className="space-y-3">
                <a
                  href="https://wa.me/6285692985927"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-xl hover:border-primary hover:bg-accent transition"
                >
                  <i className="fa-brands fa-whatsapp text-primary text-2xl" />
                  <div>
                    <p className="font-medium text-sm">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">
                      Chat langsung dengan tim kami
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:helpfastcare@gmail.com"
                  className="flex items-center gap-3 p-3 border rounded-xl hover:border-primary hover:bg-accent transition"
                >
                  <i className="fa-solid fa-envelope text-primary text-2xl" />
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-xs text-muted-foreground">
                      helpfastcare@gmail.com
                    </p>
                  </div>
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[15px] text-justify">
                  Website ini sepenuhnya gratis dan dibuat untuk membantu
                  masyarakat menemukan fasilitas kesehatan dengan cepat dan
                  praktis. Informasi rumah sakit, layanan darurat, dan lokasi
                  tersedia dalam satu tempat.
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 flex items-center justify-center bg-white rounded-lg border overflow-hidden">
                    <Image
                      src="/bni-logo.webp"
                      alt="BNI"
                      width={80}
                      height={80}
                      className="object-contain p-2"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Nomor Rekening</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold text-red-500 tracking-wide">
                        {showRek ? noRek : maskedRek}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowRek(!showRek)}
                        className="text-[12px]"
                      >
                        <i
                          className={`fa-solid ${showRek ? "fa-eye-slash" : "fa-eye"}`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      a.n. ALIEF FAISAL ADRIANSYAH
                    </p>
                  </div>
                </div>

                <hr className="border-t border-gray-200 my-4" />

                <div className="space-y-3">
                  <p className="text-[12px] font-semibold uppercase text-primary text-left">
                    Kontributor :
                  </p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {/* Kolom Kiri */}
                    <div className="space-y-1 pr-4 border-r border-border">
                      <p className="text-xs text-gray-600 flex justify-between">
                        <span>1. Hamba Allah</span>
                        <span className="font-medium text-primary">
                          Rp.100k
                        </span>
                      </p>

                      <p className="text-xs text-gray-600 flex justify-between">
                        <span>2.</span>
                        <span className="font-medium text-primary"></span>
                      </p>

                      <p className="text-xs text-gray-600 flex justify-between">
                        <span>3.</span>
                        <span className="font-medium text-primary"></span>
                      </p>

                      <p className="text-xs text-gray-600 flex justify-between">
                        <span>4.</span>
                        <span className="font-medium text-primary"></span>
                      </p>

                      <p className="text-xs text-gray-600 flex justify-between">
                        <span>5.</span>
                        <span className="font-medium text-primary"></span>
                      </p>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="space-y-1 pl-4">
                      <p className="text-xs text-gray-600 flex justify-between">
                        <span>6.</span>
                        <span className="font-medium text-primary"></span>
                      </p>

                      <p className="text-xs text-gray-600 flex justify-between">
                        <span>7.</span>
                        <span className="font-medium text-primary"></span>
                      </p>

                      <p className="text-xs text-gray-600 flex justify-between">
                        <span>8.</span>
                        <span className="font-medium text-primary"></span>
                      </p>

                      <p className="text-xs text-gray-600 flex justify-between">
                        <span>9.</span>
                        <span className="font-medium text-primary"></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
