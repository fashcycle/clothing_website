import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-16">
      <div className="col-span-1">
            <Link href="/" className="font-serif text-2xl font-medium">
            Fashcycle
            </Link>
            <p className="mt-2 text-primary-foreground/80">
A fashion rental platform where you can rent, lend, and buy designer fashion from people like you.            </p>
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
          <div className="col-span-2 lg:col-start-3">
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
            
                <button
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  onClick={() => {
                    const element = document.getElementById('how-it-works');
                    const headerOffset = 200; // Adjust this value based on your header height
                    const elementPosition = element?.getBoundingClientRect().top ?? 0;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }}
                
                >
                   How It Works
                </button>
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
          <div className="hidden lg:block lg:col-start-5">
          <h3 className="font-medium mb-3 uppercase text-sm tracking-wider">Support</h3>
            <ul className="space-y-2">
            <li>
                <Link
                  href="/help"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
             
            </ul>
          </div>
        
        </div>
        <div className="border-t border-primary-foreground/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/80">
            © {new Date().getFullYear()} AMKA JHAMKA PRIVATE LIMITED. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

