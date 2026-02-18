import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { StoreProvider } from "@/context/StoreContext";


import NextTopLoader from "nextjs-toploader";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});


export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://santhul-cakes.netlify.app"),
  title: {
    default: "Santhul Cake House | Premium Homemade Cakes",
    template: "%s | Santhul Cake House"
  },
  description: "Premium homemade cakes crafted with love in Sri Lanka. Custom designs, premium ingredients, zero preservatives. Order chocolate, vanilla, and fruit cakes online.",
  keywords: ["cakes", "homemade cakes", "sri lanka cakes", "birthday cakes", "wedding cakes", "santhul cakes", "chocolate cake", "custom cakes"],
  authors: [{ name: "Santhul Cake House" }],
  creator: "Santhul Cake House",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Santhul Cake House | Premium Homemade Cakes",
    description: "Premium homemade cakes crafted with love. Order online for delivery.",
    siteName: "Santhul Cake House",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Santhul Cake House Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Santhul Cake House",
    description: "Premium homemade cakes crafted with love. Order online.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${playfair.variable} ${montserrat.variable} ${greatVibes.variable} antialiased flex flex-col min-h-screen`}
      >
        <NextTopLoader color="#E91E63" showSpinner={false} />
        <StoreProvider>
          <CartProvider>
            <Header />
            <ErrorBoundary>
              <main className="flex-grow">{children}</main>
            </ErrorBoundary>
            <Footer />
            <ScrollToTop />
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                style: {
                  fontFamily: "var(--font-sans)",
                },
              }}
            />
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

