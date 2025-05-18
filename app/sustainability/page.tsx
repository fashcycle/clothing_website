"use client"

import { motion } from "framer-motion"
import { Leaf, Recycle, Users, Heart } from "lucide-react"

export default function Sustainability() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Sustainable Fashion Future</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The fashion industry is responsible for between 2–8% of global carbon emissions. Every year, over 150 million trees are logged to make fabrics, and more than half of all fast fashion is discarded within the same year-wasting an estimated $460 billion in value.
        </p>
      </motion.div>

      {/* Challenge Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-16"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">Why Change Is Hard</h2>
            <p className="text-lg text-muted-foreground mb-4">
              While the need to address fashion's impact is urgent, research shows that simply presenting facts isn't enough to change habits. As humans, our choices are shaped by our desires, fears, beliefs, and hopes-not just information.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic text-xl">
              "The problem with an approach that prioritizes information is it ignores what makes us human."
            </blockquote>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Imagining What's Possible</h2>
            <p className="text-lg text-muted-foreground mb-4">
              To create real change, we need to rewrite the story of fashion. Imagine a world where fashion is less about what's new, cheap, and disposable, and more about quality, longevity, and equity.
            </p>
            <div className="bg-primary/5 p-6 rounded-lg">
              <p className="text-lg font-medium">
                For the fashion sector to meet the Paris Agreement goals, 1 out of every 5 garments will need to be traded through alternative consumption models-like sharing, renting, and reselling-by 2030.
              </p>
            </div>
          </section>

          <section>
          <p className="text-2xl mb-6">
              <span className="font-bold">Our Approach: </span>
              <span className="text-xl">We combine technology and fashion. To make Future Fashion.</span>
            </p>
            <p className="text-lg text-muted-foreground ">
              At Fashcycle, we believe sustainability should be simple, rewarding, and tailored to you.
            </p>
            <p className="text-lg text-muted-foreground mb-8">We’re building a community and a platform where:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-background p-6 rounded-lg shadow-sm"
              >
                <Recycle className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Second Life for Fashion</h3>
                <p className="text-muted-foreground">Pre-loved fashion gets a second life-reducing waste and maximizing value.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-background p-6 rounded-lg shadow-sm"
              >
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Accessible Choices</h3>
                <p className="text-muted-foreground">Alternative choices are accessible-from renting and sharing to buying and selling gently worn styles.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-background p-6 rounded-lg shadow-sm"
              >
                <Heart className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality & Longevity</h3>
                <p className="text-muted-foreground">Quality and longevity are celebrated-helping you build a wardrobe that's both stylish and sustainable.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-background p-6 rounded-lg shadow-sm"
              >
                <Leaf className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Unique Experience</h3>
                <p className="text-muted-foreground">Creating a unique shopping experience that's good for you and the planet.</p>
              </motion.div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">It's About Culture, Not Just Clothes</h2>
            <p className="text-lg text-muted-foreground mb-4">
              We know that sustainable fashion means different things in different regions and for different people. That's why we're focused on changing not just habits, but the culture around fashion itself.
            </p>
            <p className="text-lg text-muted-foreground">
              By raising awareness, inspiring action, and offering real alternatives, we empower individuals to demand a better, fairer, and more sustainable industry.
            </p>
          </section>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-primary text-primary-foreground p-8 rounded-lg text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Fashcycle: Future Fashion.</h2>
            <p className="text-lg">Join us in creating a more sustainable fashion future.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}