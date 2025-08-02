"use client";

import { useState, useEffect } from "react";
import { Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as Yup from "yup";
import { useFormik } from "formik";
import LehengaSizeChart from "@/components/clothCategory-sizecharts/lehnga-sizechart";
import ShararaSizeChart from "@/components/clothCategory-sizecharts/sharara-sizechart";
import AnarkaliSizeChart from "@/components/clothCategory-sizecharts/anarkali-sizechart";
import SareeSizeChart from "@/components/clothCategory-sizecharts/saree-sizechart";
import SuitSizeChart from "@/components/clothCategory-sizecharts/suit-sizechart";
import {
  addNewAddress,
  createProduct,
  getAllCategories,
  verifyReferral,
} from "@/app/api/api";
import { Badge } from "@/components/ui/badge";
import GownSizeChart from "@/components/clothCategory-sizecharts/gown-sizechart";
import RajasthaniPoshakSizeChart from "@/components/clothCategory-sizecharts/rajesthaniposhak-sizechart";
import { Loader } from "@/components/ui/loader";
import OtherSizeChart from "@/components/clothCategory-sizecharts/other-sizechart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { toast } from "sonner";
import { AddressFormDialog } from "@/components/profile/address-form-dialog";

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

interface ProductListingTabProps {
  userData: any;
  savedAddresses: SavedAddress[];
  fetchAddresses: () => void;
  router: any;
}

const validationSchema = Yup.object().shape({
  productName: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  mobileNumber: Yup.string().required("Mobile number is required"),
  addressId: Yup.string().required("Address is required"),
  originalPurchasePrice: Yup.number()
    .min(5000, "Minimum price should be ₹5,000")
    .required("Original purchase price is required"),
  productSize: Yup.string().required("Product size is required"),
  sizeFlexibility: Yup.string().required("Size flexibility is required"),
  color: Yup.string().required("Color is required"),
  frontLook: Yup.mixed().required("Front look image is required"),
  sideLook: Yup.mixed().required("Side look image is required"),
  backLook: Yup.mixed().required("Back look image is required"),
  closeUpLook: Yup.mixed().required("Close up look image is required"),
  listingType: Yup.array().min(1, "At least one listing type is required"),
});

export default function ProductListingTab({
  userData,
  savedAddresses,
  fetchAddresses,
  router,
}: ProductListingTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [referralVerified, setReferralVerified] = useState<boolean | null>(
    null
  );
  const [referrerName, setReferrerName] = useState("");
  const [referralVerifying, setReferralVerifying] = useState(false);

  const formik = useFormik({
    initialValues: {
      productName: "",
      category: "",
      mobileNumber: userData?.phone || "",
      addressId: "",
      originalPurchasePrice: 5000,
      productSize: "",
      sizeFlexibility: "",
      color: "",
      frontLook: null,
      sideLook: null,
      backLook: null,
      closeUpLook: null,
      optional1: null,
      optional2: null,
      productVideo: null,
      accessoriesImage: null,
      proofOfPurchase: null,
      listingType: [],
      referralCode: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form errors:", formik);

      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("productName", values.productName);
        formData.append("categoryId", values.category);
        formData.append("mobileNumber", values.mobileNumber);
        formData.append("addressId", values.addressId);
        formData.append("referralCode", values.referralCode);
        formData.append(
          "originalPurchasePrice",
          values.originalPurchasePrice.toString()
        );
        formData.append("size", values.productSize);
        formData.append("sizeFlexibility", values.sizeFlexibility);
        formData.append("color", values.color);
        if (values.frontLook) formData.append("frontLook", values.frontLook);
        if (values.sideLook) formData.append("sideLook", values.sideLook);
        if (values.backLook) formData.append("backLook", values.backLook);
        if (values.closeUpLook)
          formData.append("closeUpLook", values.closeUpLook);
        if (values.optional1) formData.append("optional1", values.optional1);
        if (values.optional2) formData.append("optional2", values.optional2);
        if (values.productVideo)
          formData.append("productVideo", values.productVideo);
        if (values.accessoriesImage)
          formData.append("accessoriesImage", values.accessoriesImage);
        if (values.proofOfPurchase)
          formData.append("proofOfPurchase", values.proofOfPurchase);

        const listingTypeValue =
          values.listingType.length === 2 ? "both" : values.listingType[0];
        formData.append("listingType", listingTypeValue);

        const response = await createProduct(formData);
        if (response.success === true) {
          formik.resetForm();

          toast.success(response.message);
        } else {
          toast.error(response.message || "Failed to create product");
        }
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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
    (cat) => String(cat.id) === String(formik.values.category)
  );

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
        toast.success("Address added successfully");
      } else {
        toast.error("Failed to add address. Please check the form.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue(fieldName, file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Listings</CardTitle>
        <CardDescription>List your product for rent or sale</CardDescription>
      </CardHeader>
      <form onSubmit={formik.handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2 static lg:absolute top-10 right-10">
            <Label htmlFor="referralCode" className="font-large font-bold">
              Referral Code *
            </Label>
            <Input
              id="referralCode"
              name="referralCode"
              value={formik.values.referralCode.toUpperCase()}
              onChange={(e) => {
                const uppercaseCode = e.target.value.toUpperCase();
                formik.setFieldValue("referralCode", uppercaseCode);
              }}
              onBlur={async (e) => {
                const referralCode = e.target.value.trim().toUpperCase();
                if (!referralCode) return;
                try {
                  setReferralVerifying(true);
                  const res = await verifyReferral({
                    code: referralCode,
                  });
                  if (res.success && res.verified && res.data?.referrerName) {
                    setReferralVerified(true);
                    setReferrerName(res.data.referrerName);
                  } else {
                    setReferralVerified(false);
                    setReferrerName("");
                    formik.setFieldError(
                      "referralCode",
                      "Invalid referral code"
                    );
                  }
                } catch {
                  setReferralVerified(false);
                  setReferrerName("");
                  formik.setFieldError("referralCode", "Invalid referral code");
                } finally {
                  setReferralVerifying(false);
                }
              }}
              className={`uppercase ${
                formik.touched.referralCode && formik.errors.referralCode
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
            {formik.touched.referralCode && formik.errors.referralCode && (
              <p className="text-sm text-destructive">
                {formik.errors.referralCode}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName" className="font-large font-bold">
              Product Name *
            </Label>
            <Input
              id="productName"
              name="productName"
              value={formik.values.productName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.productName && formik.errors.productName && (
              <p className="text-sm text-destructive">
                {formik.errors.productName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber" className="font-large font-bold">
              Mobile Number *
            </Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              value={formik.values.mobileNumber}
              disabled={!!userData?.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <p className="text-sm text-destructive">
                {formik.errors.mobileNumber}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="font-large font-bold">
              Category *
            </Label>
            <Select
              onValueChange={(value) => {
                formik.setFieldValue("category", value);
              }}
              value={formik.values.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" id="category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <p className="capitalize">{category.name}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-sm text-destructive">
                {formik.errors.category}
              </p>
            )}
          </div>

          {selectedCategoryObj?.slug === "lehenga" && (
            <LehengaSizeChart
              onSizeSelect={(size) => {
                formik.setFieldValue("productSize", size);
              }}
            />
          )}
          {selectedCategoryObj?.slug === "gown" && (
            <GownSizeChart
              onSizeSelect={(size: any) => {
                formik.setFieldValue("productSize", size);
              }}
            />
          )}
          {selectedCategoryObj?.slug === "sharara-set" && (
            <ShararaSizeChart
              onSizeSelect={(size) => {
                formik.setFieldValue("productSize", size);
              }}
            />
          )}
          {selectedCategoryObj?.slug === "anarkali" && (
            <AnarkaliSizeChart
              onSizeSelect={(size) => {
                formik.setFieldValue("productSize", size);
              }}
            />
          )}
          {selectedCategoryObj?.slug === "saree" && (
            <SareeSizeChart
              onSizeSelect={(size) => {
                formik.setFieldValue("productSize", size);
              }}
            />
          )}
          {selectedCategoryObj?.slug === "suit" && (
            <SuitSizeChart
              onSizeSelect={(size) => {
                formik.setFieldValue("productSize", size);
              }}
            />
          )}
          {selectedCategoryObj?.slug === "poshak" && (
            <RajasthaniPoshakSizeChart
              onSizeSelect={(size: any) => {
                formik.setFieldValue("productSize", size);
              }}
            />
          )}
          {selectedCategoryObj?.slug === "other" && (
            <OtherSizeChart
              onSizeSelect={(size: any) => {
                formik.setFieldValue("productSize", size);
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
              name="originalPurchasePrice"
              type="number"
              value={formik.values.originalPurchasePrice || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {formik.touched.originalPurchasePrice &&
              formik.errors.originalPurchasePrice && (
                <p className="text-sm text-destructive">
                  {formik.errors.originalPurchasePrice}
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
                      Size flexibility shows the possibility of alteration
                      available in the product.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  onValueChange={(value) => {
                    formik.setFieldValue("sizeFlexibility", value);
                  }}
                  value={formik.values.sizeFlexibility}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select flexibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {["0cm", "1cm", "2cm", "3cm", "3+cm"].map((flex) => (
                      <SelectItem key={flex} value={flex}>
                        {flex}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.values.sizeFlexibility === "0cm" && (
                  <p className="text-sm italic text-blue-600">
                    Size flexibility of 0cm means no size alterations are
                    possible for this product.
                  </p>
                )}
                {formik.touched.sizeFlexibility &&
                  formik.errors.sizeFlexibility && (
                    <p className="text-sm text-destructive">
                      {formik.errors.sizeFlexibility}
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
                formik.setFieldValue("color", value);
              }}
              value={formik.values.color}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color">
                  {formik.values.color && (
                    <div className="flex items-center gap-2 capitalize">
                      <div
                        className={`w-3 h-3 rounded-full bg-${formik.values.color.toLowerCase()}-500`}
                      />
                      {formik.values.color}
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
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      {item.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.color && formik.errors.color && (
              <p className="text-sm text-destructive">{formik.errors.color}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-large font-bold">
              Product Images (Min 4 required) *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-large font-bold">Front Look</Label>
                <div className="rounded-lg">
                  <div className="space-y-2">
                    <Input
                      type="file"
                      id="frontLook"
                      name="frontLook"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => handleFileChange(e, "frontLook")}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.frontLook && formik.errors.frontLook && (
                      <p className="text-sm text-destructive">
                        {formik.errors.frontLook}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-large font-bold">Back Look Image</Label>
                <div className="rounded-lg">
                  <div className="space-y-2">
                    <Input
                      type="file"
                      id="backLook"
                      name="backLook"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => handleFileChange(e, "backLook")}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.backLook && formik.errors.backLook && (
                      <p className="text-sm text-destructive">
                        {formik.errors.backLook}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-large font-bold">Side Look Image</Label>
                <div className="rounded-lg">
                  <div className="space-y-2">
                    <Input
                      type="file"
                      id="sideLook"
                      name="sideLook"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => handleFileChange(e, "sideLook")}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.sideLook && formik.errors.sideLook && (
                      <p className="text-sm text-destructive">
                        {formik.errors.sideLook}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-large font-bold">
                  CloseUp Look Image
                </Label>
                <div className="rounded-lg">
                  <div className="space-y-2">
                    <Input
                      type="file"
                      id="closeUpLook"
                      name="closeUpLook"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => handleFileChange(e, "closeUpLook")}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.closeUpLook &&
                      formik.errors.closeUpLook && (
                        <p className="text-sm text-destructive">
                          {formik.errors.closeUpLook}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-large font-bold">Optional 1 Image</Label>
                <div className="rounded-lg">
                  <div className="space-y-2">
                    <Input
                      type="file"
                      id="optional1"
                      name="optional1"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => handleFileChange(e, "optional1")}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-large font-bold">Optional 2 Image</Label>
                <div className="rounded-lg">
                  <div className="space-y-2">
                    <Input
                      type="file"
                      id="optional2"
                      name="optional2"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => handleFileChange(e, "optional2")}
                      onBlur={formik.handleBlur}
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
              id="productVideo"
              name="productVideo"
              accept="video/*"
              onChange={(e) => handleFileChange(e, "productVideo")}
              onBlur={formik.handleBlur}
            />
            {formik.touched.productVideo && formik.errors.productVideo && (
              <p className="text-sm text-destructive">
                {formik.errors.productVideo}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-large font-bold">Accessories Image</Label>
            <div className="rounded-lg">
              <div className="space-y-2">
                <Input
                  type="file"
                  id="accessoriesImage"
                  name="accessoriesImage"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={(e) => handleFileChange(e, "accessoriesImage")}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.accessoriesImage &&
                  formik.errors.accessoriesImage && (
                    <p className="text-sm text-destructive">
                      {formik.errors.accessoriesImage}
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-large font-bold">Proof of Purchase</Label>
            <Input
              type="file"
              id="proofOfPurchase"
              name="proofOfPurchase"
              accept=".jpg,.jpeg,.png,.gif,.webp"
              onChange={(e) => handleFileChange(e, "proofOfPurchase")}
              onBlur={formik.handleBlur}
            />
            {formik.touched.proofOfPurchase &&
              formik.errors.proofOfPurchase && (
                <p className="text-sm text-destructive">
                  {formik.errors.proofOfPurchase}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label className="font-large font-bold">Listing Type *</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formik.values.listingType.includes("rent")}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...formik.values.listingType, "rent"]
                      : formik.values.listingType.filter((t) => t !== "rent");
                    formik.setFieldValue("listingType", newTypes);
                  }}
                />
                <span>Rent</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formik.values.listingType.includes("sell")}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...formik.values.listingType, "sell"]
                      : formik.values.listingType.filter((t) => t !== "sell");
                    formik.setFieldValue("listingType", newTypes);
                  }}
                />
                <span>Sell</span>
              </label>
              {formik.touched.listingType && formik.errors.listingType && (
                <p className="text-sm text-destructive">
                  {formik.errors.listingType}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-large font-bold">Address Details</h2>
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
                    formik.setFieldValue("addressId", value);
                  }}
                >
                  {savedAddresses?.map((address) => (
                    <div
                      key={address?.id}
                      className="flex items-start space-x-3 border border-primary p-6 rounded-lg hover:border-primary hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white shadow-sm hover:bg-primary/5"
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

            {formik.touched.addressId && formik.errors.addressId && (
              <p className="text-sm text-destructive">
                {formik.errors.addressId}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader text="Creating..." /> : "Create Product"}
          </Button>
        </CardContent>
      </form>

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
    </Card>
  );
}
