import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import {
  getAllProducts,
  getCartItems,
  addToCart,
  removeFromWishlist,
  getWishlistedProducts,
  addToWishlist,
} from "@/app/api/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { ProductCard } from "./ProductCard"; // Adjust the import path as necessary

export default function FeaturedProducts() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(
    null
  );

  const fetchWishlist = async () => {
    try {
      const response = await getWishlistedProducts();
      if (response.success) {
        const wishlistIds = response.products;
        setWishlistedItems(wishlistIds);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      router.push("/login");
      return;
    } else {
      try {
        setIsAddingToWishlist(productId);
        if (wishlistedItems.some((item: any) => item.id === productId)) {
          // Remove from wishlist
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
          // Add to wishlist
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
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.success) {
        const sortedProducts = response.products.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProducts(sortedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
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
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    let userData: any = localStorage.getItem("user-info");
    setUser(JSON.parse(userData));
    setIsClient(true);
    fetchProducts();
    fetchCartItems();
    fetchWishlist();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader text="Loading products..." />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingCart className="w-16 h-16 text-gray-300 mb-4 border-2 border-gray-300 rounded-full p-3" />
          <h3 className="text-xl font-semibold mb-2">No Featured Products</h3>
          <p className="text-muted-foreground text-center mb-6">
            Check back soon for our latest featured items
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4 lg:grid-cols-5">
          {products?.slice(0, 10).map((product: any, index: any) => (
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
