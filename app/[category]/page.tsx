"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
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
import { filteredProductList, getAllCategories } from "@/app/api/api";
import { Loader } from "@/components/ui/loader";
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
  const [postageAvailable, setPostageAvailable] = useState(false);
  const [resaleAvailable, setResaleAvailable] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>("");
  const params = useParams();
  const categoryParam = params?.category || "";
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.categories || []);
        // If categoryParam is present, set selectedCategory to its id
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam]);

  // Fetch user and set client state
  useEffect(() => {
    let userData: any = localStorage.getItem("user-info");
    setUser(JSON.parse(userData));
    setIsClient(true);
    scrollToTop();
  }, []);

  // Fetch products when filters change
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
      query.color = selectedColor;
    }
    setIsLoading(true);
    fetchProducts(query);
  }, [selectedCategory, selectedSize, selectedColor]);

  const fetchProducts = async (query: any) => {
    try {
      const response = await filteredProductList(query);
      if (response.success) {
        const sortedProducts = response.products.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setProducts(sortedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container py-10">
      {/* ...existing code for nav, filters, and product grid... */}
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
          {categories.find((category) => category.id === categoryParam)?.name}
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
                      <span className="text-sm capitalize">{category.name}</span>
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
                    />
                    <span className="text-sm">ALL</span>
                  </label>
                </div>
              </FilterSection>

              {/* <FilterSection title="Brand">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="brand"
                      className="mr-2"
                      defaultChecked
                    />
                    <span className="text-sm">ALL</span>
                  </label>
                </div>
              </FilterSection> */}

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

              {/* ...existing code for commented-out filters... */}
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
                  {products?.map((product: any) => {
                    return (
                      <Link href={`/products/${product.id}`} key={product.id}>
                        <Card className="group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white rounded-2xl">
                          <CardContent className="p-0">
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden">
                              <Image
                                src={
                                  product?.productImage?.frontLook ||
                                  "/placeholder.svg"
                                }
                                alt={product.productName}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />

                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                              {/* Status Badges */}
                              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                {product?.listingType?.map((tag: any) => (
                                  <Badge
                                    key={tag}
                                    className={`text-xs px-3 py-1 font-medium shadow-lg backdrop-blur-sm ${
                                      tag === "rent"
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                                        : tag === "Black-Tie"
                                        ? "bg-black text-white border-0"
                                        : tag === "Wedding Guest"
                                        ? "bg-pink-500 text-white border-0"
                                        : "bg-gray-800 text-white border-0"
                                    }`}
                                  >
                                    {tag === "rent" ? "For Rent" : tag}
                                  </Badge>
                                ))}

                                {/* Availability Badge */}
                                {product?.isAvailability && (
                                  <Badge className="bg-green-500 text-white text-xs px-3 py-1 font-medium shadow-lg border-0">
                                    Available
                                  </Badge>
                                )}
                              </div>

                              {/* Quick Info Overlay */}
                              <div className="absolute bottom-3 left-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1 text-gray-600">
                                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                      <span>Size {product.size}</span>
                                    </div>
                                    <div className="text-purple-600 font-medium">
                                      ₹{product.rentPrice3Days}/3days
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              {/* Category & Color */}
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                  {product.category?.name || "Fashion"}
                                </span>
                                {product.color && (
                                  <>
                                    <span className="text-xs text-gray-400">
                                      •
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">
                                      {product.color}
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Product Name */}
                              <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                                {product.productName}
                              </h3>
                              {/* Pricing */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">
                                    Original Price
                                  </span>
                                  <span className="text-sm line-through text-gray-400">
                                    ₹{product.originalPurchasePrice}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900">
                                    Rent from
                                  </span>
                                  <span className="text-lg font-bold text-purple-600">
                                    ₹{product.rentPrice3Days}
                                  </span>
                                </div>

                                <div className="text-xs text-gray-500 text-center">
                                  3 days • 7 days • 14 days available
                                </div>
                              </div>

                              {/* Action Button */}
                              <Link href={`/products/${product.id}`}>
                                <button
                                  // onClick={(e) => {
                                  //   e.preventDefault();
                                  //   // Add to cart or quick rent action
                                  // }}
                                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                >
                                  {product.listingType[0] === "rent"
                                    ? "Quick Rent"
                                    : product.listingType[0] === "sell"
                                    ? "Quick Buy"
                                    : "Buy or Rent "}
                                </button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
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
