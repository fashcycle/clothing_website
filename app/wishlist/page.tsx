"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Trash2,Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {  getCartItems, addToCart, removeFromWishlist, getWishlistedProducts, addToWishlist } from "@/app/api/api";
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

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<any>([])  // Initialize as empty array
  const [wishlistedItems, setWishlistedItems] = useState<any>([]);  // Initialize as empty array
  const [isLoading, setIsLoading] = useState<any>(true)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<any>(null);
  const [isClient, setIsClient] = useState<any>(false)
  const [isAddingToCart, setIsAddingToCart] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any>([]);
  const[user,setUser]=useState<any>("")

  // Move data fetching to useEffect
  useEffect(() => {
    let userData:any=localStorage.getItem("user-info")
    setUser(JSON.parse(userData))
    setIsClient(true);
          fetchCartItems(),
          fetchWishlist()
  }, []);

  // Remove initialWishlistItems mock data from the top of the file

  const fetchCartItems = async () => {
    try {
      const response = await getCartItems();
      if (response.success) {
        const cartProductIds = response.cart.map((item: any) => item.productId);
        setCartItems(cartProductIds);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  const handleAddToCart = async (productId: any) => {
    try {
      let obj: any = {
        "productId": productId,
        "quantity": 1
      }
      setIsAddingToCart(productId);
      const response = await addToCart(obj);
      if (response.success) {
        fetchCartItems()
        toast.success("Added to cart successfully!");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(null);
    }
  };
  const fetchWishlist = async () => {
    try {
      const response = await getWishlistedProducts();
      if (response.success) {
        setWishlistedItems(response.products);
        setIsLoading(false)
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
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <div className="container py-8 text-center">
   
      {wishlistedItems?.length > 0 &&
      <> 
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">
      Your Wishlist ❤️
    </h1>
    <p className="text-muted-foreground text-sm md:text-base">
         `You have {wishlistedItems?.length} item saved for later.`
    </p>
    </>
}
  </div>
    {isLoading ? (
      <div className="flex justify-center align-center py-8">
        <Loader text="Loading products..." />
      </div>) :
       wishlistedItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mb-4 fill-pink-600 text-red-500" />
          <h3 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h3>
          <p className="text-muted-foreground text-center mb-6">
            Discover and save items you love for later
          </p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Start Shopping
          </Button>
        </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6  py-10 container">
        {wishlistedItems?.map((product: any, index: any) => (
          <Card
          key={product.id}
   
        >
          <div className="relative">
            <Link href={`/products/${product.id}`}>
              <div className="overflow-hidden">
                <Image
                  src={product.productImage.frontLook || "/placeholder.svg"}
                  alt={product.title}
                  width={300}
                  height={400}
                  className="w-full h-[350px] object-cover product-image"
                />
              </div>
            </Link>
            <button
              onClick={() => toggleFavorite(product.id)}
              disabled={isAddingToWishlist === product.id}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-transform duration-300 hover:scale-110 z-10"
              aria-label={wishlistedItems.some((item: any) => item.id === product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={cn(

                  "h-5 w-5 transition-colors",
                  isAddingToWishlist === product.id && "animate-pulse",
                  wishlistedItems.some((item: any) => item.id === product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )}
              />
            </button>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              {/* <p className="product-designer">{product.designer}</p> */}
              <h3 className="font-medium line-clamp-1 capitalize">{product.productName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm capitalize">{product.color}</span>
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: product.color }}
                />
              </div>
              {/* <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div> */}

              <div className="flex flex-col gap-1 pt-1">
              <p className="product-price">
                    <span>Size: {product.size}</span>
                  </p>
                {product.listingType.includes('rent') && (
                  <p className="product-price">
                    <span>Rent for ₹{product?.originalPurchasePrice}/day</span>
                  </p>
                )}
                {product.listingType.includes('sell') && (
                  <p className="product-price">
                    <span>Buy for ₹{product.originalPurchasePrice}</span>
                  </p>
                )}
                <Button
                  onClick={() => cartItems.includes(product.id)
                    ? router.push('/cart')
                    : handleAddToCart(product.id)
                  }
                  disabled={isAddingToCart === product.id}
                  className="mt-2 w-full"
                  variant={cartItems.includes(product.id) ? "default" : "outline"}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isAddingToCart === product.id
                    ? 'Adding...'
                    : cartItems.includes(product.id)
                      ? 'Go to Cart'
                      : 'Add to Cart'
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        ))}
      </div>
      )
    }
  </>
  )
}