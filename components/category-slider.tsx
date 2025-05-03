"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories = [
  {
    id: 1,
    name: "Lehenga",
    image: "https://images.unsplash.com/photo-1610189020382-668a5fc65ebf?q=80&w=1000",
    count: 120,
  },
  {
    id: 2,
    name: "Gown",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1938",
    count: 85,
  },
  {
    id: 3,
    name: "Sharara Set",
    image: "https://images.unsplash.com/photo-1610189020382-668a5fc65ebf?q=80&w=1000",
    count: 64,
  },
  {
    id: 4,
    name: "Anarkali",
    image: "https://images.unsplash.com/photo-1610189020382-668a5fc65ebf?q=80&w=1000",
    count: 92,
  },
  {
    id: 5,
    name: "Saree",
    image: "https://images.unsplash.com/photo-1610189020382-668a5fc65ebf?q=80&w=1000",
    count: 150,
  },
  {
    id: 6,
    name: "Suit",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000",
    count: 110,
  },
]

export default function CategorySlider() {
  const [isClient, setIsClient] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { current } = sliderRef
      const scrollAmount = direction === "left" ? current.scrollLeft - 300 : current.scrollLeft + 300

      current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-medium">Shop by Category</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll("left")}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Scroll left</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => scroll("right")}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 -mx-4 px-4 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.name.toLowerCase().replace(" ", "-")}`}
              className={cn("flex-shrink-0 w-[250px] snap-start", isClient && `animate-fade-in-delay-${index % 3}`)}
            >
              <div className="relative h-[300px] overflow-hidden group hover-scale">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-white font-serif text-xl">{category.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{category.count} items</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

