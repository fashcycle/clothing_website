"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Home,
  ShoppingCart,
  CalendarDays,
  RotateCcw,
  CloudCog,
} from "lucide-react";
import { addDays, isBefore, format, differenceInDays } from "date-fns";
import "react-day-picker/dist/style.css";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { addToCart, getCartItems, getSingleProduct } from "@/app/api/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import CalendarModal from "@/components/CalendarModal";

export default function ProductPage({ id }: { id: string }) {
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [selectedRentalDays, setSelectedRentalDays] = useState<number | null>(
    null
  );
  const [rentFromDate, setRentFromDate] = useState<Date | null>(null);
  const [rentToDate, setRentToDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [cartSelectionState, setCartSelectionState] = useState<{
    rentalDays: number | null;
    fromDate: Date | null;
    toDate: Date | null;
  }>({
    rentalDays: null,
    fromDate: null,
    toDate: null,
  });

  const router = useRouter();

  // Save state to localStorage when rental details change
  useEffect(() => {
    if (product?.id && selectedRentalDays && rentFromDate && rentToDate) {
      const stateKey = `rental_state_${product.id}`;
      const state = {
        rentalDays: selectedRentalDays,
        fromDate: rentFromDate.toISOString(),
        toDate: rentToDate.toISOString(),
      };
      localStorage.setItem(stateKey, JSON.stringify(state));
    }
  }, [product?.id, selectedRentalDays, rentFromDate, rentToDate]);

  // Load state from localStorage on component mount
  useEffect(() => {
    if (product?.id) {
      const stateKey = `rental_state_${product.id}`;
      const savedState = localStorage.getItem(stateKey);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setSelectedRentalDays(parsed.rentalDays);
          setRentFromDate(new Date(parsed.fromDate));
          setRentToDate(new Date(parsed.toDate));
          setIsDateSelected(true);
          setCartSelectionState({
            rentalDays: parsed.rentalDays,
            fromDate: new Date(parsed.fromDate),
            toDate: new Date(parsed.toDate),
          });
        } catch (error) {
          console.error("Error parsing saved rental state:", error);
        }
      }
    }
  }, [product?.id]);

  const fetchProduct = async () => {
    try {
      const response = await getSingleProduct(id);
      if (response.success) {
        setProduct(response.product);
        if (response.product?.productImage?.frontLook) {
          setSelectedImage(response.product.productImage.frontLook);
        }
      }
    } catch (err) {
      console.error("Failed to fetch product", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await getCartItems();
      if (response.success) {
        const cartIds = response.cart.map((c: any) => c.product.id);
        setCartItems(cartIds);
      }
    } catch (err) {
      console.error("Failed fetching cart items", err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (!product) return;

    const imgs = Object.entries(product.productImage || {})
      .filter(
        ([key, value]) =>
          value !== null &&
          value !== undefined &&
          !["id", "productId"].includes(key)
      )
      .map(([key, path]) => ({ key, path }));

    setProductImages(imgs);
  }, [product]);

  const handleDaySelect = (fromDate: Date | undefined) => {
    if (!fromDate || !selectedRentalDays) return;

    const toDate = addDays(fromDate, selectedRentalDays);
    setRentFromDate(fromDate);
    setRentToDate(toDate);
  };

  const handleRentalDaySelection = (days: number) => {
    setSelectedRentalDays(days);
    setRentFromDate(null);
    setRentToDate(null);
    setIsDateSelected(false);
    setIsCalendarOpen(true);
  };

  const handleCalendarConfirm = () => {
    setIsCalendarOpen(false);
    setIsDateSelected(true);
    toast.success("Rental dates selected successfully!");
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setIsAddingToCart(productId);

      let payload: any = { productId };
      const isRent =
        (Array.isArray(product?.listingType) &&
          product.listingType.includes("rent")) ||
        product.listingType.includes("both");

      if (isRent) {
        if (!rentFromDate || !rentToDate) {
          toast.error("Please select rental dates first");
          return;
        }
        payload = {
          productId,
          rentFrom: rentFromDate.toISOString().split("T")[0],
          rentTo: rentToDate.toISOString().split("T")[0],
        };
      } else {
        payload = { ...payload, quantity: 1 };
      }

      const response = await addToCart(payload);
      if (response.success) {
        setCartItems((prev) => [...prev, productId]);
        toast.success("Added to cart successfully");

        if (isRent && selectedRentalDays && rentFromDate && rentToDate) {
          setCartSelectionState({
            rentalDays: selectedRentalDays,
            fromDate: rentFromDate,
            toDate: rentToDate,
          });
        }

        fetchCartItems();
      }
    } catch (err) {
      setCartItems((prev) => prev.filter((id) => id !== productId));
      toast.error(err.message || "Failed to add to cart");
      console.error(err);
    } finally {
      setIsAddingToCart(null);
    }
  };

  const renderRentalButtons = () => {
    if (!product) return null;
    // Show rental buttons if listingType is 'rent', 'both', or includes them
    const listingType = product.listingType;
    const isRent =
      (Array.isArray(listingType) &&
        (listingType.includes("rent") || listingType.includes("both"))) ||
      listingType === "rent" ||
      listingType === "both";
    if (!isRent) return null;

    const options = [
      { days: 3, price: product.rentPrice3Days },
      { days: 7, price: product.rentPrice7Days },
      { days: 14, price: product.rentPrice14Days },
    ];

    return (
      <div className="space-y-3 mb-4">
        <h3 className="font-semibold text-base">Select Rental Duration</h3>
        <div className="grid grid-cols-3 gap-2">
          {options.map(({ days, price }) => {
            const isSelected = selectedRentalDays === days;

            return (
              <motion.div
                key={days}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handleRentalDaySelection(days)}
                  className={`w-full p-2 h-auto flex flex-col items-center justify-center relative text-xs ${
                    isSelected
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {days === 7 && (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold absolute text-[10px] top-[-12px]">
                      Recommended
                    </Badge>
                  )}
                  <div className="font-semibold text-sm">{days} Days</div>
                  <div className="text-xs opacity-75 flex-col items-center ">
                    <p> Perfect for </p>
                    <p>
                      {days === 3
                        ? "Events"
                        : days === 7
                        ? "Occasions"
                        : "Extended"}
                    </p>
                  </div>
                  <div className="font-bold text-sm mt-1">₹{price}</div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {rentFromDate && rentToDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-700 font-medium">Rental Dates:</span>
              <span className="font-semibold text-emerald-700">
                {format(rentFromDate, "MMM dd")} -{" "}
                {format(rentToDate, "MMM dd, yyyy")}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader text="Loading product..." />
      </div>
    );
  }

  const isRentProduct =
    (Array.isArray(product.listingType) &&
      product.listingType.includes("rent")) ||
    product.listingType.includes("both");

  const isSellProduct =
    Array.isArray(product.listingType) && product.listingType.includes("sell");

  return (
    <>
      <div className="max-w-7xl mx-auto py-4 px-4 md:pt-12 lg:pt-24">
        {/* Compact Breadcrumb */}
        <div className="flex items-center text-xs mb-4 gap-2 lg:mt-6">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <Home className="h-3 w-3" /> Home
          </Link>
          <span>/</span>
          <Link href="/browse" className="hover:underline">
            All Categories
          </Link>
          <span>/</span>
          <Link
            href={
              product?.category &&
              typeof product.category === "object" &&
              product.category.slug
                ? `/${product.category.id}`
                : "/dashboard"
            }
            className="hover:underline capitalize"
          >
            {product?.category && typeof product.category === "object"
              ? product.category.name
              : typeof product?.category === "string"
              ? product.category
              : "Category"}
          </Link>
          <span>/</span>
          <span className="text-gray-500 truncate">{product.productName}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1 xl:col-span-1"
          >
            <div className="relative w-full aspect-[3/3] rounded-lg overflow-hidden shadow-lg mb-3">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img) => (
                <motion.div
                  key={img.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(img.path)}
                  className={`relative aspect-[4/5] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === img.path
                      ? "border-emerald-600 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img.path}
                    alt="thumbnail"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1 xl:col-span-1 space-y-4"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">{product.productName}</h1>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge
                variant="outline"
                className="border-blue-400 bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs capitalize"
              >
                {product.category?.name}
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-400 bg-emerald-100 text-blue-800 rounded-full px-2 py-1 text-xs capitalize"
              >
                Size: {product.size}
              </Badge>
            </div>

            {/* Rental Options */}
            {isRentProduct && renderRentalButtons()}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isSellProduct && (
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 text-sm rounded-lg shadow-lg"
                  onClick={() => handleAddToCart(product.id)}
                >
                  BUY NOW
                </Button>
              )}

              <Button
                onClick={() =>
                  cartItems.includes(product.id)
                    ? router.push("/cart")
                    : handleAddToCart(product.id)
                }
                disabled={
                  isAddingToCart === product.id ||
                  (isRentProduct && (!rentFromDate || !rentToDate))
                }
                className={`flex-1 py-4 text-sm rounded-lg shadow-lg ${
                  cartItems.includes(product.id)
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }`}
                variant={cartItems.includes(product.id) ? "default" : "outline"}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isAddingToCart === product.id
                  ? "Adding..."
                  : cartItems.includes(product.id)
                  ? "Go to Cart"
                  : "Add to Cart"}
              </Button>
            </div>

            {/* Guarantee Badge */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                ✓ All purchases are verified and guaranteed authentic
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-2 xl:col-span-1 space-y-4"
            >
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-base mb-3">
                  Product Details
                </h3>

                {[
                  { label: "COLOUR", value: product.color },
                  { label: "SIZE FLEXIBILITY", value: product.sizeFlexibility },
                  {
                    label: "ORIGINAL PRICE",
                    value: `₹${product.originalPurchasePrice}`,
                  },
                  { label: "SIZE", value: product?.size },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span className="text-gray-600 font-medium text-sm">
                      {label}
                    </span>
                    <span className="font-semibold capitalize text-sm">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h2 className="font-semibold mb-2 text-sm">About this item</h2>
                <p className="text-gray-700 text-sm">
                  {product.description ||
                    `Quality ${product.productName} in ${product.color}. Size ${product.size}.`}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Product Details Section */}
        </div>
      </div>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedRentalDays={selectedRentalDays}
        rentFromDate={rentFromDate}
        rentToDate={rentToDate}
        onDaySelect={handleDaySelect}
        onConfirm={handleCalendarConfirm}
      />
    </>
  );
}
