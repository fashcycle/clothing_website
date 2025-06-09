

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Trash2, Star, ShoppingCart, Plus, Minus, Tag, Truck, Shield, RotateCcw, Gift, MapPin, Clock, CreditCard, Badge } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { getCartItems, removeFromWishlist, getWishlistedProducts, addToWishlist, removeFromCart, getUserDetails, updateAddress, deleteAddress, addNewAddress } from "@/app/api/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader"
import { AddressList } from "@/components/profile/address-list"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { AddressFormDialog } from "@/components/profile/address-form-dialog"

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
  const [wishlistedItems, setWishlistedItems] = useState<any>([]);  // Initialize as empty array
  const [isLoading, setIsLoading] = useState<any>(true)
  const [isClient, setIsClient] = useState<any>(false)
  const [cartItems, setCartItems] = useState<any>([]);
  const [user, setUser] = useState<any>("")
  const [discount, setDiscount] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressModal, setShowAddressModal] = useState<any>(false)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
  ]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<any>();

  // Add this function after the state declarations
  const updateItemRentalPeriod = (itemId: string, period: string) => {
    setCartItems((prevItems: any) =>
      prevItems.map((item: any) =>
        item.id === itemId
          ? { ...item, selectedRentalPeriod: period }
          : item
      )
    );
  };

  // Add this function to calculate price for individual items
  const calculateItemPrice = (item: any) => {
    const originalPrice = item?.product?.originalPurchasePrice || 0;
    const rentalPeriod = item.selectedRentalPeriod || "3";

    if (item?.product?.listingType?.includes("rent")) {
      switch (rentalPeriod) {
        case "3":
          return Math.round(originalPrice * 0.21); // 21% for 3 days
        case "7":
          return Math.round(originalPrice * 0.35); // 35% for 7 days
        case "14":
          return Math.round(originalPrice * 0.42); // 42% for 14 days
        default:
          return Math.round(originalPrice * 0.21);
      }
    } else {
      return Math.round(originalPrice * 0.5); // 50% for purchase
    }
  };

  useEffect(() => {
    setIsClient(true)
    let userData: any = localStorage.getItem("user-info")
    setUser(JSON.parse(userData))
    fetchCartItems(),
      fetchWishlist()
  }, []);

  // Remove initialWishlistItems mock data from the top of the file

  const fetchCartItems = async () => {
    try {
      const response = await getCartItems();
      if (response.success) {
        // Initialize selectedRentalPeriod for each item if not present
        const itemsWithRentalPeriod = response.cart.map((item: any) => ({
          ...item,
          selectedRentalPeriod: item.selectedRentalPeriod || "3"
        }));
        setCartItems(itemsWithRentalPeriod);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await getWishlistedProducts();
      if (response.success) {
        setWishlistedItems(response.products);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const userDetails = await getUserDetails();
      if (userDetails?.success) {
        localStorage.setItem('user-info', JSON.stringify(userDetails.user));
        setUser(userDetails.user);
        setSavedAddresses(userDetails?.user?.addresses)
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
    }
  };
  const removeItem = async (itemId: string) => {
    try {
      let obj: any = {
        "userId": user?.id,
        "productId": itemId
      }
      const response = await removeFromCart(obj);
      if (response.success) {
        await fetchCartItems();
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error("Failed to remove item from cart");
      console.error('Error removing item:', error);
    }
  };

  const handleAddAddressApi = async (newAddress: any) => {
    setIsSubmitting(true)

    let data = {
      pincode: newAddress?.pincode,
      city: newAddress?.city,
      state: newAddress?.state,
      customAddressType: newAddress?.customAddressType,
      landmark: newAddress?.landmark,
      addressLine1: newAddress?.addressLine1,
      addressLine2: newAddress?.addressLine2,
      address: newAddress?.address
    }
    const response = await addNewAddress(data);
    if (response.success) {
      setIsSubmitting(false)

      setSavedAddresses([...savedAddresses, newAddress]);
      fetchUserDetails()
      // setShowNewAddressForm(false);
      // setNewAddressForm({
      //   id: "",
      //   address: "",
      //   landmark: "",
      //   customAddressType: "",
      //   addressLine1: "",
      //   addressLine2: "",
      //   pincode: "",
      //   city: "",
      //   state: "",
      //   country: "India"
      // });
      const newErrors = { ...formErrors };
      delete newErrors.addressLine1;
      delete newErrors.pincode;
      delete newErrors.landmark;
      setFormErrors(newErrors);
    }
  }


  const subtotal = cartItems.reduce((sum: any, item: any) => {
    const itemPrice = calculateItemPrice(item);
    return sum + (itemPrice * item.quantity);
  }, 0);

  const shipping = subtotal > 999 ? 0 : 99; // Free shipping over ₹999
  const taxAmount = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + taxAmount;
  const tax = taxAmount;
  useEffect(()=>{
if(user){
  setSelectedAddress(user?.addresses[0])
}
  },[user])

  return (
    <>
      <div className="min-h-screen ">
        {/* Header with breadcrumb */}
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              {/* Delivery Address */}
              <motion.div
                variants={itemVariants}
                className="p-6 border rounded-xl mb-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-[300px]">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-pink-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">

                        <h2 className="font-semibold text-lg text-gray-800">Deliver to:</h2>
                      </div>

                      {user?.addresses?.length > 0 && (
                        <div className="border rounded-lg p-4 w-full mt-8">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">
                                {selectedAddress?.customAddressType || selectedAddress?.address}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{selectedAddress?.landmark}</p>
                          <p className="text-sm text-muted-foreground">{selectedAddress?.addressLine1}</p>
                          {selectedAddress?.addressLine2 && (
                            <p className="text-sm text-muted-foreground">{selectedAddress?.addressLine2}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {selectedAddress?.city}, {selectedAddress?.state}, {selectedAddress?.country}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" className="shrink-0" onClick={() => { setShowAddressModal(true) }}>
                    Change Address
                  </Button>
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

              {/* Cart Items */}
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-2 text-gray-800">Your Cart is Empty</h3>
                  <p className="text-gray-500 text-center mb-6 max-w-md">
                    Discover amazing products and add them to your cart to get started
                  </p>
                  <Button className="px-8 py-3">
                    <ShoppingCart className="w-5 h-5" />
                    Continue Shopping
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Cart Items ({cartItems.length})
                    </h2>

                  </div>

                  <AnimatePresence>
                    {cartItems.map((item: any) => (
                      <motion.div
                        key={item.id} // Added key property
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 sm:p-6 border rounded-xl bg-white shadow hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          {/* Product Image with animations */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative shrink-0 mx-auto sm:mx-0"
                          >
                            <div className="w-full sm:w-36 h-36 bg-gray-50 rounded-xl overflow-hidden">
                              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }}>
                                <Image
                                  src={item?.product?.productImage?.frontLook || "/placeholder.svg"}
                                  alt={item.product.projectName}
                                  width={144}
                                  height={144}
                                  className="w-full h-full object-cover"
                                  priority
                                />
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

                          {/* Product Details */}
                          <div className="flex-grow space-y-3">
                            {/* Product Title and Rating */}
                            <div>
                              <h3 className="font-medium text-lg line-clamp-2">{item.product.projectName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{item.product.rating}</span>
                                </div>
                                <span className="text-xs text-gray-500">({item.product.reviews} reviews)</span>
                              </div>
                            </div>

                            {/* Product Attributes */}
                            <div className="flex flex-wrap gap-4">
                              {/* Color */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Color:</span>
                                <div
                                  className="w-5 h-5 rounded-full border-2 border-gray-300"
                                  style={{ backgroundColor: item.product.color }}
                                />
                              </div>

                              {/* Size */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Size:</span>
                                <span className="text-sm font-medium">{item?.product?.size}</span>
                              </div>
                            </div>

                            {/* Listing Type Badges */}
                            <div className="flex flex-wrap gap-2">
                              {item?.product?.listingType?.map((type: string) => (
                                <div
                                  key={type}
                                  className="w-fit bg-purple-100 text-purple-600 uppercase px-1 rounded"
                                >
                                  {`For ${type}`}
                                </div>
                              ))}
                            </div>

                            {/* Pricing Section */}
                            <div className="pt-2">
                              {item?.product?.listingType?.includes("rent") ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-gray-700">Rental Period:</span>
                                  </div>

                                  <Tabs
                                    defaultValue={item.selectedRentalPeriod || "3"}
                                    value={item.selectedRentalPeriod || "3"}
                                    onValueChange={(value) => updateItemRentalPeriod(item.id, value)}
                                    className="w-full"
                                  >
                                    <TabsList className="grid grid-cols-3 w-full max-w-xs bg-gray-100 p-1 rounded-full">
                                      <TabsTrigger
                                        value="3"
                                        className="data-[state=active]:bg-white data-[state=active]:text-black text-muted-foreground font-medium py-2 rounded-full transition"
                                      >
                                        3 Days
                                      </TabsTrigger>
                                      <TabsTrigger
                                        value="7"
                                        className="data-[state=active]:bg-white data-[state=active]:text-black text-muted-foreground font-medium py-2 rounded-full transition"
                                      >
                                        7 Days
                                      </TabsTrigger>
                                      <TabsTrigger
                                        value="14"
                                        className="data-[state=active]:bg-white data-[state=active]:text-black text-muted-foreground font-medium py-2 rounded-full transition"
                                      >
                                        14 Days
                                      </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="3" className="mt-2">
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-emerald-600">₹{(item?.product?.originalPurchasePrice) * 21 / 100}</span>
                                        <span className="text-sm text-gray-500">for 3 days</span>
                                      </motion.div>
                                    </TabsContent>
                                    <TabsContent value="7" className="mt-2">
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-emerald-600">₹{(item?.product?.originalPurchasePrice) * 35 / 100}</span>
                                        <span className="text-sm text-gray-500">for 7 days</span>
                                      </motion.div>
                                    </TabsContent>
                                    <TabsContent value="14" className="mt-2">
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-emerald-600">₹{(item?.product?.originalPurchasePrice) * 42 / 100}</span>
                                        <span className="text-sm text-gray-500">for 14 days</span>
                                      </motion.div>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              ) : (
                                <div className="flex items-baseline gap-3">
                                  <span className="text-2xl font-bold text-emerald-600">₹{item.product.originalPurchasePrice * 0.5}</span>
                                  {item.product.mrp > item.product.originalPurchasePrice && (
                                    <span className="text-sm text-gray-500 line-through">₹{item.product.mrp}</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions Row */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                
                              </div>

                              {/* Remove Button */}
                              <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#FEE2E2" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeItem(item.id)}
                                className="flex items-right gap-1 text-red-500 hover:text-red-600 px-3 py-1.5 rounded-md text-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Remove</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                variants={itemVariants}
                className="sticky top-8 space-y-6"
              >
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
                {discount > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-600 font-medium">Promo applied! {discount}% off</span>
                  </div>
                )}
              </div> */}

                {/* Order Summary */}
                <div className="p-6 border rounded-xl bg-white shadow-lg">
                  <h3 className="font-semibold mb-4 text-xl text-gray-800">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {/* {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )} */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className={"text-green-600 font-medium"}>
                        {"FREE"}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Tax (GST 18%)</span>
                      <span className="font-medium">₹{tax.toLocaleString()}</span>
                    </div> */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-pink-600">₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6 py-4 text-lg">
                    <Shield className="w-5 h-5" />
                    Proceed to Checkout
                  </Button>

                  <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Secure checkout with SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Easy returns & exchanges</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="p-4 border rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="text-center">
                      <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-xs font-medium">Free Delivery</div>
                    </div>
                    <div className="text-center">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-xs font-medium">Secure Payment</div>
                    </div>
                    <div className="text-center">
                      <RotateCcw className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-xs font-medium">Easy Returns</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>

      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Select Delivery Address</DialogTitle>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {user?.addresses?.map((address: any) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-pink-500 ${selectedAddressId === address.id ? 'border-pink-500 bg-pink-50' : ''
                  }`}
                onClick={() => {
                  setSelectedAddressId(address.id);
                  setSelectedAddress(address)
                  setShowAddressModal(false);
                  // You can add logic here to update the selected address
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{address.customAddressType}</span>
                  {selectedAddressId === address.id && (
                    <Badge variant="secondary" className="bg-pink-100 text-pink-700">Selected</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{address.landmark}</p>
                <p className="text-sm text-gray-600">{address.addressLine1}</p>
                {address.addressLine2 && (
                  <p className="text-sm text-gray-600">{address.addressLine2}</p>
                )}
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state}, {address.pincode}
                </p>
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
      <AddressFormDialog
        openFor={"add"}
        open={showNewAddressForm}
        setIsSubmitting={setIsSubmitting}
        isSubmitting={isSubmitting}
        onOpenChange={setShowNewAddressForm}
        onSave={(newAddress) => {
          handleAddAddressApi(newAddress)
        }}
      />
    </>
  );
}