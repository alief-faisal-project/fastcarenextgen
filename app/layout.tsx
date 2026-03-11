import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "sonner";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import Footer from "@/components/Footer";
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
};

/* ============================= */
/* SEO METADATA */
/* ============================= */

export const metadata: Metadata = {
  metadataBase: new URL("https://fastcare.id"),
  title: {
    default: "FastCare",
    template: "%s | FastCare",
  },
  description:
    "FastCare adalah platform untuk mencari rumah sakit, klinik, dan layanan kesehatan terdekat dengan cepat dan mudah.",
  keywords: [
    "hospital finder",
    "rumah sakit terdekat",
    "cari rumah sakit",
    "fastcare",
    "healthcare indonesia",
    "klinik terdekat",
  ],
  authors: [{ name: "FastCare Team" }],
  creator: "FastCare",
  publisher: "FastCare",
  applicationName: "FastCare",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FastCare - Hospital Finder",
    description:
      "Temukan rumah sakit, klinik, dan layanan kesehatan terdekat dengan FastCare.",
    url: "https://fastcare.id",
    siteName: "FastCare",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FastCare - Hospital Finder",
    description:
      "Cari rumah sakit dan layanan kesehatan terdekat dengan mudah.",
    images: ["/og-image.jpg"],
  },
  icons: { icon: "/favicon.ico" },
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

            {/* Footer */}
            <Footer />
          </LoadingWrapper>
        </AppProvider>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
