import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sari Buah",
  description: "Fresh fruits for a healthy lifestyle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🍎</text></svg>" />
        {/* SEO test */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Fresh fruits for a healthy lifestyle" />
        <meta name="keywords" content="buah, buah segar, sari buah, toko buah, healthy, fruits, fresh, vitamin, belanja buah online" />
        <meta property="og:title" content="Sari Buah" />
        <meta property="og:description" content="Fresh fruits for a healthy lifestyle" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sari Buah" />
        <meta property="og:image" content="/apple-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sari Buah" />
        <meta name="twitter:description" content="Fresh fruits for a healthy lifestyle" />
        <meta name="twitter:image" content="/apple-og.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
