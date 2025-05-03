"use client"

import { useState, useRef } from "react"
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Camera, CheckCircle, AlertCircle, Plus, Upload } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import * as yup from "yup"
import LehengaSizeChart from "@/components/lehnga-sizechart"

interface UserAddress {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

// Move these interfaces outside of the component, at the top level with UserAddress
interface ProductImage {
  type: string;
  file: File;
  preview: string;
}

interface ProductForm {
  name: string;
  category: string;
  mobileNumber: string;
  address: {
    landmark: string;
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  };
  originalPrice: number;
  size: string;
  sizeFlexibility: string;
  color: string;
  images: ProductImage[];
  video: File | null;
  accessories: ProductImage[];
  proofOfPurchase: File | null;
  listingType: string[];

}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { data: session } = useSession()
  const [userLocation, setUserLocation] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedLocation = localStorage.getItem('userLocation')
      return storedLocation ? JSON.parse(storedLocation) : null
    }
    return null
  })

  // Get user's address from local storage or default values
  const [userAddress, setUserAddress] = useState<UserAddress | null>(() => {
    if (typeof window !== 'undefined') {
      const storedAddress = localStorage.getItem('userAddress')
      return storedAddress ? JSON.parse(storedAddress) : null
    }
    return null
  })

  // Function to update address and location
  const updateAddress = (newAddress: UserAddress) => {
    setUserAddress(newAddress)
    localStorage.setItem('userAddress', JSON.stringify(newAddress))
  }

  // Get location string
  const getLocationString = () => {
    if (userAddress) {
      return `${userLocation.city}, ${userLocation.state}`
    } else if (userLocation) {
      return `${userLocation.city}, ${userLocation.state}`
    }
    return "Location not set"
  }
  console.log(userAddress, userLocation, "userLocation")
  // Get user's full name from session
  const userFullName = session?.user?.name || "Guest User"
  const userEmail = session?.user?.email || "No email provided"
  const userImage = session?.user?.image || ""
  console.log(session?.user, "session?.user")
  // In the ProfilePage component, add this state
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    category: "",
    originalPrice: 5000,
    size: "",
    sizeFlexibility: "",
    color: "",
    images: [],
    video: null,
    accessories: [],
    proofOfPurchase: null,
    listingType: [],
    mobileNumber: "",
    address: {
      landmark: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    }
  })
  console.log(productForm, "productForm")
  const handleProjectCreat = async () => {
    try {
      await productSchema.validate(productForm, { abortEarly: false })
      // If validation passes, proceed with form submission
      console.log("Form is valid", productForm)
      // Add your submission logic here
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: { [key: string]: string } = {}
        err.inner.forEach((e) => {
          if (e.path) {
            errors[e.path] = e.message
          }
        })
        setFormErrors(errors)
      }
    }
  }
  const productSchema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    category: yup.string().required("Category is required"),
    originalPrice: yup
      .number()
      .min(5000, "Minimum price should be ₹5,000")
      .required("Original price is required"),
    size: yup.string().required("Size is required"),
    sizeFlexibility: yup.string().required("Size flexibility is required"),
    color: yup.string().required("Color is required"),
    images: yup.array().min(4, "Minimum 4 images are required"),
    video: yup.mixed(),
    accessories: yup.array(),
    proofOfPurchase: yup.mixed().required("Proof of purchase is required"),
    listingType: yup.array().min(1, "Select at least one listing type"),
    mobileNumber: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "Enter valid Indian mobile number")
      .required("Mobile number is required"),
    address: yup.object().shape({
      landmark: yup.string(),
      addressLine1: yup.string().required("Address line 1 is required"),
      addressLine2: yup.string(),
      pincode: yup
        .string()
        .matches(/^[1-9][0-9]{5}$/, "Enter valid 6-digit pincode")
        .required("Pincode is required"),
      city: yup.string().required(),
      state: yup.string().required(),
      country: yup.string().required(),
    }),
  })

  // In your ProfilePage component, add this state for errors
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState("productListing")
  const handlePincodeChange = async (pincode: string) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const [data] = await response.json();
        if (data.Status === "Success") {
          const [firstPost] = data.PostOffice;
          setProductForm(prev => ({
            ...prev,
            address: {
              ...prev.address,
              city: firstPost.District,
              state: firstPost.State,
              country: "India"
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
      }
    }
  };
  const handleFileValidation = (file: File, maxSize: number) => {
    const sizeInMB = file.size / (1024 * 1024);
    return sizeInMB <= maxSize;
  };
  const UploadImageInput = ({ index, type, productForm, setProductForm, handleFileValidation }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!handleFileValidation(file, 10)) {
          alert("Image size should be less than 10MB");
          return;
        }
        const newImage = {
          type: type,
          file: file,
          preview: URL.createObjectURL(file),
        };
        const newImages = [...productForm.images];
        newImages[index] = newImage;
        setProductForm({ ...productForm, images: newImages });
      }
    };
  
    return (
      <div>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>
    );
  };
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="relative">
              <div className="absolute right-4 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsEditing(true)
                    setActiveTab("personal")
                  }}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Profile</span>
                </Button>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userImage} />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -right-2 bottom-0">
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Change profile picture</span>
                    </Button>
                  </div>
                </div>
                <CardTitle>{userFullName}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    Verified User
                  </Badge>
                </CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary">Seller</Badge>
                  <Badge variant="secondary">Renter</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userEmail}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{getLocationString()}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined April 2023</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>ID Verified</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Public Profile
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Get updates about your orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          {/* <Tabs defaultValue="productListing" className="w-full"> */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="productListing">Product Listing</TabsTrigger>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>

            <TabsContent value="productListing" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Listings</CardTitle>
                  <CardDescription>List your product for rent or sale</CardDescription>
                </CardHeader>
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  await handleProjectCreat()
                }}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => {
                          setProductForm({ ...productForm, name: e.target.value })
                          setFormErrors({ ...formErrors, name: "" })
                        }}
                      />
                      {formErrors.name && (
                        <p className="text-sm text-destructive">{formErrors.name}</p>
                      )}

                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <Input
                        id="mobileNumber"
                        value={productForm.mobileNumber}
                        onChange={(e) => {
                          setProductForm({ ...productForm, mobileNumber: e.target.value });
                          setFormErrors({ ...formErrors, mobileNumber: "" });
                        }}
                      />
                      {formErrors.mobileNumber && (
                        <p className="text-sm text-destructive">{formErrors.mobileNumber}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" id="category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lehenga">Lehenga</SelectItem>
                          <SelectItem value="gown">Gown</SelectItem>
                          <SelectItem value="sharara-set">Sharara Set</SelectItem>
                          <SelectItem value="anarkali">Anarkali</SelectItem>
                          <SelectItem value="saree">Saree</SelectItem>
                          <SelectItem value="suit">Suit</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.category && (
                        <p className="text-sm text-destructive">{formErrors.category}</p>
                      )}
                    </div>
                    {productForm.category === "lehenga" && (
                      <LehengaSizeChart
                        onSizeSelect={(size) => {
                          setProductForm({ ...productForm, size: size.toLowerCase() });
                          setFormErrors({ ...formErrors, size: "" });
                        }}
                      />
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Purchase Price (₹)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        min={5000}
                        value={productForm.originalPrice}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setProductForm({ ...productForm, originalPrice: value });
                          if (value < 5000) {
                            setFormErrors({ ...formErrors, originalPrice: "Minimum price should be ₹5,000" });
                          } else {
                            setFormErrors({ ...formErrors, originalPrice: "" });
                          }
                        }} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }} />

                      {formErrors.originalPrice && (
                        <p className="text-sm text-destructive">{formErrors.originalPrice}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">


                      <div className="space-y-2">
                        <Label>Size Flexibility</Label>
                        <Select onValueChange={(value) => setProductForm({ ...productForm, sizeFlexibility: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select flexibility" />
                          </SelectTrigger>
                          <SelectContent>
                            {["1cm", "2cm", "3cm", "3+cm"].map((flex) => (
                              <SelectItem key={flex} value={flex}>{flex}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={productForm.color}
                        onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <Label>Product Images (Min 4 required)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["Front look", "Side Look", "Back look", "CloseUp look", "Optional 1", "Optional 2"].map((type, index) => (
                          <div key={type} className="border rounded-lg p-4 text-center">
                            <p className="font-medium mb-2">{type}</p>
                            <Input
                              type="file"
                              accept=".jpg,.jpeg,.png,.gif,.webp"
                              className="hidden"
                              id={`image-${index}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (!handleFileValidation(file, 10)) {
                                    alert("Image size should be less than 10MB");
                                    return;
                                  }
                                  // Handle file upload
                                  const newImage = {
                                    type: type,
                                    file: file,
                                    preview: URL.createObjectURL(file)
                                  };
                                  const newImages = [...productForm.images];
                                  newImages[index] = newImage;
                                  setProductForm({ ...productForm, images: newImages });
                                }
                              }}
                            />
                            <Label htmlFor={`image-${index}`}>
                              <Button variant="outline" type="button" className="w-full">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div> */}
                    <div className="space-y-2">
                      <Label>Product Images (Min 4 required)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["Front look", "Side Look", "Back look", "CloseUp look", "Optional 1", "Optional 2"].map((type, index) => (
                          <div key={type} className="border rounded-lg p-4 text-center">
                            <p className="font-medium mb-2">{type}</p>
                            {productForm.images[index]?.preview ? (
                              <div className="space-y-2">
                                <img 
                                  src={productForm.images[index].preview} 
                                  alt={type}
                                  className="w-full h-32 object-cover rounded-md"
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    const newImages :any= [...productForm.images];
                                    newImages[index] = null;
                                    setProductForm({ ...productForm, images: newImages });
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <UploadImageInput
                                index={index}
                                type={type}
                                productForm={productForm}
                                setProductForm={setProductForm}
                                handleFileValidation={handleFileValidation}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Product Video (Max 20MB)</Label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!handleFileValidation(file, 20)) {
                              alert("Video size should be less than 20MB");
                              return;
                            }
                            setProductForm({ ...productForm, video: file });
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Accessories Image</Label>
                      <div className="border rounded-lg p-4">
                        {productForm.accessories[0]?.preview ? (
                          <div className="space-y-2">
                            <img 
                              src={productForm.accessories[0].preview} 
                              alt="Accessory"
                              className="w-full h-32 object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={() => setProductForm({ ...productForm, accessories: [] })}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Input
                              type="file"
                              accept=".jpg,.jpeg,.png,.gif,.webp"
                              className="hidden"
                              id="accessory-upload"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (!handleFileValidation(file, 10)) {
                                    alert("Accessory image size should be less than 10MB");
                                    return;
                                  }
                                  const newAccessory = {
                                    type: "accessory",
                                    file: file,
                                    preview: URL.createObjectURL(file)
                                  };
                                  setProductForm({
                                    ...productForm,
                                    accessories: [newAccessory]
                                  });
                                }
                              }}
                            />
                            <Label htmlFor="accessory-upload">
                              <Button variant="outline" type="button" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Accessory Image
                              </Button>
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Proof of Purchase</Label>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file && file.size <= 10 * 1024 * 1024) {
                            setProductForm({ ...productForm, proofOfPurchase: file })
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Listing Type</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.listingType.includes('rent')}
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...productForm.listingType, 'rent']
                                : productForm.listingType.filter(t => t !== 'rent')
                              setProductForm({ ...productForm, listingType: newTypes })
                            }}
                          />
                          <span>Rent</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.listingType.includes('sell')}
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...productForm.listingType, 'sell']
                                : productForm.listingType.filter(t => t !== 'sell')
                              setProductForm({ ...productForm, listingType: newTypes })
                            }}
                          />
                          <span>Sell</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Address Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="landmark">Landmark/Address</Label>
                        <Input
                          id="landmark"
                          value={productForm.address?.landmark}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            address: { ...productForm.address, landmark: e.target.value }
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addressLine1">Address Line 1*</Label>
                        <Input
                          id="addressLine1"
                          value={productForm.address?.addressLine1}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            address: { ...productForm.address, addressLine1: e.target.value }
                          })}
                        />
                        {formErrors["address.addressLine1"] && (
                          <p className="text-sm text-destructive">{formErrors["address.addressLine1"]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input
                          id="addressLine2"
                          value={productForm.address?.addressLine2}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            address: { ...productForm.address, addressLine2: e.target.value }
                          })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode*</Label>
                          <Input
                            id="pincode"
                            value={productForm.address?.pincode}
                            onChange={(e) => {
                              const pincode = e.target.value;
                              setProductForm({
                                ...productForm,
                                address: { ...productForm.address, pincode }
                              });
                              handlePincodeChange(pincode);
                            }}
                          />
                          {formErrors["address.pincode"] && (
                            <p className="text-sm text-destructive">{formErrors["address.pincode"]}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={productForm.address?.city}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={productForm.address?.state}
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={productForm.address?.country}
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Create Listing
                    </Button>
                  </CardContent>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Priya" disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Sharma" disabled={!isEditing} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="priya.sharma@example.com" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+91 9876543210" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" defaultValue="1990-05-15" disabled={!isEditing} />
                  </div>

                  {/* Bio section removed */}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}>
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>Manage your shipping and billing addresses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input id="address1" defaultValue="123 Fashion Street" disabled={!isEditing} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input id="address2" defaultValue="Apartment 4B" disabled={!isEditing} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        defaultValue={userAddress?.city || userLocation?.city || ""}
                        disabled={!isEditing}
                        onChange={(e) => {
                          if (isEditing) {
                            updateAddress({
                              ...userAddress,
                              city: e.target.value
                            })
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        defaultValue={userAddress?.state || userLocation?.state || ""}
                        disabled={!isEditing}
                        onChange={(e) => {
                          if (isEditing) {
                            updateAddress({
                              ...userAddress,
                              state: e.target.value
                            })
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input id="pincode" defaultValue="400001" disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" defaultValue="India" disabled={!isEditing} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}>
                    {isEditing ? "Save Changes" : "Edit Address"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  )
}