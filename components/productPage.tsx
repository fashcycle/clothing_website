"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ShoppingCart } from "lucide-react";
import { addDays, format } from "date-fns";
import "react-day-picker/dist/style.css";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { addToCart, getCartItems, getSingleProduct } from "@/app/api/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import CalendarModal from "@/components/CalendarModal";
import "react-medium-image-zoom/dist/styles.css";
interface ProductPageProps {
  id: string;
}
export default function ProductPage({ id }: ProductPageProps) {
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isBuyChecked, setIsBuyChecked] = useState(false);
console.log(product,"safgyasifutoiypqof")
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, []);
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
        } catch (error) {
          console.error("Error parsing saved rental state:", error);
        }
      }
    }
  }, [product?.id]);
  useEffect(() => {
    if (
      Array.isArray(product?.listingType) &&
      product?.listingType.length === 1 &&
      product?.listingType[0] === "sell"
    ) {
      setIsBuyChecked(true);
    }
  }, [product?.listingType]);
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
    setIsCalendarOpen(true);
  };

  const handleCalendarConfirm = () => {
    setIsCalendarOpen(false);
    toast.success("Rental dates selected successfully!");
  };

  const handleAddToCart = async (productId: string, type: "BUY" | "RENT") => {
    if (!isLogin) {
      toast.error("Please Login and then Continue");
      return;
    }
    try {
      setIsAddingToCart(productId);

      let payload: any = { productId };
      if (type === "RENT") {
        if (!rentFromDate || !rentToDate || !selectedRentalDays) {
          toast.error("Please select rental dates and duration first");
          return;
        }

        payload = {
          productId,
          type: "RENT",
          rentDurationInDays: selectedRentalDays,
         rentFrom: rentFromDate.toISOString().split("T")[0],
  rentTo:product?.category?.isEvent==true?rentFromDate.toISOString().split("T")[0]: rentToDate.toISOString().split("T")[0],
        };
      } else {
        payload = { ...payload, quantity: 1, type: "BUY" };
      }

      const response = await addToCart(payload);
      if (response.success) {
        setCartItems((prev) => [...prev, productId]);
        toast.success("Added to cart successfully");

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
    const listingType = product.listingType;
    const isRent =
      (Array.isArray(listingType) &&
        (listingType.includes("rent") || listingType.includes("both"))) ||
      listingType === "rent" ||
      listingType === "both";
    if (!isRent) return null;

    const options = [
      { days: 3, price: Math.round(product.rentPrice3Days) },
      { days: 7, price: Math.round(product.rentPrice7Days) },
      { days: 14, price: Math.round(product.rentPrice14Days) },
    ];

    return (
      <div className="space-y-3 mb-4">
 <h3 className="font-bold  mb-8 text-base text-gray-900 flex items-center gap-2">
    <span className="w-1 h-5 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></span>
    Select Rental Duration
  </h3>        <div className="grid grid-cols-3 gap-2">
          {options.map(({ days, price }) => {
            const isActive =
              selectedRentalDays === days && rentFromDate && rentToDate;
            const isInCart = cartItems.includes(product.id);
            const selectedDuration = cartItems.includes(product.id)
              ? selectedRentalDays
              : null;
            return (
            <motion.button
  key={days}
  type="button"
  onClick={() => handleRentalDaySelection(days)}
  aria-pressed={!!isActive}   // ✅ force boolean
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className={`
 
    ${isActive 
      ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-emerald-100 shadow-md" 
      : "border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-25"
    }
  `}
>
  <Button
    variant={isActive ? "default" : "outline"}
    onClick={() => handleRentalDaySelection(days)}
    className={`w-full p-2 h-auto flex flex-col items-center justify-center relative text-xs ${
      isActive || selectedDuration === days
        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
        : "hover:bg-gray-50"
    }`}
  >
    {days === 7 && (
      <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold absolute text-[10px] -top-3">
        Recommended
      </Badge>
    )}
    <div className="font-semibold text-sm">{days} Days</div>
    <div className="text-xs opacity-75 text-center">
      <p>Perfect for</p>
      <p>
        {days === 3 ? "Events" : days === 7 ? "Occasions" : "Extended"}
      </p>
    </div>
    <div className="font-bold text-sm mt-1">₹{price}</div>
  </Button>
</motion.button>
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
const renderEventRentalButton = () => {
  if (!product) return null;
  const price = Math.round(product?.rentPrice1Day || 0);

  return (
    <div className="space-y-3 mb-4">
      <h3 className="font-bold mb-4 text-base text-gray-900 flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></span>
        Book for 1 Day
      </h3>

      <motion.button
        type="button"
        onClick={() => handleRentalDaySelection(1)}
        aria-pressed={!!(selectedRentalDays === 1 && rentFromDate && rentToDate)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="border border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-25 rounded-lg w-full"
      >
        <Button
          variant={selectedRentalDays === 1 ? "default" : "outline"}
          onClick={() => handleRentalDaySelection(1)}
          className={`w-full p-3 h-auto flex flex-col items-center justify-center text-sm ${
            selectedRentalDays === 1
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold text-sm">1 Day</div>
          <div className="text-xs opacity-75 text-center">
            <p>Perfect for Events</p>
          </div>
          <div className="font-bold text-sm mt-1">₹{price}</div>
        </Button>
      </motion.button>

      {rentFromDate && rentToDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2 text-xs"
        >
          {/* Rental Date */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Booking Date:</span>
            <span className="font-semibold text-emerald-700">
              {format(rentFromDate, "MMM dd, yyyy")}
            </span>
          </div>

          {/* Delivery Info */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Delivery Time:</span>
            <span className="font-semibold text-gray-800">Before 6:00 PM</span>
          </div>

          {/* Pickup Info */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Return Pickup:</span>
            <span className="font-semibold text-gray-800">
              {format(addDays(rentFromDate, 1), "MMM dd, yyyy")} at 10:00 AM
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
    (Array.isArray(product.listingType) &&
      product.listingType.includes("sell")) ||
    product.listingType.includes("both");
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto pt-8  px-4 md:pt-8 lg:pt-20">
        <div className="flex flex-wrap items-center text-xs sm:text-sm mb-4 gap-2 lg:mt-6">
          <Link
            href="/"
            className="hover:underline flex items-center gap-1 shrink-0"
          >
            <Home className="h-3 w-3 sm:h-4 sm:w-4" /> Home
          </Link>
          <span className="shrink-0">/</span>
          <Link href="/browse" className="hover:underline shrink-0">
            All Categories
          </Link>
          <span className="shrink-0">/</span>
          <Link
            href={
              product?.category &&
              typeof product.category === "object" &&
              product.category.slug
                ? `/${product.category.id}`
                : "/dashboard"
            }
            className="hover:underline capitalize shrink-0"
          >
            {product?.category && typeof product.category === "object"
              ? product.category.name
              : typeof product?.category === "string"
              ? product.category
              : "Category"}
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-gray-500 truncate capitalize max-w-[150px] sm:max-w-[250px] md:max-w-[400px]">
            {product.productName}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden md:flex md:col-span-1 flex-col gap-2"
          >
            {productImages?.map((img, index) => (
              <motion.div
                key={img.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedImage(img.path);
                  // openLightbox(index);
                }}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-12 md:col-span-5"
          >
            <div
              className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-lg mb-3 cursor-pointer"
              onClick={() => {
                const currentIndex = productImages.findIndex(
                  (img) => img.path === selectedImage
                );
                openLightbox(currentIndex);
              }}
            >
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
            <div className="grid grid-cols-4 gap-2 md:hidden">
              {productImages.map((img, index) => (
                <motion.div
                  key={img.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedImage(img.path);
                    // openLightbox(index);
                  }}
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-12 md:col-span-5 space-y-4"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2 capitalize">
                {product.productName}
              </h1>
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
{isRentProduct && (
  product?.category?.isEvent
    ? renderEventRentalButton()   
    : renderRentalButtons()       
)}
            {isSellProduct && (
              <div className="flex gap-3 bg-gray-50 p-3 rounded-lg justify-center items-center gap-8">
                <div className="flex-1">
                  <div className="mb-3 flex flex-col gap-2">
                    <div className="text-lg font-bold text-green-600 text-center">
                      Make it Own at :{" "}
                      <span className="text-sm line-through text-green-800">
                        {" "}
                        ₹{Math.round(product?.originalPurchasePrice)}
                      </span>{" "}
                      ₹{Math.round(product?.sellingPrice)}
                    </div>
                    <div className="items-center justify-center flex">
                      <Badge
                        variant="outline"
                        className="border-green-400 bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs capitalize "
                      >
                        Save ₹
                        {Math.round(product?.originalPurchasePrice - product?.sellingPrice)}
                      </Badge>
                    </div>
                  </div>
                </div>
                {isSellProduct && isRentProduct && (
                  <button
                    type="button"
                    className={`flex items-center px-4 py-2 border rounded-lg shadow-lg text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isBuyChecked
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                    }`}
                    disabled={cartItems.includes(product.id)}
                    onClick={() =>
                      !cartItems.includes(product.id) &&
                      setIsBuyChecked((prev) => !prev)
                    }

                    // onClick={() => setIsBuyChecked((prev) => !prev)}
                  >
                    Make It Yours
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() =>
                  cartItems.includes(product.id)
                    ? router.push("/cart")
                    : handleAddToCart(product.id, isBuyChecked ? "BUY" : "RENT")
                }
                disabled={
                  isAddingToCart === product.id ||
                  (!isBuyChecked &&
                    isRentProduct &&
                    (!rentFromDate || !rentToDate))
                }
                  className={`flex-1 py-4 text-sm rounded-lg shadow-lg transition-colors duration-300
    ${
      cartItems.includes(product.id)
        ? "bg-emerald-600 hover:bg-emerald-800 text-white"
        : "border border-emerald-600 text-emerald-600 hover:bg-emerald-800 hover:text-white"
    }`}
                // className={`flex-1 py-4 text-sm rounded-lg shadow-lg ${
                //   cartItems.includes(product.id)
                //     ? "bg-emerald-600 hover:bg-emerald-700"
                //     : ""
                // }`}
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
  className="space-y-4"
>
  {/* Product Details */}
  <div className="space-y-2 border-t border-gray-200 pt-4">
    <h3 className="font-semibold text-sm tracking-wide text-gray-800 mb-2">
      Product Details
    </h3>

    {[
      { label: "Colour", value: product.color },
      { label: "Size Flexibility", value: product.sizeFlexibility },
      {
        label: "Original Price",
        value: `₹${Math.round(product.originalPurchasePrice)}`,
      },
      { label: "Size", value: product?.size },
    ].map(({ label, value }) => (
      <div
        key={label}
        className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-b-0"
      >
        <span className="text-gray-600 font-medium text-xs tracking-wide">
          {label}
        </span>
        <span className="font-semibold capitalize text-xs text-gray-800">
          {value}
        </span>
      </div>
    ))}
  </div>

  {/* About this item */}
  <div className="bg-gray-50/70 p-3 rounded-lg border border-gray-100 shadow-sm">
    <h2 className="font-semibold mb-1.5 text-xs uppercase text-gray-700 tracking-wide">
      About this item
    </h2>
    <p className="text-gray-600 text-xs leading-relaxed">
      {product.description ||
        `Quality ${product.productName} in ${product.color}. Size ${product.size}.`}
    </p>
  </div>
</motion.div>

          </motion.div>
        </div>
      </div>
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={productImages.map((img) => ({ src: img.path }))}
        index={lightboxIndex}
        on={{
          view: ({ index: currentIndex }) => setLightboxIndex(currentIndex),
        }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          root: { "--yarl__color_backdrop": "rgba(0, 0, 0, 0.8)" },
        }}
        plugins={[Zoom]} // Zoom enabled
        carousel={{ finite: false }}
        zoom={{ maxZoomPixelRatio: 2 }}
      />
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedRentalDays={selectedRentalDays}
        rentFromDate={rentFromDate}
        rentToDate={rentToDate}
        onDaySelect={handleDaySelect}
        onConfirm={handleCalendarConfirm}
        product={product}
      />
    </>
  );
}
