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

export const metadata: Metadata = {
  title: "Santhul Cake House | Premium Homemade Cakes",
  description:
    "Premium homemade cakes crafted with love for your special moments. Custom designs, premium ingredients, zero preservatives.",
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

