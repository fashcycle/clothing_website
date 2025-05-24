"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Trash2,Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {  getCartItems, removeFromWishlist, getWishlistedProducts, addToWishlist } from "@/app/api/api";
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader"

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

export default function CartPage() {
  const router = useRouter();
  const [wishlistedItems, setWishlistedItems] = useState<any>([]);  // Initialize as empty array
  const [isLoading, setIsLoading] = useState<any>(true)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<any>(null);
  const [isClient, setIsClient] = useState<any>(false)
  const [cartItems, setCartItems] = useState<any>([]);
  const[user,setUser]=useState<any>("")

  useEffect(() => {
    setIsClient(true)
    let userData:any=localStorage.getItem("user-info")
    setUser(JSON.parse(userData))
          fetchCartItems(),
          fetchWishlist()
  }, []);

  // Remove initialWishlistItems mock data from the top of the file

  const fetchCartItems = async () => {
    try {
      const response = await getCartItems();
      if (response.success) {
          setCartItems(response.cart);
          setIsLoading(false)
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await getWishlistedProducts();
      if (response.success) {
        setWishlistedItems(response.products);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleFavorite = async (productId: any) => {
    try {
      setIsAddingToWishlist(productId);

      if (wishlistedItems.some((item: any) => item.id === productId)) {
        // Remove from wishlist
        let obj:any={
          "userId": user?.id,
          "productId": productId
        }
        const response = await removeFromWishlist(obj);
        if (response.success) {
          await fetchWishlist();
          toast.success("Removed from wishlist!");
        }
      } else {
        // Add to wishlist
        const response = await addToWishlist({ productId });
        if (response.success) {
          await fetchWishlist();
          toast.success("Added to wishlist!");
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error('Error updating wishlist:', error);
    } finally {
      setIsAddingToWishlist(null);
    }
  };


  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="container mx-auto px-4 py-8"
  >
    {/* Delivery Address */}
    <motion.div 
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      className="p-6 border rounded-lg mb-6 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg mb-2">Deliver to:</h2>
          <p className="text-lg font-medium">Swati Patidar, 452001</p>
          <p className="text-gray-600 mt-1">
            124, Guru Kripa Girls Hostel, Vishnupuri, Bhawarkuan, Indore, MP
          </p>
        </div>
        <Button 
          variant="outline" 
          className="hover:scale-105 transition-transform"
        >
          Change Address
        </Button>
      </div>
    </motion.div>

    {/* Offers Section */}
    <motion.div 
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-6 border rounded-lg mb-6 bg-white shadow-sm hover:shadow-md transition-all"
    >
      <h3 className="font-semibold mb-3 text-lg">Available Offers</h3>
      <ul className="text-gray-600 space-y-2">
        <motion.li 
          whileHover={{ x: 10 }}
          className="flex items-center gap-2"
        >
          <span className="text-pink-500">•</span>
          10% Instant Discount on Axis Bank Credit Cards
        </motion.li>
      </ul>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        className="text-pink-600 font-medium mt-3 hover:underline"
      >
        Show More
      </motion.button>
    </motion.div>

    {/* Cart Items */}
    {cartItems.length === 0 ? (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4 border-2 border-gray-300 rounded-full p-3" />
        <h3 className="text-xl font-semibold mb-2">Your Cart is Empty</h3>
        <p className="text-muted-foreground text-center mb-6">
          Looks like you haven't added anything to your cart yet
        </p>
        <Button 
          onClick={() => router.push('/')}
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          Continue Shopping
        </Button>
      </motion.div>
    ) : (
    <AnimatePresence>
      {cartItems?.map((item: any, idx: number) => (
        <motion.div
          key={item.product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ delay: idx * 0.1 }}
          className="p-6 border rounded-lg mb-4 bg-white shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Image
                src={item?.product?.productImage?.frontLook || "/placeholder.png"}
                alt={item.product?.projectName}
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
            </motion.div>
            
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{item.product?.projectName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm capitalize">{item?.product.color}</span>
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item?.product?.color }}
                />
              </div>              
             

              <div className="mt-4 flex items-center gap-4">
                <span className="text-xl font-semibold">₹{item?.product?.originalPurchasePrice}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
    )}
    {/* Cart Summary */}
    <motion.div
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">Total: ₹{cartItems.reduce((acc: number, item: any) => acc + item?.product?.originalPurchasePrice, 0)}</p>
        </div>
        <Button 
          className="bg-pink-600 hover:bg-pink-700 text-white px-8"
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </div>
    </motion.div>
  </motion.div>
  );
}