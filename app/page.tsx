'use client';

import Link from "next/link"
import Image from "next/image"
import { useEffect } from 'react';
import { ArrowRight, TrendingUp, Truck, Users, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FeaturedProducts from "@/components/featured-products"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import CategorySlider from "@/components/category-slider"
import LocationPopup from "@/components/location-popup"
import LocationHandler from "@/components/location-handler"

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

  return (
    <div className="flex flex-col">
      {/* Location Popup - Only shown on home page */}
      <LocationPopup />

      {/* Location Handler - Handles actual geolocation requests */}
      <LocationHandler />

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/70"></div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col md:flex-row items-center h-[80vh]">
          <div className="md:w-1/2 text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight animate-fade-in">
              Fashion Simplified
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-md animate-fade-in-delay">
              Your one-stop platform for renting, selling, and buying quality clothing. Save money, reduce waste, and
              stay stylish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-delay-2">
            <Button 
  size="lg" 
  className="bg-white text-primary hover:bg-white/90"
  onClick={() => {
    const element = document.getElementById('new-arrivals');
    const headerOffset = 100; // Adjust this value based on your header height
    const elementPosition = element?.getBoundingClientRect().top ?? 0;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }}
>
  Browse Clothes
  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
</Button>
              {/* <Link href="/upload">
                <Button size="lg" variant="outline" className="border-white text-primary bg-white/10">
                  Upload Your Clothes
                </Button>
              </Link> */}
            </div>
            {/* Happy user count and images , commented for now */}
            {/* <div className="flex items-center gap-4 mt-6 animate-fade-in-delay-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block rounded-full ring-2 overflow-hidden">
                    <div className="h-10 w-10 rounded-full object-cover bg-gray-500"></div>
                    <Image
                      src={`/placeholder.svg?height=40&width=40&text=User${i}`}
                      alt={`User ${i}`}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/80">
                <span className="font-medium">2,000+</span> happy users
              </div>
            </div> */}
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
            {/* <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 animate-slide-up-delay-2 glass-effect">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">4.9/5 from 2000+ reviews</span>
              </div>
            </div> */}
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
      <section  id="new-arrivals" className="container px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-medium">New Arrivals</h2>
            <p className="text-muted-foreground mt-1">Discover our latest additions</p>
          </div>
          <Link href="/browse" className="inline-flex items-center mt-4 md:mt-0">
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
    

      {/* Stats Section  comment for now*/}
      {/* <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-primary-foreground/5 backdrop-blur-sm border-none animate-fade-in">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4" />
                <h3 className="text-3xl font-serif font-medium">500,000+</h3>
                <p className="text-primary-foreground/80">Active Users</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/5 backdrop-blur-sm border-none animate-fade-in-delay">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Truck className="h-12 w-12 mb-4" />
                <h3 className="text-3xl font-serif font-medium">100,000+</h3>
                <p className="text-primary-foreground/80">Successful Rentals</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/5 backdrop-blur-sm border-none animate-fade-in-delay-2">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <TrendingUp className="h-12 w-12 mb-4" />
                <h3 className="text-3xl font-serif font-medium">₹50M+</h3>
                <p className="text-primary-foreground/80">Transaction Volume</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <Testimonials />

      {/* Sustainability Section */}
      <section className="container px-4 md:px-6 py-12 md:py-20">
       <div className="grid md:grid-cols-2 gap-10 items-center">
  <div>
    <h2 className="text-2xl md:text-3xl font-serif font-medium mb-4">Fashion That Doesn't Cost the Earth</h2>
    <p className="text-muted-foreground mb-6">
      By renting instead of buying, you're helping to reduce fashion waste and extend the lifecycle of quality
      garments.
    </p>
    <ul className="space-y-4">
      <li className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <h3 className="font-medium">Reduce Fashion Waste</h3>
          <p className="text-sm text-muted-foreground">
            Over 92 million tonnes of clothing end up in landfills globally every year
          </p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <h3 className="font-medium">Save Money</h3>
          <p className="text-sm text-muted-foreground">
            Renting saves up to 24% of water and 6% of energy compared to buying new clothes
          </p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <h3 className="font-medium">Support Circular Economy</h3>
          <p className="text-sm text-muted-foreground">
            Each rented item results in 3% fewer carbon emissions—giving fashion a longer, greener life
          </p>
        </div>
      </li>
    </ul>
    <Link href="/sustainability">
      <Button className="mt-6">Learn More About Sustainability</Button>
    </Link>  </div>
  <div className="relative">
    <Image
      src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070"
      alt="Sustainable Fashion"
      width={600}
      height={700}
      className="rounded-lg object-cover w-full h-[500px]"
    />
    {/* <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg max-w-xs">
      <p className="text-lg font-medium mb-2">Our Impact</p>
      <p className="text-sm text-muted-foreground">
        Together, our community has saved over 1 million kg of CO₂ emissions by choosing to rent instead of buy.
      </p>
    </div> */}
  </div>
</div>

      </section>

      {/* CTA Section */}
      <section className="container px-4 md:px-6 py-12 md:py-16">
        <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          <div className="grid gap-6 md:grid-cols-2 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-serif font-medium tracking-tight md:text-4xl">Join Our Community Today</h2>
              <p className="mt-4 text-primary-foreground/90 md:text-lg">
                Start renting, lending, and buying designer fashion from people like you. Join 500,000+ fashion
                enthusiasts on our platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto group">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {/* <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
                >
                  Browse Collection
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

