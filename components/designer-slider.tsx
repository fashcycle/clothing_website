"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const designers = [
  {
    id: 1,
    name: "Gucci",
    image: "/placeholder.svg?height=80&width=80&text=Gucci",
    count: 120,
  },
  {
    id: 2,
    name: "Prada",
    image: "/placeholder.svg?height=80&width=80&text=Prada",
    count: 85,
  },
  {
    id: 3,
    name: "Zimmermann",
    image: "/placeholder.svg?height=80&width=80&text=Zimmermann",
    count: 64,
  },
  {
    id: 4,
    name: "Valentino",
    image: "/placeholder.svg?height=80&width=80&text=Valentino",
    count: 92,
  },
  {
    id: 5,
    name: "Reformation",
    image: "/placeholder.svg?height=80&width=80&text=Reformation",
    count: 150,
  },
  {
    id: 6,
    name: "Chanel",
    image: "/placeholder.svg?height=80&width=80&text=Chanel",
    count: 110,
  },
  {
    id: 7,
    name: "Dior",
    image: "/placeholder.svg?height=80&width=80&text=Dior",
    count: 78,
  },
  {
    id: 8,
    name: "Versace",
    image: "/placeholder.svg?height=80&width=80&text=Versace",
    count: 65,
  },
]

export default function DesignerSlider() {
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
    <section className="py-10 border-b">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Featured Designers</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => scroll("left")}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Scroll left</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => scroll("right")}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide gap-8 pb-4 -mx-4 px-4 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {designers.map((designer, index) => (
            <Link
              key={designer.id}
              href={`/designer/${designer.name.toLowerCase()}`}
              className={cn(
                "flex-shrink-0 snap-start flex flex-col items-center",
                isClient && `animate-fade-in-delay-${index % 3}`,
              )}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border hover-scale">
                <Image
                  src={designer.image || "/placeholder.svg"}
                  alt={designer.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-center">{designer.name}</p>
              <p className="text-xs text-muted-foreground">{designer.count} items</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

