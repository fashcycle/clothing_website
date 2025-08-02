"use client";
import { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Camera,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

import {
  addNewAddress,
  getUserDetails,
  getUserAddresses,
  updateUserProfile,
  updateAddress,
  deleteAddress,
} from "@/app/api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ProfilePictureDialog } from "@/components/profile/profile-picture-dialog";
import { formatDate } from "../utils/dateUtils";
import { PersonalInfoForm } from "@/components/profile/personalInfoForm";
import { AddressFormDialog } from "@/components/profile/address-form-dialog";
import { AddressList } from "@/components/profile/address-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@radix-ui/react-tooltip";
import { toast } from "sonner";
import ProductListingTab from "@/components/ProductListingTab";
interface UserAddress {
  address: string;
  landmark: string;
  customAddressType: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const router: any = useRouter();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const fileInputRef: any = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userLocation, setUserLocation] = useState(() => {
    if (typeof window !== "undefined") {
      const storedLocation = localStorage.getItem("userLocation");
      return storedLocation ? JSON.parse(storedLocation) : null;
    }
    return null;
  });
  const [userData, setUserData] = useState(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user-info");
      return user ? JSON.parse(user) : null;
    }
    return null;
  });
  const [userAddress, setUserAddress] = useState<UserAddress | null>(() => {
    if (typeof window !== "undefined") {
      const storedAddress = localStorage.getItem("userAddress");
      return storedAddress ? JSON.parse(storedAddress) : null;
    }
    return null;
  });

  const getLocationString = () => {
    if (userAddress) {
      return `${userLocation.city}, ${userLocation.state}`;
    } else if (userLocation) {
      return `${userLocation.city}, ${userLocation.state}`;
    }
    return "Location not set";
  };
  const [userImage, setUserImage] = useState<any>();
  useEffect(() => {
    if (userData) {
      setUserImage(userData?.image);
    }
  }, [userData]);

  interface SavedAddress {
    id: string;
    address: string;
    landmark: string;
    customAddressType: string;
    addressLine1: string;
    addressLine2: string;
    pincode: {
      pincode: string;
      city: string;
      state: string;
      country: string;
    };
  }

  // Inside ProfilePage component, add this state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
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

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState<SavedAddress>({
    id: "",
    address: "",
    customAddressType: "",
    landmark: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
  }); // In your ProfilePage component, add this state for errors
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState("productListing");
  const allowedImageTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
  ];

  const handleAddAddressApi = async (newAddress: any) => {
    setIsSubmitting(true);

    const data = {
      pincode: newAddress?.pincode,
      city: newAddress?.city,
      state: newAddress?.state,
      customAddressType: newAddress?.customAddressType,
      landmark: newAddress?.landmark,
      addressLine1: newAddress?.addressLine1,
      addressLine2: newAddress?.addressLine2,
      address: newAddress?.address,
    };

    try {
      const response = await addNewAddress(data);
      if (response.success) {
        setIsSubmitting(false);
        fetchAddresses();
        setShowNewAddressForm(false);
        setNewAddressForm({
          id: "",
          address: "",
          landmark: "",
          customAddressType: "",
          addressLine1: "",
          addressLine2: "",
          pincode: "",
          city: "",
          state: "",
          country: "India",
        });

        const newErrors = { ...formErrors };
        delete newErrors.addressLine1;
        delete newErrors.pincode;
        delete newErrors.landmark;
        setFormErrors(newErrors);
      } else {
        toast.error("Failed to add address. Please check the form.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };
  const confirmLogout = () => {
    localStorage.removeItem("user-info");
    localStorage.removeItem("token");
    router.push("/login");
    setShowLogoutDialog(false);
  };
  const handleImageUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("name", userData?.name);
      formData.append("email", userData?.email);
      formData.append("image", selectedImage);
      try {
        const result = await updateUserProfile(formData);
        if (result?.success) {
          const userDetails = await getUserDetails();
          if (userDetails?.success) {
            localStorage.setItem(
              "user-info",
              JSON.stringify(userDetails?.user)
            );
            setUserData(userDetails.user);
          }
          setUserImage(userDetails?.user?.image);
          setIsImageDialogOpen(false);
          setSelectedImage(null);
          setPreviewImage(null);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };
  const fetchUserDetails = async () => {
    try {
      const userDetails = await getUserDetails();
      if (userDetails?.success) {
        localStorage.setItem("user-info", JSON.stringify(userDetails.user));
        setUserData(userDetails.user);
        setUserImage(userDetails.user?.image);
        // setSavedAddresses(userDetails?.user?.addresses);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!allowedImageTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, or WEBP images are allowed.");

        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  const removeProfilePicture = () => {
    setIsImageDialogOpen(false);
    setPreviewImage(null);
  };
  const handleProfileUpdate = async (data: any) => {
    const formData = new FormData();
    formData.append("phone", data?.phone);
    formData.append("dob", data?.dob);
    formData.append("name", data?.name);
    try {
      const result = await updateUserProfile(formData);
      if (result?.success) {
        const userDetails = await getUserDetails();
        if (userDetails?.success) {
          localStorage.setItem("user-info", JSON.stringify(userDetails?.user));
          setUserData(userDetails.user);
        }
        toast.success(result.message);
        setUserImage(userDetails?.user?.image);
        setIsImageDialogOpen(false);
        setSelectedImage(null);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="container py-10 lg:pt-24">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="w-full max-w-md mx-auto overflow-hidden border-2 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="relative pb-0">
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 h-fit">
                <div>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255 255 255 / 1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => router.push("/dashboard")}
                    className="bg-white/80 backdrop-blur-sm hover:bg-white transition-all border border-green-600 rounded px-4 py-2 flex items-center gap-2 whitespace-nowrap"
                  >
                    <ChevronLeft className="h-5 w-5 flex-shrink-0" />
                    <span>Dashboard</span>
                  </motion.button>
                </div>
                <div className="flex items-center gap-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all"
                            onClick={() => {
                              setIsEditing(true);
                              setActiveTab("personal");
                            }}
                          >
                            <Edit className="h-4 w-4 text-primary" />
                            <span className="sr-only">Edit Profile</span>
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="bg-black text-white px-2 py-1 rounded-md text-sm"
                      >
                        <p>Edit Profile</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all"
                            onClick={handleLogout}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-red-500"
                            >
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16 17 21 12 16 7"></polyline>
                              <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            <span className="sr-only">Logout</span>
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="bg-black text-white px-2 py-1 rounded-md text-sm"
                      >
                        <p>Logout</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="relative mb-6 mt-14"
                  onMouseEnter={() => setIsHoveringAvatar(true)}
                  onMouseLeave={() => setIsHoveringAvatar(false)}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-lg">
                      <AvatarImage
                        src={userImage || "/placeholder.svg"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary">
                        <User className="h-14 w-14 text-white" />
                      </AvatarFallback>
                    </Avatar>

                    <AnimatePresence>
                      {isHoveringAvatar && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-white hover:bg-primary/50"
                            onClick={() => {
                              setIsImageDialogOpen(true);
                              setPreviewImage(userImage);
                            }}
                          >
                            <Camera className="h-6 w-6" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <CardTitle className="text-2xl font-bold">
                    {userData?.name}
                  </CardTitle>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardDescription className="flex items-center mt-1">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Verified User
                    </Badge>
                  </CardDescription>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mt-4"
                >
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    Seller
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
                  >
                    Renter
                  </Badge>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 bg-slate-50 p-4 rounded-lg"
              >
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Mail className="h-4 w-4 mr-3 text-primary" />
                  <span>{userData?.email}</span>
                </motion.div>
                {userData?.phone !== null && (
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Phone className="h-4 w-4 mr-3 text-primary" />
                    <span>{userData?.phone}</span>
                  </motion.div>
                )}
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MapPin className="h-4 w-4 mr-3 text-primary" />
                  <span>{getLocationString()}</span>
                </motion.div>
                {userData?.createdAt && (
                  <motion.div
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Calendar className="h-4 w-4 mr-3 text-primary" />
                    {formatDate(userData?.createdAt)}
                  </motion.div>
                )}
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Shield className="h-4 w-4 mr-3 text-primary" />
                  <span>ID Verified</span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white mt-6">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get updates about your orders
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for important updates
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="md:w-2/3">
          {/* <Tabs defaultValue="productListing" className="w-full"> */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full "
          >
            <TabsList className="grid w-full grid-cols-3 ">
              <TabsTrigger value="productListing">Product Listing</TabsTrigger>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>

            <TabsContent value="productListing" className="mt-6 relative">
              <ProductListingTab
                userData={userData}
                savedAddresses={savedAddresses}
                fetchAddresses={fetchAddresses}
                router={router}
              />
            </TabsContent>

            <TabsContent value="personal" className="mt-6">
              <PersonalInfoForm
                userData={{
                  name: userData?.name,
                  phone: userData?.phone,
                  dob: userData?.dob,
                }}
                onSubmit={async (data: any) => {
                  try {
                    handleProfileUpdate(data);
                  } catch (error) {
                    console.error("Error updating user data:", error);
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="address" className="mt-6">
              <AddressList
                addresses={savedAddresses}
                onAddressUpdate={async (
                  addressId: any,
                  updatedAddressData: any
                ) => {
                  try {
                    const response = await updateAddress(
                      addressId,
                      updatedAddressData
                    );
                    await fetchAddresses();
                  } catch (error) {
                    console.error("Error updating address:", error);
                  }
                }}
                onAddressDelete={async (addressId: any) => {
                  try {
                    await deleteAddress(addressId);
                    await fetchAddresses();
                  } catch (error) {
                    console.error("Error deleting address:", error);
                  }
                }}
                onAddNewAddress={async (newAddress) => {
                  try {
                    const response: any = await addNewAddress(newAddress);
                    await fetchAddresses();
                  } catch (error) {
                    console.error("Error adding address:", error);
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ProfilePictureDialog
        isOpen={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        previewImage={previewImage}
        userImage={userImage}
        onFileChange={handleFileChange}
        removeProfilePicture={removeProfilePicture}
        handleImageUpload={handleImageUpload}
        fileInputRef={fileInputRef}
        triggerFileInput={triggerFileInput}
      />
      <AddressFormDialog
        openFor={"add"}
        open={showNewAddressForm}
        setIsSubmitting={setIsSubmitting}
        isSubmitting={isSubmitting}
        onOpenChange={setShowNewAddressForm}
        onSave={(newAddress) => {
          handleAddAddressApi(newAddress);
        }}
      />
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
