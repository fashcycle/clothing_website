"use client";
// i have added size dropdown where user can select size of product
// static sized (S,M,L) bacause ofc category name issue
// once categoty are created then we remove (size )
import { useState, useRef, useEffect } from "react";
import {
  User,
  Info,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Camera,
  CheckCircle,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as yup from "yup";
import LehengaSizeChart from "@/components/clothCategory-sizecharts/lehnga-sizechart";
import ShararaSizeChart from "@/components/clothCategory-sizecharts/sharara-sizechart";
import AnarkaliSizeChart from "@/components/clothCategory-sizecharts/anarkali-sizechart";
import SareeSizeChart from "@/components/clothCategory-sizecharts/saree-sizechart";
import SuitSizeChart from "@/components/clothCategory-sizecharts/suit-sizechart";
import {
  addNewAddress,
  getUserDetails,
  getUserAddresses,
  updateUserProfile,
  createProduct,
  updateAddress,
  deleteAddress,
  getAllCategories,
  verifyReferral,
} from "@/app/api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import GownSizeChart from "@/components/clothCategory-sizecharts/gown-sizechart";
import RajasthaniPoshakSizeChart from "@/components/clothCategory-sizecharts/rajesthaniposhak-sizechart";
import { ProfilePictureDialog } from "@/components/profile/profile-picture-dialog";
import { formatDate } from "../utils/dateUtils";
import { PersonalInfoForm } from "@/components/profile/personalInfoForm";
import { AddressFormDialog } from "@/components/profile/address-form-dialog";
import { Loader } from "@/components/ui/loader";
import { AddressList } from "@/components/profile/address-list";
import OtherSizeChart from "@/components/clothCategory-sizecharts/other-sizechart";
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

interface ProductForm {
  productName: string;
  category: string;
  mobileNumber: string;
  addressId: string;
  size: string;
  originalPurchasePrice: number;
  productSize: string;
  sizeFlexibility: string;
  color: string;
  frontLook: File | null;
  sideLook: File | null;
  backLook: File | null;
  closeUpLook: File | null;
  optional1: File | string;
  optional2: File | string;
  productVideo: File | null;
  accessoriesImage: File | string;
  proofOfPurchase: File | string;
  listingType: string[];
  referralCode: string;
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

  const [productForm, setProductForm] = useState<ProductForm>({
    productName: "",
    category: "",
    originalPurchasePrice: 5000,
    productSize: "",
    sizeFlexibility: "",
    color: "",
    frontLook: null,
    sideLook: null,
    backLook: null,
    closeUpLook: null,
    optional1: "",
    optional2: "",
    productVideo: null,
    accessoriesImage: "",
    proofOfPurchase: "",
    listingType: [],
    mobileNumber: "",
    addressId: "",
    size: "",
    referralCode: "",
  });
  const handleProjectCreat = async () => {
    const errors: any = {};
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("productName", productForm.productName);
      formData.append("categoryId", productForm.category);
      formData.append("mobileNumber", productForm.mobileNumber);
      formData.append("addressId", productForm.addressId);
      formData.append("referralCode", productForm.referralCode);
      formData.append(
        "originalPurchasePrice",
        productForm.originalPurchasePrice.toString()
      );
      formData.append("size", productForm.productSize);
      formData.append("sizeFlexibility", productForm.sizeFlexibility);
      // formData.append("size", productForm.size);
      formData.append("color", productForm.color);

      if (productForm.frontLook)
        formData.append("frontLook", productForm.frontLook);
      if (productForm.sideLook)
        formData.append("sideLook", productForm.sideLook);
      if (productForm.backLook)
        formData.append("backLook", productForm.backLook);
      if (productForm.closeUpLook)
        formData.append("closeUpLook", productForm.closeUpLook);

      if (productForm.optional1)
        formData.append("optional1", productForm.optional1);
      if (productForm.optional2)
        formData.append("optional2", productForm.optional2);

      if (productForm.productVideo)
        formData.append("productVideo", productForm.productVideo);

      if (productForm.accessoriesImage)
        formData.append("accessoriesImage", productForm.accessoriesImage);

      if (productForm.proofOfPurchase)
        formData.append("proofOfPurchase", productForm.proofOfPurchase);

      const listingTypeValue =
        productForm.listingType.length === 2
          ? "both"
          : productForm.listingType[0];
      formData.append("listingType", listingTypeValue);
      delete errors.productVideo;
      const response = await createProduct(formData);
      if (response.success === true) {
        setProductForm({
          productName: "",
          category: "",
          originalPurchasePrice: 5000,
          productSize: "",
          sizeFlexibility: "",
          color: "",
          frontLook: null,
          sideLook: null,
          backLook: null,
          closeUpLook: null,
          optional1: "",
          optional2: "",
          productVideo: null,
          accessoriesImage: "",
          proofOfPurchase: "",
          listingType: [],
          mobileNumber: "",
          addressId: "",
          size: "",
          referralCode: "",
        });
        setFormErrors({});
        setSelectedAddressId("");
        toast.success("Product created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Failed to create product");
      }
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        err.inner.forEach((e) => {
          if (e.path) {
            errors[e.path] = e.message;
          }
        });
        setFormErrors(errors);
      } else {
        toast.error(err.message || "Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
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

  const handleFileValidation = (file: File, maxSize: number) => {
    const sizeInMB = file.size / (1024 * 1024);
    return sizeInMB <= maxSize;
  };
  const labelToFieldMap: Record<string, keyof ProductForm> = {
    "Front look": "frontLook",
    "Side Look": "sideLook",
    "Back look": "backLook",
    "CloseUp look": "closeUpLook",
    "Optional 1": "optional1",
    "Optional 2": "optional2",
  };
  const UploadImageInput = ({
    index,
    type,
    productForm,
    setProductForm,
    handleFileValidation,
  }: any) => {
    const fieldKey = labelToFieldMap[type]; // ✅ use the correct key

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && handleFileValidation(file)) {
        setProductForm({
          ...productForm,
          [fieldKey]: file,
        });
      }
    };

    return (
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full text-sm"
      />
    );
  };
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
  const [categories, setCategories] = useState();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const selectedCategoryObj = categories?.find(
    (cat) => String(cat.id) === String(productForm.category)
  );
  const [referralVerified, setReferralVerified] = useState(null);
  const [referrerName, setReferrerName] = useState("");
  const [referralVerifying, setReferralVerifying] = useState(false);
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
              <Card>
                <CardHeader>
                  <CardTitle>Product Listings</CardTitle>
                  <CardDescription>
                    List your product for rent or sale
                  </CardDescription>
                </CardHeader>
                <form
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    handleProjectCreat();
                  }}
                >
                  <CardContent className="space-y-6">
                    <div className="space-y-2 static lg:absolute top-10 right-10">
                      <Label
                        htmlFor="referralCode"
                        className="font-large font-bold"
                      >
                        Referral Code *
                      </Label>
                      <Input
                        id="referralCode"
                        value={productForm.referralCode.toUpperCase()}
                        onChange={(e) => {
                          const uppercaseCode = e.target.value.toUpperCase();
                          setProductForm({
                            ...productForm,
                            referralCode: uppercaseCode,
                          });
                          setReferralVerified(null);
                          setReferrerName("");
                          setFormErrors({ ...formErrors, referralCode: "" });
                        }}
                        onBlur={async (e) => {
                          const referralCode = e.target.value
                            .trim()
                            .toUpperCase();
                          if (!referralCode) return;
                          try {
                            setReferralVerifying(true);
                            const res = await verifyReferral({
                              code: referralCode,
                            });
                            if (
                              res.success &&
                              res.verified &&
                              res.data?.referrerName
                            ) {
                              setReferralVerified(true);
                              setReferrerName(res.data.referrerName);
                              setFormErrors({
                                ...formErrors,
                                referralCode: "",
                              });
                            } else {
                              setReferralVerified(false);
                              setReferrerName("");
                              setFormErrors({
                                ...formErrors,
                                referralCode: "Invalid referral code",
                              });
                            }
                          } catch {
                            setReferralVerified(false);
                            setReferrerName("");
                            setFormErrors({
                              ...formErrors,
                              referralCode: "Invalid referral code",
                            });
                          } finally {
                            setReferralVerifying(false);
                          }
                        }}
                        className={`uppercase ${
                          formErrors.referralCode
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                        disabled={referralVerifying}
                      />

                      {referralVerifying && (
                        <p className="text-xs text-gray-500">Verifying...</p>
                      )}
                      {referralVerified && referrerName && (
                        <p className="text-green-600 text-sm font-medium">
                          Referrer: {referrerName}
                        </p>
                      )}
                      {formErrors.referralCode && (
                        <p className="text-sm text-destructive">
                          {formErrors.referralCode}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="productName"
                        className="font-large font-bold"
                      >
                        Product Name *
                      </Label>
                      <Input
                        id="productName"
                        value={productForm.productName}
                        onChange={(e) => {
                          setProductForm({
                            ...productForm,
                            productName: e.target.value,
                          });
                          setFormErrors({ ...formErrors, productName: "" });
                        }}
                      />
                      {formErrors.productName && (
                        <p className="text-sm text-destructive">
                          {formErrors.productName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="mobileNumber"
                        className="font-large font-bold"
                      >
                        Mobile Number *
                      </Label>
                      <Input
                        id="mobileNumber"
                        value={productForm.mobileNumber}
                        onChange={(e) => {
                          setProductForm({
                            ...productForm,
                            mobileNumber: e.target.value,
                          });
                          const newErrors = { ...formErrors };
                          delete newErrors.mobileNumber;
                          setFormErrors(newErrors);
                        }}
                      />
                      {formErrors.mobileNumber && (
                        <p className="text-sm text-destructive">
                          {formErrors.mobileNumber}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="category"
                        className="font-large font-bold"
                      >
                        Category *
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          setProductForm({ ...productForm, category: value });
                          const newErrors = { ...formErrors };
                          delete newErrors.category;
                          setFormErrors(newErrors);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select category"
                            id="category"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <p className="capitalize ">{category.name}</p>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.category && (
                        <p className="text-sm text-destructive">
                          {formErrors.category}
                        </p>
                      )}
                    </div>

                    {selectedCategoryObj?.slug === "lehenga" && (
                      <LehengaSizeChart
                        onSizeSelect={(size) => {
                          setProductForm({ ...productForm, productSize: size });
                          const newErrors = { ...formErrors };
                          delete newErrors.productSize;
                          setFormErrors(newErrors);
                        }}
                      />
                    )}
                    {selectedCategoryObj?.slug === "gown" && (
                      <GownSizeChart
                        onSizeSelect={(size: any) => {
                          setProductForm({ ...productForm, productSize: size });
                          setFormErrors({ ...formErrors, productSize: "" });
                        }}
                      />
                    )}
                    {selectedCategoryObj?.slug === "sharara-set" && (
                      <ShararaSizeChart
                        onSizeSelect={(size) => {
                          setProductForm({ ...productForm, productSize: size });
                          setFormErrors({ ...formErrors, productSize: "" });
                        }}
                      />
                    )}
                    {selectedCategoryObj?.slug === "anarkali" && (
                      <AnarkaliSizeChart
                        onSizeSelect={(size) => {
                          setProductForm({ ...productForm, productSize: size });
                          setFormErrors({ ...formErrors, productSize: "" });
                        }}
                      />
                    )}
                    {selectedCategoryObj?.slug === "saree" && (
                      <SareeSizeChart
                        onSizeSelect={(size) => {
                          setProductForm({ ...productForm, productSize: size });
                          setFormErrors({ ...formErrors, productSize: "" });
                        }}
                      />
                    )}
                    {selectedCategoryObj?.slug === "suit" && (
                      <SuitSizeChart
                        onSizeSelect={(size) => {
                          setProductForm({ ...productForm, productSize: size });
                          setFormErrors({ ...formErrors, productSize: "" });
                        }}
                      />
                    )}
                    {selectedCategoryObj?.slug === "poshak" && (
                      <RajasthaniPoshakSizeChart
                        onSizeSelect={(size: any) => {
                          setProductForm({ ...productForm, productSize: size });
                          setFormErrors({ ...formErrors, productSize: "" });
                        }}
                      />
                    )}
                    {selectedCategoryObj?.slug === "other" && (
                      <OtherSizeChart
                        onSizeSelect={(size: any) => {
                          setProductForm({ ...productForm, productSize: size });
                          const newErrors = { ...formErrors };
                          delete newErrors.productSize;
                          setFormErrors(newErrors);
                        }}
                      />
                    )}
                    <div className="space-y-2">
                      <Label
                        htmlFor="originalPurchasePrice"
                        className="font-large font-bold"
                      >
                        Original Purchase Price (₹) *
                      </Label>
                      <Input
                        id="originalPurchasePrice"
                        type="number"
                        value={productForm.originalPurchasePrice || ""}
                        onChange={(e) => {
                          const value =
                            e.target.value === "" ? 0 : Number(e.target.value);
                          setProductForm({
                            ...productForm,
                            originalPurchasePrice: value,
                          });
                          if (value < 5000) {
                            setFormErrors({
                              ...formErrors,
                              originalPurchasePrice:
                                "Minimum price should be ₹5,000",
                            });
                          } else {
                            const newErrors = { ...formErrors };
                            delete newErrors.originalPurchasePrice;
                            setFormErrors(newErrors);
                          }
                        }}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                      />
                      {formErrors.originalPurchasePrice && (
                        <p className="text-sm text-destructive">
                          {formErrors.originalPurchasePrice}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <TooltipProvider>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <Label className="font-large font-bold">
                              Size Flexibility *
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent
                                side="bottom"
                                className="bg-black text-white px-2 py-1 rounded-md text-sm max-w-xs"
                              >
                                Size flexibility shows the possibility of
                                alteration available in the product.
                              </TooltipContent>
                            </Tooltip>
                          </div>{" "}
                          <Select
                            onValueChange={(value) => {
                              setProductForm({
                                ...productForm,
                                sizeFlexibility: value,
                              });
                              const newErrors = { ...formErrors };
                              delete newErrors.sizeFlexibility;
                              setFormErrors(newErrors);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select flexibility" />
                            </SelectTrigger>
                            <SelectContent>
                              {["0cm", "1cm", "2cm", "3cm", "3+cm"].map(
                                (flex) => (
                                  <SelectItem key={flex} value={flex}>
                                    {flex}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          {productForm.sizeFlexibility === "0cm" && (
                            <p className="text-sm italic text-blue-600">
                              Size flexibility of 0cm means no size alterations
                              are possible for this product.
                            </p>
                          )}
                          {formErrors.sizeFlexibility && (
                            <p className="text-sm text-destructive">
                              {formErrors.sizeFlexibility}
                            </p>
                          )}
                        </div>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color" className="font-large font-bold">
                        Color *
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          setProductForm({ ...productForm, color: value });
                          const newErrors = { ...formErrors };
                          delete newErrors.color;
                          setFormErrors(newErrors);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color">
                            {productForm.color && (
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full bg-${productForm.color.toLowerCase()}-500`}
                                />
                                {productForm.color}
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {[
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
                          ].map((item) => (
                            <SelectItem
                              key={item.name.toLowerCase()}
                              value={item.name.toLowerCase()}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${item.color}`}
                                />
                                {item.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.color && (
                        <p className="text-sm text-destructive">
                          {formErrors.color}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-large font-bold">
                        Product Images (Min 4 required) *
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Front Look Image */}
                        <div className="space-y-2">
                          <Label className="font-large font-bold">
                            Front Look
                          </Label>
                          <div className="rounded-lg p-4">
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && file.size <= 10 * 1024 * 1024) {
                                    setProductForm({
                                      ...productForm,
                                      frontLook: file,
                                    }); // Store as File
                                    const newErrors = { ...formErrors };
                                    delete newErrors.frontLook;
                                    setFormErrors(newErrors);
                                  }
                                }}
                              />
                              {formErrors.frontLook && (
                                <p className="text-sm text-destructive">
                                  {formErrors.frontLook}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Back Look Image */}
                        <div className="space-y-2">
                          <Label className="font-large font-bold">
                            Back Look Image
                          </Label>
                          <div className="rounded-lg p-4">
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && file.size <= 10 * 1024 * 1024) {
                                    setProductForm({
                                      ...productForm,
                                      backLook: file,
                                    }); // Store as File
                                    const newErrors = { ...formErrors };
                                    delete newErrors.backLook;
                                    setFormErrors(newErrors);
                                  }
                                }}
                              />
                              {formErrors.backLook && (
                                <p className="text-sm text-destructive">
                                  {formErrors.backLook}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Side Look Image */}
                        <div className="space-y-2">
                          <Label className="font-large font-bold">
                            Side Look Image
                          </Label>
                          <div className="rounded-lg p-4">
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && file.size <= 10 * 1024 * 1024) {
                                    setProductForm({
                                      ...productForm,
                                      sideLook: file,
                                    }); // Store as File
                                    const newErrors = { ...formErrors };
                                    delete newErrors.sideLook;
                                    setFormErrors(newErrors);
                                  }
                                }}
                              />
                              {formErrors.sideLook && (
                                <p className="text-sm text-destructive">
                                  {formErrors.sideLook}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CloseUp Look Image */}
                        <div className="space-y-2">
                          <Label className="font-large font-bold">
                            CloseUp Look Image
                          </Label>
                          <div className="rounded-lg p-4">
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && file.size <= 10 * 1024 * 1024) {
                                    setProductForm({
                                      ...productForm,
                                      closeUpLook: file,
                                    }); // Store as File
                                    const newErrors = { ...formErrors };
                                    delete newErrors.closeUpLook;
                                    setFormErrors(newErrors);
                                  }
                                }}
                              />
                              {formErrors.closeUpLook && (
                                <p className="text-sm text-destructive">
                                  {formErrors.closeUpLook}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Optional 1 Image */}
                        <div className="space-y-2">
                          <Label className="font-large font-bold">
                            Optional 1 Image
                          </Label>
                          <div className="rounded-lg p-4">
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && file.size <= 10 * 1024 * 1024) {
                                    setProductForm({
                                      ...productForm,
                                      optional1: file,
                                    }); // Store as File
                                    const newErrors = { ...formErrors };
                                    delete newErrors.optional1;
                                    setFormErrors(newErrors);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Optional 2 Image */}
                        <div className="space-y-2">
                          <Label className="font-large font-bold">
                            Optional 2 Image
                          </Label>
                          <div className="rounded-lg p-4">
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && file.size <= 10 * 1024 * 1024) {
                                    setProductForm({
                                      ...productForm,
                                      optional2: file,
                                    }); // Store as File
                                    const newErrors = { ...formErrors };
                                    delete newErrors.optional2;
                                    setFormErrors(newErrors);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-large font-bold">
                        Product Video (Max 20MB)
                      </Label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const maxSizeInMB = 20;
                            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

                            if (file.size > maxSizeInBytes) {
                              alert("Video size should be less than 20MB");
                              return;
                            }

                            setProductForm({
                              ...productForm,
                              productVideo: file,
                            });
                            const newErrors = { ...formErrors };
                            delete newErrors.productVideo;
                            setFormErrors(newErrors);
                          }
                        }}
                      />
                      {formErrors.productVideo && (
                        <p className="text-sm text-destructive">
                          {formErrors.productVideo}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-large font-bold">
                        Accessories Image
                      </Label>
                      <div className="rounded-lg p-4">
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && file.size <= 10 * 1024 * 1024) {
                                setProductForm({
                                  ...productForm,
                                  accessoriesImage: file,
                                }); // ✅ Store as File
                                const newErrors = { ...formErrors };
                                delete newErrors.accessoriesImage;
                                setFormErrors(newErrors);
                              }
                            }}
                          />
                          {formErrors.accessoriesImage && (
                            <p className="text-sm text-destructive">
                              {formErrors.accessoriesImage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-large font-bold">
                        Proof of Purchase
                      </Label>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.size <= 10 * 1024 * 1024) {
                            setProductForm({
                              ...productForm,
                              proofOfPurchase: file,
                            }); // ✅ Store as File
                            const newErrors = { ...formErrors };
                            delete newErrors.proofOfPurchase;
                            setFormErrors(newErrors);
                          }
                        }}
                      />
                      {formErrors.proofOfPurchase && (
                        <p className="text-sm text-destructive">
                          {formErrors.proofOfPurchase}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-large font-bold">
                        Listing Type *
                      </Label>
                      <div className="flex gap-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.listingType.includes("rent")}
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...productForm.listingType, "rent"]
                                : productForm.listingType.filter(
                                    (t) => t !== "rent"
                                  );
                              setProductForm({
                                ...productForm,
                                listingType: newTypes,
                              });
                              const newErrors = { ...formErrors };
                              delete newErrors.listingType;
                              setFormErrors(newErrors);
                            }}
                          />

                          <span>Rent</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.listingType.includes("sell")}
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...productForm.listingType, "sell"]
                                : productForm.listingType.filter(
                                    (t) => t !== "sell"
                                  );
                              setProductForm({
                                ...productForm,
                                listingType: newTypes,
                              });
                            }}
                          />
                          <span>Sell</span>
                        </label>
                        {formErrors.listingType && (
                          <p className="text-sm text-destructive">
                            {formErrors.listingType}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="font-large font-bold">
                          Address Details
                        </h2>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNewAddressForm(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Address
                        </Button>
                      </div>
                      {!showNewAddressForm && savedAddresses?.length > 0 && (
                        <div className="space-y-4">
                          <Label>Select From Saved Address</Label>
                          <RadioGroup
                            value={selectedAddressId || ""}
                            onValueChange={(value) => {
                              setSelectedAddressId(value);
                              setProductForm({
                                ...productForm,
                                addressId: value,
                              });
                            }}
                          >
                            {savedAddresses?.map((address) => (
                              <div
                                key={address?.id}
                                className="flex items-start space-x-3 border border-primary p-6 rounded-lg 
                                hover:border-primary hover:shadow-lg transition-all duration-300 
                                hover:scale-[1.02] cursor-pointer bg-white
                                shadow-sm hover:bg-primary/5"
                              >
                                <RadioGroupItem
                                  value={address?.id}
                                  id={`address-${address?.id}`}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <Label
                                    htmlFor={`address-${address?.id}`}
                                    className="grid gap-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-base">
                                        {address.address}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="animate-in fade-in duration-500"
                                      >
                                        {address.pincode.pincode}
                                      </Badge>
                                    </div>
                                    <span className="text-muted-foreground">
                                      {address.landmark}
                                    </span>

                                    <span className="text-muted-foreground">
                                      {address.addressLine1}
                                    </span>
                                    {address.addressLine2 && (
                                      <span className="text-muted-foreground">
                                        {address.addressLine2}
                                      </span>
                                    )}
                                    <span className="text-muted-foreground">{`${address.pincode.city}, ${address.pincode.state}`}</span>
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}

                      {formErrors.addressId && (
                        <p className="text-sm text-destructive">
                          {formErrors.addressId}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <Loader text="Creating..." />
                      ) : (
                        "Create Product"
                      )}
                    </Button>
                  </CardContent>
                </form>
              </Card>
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
