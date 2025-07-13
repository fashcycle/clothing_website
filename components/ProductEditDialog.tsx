import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  getAllCategories,
  getUserAddresses,
  updateProduct,
} from "@/app/api/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import your size chart components
import LehengaSizeChart from "./clothCategory-sizecharts/lehnga-sizechart";
import OtherSizeChart from "./clothCategory-sizecharts/other-sizechart";
import RajasthaniPoshakSizeChart from "./clothCategory-sizecharts/rajesthaniposhak-sizechart";
import SuitSizeChart from "./clothCategory-sizecharts/suit-sizechart";
import SareeSizeChart from "./clothCategory-sizecharts/saree-sizechart";
import AnarkaliSizeChart from "./clothCategory-sizecharts/anarkali-sizechart";
import ShararaSizeChart from "./clothCategory-sizecharts/sharara-sizechart";
import GownSizeChart from "./clothCategory-sizecharts/gown-sizechart";

interface ProductEditDialogProps {
  product: any;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

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

interface ProductForm {
  productName: string;
  category: string;
  mobileNumber: string;
  addressId: string;
  size: string;
  originalPurchasePrice: string;
  sizeFlexibility: string;
  color: string;
  frontLook: File | null;
  sideLook: File | null;
  backLook: File | null;
  closeUpLook: File | null;
  optional1: File | null;
  optional2: File | null;
}

export function ProductEditDialog({
  product,
  open,
  onClose,
  onUpdate,
}: ProductEditDialogProps) {
  const [productForm, setFormData] = useState<ProductForm>({
    productName: "",
    category: "",
    mobileNumber: "",
    addressId: "",
    size: "",
    originalPurchasePrice: "",
    sizeFlexibility: "",
    color: "",
    frontLook: null,
    sideLook: null,
    backLook: null,
    closeUpLook: null,
    optional1: null,
    optional2: null,
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState([]);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        category: product.categoryId || "",
        mobileNumber: product.mobileNumber || "",
        addressId: product.addressId || "",
        size: product.size || "",
        originalPurchasePrice: product.originalPurchasePrice || "",
        sizeFlexibility: product.sizeFlexibility || "",
        color: product.color || "",

        // don't load URLs into these fields
        frontLook: null,
        sideLook: null,
        backLook: null,
        closeUpLook: null,
        optional1: null,
        optional2: null,
      });
      setSelectedAddressId(product.addressId || null);
      setSelectedCategory(product.categoryId || "");
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const name = e.target.name;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setSelectedCategory(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const selectedCategoryName = categories.find(
    (category) => category.id === productForm.category
  )?.name;

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("productName", productForm.productName);
      data.append("categoryId", productForm.category);
      data.append("mobileNumber", productForm.mobileNumber);
      data.append("addressId", productForm.addressId);
      data.append("size", productForm.size);
      data.append("sizeFlexibility", productForm.sizeFlexibility);
      data.append("color", productForm.color);
      if (productForm.frontLook instanceof File)
        data.append("frontLook", productForm.frontLook);
      if (productForm.sideLook instanceof File)
        data.append("sideLook", productForm.sideLook);
      if (productForm.backLook instanceof File)
        data.append("backLook", productForm.backLook);
      if (productForm.closeUpLook instanceof File)
        data.append("closeUpLook", productForm.closeUpLook);
      if (productForm.optional1 instanceof File)
        data.append("optional1", productForm.optional1);
      if (productForm.optional2 instanceof File)
        data.append("optional2", productForm.optional2);
      const updated = await updateProduct(product.id, data);
      toast.success("Product updated successfully!");
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update product.");
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

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchCategories();
  }, []);

  const selectedAddress = savedAddresses.find(
    (address) => address.id === selectedAddressId
  );

  const renderSizeChartDialog = () => {
    const SizeChartDialog = ({ children }) => (
      <Dialog
        open={showSizeChart}
        onOpenChange={(open) => setShowSizeChart(open)}
      >
        <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Size</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </DialogContent>
      </Dialog>
    );

    const categorySlug = categories.find(
      (category) => category.id === selectedCategory
    )?.slug;

    switch (categorySlug) {
      case "lehenga":
        return (
          <SizeChartDialog>
            <LehengaSizeChart
              onSizeSelect={(size) => {
                setFormData({ ...productForm, size });
                setShowSizeChart(false);
              }}
            />
          </SizeChartDialog>
        );
      case "gown":
        return (
          <SizeChartDialog>
            <GownSizeChart
              onSizeSelect={(size) => {
                setFormData({ ...productForm, size });
                setShowSizeChart(false);
              }}
            />
          </SizeChartDialog>
        );
      case "sharara-set":
        return (
          <SizeChartDialog>
            <ShararaSizeChart
              onSizeSelect={(size) => {
                setFormData({ ...productForm, size });
                setShowSizeChart(false);
              }}
            />
          </SizeChartDialog>
        );
      case "anarkali":
        return (
          <SizeChartDialog>
            <AnarkaliSizeChart
              onSizeSelect={(size) => {
                setFormData({ ...productForm, size });
                setShowSizeChart(false);
              }}
            />
          </SizeChartDialog>
        );
      case "saree":
        return (
          <SizeChartDialog>
            <SareeSizeChart
              onSizeSelect={(size) => {
                setFormData({ ...productForm, size });
                setShowSizeChart(false);
              }}
            />
          </SizeChartDialog>
        );
      case "suit":
        return (
          <SizeChartDialog>
            <SuitSizeChart
              onSizeSelect={(size) => {
                setFormData({ ...productForm, size });
                setShowSizeChart(false);
              }}
            />
          </SizeChartDialog>
        );
      case "poshak":
        return (
          <SizeChartDialog>
            <RajasthaniPoshakSizeChart
              onSizeSelect={(size) => {
                setFormData({ ...productForm, size });
                setShowSizeChart(false);
              }}
            />
          </SizeChartDialog>
        );
      case "other":
        return (
          <SizeChartDialog>
            <OtherSizeChart
              onSizeSelect={(size) => {
                setFormData({ ...productForm, size });
                setShowSizeChart(false);
              }}
            />
          </SizeChartDialog>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-100 max-w-4xl h-[95vh] max-h-[95vh] overflow-hidden flex flex-col">
        <style>
          {`
                div#radix-«r8» {
                width: 87% !important;
                height: 80vh !important;
                }
             
          `}
        </style>
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg sm:text-xl">Edit Product</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Product Name</Label>
                <Input
                  name="productName"
                  value={productForm.productName}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                  value={productForm.category}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="capitalize"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Size</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
                  <Input
                    name="size"
                    value={productForm.size}
                    onChange={handleChange}
                    disabled={true}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowSizeChart(true)}
                    className="w-full sm:w-auto whitespace-nowrap"
                    size="sm"
                  >
                    Select Size
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Original Purchase Price (₹)
                </Label>
                <Input
                  name="originalPurchasePrice"
                  type="number"
                  value={productForm.originalPurchasePrice}
                  onChange={handleChange}
                  disabled={true}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Mobile Number</Label>
                <Input
                  name="mobileNumber"
                  value={productForm.mobileNumber}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Size Flexibility</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("sizeFlexibility", value)
                  }
                  value={productForm.sizeFlexibility}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select flexibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0cm">0cm</SelectItem>
                    <SelectItem value="1cm">1cm</SelectItem>
                    <SelectItem value="2cm">2cm</SelectItem>
                    <SelectItem value="3cm">3cm</SelectItem>
                    <SelectItem value="3+cm">3+cm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Color</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("color", value)}
                  value={productForm.color}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select color" />
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
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">
              Product Images
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Front Look Image</Label>
                <Input
                  type="file"
                  name="frontLook"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Side Look Image</Label>
                <Input
                  type="file"
                  name="sideLook"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Back Look Image</Label>
                <Input
                  type="file"
                  name="backLook"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Close-Up Look Image
                </Label>
                <Input
                  type="file"
                  name="closeUpLook"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Optional Image 1</Label>
                <Input
                  type="file"
                  name="optional1"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Optional Image 2</Label>
                <Input
                  type="file"
                  name="optional2"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="mt-6">
            <Label className="text-sm font-medium">Delivery Address</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
              <Input
                name="addressId"
                value={
                  selectedAddress
                    ? `${selectedAddress.addressLine1}, ${selectedAddress.landmark}, ${selectedAddress.pincode.city}, ${selectedAddress.pincode.state}, ${selectedAddress.pincode.country}`
                    : ""
                }
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setShowAddressModal(true)}
                className="w-full sm:w-auto whitespace-nowrap"
                size="sm"
              >
                Change Address
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Update Product
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Address Selection Modal */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Select Delivery Address
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {savedAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all hover:border-green-800 ${
                    selectedAddressId === address.id
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedAddressId(address.id);
                    setFormData((prev) => ({
                      ...prev,
                      addressId: address.id,
                    }));
                    setShowAddressModal(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm sm:text-base">
                      {address.customAddressType}
                    </span>
                    {selectedAddressId === address.id && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 rounded-full text-xs"
                      >
                        Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {address.landmark}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      {address.addressLine2}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600">
                    {[
                      address.pincode.city,
                      address.pincode.state,
                      address.pincode.country,
                      address.pincode.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {renderSizeChartDialog()}
    </Dialog>
  );
}
