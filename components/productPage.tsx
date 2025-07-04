"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  ShoppingCart,
  X,
  CalendarDays,
} from "lucide-react";
import { addDays, isBefore, format, differenceInDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  addToCart,
  getAllProducts,
  getCartItems,
  getSingleProduct,
  getWishlistedProducts,
} from "@/app/api/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Modal Component
const CalendarModal = ({
  isOpen,
  onClose,
  selectedRentalDays,
  rentFromDate,
  rentToDate,
  onDaySelect,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedRentalDays: number | null;
  rentFromDate: Date | null;
  rentToDate: Date | null;
  onDaySelect: (day: Date | undefined) => void;
  onConfirm: () => void;
}) => {
  const minSelectableDate = addDays(new Date(), 2);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Rental Dates</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedRentalDays && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected Duration:</strong> {selectedRentalDays} days
                </p>
              </div>
            )}

            <div className="border rounded-lg p-4">
              <DayPicker
                mode="single"
                selected={rentFromDate ?? undefined}
                onSelect={onDaySelect}
                disabled={{ before: minSelectableDate }}
                modifiers={{
                  rentalRange:
                    rentFromDate && rentToDate
                      ? { from: rentFromDate, to: rentToDate }
                      : undefined,
                }}
                modifiersClassNames={{
                  rentalRange: "bg-emerald-200 text-emerald-900",
                }}
                className="w-full"
              />
            </div>

            {rentFromDate && rentToDate && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-800 text-center">
                  <strong>Rental Period:</strong>
                  <br />
                  {format(rentFromDate, "MMM dd, yyyy")} →{" "}
                  {format(rentToDate, "MMM dd, yyyy")}
                  <br />
                  <span className="text-xs">
                    ({differenceInDays(rentToDate, rentFromDate)} days)
                  </span>
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={!rentFromDate || !rentToDate}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Confirm Dates
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

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

  const router = useRouter();

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
      .filter(([, path]) => path)
      .map(([key, path]) => ({ key, path }));
    setProductImages(imgs);
  }, [product]);

  const minSelectableDate = addDays(new Date(), 2);

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;
    if (isBefore(day, minSelectableDate)) return;

    setRentFromDate(day);
    if (selectedRentalDays) {
      const to = addDays(day, selectedRentalDays);
      setRentToDate(to);
    }
  };

  const handleRentalDaySelection = (days: number) => {
    setSelectedRentalDays(days);
    // Reset dates when changing rental duration
    setRentFromDate(null);
    setRentToDate(null);
  };

  const handleCalendarConfirm = () => {
    setIsCalendarOpen(false);
    toast.success("Rental dates selected successfully!");
  };

  const resetRentalState = () => {
    setRentFromDate(null);
    setRentToDate(null);
    setSelectedRentalDays(null);
  };

  const getCurrentRentalPrice = () => {
    if (!selectedRentalDays || !product) return 0;

    switch (selectedRentalDays) {
      case 3:
        return product.rentPrice3Days;
      case 7:
        return product.rentPrice7Days;
      case 14:
        return product.rentPrice14Days;
      default:
        return product.rentPrice3Days;
    }
  };
  const handleAddToCart = async (productId: string) => {
    try {
      setIsAddingToCart(productId);

      // Build payload depending on listing type
      let payload: any = { productId };
      const isRent =
        Array.isArray(product?.listingType) &&
        product.listingType.includes("rent");

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

      
        fetchCartItems();
      }
    } catch (err) {

      setCartItems((prev) => prev.filter((id) => id !== productId));
      toast.error("Failed to add to cart");
      console.error(err);
    } finally {
      setIsAddingToCart(null);
    }
  };

  const renderRentalButtons = () => {
    if (!product) return null;
    if (
      !Array.isArray(product.listingType) ||
      !product.listingType.includes("rent")
    )
      return null;

    const options = [
      { days: 3, price: product.rentPrice3Days },
      { days: 7, price: product.rentPrice7Days },
      { days: 14, price: product.rentPrice14Days },
    ];

    return (
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-lg">Select Rental Duration</h3>
        <div className="grid grid-cols-1 gap-3">
          {options.map(({ days, price }) => (
            <motion.div
              key={days}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={selectedRentalDays === days ? "default" : "outline"}
                onClick={() => handleRentalDaySelection(days)}
                className={`w-full p-4 h-auto flex justify-between items-center ${
                  selectedRentalDays === days
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">{days} Days</div>
                  <div className="text-sm opacity-75">
                    Perfect for{" "}
                    {days === 3
                      ? "events"
                      : days === 7
                      ? "occasions"
                      : "extended use"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">₹{price}</div>
                  <div className="text-xs opacity-75">
                    ₹{Math.round(price / days)}/day
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderDateSelection = () => {
    if (!selectedRentalDays) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Select Dates</h3>
          {rentFromDate && rentToDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRentFromDate(null);
                setRentToDate(null);
              }}
              className="text-red-600 hover:text-red-700"
            >
              Clear
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setIsCalendarOpen(true)}
          className="w-full p-4 h-auto flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            <span>
              {rentFromDate && rentToDate
                ? `${format(rentFromDate, "MMM dd")} - ${format(
                    rentToDate,
                    "MMM dd, yyyy"
                  )}`
                : "Select rental dates"}
            </span>
          </div>
          {rentFromDate && rentToDate && (
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800"
            >
              {differenceInDays(rentToDate, rentFromDate)} days
            </Badge>
          )}
        </Button>

        {rentFromDate && rentToDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-700">Total Cost:</span>
              <span className="font-bold text-emerald-800">
                ₹{getCurrentRentalPrice()}
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
    Array.isArray(product.listingType) && product.listingType.includes("rent");
  const isSellProduct =
    Array.isArray(product.listingType) && product.listingType.includes("sell");
  return (
    <>
      <div className="max-w-7xl mx-auto py-8 px-4">

        <div className="flex items-center text-sm mb-6 gap-2">
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
          <span className="text-gray-500">{product.productName}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
  
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="relative h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
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
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
              <p className="text-gray-600">
                {product.color} {product.category?.name}, {product.size}
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-lg text-center">
              {isRentProduct && !isSellProduct ? (
                <>
                  <p className="text-lg text-gray-600 mb-2">Rental Price</p>
                  <p className="text-4xl font-bold text-emerald-600">
                    ₹{product.rentPrice3Days}
                    <span className="text-lg text-gray-500 ml-2">/ 3 days</span>
                  </p>
                </>
              ) : isSellProduct && !isRentProduct ? (
                <>
                  <p className="text-lg text-gray-600 mb-2">Sale Price</p>
                  <p className="text-4xl font-bold text-emerald-600">
                    ₹{Math.round((product.originalPurchasePrice * 50) / 100)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-600 mb-2">
                    Available for Rent & Sale
                  </p>
                  <div className="flex justify-center gap-4">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">
                        ₹{product.rentPrice3Days}
                      </p>
                      <p className="text-sm text-gray-500">Rent / 3 days</p>
                    </div>
                    <div className="border-l pl-4">
                      <p className="text-2xl font-bold text-blue-600">
                        ₹
                        {Math.round((product.originalPurchasePrice * 50) / 100)}
                      </p>
                      <p className="text-sm text-gray-500">Buy now</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {isRentProduct && (
              <>
                {renderRentalButtons()}
                {renderDateSelection()}
              </>
            )}

            <div className="flex gap-4">
              {isSellProduct && (
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-lg shadow-lg"
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
                className={`flex-1 py-6 text-lg rounded-lg shadow-lg ${
                  cartItems.includes(product.id)
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }`}
                variant={cartItems.includes(product.id) ? "default" : "outline"}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAddingToCart === product.id
                  ? "Adding..."
                  : cartItems.includes(product.id)
                  ? "Go to Cart"
                  : isRentProduct
                  ? "Add to Cart"
                  : "Add to Cart"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-blue-400 bg-blue-100 text-blue-800 rounded-full px-3 py-1 capitalize"
              >
                {product.category?.name}
              </Badge>
              {product.listingType?.map((t: string) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 uppercase"
                >
                  {t}
                </Badge>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-2">About this item</h2>
              <p className="text-gray-700">
                {product.description ||
                  `Quality ${product.productName} in ${product.color}. Size ${product.size}.`}
              </p>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg mb-4">Specifications</h3>

              {[
                { label: "BRAND", value: "FashCycle" },
                { label: "SIZE", value: product?.size },
                { label: "SIZE FLEXIBILITY", value: product.sizeFlexibility },
                { label: "COLOUR", value: product.color },
                {
                  label: isRentProduct ? "RENTAL PRICE" : "SALE PRICE",
                  value: isRentProduct
                    ? `₹${product.rentPrice3Days} (3 days)`
                    : `₹${product?.originalPurchasePrice}`,
                },
                { label: "CONDITION", value: "Excellent" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-3 border-b border-gray-100"
                >
                  <span className="text-gray-600 font-medium">{label}</span>
                  <span className="font-semibold capitalize">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                ✓ All purchases are verified and guaranteed authentic
              </p>
            </div>
          </motion.div>
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
