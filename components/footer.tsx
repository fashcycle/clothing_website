import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="font-serif text-2xl font-medium">
            Fashcycle
            </Link>
            <p className="mt-2 text-primary-foreground/80">
              The world's largest fashion rental platform. Rent, lend, and buy designer fashion from people like you.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3 uppercase text-sm tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
             
              <li>
                <Link
                  href="/about-us"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 uppercase text-sm tracking-wider">Support</h3>
            <ul className="space-y-2">
              {/* <li>
                <Link
                  href="/help"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li> */}
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              
              <li>
                <Link
                  href="/terms"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
              <Link
              href="/privacy"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"            >
              Privacy Policy
            </Link>
              </li>
            </ul>
          </div>
          <div className="hidden lg:block">
            <h3 className="font-medium mb-3 uppercase text-sm tracking-wider">Newsletter</h3>
            <p className="text-sm text-primary-foreground/80 mb-2">
              Subscribe to get updates on new features and promotions.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-md text-sm"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 bg-primary-foreground text-primary rounded-md text-sm font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/80">
            © {new Date().getFullYear()} Fashcycle. All rights reserved.
          </p>
       
        </div>
      </div>
    </footer>
  )
}

