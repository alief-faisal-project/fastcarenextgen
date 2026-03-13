import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "sonner";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import FooterWrapper from "@/components/FooterWrapper"; // Kita gunakan Wrapper agar Root tetap Server Component
import TutorialWrapper from "@/components/TutorialWrapper";
import LoadingWrapper from "@/components/LoadingWrapper";

config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ============================= */
/* VIEWPORT */
/* ============================= */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b1f3a", // Pindahkan ke sini agar konsisten di Android
};

/* ============================= */
/* SEO METADATA */
/* ============================= */

export const metadata: Metadata = {
  metadataBase: new URL("https://fastcare.id"),
  title: {
    default: "FastCare© Pencarian Layanan Kesehatan Terdekat",
    template: "%s | FastCare",
  },
  description:
    "FastCare adalah platform untuk mencari rumah sakit, klinik, dan layanan kesehatan terdekat dengan cepat dan mudah.",
  // ... keywords, authors, dll tetap sama ...

  // TAMBAHKAN INI UNTUK PWA:
  manifest: "/manifest.json",
  applicationName: "FastCare",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FastCare",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  // ... (sisa metadata openGraph dan twitter tetap sama)
};

/* ============================= */
/* ROOT LAYOUT */
/* ============================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <LoadingWrapper>
            {children}

            {/* Tutorial Modal */}
            <TutorialWrapper />

            {/* Footer dengan Logic Hide di Detail Hospital */}
            <FooterWrapper />
          </LoadingWrapper>
        </AppProvider>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
