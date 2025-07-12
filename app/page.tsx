"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  TrendingUp,
  Truck,
  Users,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeaturedProducts from "@/components/featured-products";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import CategorySlider from "@/components/category-slider";
import LocationPopup from "@/components/location-popup";
import LocationHandler from "@/components/location-handler";
import appStore from "@/public/appStore.svg";
import googlePlay from "@/public/googlePlay.svg";

export default function Home() {
  useEffect(() => {
    // Force a check for location permission on home page mount
    const locationPermission = localStorage.getItem("locationPermission");
    const userLocation = localStorage.getItem("userLocation");
    // Clear location popup flag to ensure it shows if needed
    if (!userLocation || locationPermission === "never") {
      localStorage.removeItem("hasSeenLocationPopup");
    }
  }, []);

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Location Popup - Only shown on home page */}
      <LocationPopup />

      {/* Location Handler - Handles actual geolocation requests */}
      <LocationHandler />

      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/70"></div>

        <div className="container relative z-10 px-4 mt-5 md:px-6 flex flex-col md:flex-row items-center min-h-[80vh]">
          <div className="md:w-1/2 text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight animate-fade-in">
              Future Fashion
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-md animate-fade-in-delay">
              Welcome to the F-Cian tribe — a community of bold, conscious women
              who believe in sharing style, not just owning it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-delay-2">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => {
                  const element = document.getElementById("new-arrivals");
                  const headerOffset = 100; // Adjust this value based on your header height
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
                Browse Clothes
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="https://apps.apple.com/app/idXXXXXXXXX"
                target="_blank"
              >
                <Image
                  src={appStore}
                  width={150}
                  height={50}
                  alt="App Store"
                  className="object-cover"
                />
              </Link>

              <Link
                href="https://play.google.com/store/apps/details?id=com.yourapp"
                target="_blank"
              >
                <Image
                  src={googlePlay}
                  width={150}
                  height={50}
                  alt="Google Play"
                  className="object-cover"
                />
              </Link>
            </div>
          </div>

          <div className="hidden md:block md:w-1/2 relative">
            <div className="relative w-full h-[450px] overflow-hidden rounded-xl animate-float">
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000"
                alt="Hero Image"
                fill
                className="object-cover hover-scale"
              />
            </div>
            <div className="absolute top-4 -right-6 bg-white rounded-lg shadow-lg p-4 animate-slide-in-right glass-effect">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="font-medium">Verified Sellers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <CategorySlider />

      {/* Trending Listings */}
      <section
        id="new-arrivals"
        className="container px-4 md:px-6 py-12 md:py-16"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-medium">
              Outfits with Stories
            </h2>
            <p className="text-muted-foreground mt-1">
              Discover our latest additions
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center mt-4 md:mt-0"
          >
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <FeaturedProducts />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Sustainability Section */}
      <section className="container px-4 md:px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-medium mb-4">
              Fashion That Doesn't Cost the Earth
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Reduce Fashion Waste</h3>
                  <p className="text-sm text-muted-foreground">
                    Globally, more than half of all fast fashion is disposed
                    within the same year.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Save Money</h3>
                  <p className="text-sm text-muted-foreground">
                    Renting saves up to 24% of water and 6% of energy compared
                    to buying new clothes.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Support Circular Economy</h3>
                  <p className="text-sm text-muted-foreground">
                    For the fashion sector to hit the Paris Agreement goals, it
                    is said 1 out of 5 garments will need to be traded through
                    circular consumption models by 2030.
                  </p>
                </div>
              </li>
            </ul>
            <Link href="/sustainability">
              <Button className="mt-6">Learn More About Sustainability</Button>
            </Link>
          </div>
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070"
              alt="Sustainable Fashion"
              width={600}
              height={700}
              className="rounded-lg object-cover w-full h-[300px] md:h-[500px]"
            />
          </div>
        </div>
      </section>

      {!isLogin && (
        <section className="container px-4 md:px-6 py-12 md:py-16">
          <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aC00djJoNHY0aDJWNmg0VjRoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
            <div className="grid gap-6 md:grid-cols-2 items-center relative z-10">
              <div>
                <h2 className="text-3xl font-serif font-medium tracking-tight md:text-4xl">
                  Join F-Cian Today
                </h2>
                <p className="mt-4 text-primary-foreground/90 md:text-lg">
                  Start Renting, Lending, Selling, and Buying occasion-wear from
                  people like you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto group"
                  >
                    Sign Up Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}
