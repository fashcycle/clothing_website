"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dummy data for demonstration
const initialWishlistItems = [
  {
    id: 1,
    name: "Floral Lehenga",
    price: "₹15,999",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500",
    category: "LEHENGA"
  },
  {
    id: 2,
    name: "Designer Gown",
    price: "₹12,999",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
    category: "GOWN"
  }
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)

  const removeFromWishlist = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id))
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-serif mb-8">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500">Start adding items you love!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{item.price}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}