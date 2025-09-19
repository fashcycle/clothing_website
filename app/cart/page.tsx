"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Star,
  ShoppingCart,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  MapPin,
  Clock,
  Badge,
  Info,
  CheckCircle,
  Sparkles, IndianRupee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCartItems,
  getWishlistedProducts,
  removeFromCart,
  getUserDetails,
  addNewAddress,
  getUserAddresses,
  getRazorpayKeys,
  getCartRespond,
} from "@/app/api/api";
import { Ban } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressFormDialog } from "@/components/profile/address-form-dialog";
import axios from "axios";
import CartCountdown from "@/components/CartCountdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SavedAddress {
  id: string;
  address: string;
  landmark: string;
  customAddressType: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
}

export default function CartPage() {
  const router = useRouter();
  const [wishlistedItems, setWishlistedItems] = useState<any>([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState<any>(true);
  const [isClient, setIsClient] = useState<any>(false);
  const [cartItems, setCartItems] = useState<any>([]);
  const [user, setUser] = useState<any>("");
  const [discount, setDiscount] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressModal, setShowAddressModal] = useState<any>(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [isPaying, setIsPaying] = useState(false);
  const [showCheckoutTimer, setShowCheckoutTimer] = useState(false);
  const [checkoutTimer, setCheckoutTimer] = useState(20);
  const [checkoutTimerActive, setCheckoutTimerActive] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState<string>("");
  const [orderData, setOrderData] = useState<any>(null)
const[isNotAvailable,setIsNotAvailable]=useState(false)
const [showOrderPopup, setShowOrderPopup] = useState(false);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const keysRes = await getRazorpayKeys();
        const razorpayKeyObj = keysRes.extraKeys.find(
          (k: any) => k.key === "RAZORPAY_KEY_ID"
        );

        setRazorpayKey(razorpayKeyObj?.value || "");
      } catch (err) {
        toast.error("Failed to fetch Razorpay keys");
      }
    };

    fetchKeys();
  }, []);



  const handleCheckout = async () => {
    if (!selectedAddressId)
      return toast.error("Please select or add delivery address!");
    if (cartItems.length === 0) return toast.error("Cart is empty!");

    setShowCheckoutTimer(true);
    setCheckoutTimer(20); // countdown
    setCheckoutTimerActive(true);

    const cartIDS = cartItems.map((item: any) => item.id);
    setOrderData({ productId: cartIDS });
  };
  // ⏳ Countdown timer effect
  useEffect(() => {
    if (!showCheckoutTimer || !checkoutTimerActive) return;

    const timerInterval = setInterval(() => {
      setCheckoutTimer((prev) => {
        if (prev <= 1) {
          setCheckoutTimerActive(false);
          clearInterval(timerInterval);
          proceedCheckout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [showCheckoutTimer, checkoutTimerActive]);

  // 🔄 Cart status check effect
  useEffect(() => {
    if (!showCheckoutTimer || !checkoutTimerActive || !orderData?.productId) return;

    const cartCheckInterval = setInterval(() => {

      checkCartStatus(orderData?.productId);
    }, 5000);

    return () => clearInterval(cartCheckInterval);
  }, [showCheckoutTimer, checkoutTimerActive, orderData?.productId]);

  // ✅ Function to check cart status
  const checkCartStatus = async (productId: string) => {
    try {
      const res = await getCartRespond(productId);

      if (res?.status === "AVAILABLE") {
        // ✅ Order confirmed → proceed directly
        clearTimers();
        proceedCheckout();
        return;
      }

      if (res?.status === " NOT_AVAILABLE") {
        setIsNotAvailable(true)
            setCheckoutTimerActive(false);

        // ❌ Order rejected → stop checkout
        // toast.error("The product is not available on your selected booking dates.");
        // clearTimers();
        return;
      }

      // 🔄 For any other status → keep countdown running
      if (!res.success) {
        toast.error("Cart/order is no longer valid!");
        clearTimers();
      }
    } catch (err) {
      toast.error("Error validating cart. Closing checkout.");
      clearTimers();
    }
  };

  // Utility to stop timers + reset state
  const clearTimers = () => {
    setCheckoutTimerActive(false);
    setShowCheckoutTimer(false);
  };
const proceedCheckout = async () => {
  if (!razorpayKey) {
    toast.error("Razorpay key not available");
    return;
  }

  setShowCheckoutTimer(false);

  try {
    const cartIDS = cartItems.map((item: any) => item.id);

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/orders/create`,
      { selectedItems: cartIDS, shippingAddressId: selectedAddressId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setIsPaying(true);

    const razorpay_order_id = data?.order?.razorpayOrderId;
    const options = {
      key: razorpayKey,
      amount: total * 100,
      currency: "INR",
      name: "FashCycle",
      description: `Order #${razorpay_order_id}`,
      order_id: razorpay_order_id,
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.mobileNumber,
      },
      notes: {
        address: `${selectedAddress?.addressLine1}, ${selectedAddress?.city}`,
      },
      theme: { color: "#0160D8" },
      handler: async (response: any) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

        try {
          const verifyRes = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE}/orders/verify-payment`,
            {
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              razorpaySignature: razorpay_signature,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (verifyRes.data.success === true) {
            toast.success("Payment successful! 🎉");
            fetchCartItems();
            setShowOrderPopup(true);
          }
        } catch (err) {
          toast.error("Verify API error");
        } finally {
          setIsPaying(false);
        }
      },
      modal: {
        ondismiss: () => setIsPaying(false),
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (err) {
    toast.error("Order create API failed");
    console.error("proceedCheckout error:", err);
    setIsPaying(false);
  }
};

//   const proceedCheckout = async () => {

//     if (!razorpayKey) {
//       toast.error("Razorpay key not available");
//       return;
//     }

//     setShowCheckoutTimer(false);
//     const cartIDS = cartItems.map((item: any) => item.id);
//     const { data } = await axios.post(${ process.env.NEXT_PUBLIC_API_BASE } / orders / create,
//       { selectedItems: cartIDS, shippingAddressId: selectedAddressId },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: Bearer ${ localStorage.getItem("token") }, },
// }
//    );
// console.log(data, "orderdata");
// try {
//   setIsPaying(true);
//   console.log(data?.order?.razorpayOrderId, "orderData?.order?.razorpayOrderId")
//   const razorpay_order_id = data?.order?.razorpayOrderId;

//   const options = {
//     key: razorpayKey,
//     amount: total * 100,
//     currency: "INR",
//     name: "FashCycle",
//     description: `Order #${razorpay_order_id}`,
//     order_id: razorpay_order_id,
//     prefill: {
//       name: user?.name,
//       email: user?.email,
//       contact: user?.mobileNumber,
//     },
//     notes: {
//       address: `${selectedAddress?.addressLine1}, ${selectedAddress?.city}`,
//     },
//     theme: { color: "#0160D8" },
//     handler: async (response: any) => {
//       const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//         response;
//       try {
//         const verifyRes = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_BASE}/orders/verify-payment`,
//           {
//             razorpayOrderId: razorpay_order_id,
//             razorpayPaymentId: razorpay_payment_id,
//             razorpaySignature: razorpay_signature,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         if (verifyRes.data.success === true) {
//           toast.success("Payment successful! 🎉");
//           fetchCartItems();
//         }
//       } catch (err) {
//         toast.error("Verify API error");
//       } finally {
//         setIsPaying(false);
//       }
//     },
//     modal: {
//       ondismiss: () => setIsPaying(false),
//     },
//   };

//   const rzp = new (window as any).Razorpay(options);
//   rzp.open();
// } catch (err) {
//   toast.error("Order create API failed");
//   console.log(err, "errerrerr")
//   setIsPaying(false);
// }
//   };

const calculateItemPrice = (item: any) => {
  if (item.rentDurationInDays === 3) {
    return item.product.rentPrice3Days;
  } else if (item.rentDurationInDays === 7) {
    return item.product.rentPrice7Days;
  } else if (item.rentDurationInDays === 14) {
    return item.product.rentPrice14Days;
  } 
  else if (item.rentDurationInDays === 1) {
    return item.product.rentPrice1Day;
  }else {
    return item?.product?.sellingPrice;
  }
};
const calculateConvenienceFee = (item: any) => {
  if (item.rentDurationInDays === 3) {
    return item?.convenienceFee;
  } else if (item.rentDurationInDays === 7) {
    return item?.convenienceFee;
  } else if (item.rentDurationInDays === 14) {
    return item?.convenienceFee;
  } else {
    return item?.convenienceFee;
  }
};
useEffect(() => {
  setIsClient(true);
  let userData: any = localStorage.getItem("user-info");
  setUser(JSON.parse(userData));
  fetchCartItems(), fetchWishlist();
}, []);

const fetchCartItems = async () => {
  try {
    const response = await getCartItems();
    if (response.success) {
      const itemsWithRentalPeriod = response.cart.map((item: any) => ({
        ...item,
        rentDurationInDays: item.rentDurationInDays,
      }));
      setCartItems(itemsWithRentalPeriod);
      setIsLoading(false);
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
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
};

const fetchUserDetails = async () => {
  try {
    const userDetails = await getUserDetails();
    if (userDetails?.success) {
      localStorage.setItem("user-info", JSON.stringify(userDetails.user));
      setUser(userDetails.user);
      setSelectedAddressId(userDetails?.user?.addresses?.[0]?.id || "");
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

useEffect(() => {
  fetchUserDetails();
}, []);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: { duration: 0.3 },
  },
};
const removeItem = async (itemId: string) => {
  try {
    let obj: any = {
      userId: user?.id,
      productId: itemId,
    };
    const response = await removeFromCart(obj);
    if (response.success) {
      await fetchCartItems();
      toast.success("Item removed from cart");
    }
  } catch (error) {
    toast.error("Failed to remove item from cart");
    console.error("Error removing item:", error);
  }
};
const fetchAddresses = async () => {
  try {
    const response = await getUserAddresses();
    if (response.success) {
      setSavedAddresses(response.addresses);
    } else if (response?.data && Array.isArray(response.data)) {
      setSavedAddresses(response.data);
    } else {
      setSavedAddresses([]);
    }
  } catch (error: any) {
    setSavedAddresses([]);
  }
};
useEffect(() => {
  fetchAddresses();
}, []);
const handleAddAddressApi = async (newAddress: any) => {
  setIsSubmitting(true);

  let data = {
    pincode: newAddress?.pincode,
    city: newAddress?.city,
    state: newAddress?.state,
    customAddressType: newAddress?.customAddressType,
    landmark: newAddress?.landmark,
    addressLine1: newAddress?.addressLine1,
    addressLine2: newAddress?.addressLine2,
    address: newAddress?.address,
  };
  const response = await addNewAddress(data);
  if (response.success) {
    setIsSubmitting(false);

    fetchUserDetails();

    const newErrors = { ...formErrors };
    delete newErrors.addressLine1;
    delete newErrors.pincode;
    delete newErrors.landmark;
    setFormErrors(newErrors);
  }
};
const totalSecurityAmount = cartItems.reduce(
  (sum: any, item: any) => sum + (item.securityAmount || 0),
  0
);
const convenienceFee = cartItems.reduce((sum: any, item: any) => {
  const itemPrice = calculateConvenienceFee(item);
  return sum + itemPrice;
}, 0);
const subtotal = cartItems.reduce((sum: number, item: any) => {
  const itemPrice = calculateItemPrice(item);
  return sum + itemPrice;
}, 0);
// const calculateItemPrice = (item: any): number => {
//   const { rentDurationInDays, product, quantity } = item;

//   if (rentDurationInDays == null) {
//     return product.sellingPrice * quantity;
//   }

//   switch (rentDurationInDays) {
//     case 1:
//       return product.rentPrice1Day * quantity;
//     case 3:
//       return product.rentPrice3Days * quantity;
//     case 7:
//       return product.rentPrice7Days * quantity;
//     case 14:
//       return product.rentPrice14Days * quantity;
//     default:
//       throw new Error(`Unsupported rent duration: ${rentDurationInDays}`);
//   }
// };



console.log("Subtotal:", subtotal);

// const shipping = subtotal > 999 ? 0 : 99;
const shipping = 0;
const taxAmount = Math.round(subtotal * 0.18);
const total = subtotal + shipping + totalSecurityAmount + convenienceFee;
const tax = taxAmount;
useEffect(() => {
  if (user && Array.isArray(user.addresses) && user.addresses.length > 0) {
    setSelectedAddress(user.addresses[0]);
  }
}, [user]);

useEffect(() => {
  if (savedAddresses && savedAddresses.length > 0) {
    const found = savedAddresses.find(
      (addr) => addr.id === selectedAddressId
    );
    setSelectedAddress(found || savedAddresses[0]);
  } else {
    setSelectedAddress(undefined);
  }
}, [savedAddresses, selectedAddressId]);
const colorOptions = [
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
  { name: "White", color: "bg-white border border-gray-200" },
  { name: "Grey", color: "bg-gray-500" },
  { name: "Brown", color: "bg-amber-800" },
  { name: "Gold", color: "bg-yellow-600" },
  { name: "Silver", color: "bg-gray-300" },
];

return (
  <>
    <div className="min-h-screen lg:mt-10 pt-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="shadow-sm mt-10"
      >
        <div className="container mx-auto px-4 py-4 flex justify-center items-center">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Your Shopping Cart
          </h1>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8"
      >
        <div
          className={`${cartItems.length > 0 ? "grid lg:grid-cols-3 gap-8" : "w-full"
            }`}
        >
          <div className="lg:col-span-2">
            {/* <motion.div
                variants={itemVariants}
                className="p-6 border rounded-xl mb-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                  <div className="flex items-start gap-4 flex-1 min-w-[250px] w-full">
                    <div className="p-2 bg-pink-100 rounded-lg shrink-0">
                      <MapPin className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-semibold text-base sm:text-lg text-gray-800">
                          Deliver to:
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto shrink-0"
                      onClick={() => {
                        if (savedAddresses.length > 0) {
                          setShowAddressModal(true);
                        } else {
                          setShowNewAddressForm(true);
                        }
                      }}
                    >
                      {savedAddresses.length > 0 ? (
                        "Change Address"
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add New Address
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {user?.addresses?.length > 0 ? (
                  <div className="border rounded-lg p-4 w-full mt-4 sm:mt-6">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedAddress?.customAddressType ||
                            selectedAddress?.addressType}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress?.landmark}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress?.addressLine1}{" "}
                      {selectedAddress?.addressLine2 &&
                        selectedAddress?.addressLine2}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress?.pincode
                        ? [
                            selectedAddress.pincode.city,
                            selectedAddress.pincode.state,
                            selectedAddress.pincode.country,
                            selectedAddress.pincode.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")
                        : [
                            selectedAddress?.city,
                            selectedAddress?.state,
                            selectedAddress?.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No address selected. Please add an address.
                  </p>
                )}
                     <div className="w-full sm:w-auto flex justify-start sm:justify-end mt-5 lg:hidden">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto shrink-0"
                      onClick={() => {
                        if (savedAddresses.length > 0) {
                          setShowAddressModal(true);
                        } else {
                          setShowNewAddressForm(true);
                        }
                      }}
                    >
                      {savedAddresses.length > 0 ? (
                        "Change Address"
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add New Address
                        </>
                      )}
                    </Button>
                  </div>
              </motion.div> */}
            <motion.div
              variants={itemVariants}
              className="p-4 border rounded-lg bg-pink-50 hover:shadow-md transition-all duration-300 mb-5"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                {/* Left Section (Address Info) */}
                <div className="flex flex-col text-sm text-gray-800">
                  <p className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                    <MapPin className="w-5 h-5 text-pink-600" />
                    Deliver to:{" "}
                    <span className="font-medium text-sm text-gray-700 font-semibold">
                      {user?.name}, {selectedAddress?.pincode?.pincode}
                    </span>
                  </p>
                  <p className="text-gray-600 mt-1 line-clamp-1 sm:ml-7 ml-6">
                    {[
                      selectedAddress?.addressLine1,
                      selectedAddress?.addressLine2,
                      selectedAddress?.landmark,
                      selectedAddress?.pincode?.city,
                      selectedAddress?.pincode?.state,
                      selectedAddress?.pincode?.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                   {selectedAddress?.mobileNumber && (
        <p className="text-gray-700 mt-1 sm:ml-7 ml-6">
        <span className="font-medium">Mobile: {selectedAddress.mobileNumber}</span>
        </p>
      )}
                </div>

                {/* Right Section (Button) */}
                <div className="mt-2 sm:mt-0">
                  <Button
                    variant="outline"
                    className="text-pink-600 border-pink-500 font-semibold text-xs sm:text-sm transition-shadow hover:shadow-md hover:text-pink-600"
                    onClick={() => {
                      if (savedAddresses.length > 0) {
                        setShowAddressModal(true);
                      } else {
                        setShowNewAddressForm(true);
                      }
                    }}
                  >
                    {savedAddresses.length > 0 ? "CHANGE ADDRESS" : "ADD NEW ADDRESS"}
                  </Button>
                </div>
              </div>

            </motion.div>

            {/* Offers Section */}
            {/* <motion.div
              variants={itemVariants}
              className="p-6 border rounded-xl mb-6 bg-gradient-to-r from-orange-50 to-pink-50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Gift className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">Available Offers</h3>
              </div>
              <div className="space-y-3">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200"
                >
                  <CreditCard className="w-5 h-5 text-pink-500" />
                  <span className="text-gray-700">10% Instant Discount on Axis Bank Credit Cards</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200"
                >
                  <Tag className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Extra 5% off on orders above ₹2000</span>
                </motion.div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="text-pink-600 font-medium mt-4 hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Show More Offers
              </motion.button>
            </motion.div> */}

            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Your Cart is Empty
                </h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  Discover amazing products and add them to your cart to get
                  started
                </p>
                <Link href="/browse">
                  <Button className="px-8 py-3">
                    <ShoppingCart className="w-5 h-5" />
                    Continue Shopping
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded  border-gray-300">
                  <div className="p-2 bg-emerald-800 text-white rounded">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-sm sm:text-base text-gray-900">
                    {cartItems?.length}  {cartItems?.length > 1 ? `ITEMS` : "ITEM"} SELECTED
                  </p>
                </div>

                <AnimatePresence>
                  {cartItems.map((item: any) => {
                    const productColorName = item.product.color; // Example: "Pink"

                    const matchedColor = colorOptions.find(
                      (colorOption) =>
                        colorOption.name.toLowerCase() ===
                        productColorName.toLowerCase()
                    );

                    const colorClass = matchedColor
                      ? matchedColor.color
                      : "bg-gray-200"; // fallback
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 sm:p-6 border rounded-xl bg-white shadow hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative shrink-0 mx-auto sm:mx-0"
                          >
                            <div className="w-full  sm:w-36 h-36 bg-gray-50 rounded-xl overflow-hidden">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Link href={`/products/${item.product.id}`}>
                                  <Image
                                    src={
                                      item?.product?.frontLook ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.product.productName}
                                    width={144}
                                    height={144}
                                    className="w-full h-full object-cover"
                                    priority
                                  />
                                </Link>
                              </motion.div>
                            </div>

                            {/* Discount badge */}
                            {/* {discountPercentage > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
                            >
                              {discountPercentage}% OFF
                            </motion.div>
                          )} */}

                            {/* Wishlist button */}
                            {/* <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                            </motion.button> */}
                          </motion.div>

                          <div className="flex-grow space-y-2">
                            <div>
                              <Link href={`/products/${item.product.id}`}>
                                <h3 className="font-medium text-base line-clamp-2">
                                  {item.product.productName}
                                </h3>
                              </Link>

                              {item.product.reviews > 0 && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <div className="flex items-center gap-0.5">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-medium">
                                      {item.product.rating}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    ({item.product.reviews} reviews)
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <div className="flex items-center gap-1 bg-pink-100 p-1 border rounded">
                                <span className="text-xs text-gray-600">Color:</span>
                                <div className={`inline-block w-3.5 h-3.5 rounded-full ${colorClass}`} />
                              </div>

                              <div className="flex items-center gap-1 bg-pink-100 p-1 border rounded">
                                <span className="text-xs text-gray-600">Size:</span>
                                <span className="text-xs font-medium">
                                  {item?.product?.size}
                                </span>
                              </div>
                            </div>

                            {item.rentDurationInDays !== null && (
                              <>
                                <div className="text-xs text-gray-600">
                                  Rent Duration {item?.rentDurationInDays} Days
                                </div>
                                <div className="text-xs text-gray-600">
                                  From{" "}
                                  {new Date(item?.rentFrom).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}{" "}
                                  to{" "}
                                  {new Date(item?.rentTo).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              </>
                            )}

                            <div className="flex items-baseline gap-2"> {/* gap-3 → gap-2 */}
                              <span className="text-lg font-bold text-emerald-800"> {/* 2xl → lg */}
                                ₹{" "}
                                {item.rentDurationInDays === null &&
                                  Math.round(item.product.sellingPrice ?? 0)}

                                {item.rentDurationInDays === 1 &&
                                  Math.round(item.product.rentPrice1Day)}
                                {item.rentDurationInDays === 3 &&
                                  Math.round(item.product.rentPrice3Days)}
                                {item.rentDurationInDays === 7 &&
                                  Math.round(item.product.rentPrice7Days)}
                                {item.rentDurationInDays === 14 &&
                                  Math.round(item.product.rentPrice14Days)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100"> {/* pt-3 → pt-2 */}
                              <div className="flex items-center gap-1">
                                <Info className="h-3.5 w-3.5 text-red-500 hover:text-red-600" /> {/* smaller icon */}
                                <CartCountdown createdAt={item.createdAt} />
                              </div>
                              <motion.button
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "#FEE2E2",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeItem(item.product.id)}
                                className="flex items-center gap-1 text-red-500 hover:text-red-600 px-2.5 py-1 rounded-md text-xs"
                              // smaller button (px-3 py-1.5 → px-2.5 py-1, text-sm → text-xs)
                              >
                                <Trash2 className="h-3.5 w-3.5" /> {/* smaller icon */}
                                <span>Remove</span>
                              </motion.button>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div variants={itemVariants} className="sticky space-y-6">
              {/* Promo Code */}
              {/* <div className="p-6 border rounded-xl bg-white shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-800">Apply Coupon</h3>
                {!showPromoInput ? (
                  <Button 
                    variant="outline" 
                    // onClick={() => setShowPromoInput(true)}
                    className="w-full"
                  >
                    <Tag className="w-4 h-4" />
                    Apply Promo Code
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <Button onClick={applyPromoCode} className="flex-1">
                        Apply
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowPromoInput(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
               
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-600 font-medium">Promo applied! {213123}% off</span>
                  </div>
             
              </div> */}
              {cartItems.length > 0 && (
                <>

                  <div className="p-6 border rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-md">
                    {/* Title */}
                    <h3 className="font-semibold mb-5 text-xl text-gray-900 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-pink-600" />
                      Order Summary
                    </h3>

                    {/* Price Breakdown */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-800">
                          ₹{Math.round(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Convenience Fee</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {/* Button wrapper so tooltip works on click too */}
                                <button type="button">
                                  <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="max-w-[160px] relative bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg break-words"
                              >
                                Convenience fee covers payment gateway & processing charges.
                                {/* Tooltip Arrow */}
                                <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>


                        <span className="font-medium text-gray-800">
                          ₹{Math.round(convenienceFee)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-emerald-800 font-medium">FREE</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Security Amount</span>
                          <TooltipProvider>
                            <Tooltip>
                              {/* Make Info icon clickable trigger */}
                              <TooltipTrigger asChild>
                                <button type="button">
                                  <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="max-w-[180px] relative bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg"
                              >
                                Security amount will be refunded after the product is returned in proper condition.
                                {/* Tooltip Arrow */}
                                <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>


                        <span className="font-medium text-gray-800">
                          ₹{Math.round(totalSecurityAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-emerald-800">₹{Math.round(total)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      className="w-full mt-6 py-4 text-lg"
                      disabled={
                        isPaying ||
                        showCheckoutTimer ||
                        cartItems.length === 0
                      }
                      onClick={handleCheckout}
                    >
                      {isPaying || showCheckoutTimer ? (
                        <Loader text="" className="h-5 w-5 animate-spin" />
                      ) : (
                        <Shield className="h-5 w-5" />
                      )}
                      {isPaying || showCheckoutTimer
                        ? "Processing…"
                        : "Proceed to Checkout"}
                    </Button>

                    {/* Trust Badges */}
                    <div className="p-4 border rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 mt-5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">

                        {/* Free Delivery */}
                        <div className="text-center">
                          <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <div className="text-xs text-gray-600 mt-1">Free Delivery</div>
                        </div>

                        {/* Secure Payments */}
                        <div className="text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <Shield className="w-8 h-8 text-green-600" />
                            <IndianRupee className="w-3 h-3 absolute text-green-600" />
                          </div>      <div className="text-xs text-gray-600 mt-1">Secure Payments</div>
                        </div>

                        {/* Genuine Products */}
                        <div className="text-center">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                          <div className="text-xs text-gray-600 mt-1">Genuine Products</div>
                        </div>

                        {/* Clean & Hygienic */}
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                          <div className="text-xs text-gray-600 mt-1">Clean & Hygienic</div>
                        </div>

                      </div>
                    </div>
                  </div>



                </>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>

    <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select Delivery Address
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {savedAddresses?.map((address: any) => (
            <div
              key={address.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-green-800 ${selectedAddressId === address.id
                ? "border-green-500 bg-green-50"
                : ""
                }`}
              onClick={() => {
                setSelectedAddressId(address.id);
                setShowAddressModal(false);
              }}
            >
              
              <div className="flex items-center justify-between relative">
                <span className="text-sm text-gray-600">
                  {address.customAddressType || address.addressType}
                </span>
                 
                {selectedAddressId === address.id && (
                  <Badge
                    className="absolute bg-green-100 text-green-700 rounded-full right-0 top-0"
                  >
                    Selected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{address.landmark}</p>
              <p className="text-sm text-gray-600">{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className="text-sm text-gray-600">
                  {address.addressLine2}
                </p>
              )}
              <p className="text-sm text-gray-600">
                {address.pincode
                  ? [
                    address.pincode.city,
                    address.pincode.state,
                    address.pincode.country,
                    address.pincode.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")
                  : [address.city, address.state, address.country]
                    .filter(Boolean)
                    .join(", ")}
              </p>
               {address.mobileNumber && (
      <p className="text-sm text-gray-700 font-medium">
        Mobile: {address.mobileNumber}
      </p>
    )}
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => {
              setShowAddressModal(false);
              setShowNewAddressForm(true); // Change this line
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    <Dialog
      open={showCheckoutTimer}
onOpenChange={(open) => {
  setShowCheckoutTimer(open);

  if (!open) {
    clearTimers();
    setIsNotAvailable(false);
  }
}}    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Confirming Checkout
          </DialogTitle>
        </DialogHeader>
        {isNotAvailable ?
<div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-md mx-auto shadow-md text-center">
  {/* Icon or image */}
  <div className="flex justify-center mb-3">
<span className="text-3xl">😔</span>
    {/* Or use emoji instead of image: <span className="text-3xl">😔</span> */}
  </div>

  {/* Title */}
  <h3 className="text-lg font-semibold text-blue-900 mb-2">
    Sorry, this dress isn’t available
  </h3>

  {/* Message */}
  <p className="text-blue-800 font-medium">
    The dress is not available on your selected date or at this time.
  </p>
  <p className="text-gray-700 mt-1">
    Please try placing your order again a little later.
  </p>
</div>
       : <div className="flex flex-col items-center justify-center py-6">
          <div className="text-4xl font-bold text-pink-600 mb-2">
            {Math.floor(checkoutTimer / 60)
              .toString()
              .padStart(2, "0")}
            :
            {(checkoutTimer % 60).toString().padStart(2, "0")}
          </div>
          <p className="text-gray-700 text-center mb-4">
            We’re confirming that your order is available for
            the dates you selected.
          </p>

          {/* <Button
                          className="w-full mt-2"
                          onClick={() => {
                            setCheckoutTimerActive(false);
                            proceedCheckout();
                          }}
                          disabled={isPaying}
                        >
                          Continue Now
                        </Button> */}
        </div>}
      </DialogContent>
    </Dialog>
    <AddressFormDialog
      openFor={"add"}
      open={showNewAddressForm}
      setIsSubmitting={setIsSubmitting}
      isSubmitting={isSubmitting}
      onOpenChange={setShowNewAddressForm}
      onSave={(newAddress) => {
        handleAddAddressApi(newAddress).then(() => {
          fetchAddresses(); // 👈 Refetch after address added
        });
      }}
    />
    {showOrderPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
      <h2 className="text-xl font-bold text-green-700 mb-2">Order Confirmed 🎉</h2>
      <p className="text-gray-700 mb-4">
        Your order has been placed successfully. If you haven't added your fitting details yet, please do so now.
      </p>
      <div className="flex justify-center gap-4">
        <button
          className="px-4 py-2 bg-[#1b3226] text-white rounded hover:bg-[#163a2b]"
          onClick={() => {
            setShowOrderPopup(false);
            router.push("/profile"); // or "/dashboard/profile" based on your route
          }}
        >
          Go to Profile
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          onClick={() => setShowOrderPopup(false)}
        >
          Later
        </button>
      </div>
    </div>
  </div>
)}

  </>
);
}


