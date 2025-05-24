"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { getAllProducts, getCartItems, addToCart, removeFromWishlist, getWishlistedProducts, addToWishlist } from "@/app/api/api";
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader"

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
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([])
  const [isClient, setIsClient] = useState(false)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  const[user,setUser]=useState<any>("")
  const fetchWishlist = async () => {
    try {
      const response = await getWishlistedProducts();
      if (response.success) {
        const wishlistIds = response.products;
        setWishlistedItems(wishlistIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };
  const toggleFavorite = async (productId: string) => {
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
  const handleAddToCart = async (productId: string) => {
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

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.success) {

        const sortedProducts = response.products.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProducts(sortedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };
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

  useEffect(() => {
    let userData:any=localStorage.getItem("user-info")
setUser(JSON.parse(userData))
    setIsClient(true);
    fetchProducts();
    fetchCartItems();
    fetchWishlist();
  }, []);

  useEffect(() => {
    setIsClient(true)
  }, [])


  return (
    <>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader text="Loading products..." />
        </div>) :
        products.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4 border-2 border-gray-300 rounded-full p-3" />
            <h3 className="text-xl font-semibold mb-2">No Featured Products</h3>
            <p className="text-muted-foreground text-center mb-6">
              Check back soon for our latest featured items
            </p>
          
          </div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

          {products?.slice(0, 4).map((product: any, index: any) => (<Card
            key={product.id}
            className={cn(
              "product-card border-0 rounded-none luxury-shadow",
              isClient && `animate-fade-in-delay-${index}`,
            )}
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
                <span className="text-sm  capitalize">{product.color}</span>
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
                      <span>Rent for ₹{product.originalPurchasePrice}/day</span>
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

