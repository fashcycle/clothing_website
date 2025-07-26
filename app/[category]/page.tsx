"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, CloudCog, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useParams } from "next/navigation";
import {
  addToWishlist,
  filteredProductList,
  getAllCategories,
  getCartItems,
  getWishlistedProducts,
  removeFromWishlist,
} from "@/app/api/api";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
type Category = {
  id: number;
  name: string;
  image: string;
  count: number;
};
const FilterSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-gray-200 pb-4 mb-4"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium">
        {title}
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
};
const sizes = [
  {
    id: 1,
    name: "XS",
  },
  {
    id: 2,
    name: "S",
  },
  {
    id: 3,
    name: "M",
  },
  {
    id: 4,
    name: "L",
  },
  {
    id: 5,
    name: "XL",
  },
  {
    id: 6,
    name: "XXL",
  },
];
const colors = [
  { name: "Red", color: "bg-red-500" },
  { name: "Pink", color: "bg-pink-500" },
  { name: "Maroon", color: "bg-red-900" },
  { name: "Orange", color: "bg-orange-500" },
  { name: "Yellow", color: "bg-yellow-500" },
  { name: "Green", color: "bg-green-500" },
  { name: "Blue", color: "bg-blue-500" },
  { name: "Navy", color: "bg-blue-900" },
  { name: "Purple", color: "bg-purple-500" },
  { name: "Black", color: "bg-black" },
  {
    name: "White",
    color: "bg-white border border-gray-200",
  },
  { name: "Grey", color: "bg-gray-500" },
  { name: "Brown", color: "bg-amber-800" },
  { name: "Gold", color: "bg-yellow-600" },
  { name: "Silver", color: "bg-gray-300" },
];
export default function EveningDressesPage() {
  const [showMore, setShowMore] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<any>(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any>([]);
  const [user, setUser] = useState<any>("");
  const params = useParams();
  const categoryParam = params?.category || "";
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedListingType, setSelectedListingType] = useState<string>("");
  const [wishlistedItems, setWishlistedItems] = useState<any>([]);
  const [isAddingToCart, setIsAddingToCart] = useState<any>(null);

  const [page, setPage] = useState(1);
  // NOTE------- Set limit to activate pagination and comment out pagination buttons
  const [limit, setLimit] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    let userData: any = localStorage.getItem("user-info");
    setUser(JSON.parse(userData));
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
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.categories || []);
        if (categoryParam && categoryParam !== "browse") {
          // Try to match by id (number or string)
          const found = (data.categories || []).find(
            (cat: Category) => String(cat.id) === String(categoryParam)
          );
          if (found) {
            setSelectedCategory(found.id);
          } else {
            setSelectedCategory("");
          }
        } else {
          setSelectedCategory("");
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [categoryParam]);

  useEffect(() => {
    let userData: any = localStorage.getItem("user-info");
    setUser(JSON.parse(userData));
    scrollToTop();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    let query: any = {};
    if (selectedCategory && selectedCategory !== "browse") {
      query.category = selectedCategory;
    }
    if (selectedSize) {
      query.size = selectedSize;
    }
    if (selectedColor) {
    query.color = selectedColor.toLowerCase();
    }
    if (selectedListingType) {
      query.listingType = selectedListingType;
    }
    query.page = page;
    query.limit = limit;
    setIsLoading(true);
    fetchProducts(query);
  }, [
    selectedCategory,
    selectedSize,
    selectedColor,
    selectedListingType,
    page,
    limit,
  ]);

  const fetchProducts = async (query: any) => {
    try {
      const response = await filteredProductList(query);
      if (response.success) {
        setProducts(response.products);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalItems || 0);
        setLimit(response.totalItems);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container py-10 lg:mt-10">
      <nav className="px-4 py-3 text-sm">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-gray-900">
            Collections
          </Link>
          <span>/</span>
          <p className="capitalize">
            {" "}
            {categories.find((category) => category.id === selectedCategory)
              ?.name || "All"}
          </p>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white">
              <h3 className="font-medium text-gray-900 mb-4">FILTER</h3>

              <FilterSection title="Category" defaultOpen={true}>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      className="mr-2"
                      checked={selectedCategory === ""}
                      onChange={() => setSelectedCategory("")}
                    />
                    <span className="text-sm">ALL</span>
                  </label>
                  {categories?.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        className="mr-2"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                      />
                      <span className="text-sm capitalize">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Product Type">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      className="mr-2"
                      defaultChecked
                      checked={selectedListingType === ""}
                      onChange={() => setSelectedListingType("")}
                    />
                    <span className="text-sm">All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      className="mr-2"
                      checked={selectedListingType === "rent"}
                      onChange={() => setSelectedListingType("rent")}
                    />
                    <span className="text-sm">Rent</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      className="mr-2"
                      checked={selectedListingType === "sell"}
                      onChange={() => setSelectedListingType("sell")}
                    />
                    <span className="text-sm">Buy</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      className="mr-2"
                      checked={selectedListingType === "both"}
                      onChange={() => setSelectedListingType("both")}
                    />
                    <span className="text-sm">Both</span>
                  </label>
                </div>
              </FilterSection>

              

              <FilterSection title="Size">
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      className="mr-2"
                      checked={selectedSize === ""}
                      onChange={() => setSelectedSize("")}
                    />
                    <span className="text-sm">ALL</span>
                  </label>
                  {sizes.map((size) => (
                    <label
                      key={size.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="size"
                        className="mr-2"
                        checked={selectedSize === size.name}
                        onChange={() => setSelectedSize(size.name)}
                      />
                      <span className="text-sm">{size.name}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Colour">
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="colour"
                      className="mr-2"
                      checked={selectedColor === ""}
                      onChange={() => setSelectedColor("")}
                    />
                    <span className="text-sm">ALL</span>
                  </label>
                  {colors.map((color) => (
                    <label
                      key={color.name}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="colour"
                        className="mr-2"
                        checked={selectedColor === color.name}
                        onChange={() => setSelectedColor(color.name)}
                      />
                      <span
                        className={`inline-block w-4 h-4 rounded-full ${color.color}`}
                      ></span>
                      <span className="ml-2 text-sm">{color.name}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold capitalize text-gray-900 mb-4">
                {categories.find((category) => category.id === selectedCategory)
                  ?.name || "All"}
              </h1>
              <div className="text-gray-600 text-sm leading-relaxed">
                <p>
                  Hire a show-stopping evening dress no matter what the occasion
                  is. Discover the curated Evening Dresses featuring
                  floor-length gowns & dazzling midi dresses with statement
                  sleeves. There's something for everyone, from brands such as
                  Nadine Merabi, Saloni, The Vampire's Wife and more.
                  {showMore && (
                    <span>
                      Our collection includes elegant black-tie options,
                      cocktail dresses perfect for special events, and glamorous
                      pieces that will make you feel confident and beautiful.
                      Whether you're attending a wedding, gala, or formal
                      dinner, find the perfect dress to rent for your special
                      occasion.
                    </span>
                  )}
                </p>
                <Button
                  variant="ghost"
                  className="p-0 h-auto font-medium text-gray-900 hover:bg-transparent mt-2"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "SHOW LESS" : "SHOW MORE"}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                      showMore ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center align-center py-8">
                <Loader text="Loading products..." />
              </div>
            ) : products?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products?.map((product: any, index: any) => (
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
                {/* Pagination Controls */}
                {/* <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div> */}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  No products found
                </h2>
                <p className="text-gray-600 mt-2 mb-6">
                  We couldn’t find anything in this category right now. Try
                  adjusting the filters or explore other collections.
                </p>
                <Link href="/">
                  <Button variant="default">Browse All Collections</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
