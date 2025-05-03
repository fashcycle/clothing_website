"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Mock data for featured products
const mockProducts = [
  {
    id: 1,
    title: "Floral Maxi Dress",
    designer: "Zimmermann",
    price: 2500,
    rentalPrice: 500,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=1780",
    isRental: true,
    isSale: true,
  },
  {
    id: 2,
    title: "Tailored Blazer",
    designer: "Gucci",
    price: 8000,
    rentalPrice: 1200,
    rating: 4.9,
    reviews: 86,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936",
    isRental: true,
    isSale: false,
  },
  {
    id: 3,
    title: "Silk Evening Gown",
    designer: "Valentino",
    price: 3500,
    rentalPrice: 700,
    rating: 4.7,
    reviews: 152,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1938",
    isRental: true,
    isSale: true,
  },
  {
    id: 4,
    title: "Linen Summer Dress",
    designer: "Reformation",
    price: 4200,
    rentalPrice: 850,
    rating: 4.6,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1888",
    isRental: true,
    isSale: true,
  },
]

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {mockProducts.map((product, index) => (
        <Card
          key={product.id}
          className={cn(
            "product-card border-0 rounded-none luxury-shadow",
            isClient && `animate-fade-in-delay-${index}`,
          )}
        >
          <div className="relative">
            <Link href={`/product/${product.id}`}>
              <div className="overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={300}
                  height={400}
                  className="w-full h-[350px] object-cover product-image"
                />
              </div>
            </Link>
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-transform duration-300 hover:scale-110 z-10"
              aria-label={favorites.includes(product.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  favorites.includes(product.id) ? "fill-primary text-primary" : "text-muted-foreground",
                )}
              />
            </button>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="product-designer">{product.designer}</p>
              <h3 className="font-medium line-clamp-1">{product.title}</h3>

              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                {product.isRental && (
                  <p className="product-price">
                    <span>Rent for ₹{product.rentalPrice}/day</span>
                  </p>
                )}
                {product.isSale && (
                  <p className="product-price">
                    <span>Buy for ₹{product.price}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

