import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google"; // Added Outfit
import Script from "next/script"; // Added Script
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import GlobalAds from "@/components/GlobalAds";
import LanguageModal from "@/components/LanguageModal"; // Added LanguageModal
import { LanguageProvider } from "@/context/LanguageContext"; // Added Provider

import { Suspense } from 'react'; // Added Suspense
import GoogleAnalytics from "@/components/GoogleAnalytics"; // Added GA

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#800000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MatchLK - Sri Lankan Matrimonial",
  description: "Sri Lanka's most trusted matrimonial service. Connect with genuine profiles and find your soulmate today.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MatchLK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#800000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <LanguageProvider>
          <LanguageModal />
          <GlobalAds />
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <PWAInstallPrompt />
        </LanguageProvider>

        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
