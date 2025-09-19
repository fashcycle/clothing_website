  "use client";

  import * as yup from "yup";
  import { useState, useEffect } from "react";
  import { Loader } from "@/components/ui/loader";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { getPincodes } from "@/app/api/api";
  import { toast } from "sonner";
  interface AddressFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (address: any) => void;
    setIsSubmitting: (value: boolean) => void;
    isSubmitting: boolean;
    initialData?: any;
    openFor: string;
  }

  // Fix the schema definition
  const addressSchema = yup.object().shape({
    address: yup.string(),
    customAddressType: yup.string().when("address", {
      is: "OTHER",
      then: (schema) => schema.required("Custom address type is required"),
      otherwise: (schema) => schema.nullable().optional(),
    }),
    landmark: yup.string().required("Landmark is required"),
    addressLine1: yup.string().required("Address Line 1 is required"),
    pincode: yup
      .string()
      .required("Pincode is required")
      .length(6, "Pincode must be 6 digits"),
      mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  });

  export function AddressFormDialog({
    open,
    onOpenChange,
    onSave,
    openFor,
    isSubmitting,
    initialData,
  }: AddressFormDialogProps) {
    const initialFormData: any = {
      address: "HOME",
      customAddressType: "",
      landmark: "",
      addressLine1: "",
      addressLine2: "",
      mobileNumber: "",
      pincode: "",
      city: "",
      state: "",
      country: "India",
    };
    const [formData, setFormData] = useState(initialData || initialFormData);
    const [pincodes, setPincodes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData(initialFormData);
      }
    }, [initialData]);
    useEffect(() => {
      if (open) {
        if (openFor === "add") {
          setFormData(initialFormData);
        } else if (initialData) {
          setFormData(initialData);
        }
      }
    }, [open, initialData, openFor]);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async () => {
      try {
        await addressSchema.validate(formData, { abortEarly: false });
        onSave(formData);
        onOpenChange(false);
        setErrors({});
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const newErrors: { [key: string]: string } = {};
          error.inner.forEach((err) => {
            if (err.path) {
              newErrors[err.path] = err.message;
            }
          });
          setErrors(newErrors);
        }
      }
    };
    const handleDialogClose = (open: boolean) => {
      if (!open) {
        setFormData(initialData);
        setErrors({});
      }
      onOpenChange(open);
    };
    const fetchPincodes = async () => {
      try {
        const response = await getPincodes();
        if (response?.success) {
          setPincodes(response.pincodes);
        } else if (response?.message) {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error?.message || "Error fetching pincodes");
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      if (open) {
        setIsLoading(true);
        fetchPincodes();
      }
    }, [open]);
    return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
  <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {openFor === "add" ? "Add New Address" : "Update Address"}
            </DialogTitle>
          </DialogHeader>
    <div className=" overflow-y-auto p-2 scrollbar">
        <div className="space-y-4">
            <div className="space-y-2">
              <Label>Address Type *</Label>
              <Select
                value={formData?.address}
                onValueChange={(value) => {
                  setFormData({ ...formData, address: value });
                  setErrors({ ...errors, address: "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Home" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME">Home</SelectItem>
                  <SelectItem value="WORK">Work</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            {formData?.address === "OTHER" && (
              <div className="space-y-2">
                <Label>Custom Address Type *</Label>
                <Input
                  value={formData?.customAddressType}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      customAddressType: e.target.value,
                    });
                    setErrors({ ...errors, customAddressType: "" });
                  }}
                  placeholder="Enter custom address type"
                />
                {errors.customAddressType && (
                  <p className="text-sm text-destructive">
                    {errors.customAddressType}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label>Landmark *</Label>
              <Input
                value={formData?.landmark}
                onChange={(e) => {
                  setFormData({ ...formData, landmark: e.target.value });
                  setErrors({ ...errors, landmark: "" });
                }}
              />
              {errors.landmark && (
                <p className="text-sm text-destructive">{errors.landmark}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Address Line 1 *</Label>
              <Input
                value={formData?.addressLine1}
                onChange={(e) => {
                  setFormData({ ...formData, addressLine1: e.target.value });
                  setErrors({ ...errors, addressLine1: "" });
                }}
              />
              {errors.addressLine1 && (
                <p className="text-sm text-destructive">{errors.addressLine1}</p>
              )}
            </div>


            <div className="space-y-2">
              <Label>Address Line 2</Label>
              <Input
                value={formData?.addressLine2}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine2: e.target.value })
                }
              />
            </div>
         
  <div className="space-y-2">
            <Label>Mobile Number *</Label>
            <Input
              value={formData?.mobileNumber}
              onChange={(e) => {
                setFormData({ ...formData, mobileNumber: e.target.value });
                setErrors({ ...errors, mobileNumber: "" });
              }}
              placeholder="Enter 10-digit mobile number"
            />
            {errors.mobileNumber && (
              <p className="text-sm text-destructive">{errors.mobileNumber}</p>
            )}
          </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pincode *</Label>
                <Select
                  value={formData?.pincode.pincode}
                  onValueChange={(value) => {
                    const selected = pincodes.find((p) => p.pincode === value);
                    setFormData({
                      ...formData,
                      pincode: value, // always a string
                      city: selected?.city ?? "",
                      state: selected?.state ?? "",
                      country: selected?.country ?? "",
                    });
                    setErrors({ ...errors, pincode: "" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Enter Pincode" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData?.pincode &&
                      !pincodes.some((p) => p.pincode === formData?.pincode) && (
                        <SelectItem
                          key={formData?.pincode}
                          value={formData?.pincode}
                        >
                          {typeof formData?.pincode === "string"
                            ? formData?.pincode
                            : ""}
                        </SelectItem>
                      )}
                    {pincodes.map((pincode) => (
                      <SelectItem key={pincode.id} value={pincode.pincode}>
                        {typeof pincode.pincode === "string"
                          ? pincode.pincode
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.pincode && (
                  <p className="text-sm text-destructive">{errors.pincode}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                {openFor === "add" ? (
                  <Input value={formData?.city} disabled />
                ) : (
                  <Input value={formData?.pincode.city} disabled />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>State</Label>
                {openFor === "add" ? (
                  <Input value={formData?.state} disabled />
                ) : (
                  <Input value={formData?.pincode.state} disabled />
                )}
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                {openFor === "add" ? (
                  <Input value={formData?.country} disabled />
                ) : (
                  <Input value={formData?.pincode.country} disabled />
                )}
              </div>
            </div>
            </div>
            <div className="mt-4 sticky bottom-0 bg-white pt-2">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        onClick={handleSubmit}
      >
        {isSubmitting ? <Loader text="Saving..." /> : "Save Address"}
      </Button>
    </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
