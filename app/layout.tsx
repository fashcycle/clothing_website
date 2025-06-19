'use client';

import type React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideFooter = pathname === '/cart';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/fashCycleLogoFavicon.png" />
        <link rel="canonical" href="https://fashcycle.com/" />
        <title>Fashcycle</title>
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
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
