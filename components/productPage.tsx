"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Home, ShoppingCart, CalendarDays, RotateCcw } from "lucide-react";
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

  const minSelectableDate = addDays(new Date(), 1);

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
    setIsCalendarOpen(true); // open calendar immediately
  };

  const handleCalendarConfirm = () => {
    setIsCalendarOpen(false);
    setIsDateSelected(true);
    toast.success("Rental dates selected successfully!");
  };

  const resetRentalState = () => {
    setRentFromDate(null);
    setRentToDate(null);
    setSelectedRentalDays(null);
    setIsDateSelected(false);
    setCartSelectionState({
      rentalDays: null,
      fromDate: null,
      toDate: null,
    });

    // Clear from localStorage
    if (product?.id) {
      const stateKey = `rental_state_${product.id}`;
      localStorage.removeItem(stateKey);
    }
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

        // Save cart selection state
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                  className={`w-full p-4 h-auto flex flex-col items-center justify-between ${
                    isSelected
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-semibold">{days} Days</div>
                  <div className="text-sm opacity-75">
                    Perfect for{" "}
                    {days === 3
                      ? "events"
                      : days === 7
                      ? "occasions"
                      : "extended use"}
                  </div>
                  <div className="font-bold text-lg mt-2">₹{price}</div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {rentFromDate && rentToDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <div className="flex justify-between items-center text-sm">
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
              {/* <p className="text-gray-600">
                {product.color} {product.category?.name}, {product.size}
              </p> */}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge
                variant="outline"
                className="border-blue-400 bg-blue-100 text-blue-800 rounded-full px-3 py-1 capitalize"
              >
                {product.category?.name}
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-400 bg-emerald-100 text-blue-800 rounded-full px-3 py-1 capitalize"
              >
                Size: {product.size}
              </Badge>
              {/* {product.listingType?.map((t: string) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 uppercase"
                >
                  {t}
                </Badge>
              ))} */}
            </div>
            {/* <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-lg text-center">
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
            </div> */}

            {isRentProduct && (
              <>
                {renderRentalButtons()}
                {/* {renderDateSelection()} */}
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

            <div className="space-y-3 border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg mb-4">Product Details</h3>

              {[
                { label: "COLOUR", value: product.color },
                { label: "SIZE FLEXIBILITY", value: product.sizeFlexibility },
                {
                  label: "ORIGNAL PURCHASE PRICE  ",
                  value: `₹${product.originalPurchasePrice}`,
                },
                { label: "SIZE", value: product?.size },
                // {
                //   label: isRentProduct ? "RENTAL PRICE" : "SALE PRICE",
                //   value: isRentProduct
                //     ? `₹${product.rentPrice3Days} (3 days)`
                //     : `₹${product?.originalPurchasePrice}`,
                // },
                // { label: "CONDITION", value: "Excellent" },
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-2">About this item</h2>
              <p className="text-gray-700">
                {product.description ||
                  `Quality ${product.productName} in ${product.color}. Size ${product.size}.`}
              </p>
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
