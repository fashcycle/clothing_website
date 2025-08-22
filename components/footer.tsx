import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground lg: mt-12">
      <div className="container px-6 md:px-8 py-8 md:py-12 lg: px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-medium">
              Fashcycle
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Fashcycle is an India-based sustainable fashion platform that
              operates on a circular economy model—letting users rent, lend,
              sell or buy occasion-wear like sarees, anarkalis, lehengas, gowns,
              sharara sets, and suits directly from others.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Link
                href="https://www.facebook.com/profile.php?id=61577640128490&sk=about"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                target="_blank"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/fashcycle.official?igsh=NXhpYjRkZGw3Y21v&utm_source=qr"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                target="_blank"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://x.com/fashcycle19878"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                target="_blank"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://www.youtube.com/@fashcycle"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                target="_blank"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="font-medium mb-4 uppercase text-sm tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <button
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  onClick={() => {
                    const element = document.getElementById("how-it-works");
                    const headerOffset = 200; // Adjust this value based on your header height
                    const elementPosition =
                      element?.getBoundingClientRect().top ?? 0;
                    const offsetPosition =
                      elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }}
                >
                  How It Works
                </button>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-medium mb-4 uppercase text-sm tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/80 text-center md:text-left">
            © {new Date().getFullYear()} AMKA JHAMKA PRIVATE LIMITED. All rights
            reserved.
          </p>
          <div className="flex gap-4 md:gap-6 flex-wrap justify-center md:justify-end">
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
  );
}
