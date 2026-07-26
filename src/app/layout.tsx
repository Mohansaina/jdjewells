import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ConfiguratorProvider } from "@/context/ConfiguratorContext";
import { ToastProvider } from "@/context/ToastContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import CookieBanner from "@/components/CookieBanner";

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#fcfbf9] text-[#121212]">
        <Preloader />
        <ToastProvider>
          <CartProvider>
            <ConfiguratorProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <CookieBanner />
            </ConfiguratorProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

