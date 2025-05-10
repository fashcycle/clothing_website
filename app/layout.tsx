import type React from "react"
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fashcycle - Rent, Sell & Buy Clothes",
  description:
    "Your one-stop platform for renting, selling, and buying quality clothing. Save money, reduce waste, and stay stylish.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>  
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
  <Navbar />
  <main className="flex-grow overflow-container">{children}</main>
  <Footer />
</div>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}



import './globals.css'