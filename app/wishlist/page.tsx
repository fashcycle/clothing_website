"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCartItems,
  addToCart,
  removeFromWishlist,
  getWishlistedProducts,
  addToWishlist,
} from "@/app/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistedItems, setWishlistedItems] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<any>(null);
  const [isClient, setIsClient] = useState<any>(false);
  const [isAddingToCart, setIsAddingToCart] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any>([]);
  const [user, setUser] = useState<any>("");

  useEffect(() => {
    let userData: any = localStorage.getItem("user-info");
    setUser(JSON.parse(userData));
    setIsClient(true);
    fetchCartItems(), fetchWishlist();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await getCartItems();
      if (response.success) {
        const cartProductIds = response.cart.map((item: any) => item.productId);
        setCartItems(cartProductIds);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  const handleAddToCart = async (productId: any) => {
    try {
      let obj: any = {
        productId: productId,
        quantity: 1,
      };
      setIsAddingToCart(productId);
      const response = await addToCart(obj);
      if (response.success) {
        fetchCartItems();
        toast.success("Added to cart successfully!");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(null);
    }
  };
  const fetchWishlist = async () => {
    try {
      const response = await getWishlistedProducts();
      if (response.success) {
        setWishlistedItems(response.products);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const toggleFavorite = async (productId: any) => {
    try {
      setIsAddingToWishlist(productId);

      if (wishlistedItems.some((item: any) => item.id === productId)) {
        let obj: any = {
          userId: user?.id,
          productId: productId,
        };
        const response = await removeFromWishlist(obj);
        if (response.success) {
          await fetchWishlist();
          toast.error("Removed from wishlist!");
        }
      } else {
        const response = await addToWishlist({ productId });
        if (response.success) {
          await fetchWishlist();
          toast.success("Added to wishlist!");
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist(null);
    }
  };
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div className="container py-8 text-center lg:pt-24">
        {wishlistedItems?.length > 0 && (
          <>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              Your Wishlist
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              You have {wishlistedItems?.length} item saved for later.
            </p>
          </>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center align-center py-8">
          <Loader text="Loading products..." />
        </div>
      ) : wishlistedItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Heart className="w-16 h-16 mb-4 fill-green-700 text-green-800" />
          <h3 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h3>
          <p className="text-muted-foreground text-center mb-6">
            Discover and save items you love for later
          </p>
          <Button
          variant='outline'
            onClick={() => router.push("/")}
           
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-10 container lg:grid-cols-5">
          {wishlistedItems?.map((product: any, index: any) => (
            <ProductCard
              key={product.id}
              product={product}
              isAddingToWishlist={isAddingToWishlist}
              isAddingToCart={isAddingToCart}
              cartItems={cartItems}
              wishlistedItems={wishlistedItems}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </>
  );
}
