"use client";

import type React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideFooter = pathname === "/cart";

  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => console.log("✅ Razorpay loaded")}
        onError={(e) => console.log("❌ Razorpay failed", e)}
      />

      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/fashCycleLogoFavicon.png"
        />
        <link rel="canonical" href="https://fashcycle.com/" />
        <title>Fashcycle</title>
        <meta
          name="google-site-verification"
          content="fb8RHyQYlT7lj7_xmLtWLCOHPPC18SnpqBTdfEUFA8c"
        />
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow overflow-container">{children}</main>
              {!hideFooter && <Footer />}
            </div>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
