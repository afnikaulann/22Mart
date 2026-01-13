import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "22mart.id - Belanja Kebutuhan Harian Online",
    template: "%s | 22mart.id",
  },
  description: "Platform belanja online untuk kebutuhan sehari-hari. Mudah, cepat, dan terpercaya. Dapatkan produk berkualitas dengan harga terbaik.",
  keywords: ["minimarket online", "belanja online", "kebutuhan harian", "22mart"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
