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
import { filteredProductList } from "@/app/api/api";
import { Loader } from "@/components/ui/loader";

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

export default function EveningDressesPage() {
  const [showMore, setShowMore] = useState(false);
  const [postageAvailable, setPostageAvailable] = useState(false);
  const [resaleAvailable, setResaleAvailable] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>("");
  const params = useParams();
  const category = params?.category || ""; // fallback in case category is not in URL
  const formattedCategory = decodeURIComponent(
    category.toString().replace(/-/g, " ")
  );
  useEffect(() => {
    let userData: any = localStorage.getItem("user-info");
    setUser(JSON.parse(userData));
    setIsClient(true);
    // Only add category to query if it is a real filter, not 'browse' or empty
    let query: any = {};
    if (category && category !== "browse") {
      query.category = category;
    }
    fetchProducts(query);
    // fetchCartItems();
    // fetchWishlist();
  }, []);

  const fetchProducts = async (query: any) => {
    try {
      const response = await filteredProductList(query);
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
  return (
    <div className="container py-10">
      {isLoading ? (
        <div className="flex justify-center align-center py-8">
          <Loader text="Loading products..." />
        </div>
      ) : products?.length > 0 ? (
        <>
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
              {formattedCategory.charAt(0).toUpperCase() + formattedCategory.slice(1)}
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
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          className="mr-2"
                          defaultChecked
                        />
                        <span className="text-sm">ALL</span>
                      </label>
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

                  <FilterSection title="Brand">
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
                  </FilterSection>

                  <FilterSection title="Size">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="size"
                          className="mr-2"
                          defaultChecked
                        />
                        <span className="text-sm">ALL</span>
                      </label>
                    </div>
                  </FilterSection>

                  <FilterSection title="Colour">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="colour"
                          className="mr-2"
                          defaultChecked
                        />
                        <span className="text-sm">ALL</span>
                      </label>
                    </div>
                  </FilterSection>

                  {/* ...existing code for commented-out filters... */}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {formattedCategory.charAt(0).toUpperCase() + formattedCategory.slice(1)}
                  </h1>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    <p>
                      Hire a show-stopping evening dress no matter what the occasion is. Discover the curated Evening Dresses featuring floor-length gowns & dazzling midi dresses with statement sleeves. There's something for everyone, from brands such as Nadine Merabi, Saloni, The Vampire's Wife and more.
                      {showMore && (
                        <span>
                          Our collection includes elegant black-tie options, cocktail dresses perfect for special events, and glamorous pieces that will make you feel confident and beautiful. Whether you're attending a wedding, gala, or formal dinner, find the perfect dress to rent for your special occasion.
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
                        className={`ml-1 h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products?.map((product: any) => (
                    <Card
                      key={product.id}
                      className="group cursor-pointer border-0 shadow-none hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3">
                          <Image
                            src={product?.productImage?.frontLook || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                            {product?.listingType?.map((tag: any) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className={`text-xs px-2 py-1 ${
                                  tag === "Black-Tie"
                                    ? "bg-black text-white"
                                    : tag === "Wedding Guest"
                                    ? "bg-pink-500 text-white"
                                    : "bg-gray-800 text-white"
                                }`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900">
                            {product.size}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {product.productName}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              Rent from {product.originalPurchasePrice}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            No products found
          </h2>
          <p className="text-gray-600 mt-2 mb-6">
            We couldn’t find anything in this category right now. Try adjusting the filters or explore other collections.
          </p>
          <Link href="/">
            <Button variant="default">Browse All Collections</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
