import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ConfiguratorProvider } from "@/context/ConfiguratorContext";
import { ToastProvider } from "@/context/ToastContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import InternationalPopup from "@/components/InternationalPopup";

import { AuthProvider } from "@/context/AuthContext";

// Self-hosted at build time: no render-blocking request to fonts.googleapis.com and
// no flash of fallback text. `display: swap` + the generated size-adjust metrics keep
// the swap from shifting layout.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JD Jewel | Fine Premium Luxury Jewelry & Certified Diamonds",
  description: "Experience the pinnacle of fine jewelry craftsmanship. Explore GIA certified natural diamonds, custom-designed engagement rings, Miami Cuban links, and custom grillz cast in solid 18k gold.",
  keywords: "fine jewelry, diamond rings, engagement rings, custom jewelry, gold grillz, cuban link, GIA certified, VDB diamonds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fcfbf9] text-[#121212]">
        {/* The preloader is server-rendered so real content never flashes before
            the curtain. Without JS there is nothing to dismiss it, so drop it. */}
        <noscript>
          <style>{`#jd-preloader{display:none !important}`}</style>
        </noscript>
        <Preloader />
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <ConfiguratorProvider>
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <InternationalPopup />
              </ConfiguratorProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

