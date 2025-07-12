"use client";

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
import { updateProduct } from "@/app/api/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductEditDialogProps {
  product: any;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function ProductEditDialog({
  product,
  open,
  onClose,
  onUpdate,
}: ProductEditDialogProps) {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    mobileNumber: "",
    addressId: "",
    size: "",
    originalPurchasePrice: "",
    productSize: "",
    sizeFlexibility: "",
    color: "",
    frontLook: null,
    sideLook: null,
    backLook: null,
    closeUpLook: null,
    optional1: null,
    optional2: null,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        category: product.category || "",
        mobileNumber: product.mobileNumber || "",
        addressId: product.addressId || "",
        size: product.size || "",
        originalPurchasePrice: product.originalPurchasePrice || "",
        productSize: product.productSize || "",
        sizeFlexibility: product.sizeFlexibility || "",
        color: product.color || "",
        frontLook: null,
        sideLook: null,
        backLook: null,
        closeUpLook: null,
        optional1: null,
        optional2: null,
      });
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
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: files[0],
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && !(value instanceof File)) {
          data.append(key, value);
        }
      });

      // Append file fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          data.append(key, value);
        }
      });

      const updated = await updateProduct(product.id, data);
      toast.success("Product updated successfully!");
      onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update product.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                name="productName"
                value={formData.productName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                onValueChange={(value) => handleSelectChange("category", value)}
                value={formData.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lehenga">Lehenga</SelectItem>
                  <SelectItem value="gown">Gown</SelectItem>
                  <SelectItem value="sharara-set">Sharara Set</SelectItem>
                  <SelectItem value="anarkali">Anarkali</SelectItem>
                  <SelectItem value="saree">Saree</SelectItem>
                  <SelectItem value="suit">Suit</SelectItem>
                  <SelectItem value="rajasthani-poshak">
                    Rajasthani Poshak
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                name="addressId"
                value={formData.addressId}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Size</Label>
              <Input
                name="size"
                value={formData.size}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Original Purchase Price (₹)</Label>
              <Input
                name="originalPurchasePrice"
                type="number"
                value={formData.originalPurchasePrice}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Product Size</Label>
              <Input
                name="productSize"
                value={formData.productSize}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Size Flexibility</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("sizeFlexibility", value)
                }
                value={formData.sizeFlexibility}
              >
                <SelectTrigger>
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
              <Label>Color</Label>
              <Select
                onValueChange={(value) => handleSelectChange("color", value)}
                value={formData.color}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                  <SelectItem value="maroon">Maroon</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="navy">Navy</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="grey">Grey</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Front Look Image</Label>
                <Input
                  type="file"
                  name="frontLook"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <Label>Side Look Image</Label>
                <Input
                  type="file"
                  name="sideLook"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <Label>Back Look Image</Label>
                <Input
                  type="file"
                  name="backLook"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <Label>Close-Up Look Image</Label>
                <Input
                  type="file"
                  name="closeUpLook"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Optional Image 1</Label>
                <Input
                  type="file"
                  name="optional1"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <Label>Optional Image 2</Label>
                <Input
                  type="file"
                  name="optional2"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
