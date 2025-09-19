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
import NotificationListener from "@/components/NotificationListener";

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

      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id=GTM-NRBTXSZ6'+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-NRBTXSZ6');
    `,
        }}
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
        {/* ✅ Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
          onLoad={() => console.log("✅ Razorpay loaded")}
          onError={(e) => console.log("❌ Razorpay failed", e)}
        />
<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-NRBTXSZ6"
    height={0}
    width={0}
    style={{ display: "none", visibility: "hidden" }}
  ></iframe>
</noscript>

        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          <NotificationListener />

          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="pt-12 flex-grow overflow-container z-49">
                {children}
              </main>
              {!hideFooter && <Footer />}
            </div>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
