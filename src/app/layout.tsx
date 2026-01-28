import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MatrixRain } from "@/components/MatrixRain";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CashGlitch - The System is Broken. Fix It.",
    template: "%s | CashGlitch",
  },
  description:
    "CashGlitch connects you with free resources, grants, scholarships, reparations initiatives, and opportunities. Unlock abundance and exploit the system for generational wealth.",
  keywords: [
    "free money",
    "grants",
    "scholarships",
    "reparations",
    "free resources",
    "abundance",
    "free travel",
    "job opportunities",
    "free computer",
    "community resources",
    "generational wealth",
    "financial freedom",
    "cash glitch",
  ],
  authors: [{ name: "CashGlitch" }],
  creator: "CashGlitch",
  metadataBase: new URL("https://cashglitch.org"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cashglitch.org",
    siteName: "CashGlitch",
    title: "CashGlitch - The System is Broken. Fix It.",
    description:
      "Unlock free resources, grants, scholarships, and opportunities. The abundance matrix is active.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "CashGlitch - Unlock Abundance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CashGlitch - The System is Broken. Fix It.",
    description:
      "Unlock free resources, grants, scholarships, and opportunities. The abundance matrix is active.",
    images: ["/images/og-image.png"],
    creator: "@cashglitch",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  themeColor: "#00ff41",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistMono.variable} antialiased bg-black text-primary min-h-screen`}>
        <MatrixRain />
        <Header />
        <div className="relative z-20">{children}</div>
      </body>
    </html>
  );
}
