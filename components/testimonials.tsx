"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Regular Renter",
    content:
      "I rented a designer dress for my friend's wedding and received so many compliments! The process was seamless and I saved so much money.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000",
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Lender & Renter",
    content:
      "I've been both lending my clothes and renting from others. It's a great way to make some extra money and reduce waste. The community is amazing!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000",
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Fashion Enthusiast",
    content:
      "This platform has changed how I approach fashion. I can wear designer clothes for special occasions without breaking the bank or contributing to fast fashion.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000",
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Business Owner",
    content:
      "As someone who needs formal attire for business events, this platform has been a game-changer. High-quality clothes at a fraction of the cost.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const visibleTestimonials = isClient
    ? [
        testimonials[currentIndex],
        testimonials[(currentIndex + 1) % testimonials.length],
        testimonials[(currentIndex + 2) % testimonials.length],
      ]
    : testimonials.slice(0, 3)

  return (
    <section className="container px-4 md:px-6 py-12 md:py-20 bg-primary text-primary-foreground ">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-medium">What F-Cian Says.</h2>
          {/* <p className="mt-4  md:text-lg max-w-2xl">
            Hear from our community of lenders and renters about their experiences
          </p> */}
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button
            variant="default"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full border border-white"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full border border-white"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleTestimonials.map((testimonial, index) => (
          <Card
            key={testimonial.id}
            className={cn(
              "bg-background transition-all duration-500 overflow-hidden hover-scale luxury-shadow",
              isClient && `animate-fade-in-delay-${index}`,
            )}
          >
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-primary/40 mb-4" />
              <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

