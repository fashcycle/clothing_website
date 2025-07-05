"use client";

import { motion } from "framer-motion";
import { ArrowRight, Recycle, Heart, Users } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Fashcycle</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Where Fashion meets Technology to make Future Fashion.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 mb-16"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Many of us have beautiful, gently worn, and often expensive
              clothes tucked away in our wardrobes-rarely worn, yet too good to
              let go. Over time, these pieces are forgotten, and their value is
              lost, contributing to unnecessary waste.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Fashcycle, we set out to change this story. Our platform is
              designed to bring these hidden treasures back to life. By enabling
              people to share, rent, or buy pre-loved fashion, we help you
              refresh your wardrobe in a fun, affordable, and sustainable
              way-creating a unique shopping experience that's good for you and
              the planet.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We believe that newness can be sustainable with the right
              approach. Fashion, when built on innovation and empowerment rather
              than excess and exploitation, can be a powerful force for positive
              change. At Fashcycle, our values are rooted in sustainability,
              community, and creativity. We're here to make fashion better-for
              everyone.
            </p>
          </div>
          <motion.div className="rounded-lg overflow-hidden h-[500px]">
            <img
              src="/about-us.jpg"
              alt="Fashion Sustainability"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Values Section */}
      <div className="bg-primary/5 py-16 mb-16">
        <div className="container mx-auto ">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Recycle className="h-8 w-8" />,
                title: "Sustainability",
                description:
                  "Promoting circular fashion to reduce environmental impact",
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Community",
                description:
                  "Building a community of fashion-conscious individuals",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Accessibility",
                description: "Making designer fashion accessible to everyone",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-background p-6 rounded-lg text-center"
              >
                <div className="mb-4 text-primary inline-block">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Join Our Fashion Revolution</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full inline-flex items-center gap-2"
        >
          Get Started <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}
