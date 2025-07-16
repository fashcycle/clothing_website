import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: any;
  isAddingToWishlist: string | null;
  isAddingToCart: string | null;
  cartItems: string[];
  wishlistedItems: string[];
  toggleFavorite: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAddingToWishlist,
  isAddingToCart,
  cartItems,
  wishlistedItems,
  toggleFavorite,
}) => {
  return (
    <Card
      className={cn(
        "product-card border-0 rounded-none luxury-shadow flex flex-col h-full"
      )}
    >
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="overflow-hidden">
            <Image
              src={product.productImage.frontLook || "/placeholder.svg"}
              alt={product.title || "productImg"}
              width={300}
              height={400}
              className="w-full aspect-[4/5] object-cover product-image"
            />
          </div>
        </Link>
        <button
          onClick={() => toggleFavorite(product.id)}
          disabled={isAddingToWishlist === product.id}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-transform duration-300 hover:scale-110 z-10"
          aria-label={
            wishlistedItems.some((item: any) => item.id === product.id)
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isAddingToWishlist === product.id && "animate-pulse",
              wishlistedItems.some((item: any) => item.id === product.id)
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground"
            )}
          />
        </button>
      </div>
      <CardContent className="p-2 md:p-4 flex flex-col flex-grow">
        <div className="space-y-2 flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 capitalize">
            {product.productName}
          </h3>
          <div className="flex flex-col items-start gap-2 md:flex-row">
            <Badge
              variant="outline"
              className="border-black-800 text-black-800 rounded-full px-3 py-1 capitalize"
            >
              {product.category?.name}
            </Badge>
            <Badge
              variant="outline"
              className="border-black-800 text-black-800 rounded-full px-3 py-1 capitalize"
            >
              Size- {product.size}
            </Badge>
          </div>
          <div className="space-y-1 flex-grow">
            {product.listingType.includes("rent") && (
              <>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <span className="text-sm text-gray-600">Rent (3 days):</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{Math.round(product.rentPrice3Days)}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <span className="text-sm text-gray-600">Rent (7 days):</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{Math.round(product.rentPrice7Days)}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <span className="text-sm text-gray-600">Rent (14 days):</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{Math.round(product.rentPrice14Days)}
                  </span>
                </div>
              </>
            )}
            {product.listingType.includes("sell") && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Buy Now :</span>
                <span className="text-sm font-medium text-gray-900">
                  ₹{Math.round(product.sellingPrice)}
                </span>
              </div>
            )}
          </div>
        </div>
        <Link href={`/products/${product.id}`} className="mt-4">
          <Button
            disabled={isAddingToCart === product.id}
            className="w-full"
            variant={cartItems.includes(product.id) ? "default" : "outline"}
          >
            <Eye className="w-4 h-4 mr-2" />
            Have a Look
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
