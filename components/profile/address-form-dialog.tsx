"use client"

import * as yup from "yup"
import { useState,useEffect } from "react"
import { Loader } from "@/components/ui/loader"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (address: any) => void
  setIsSubmitting: (value: boolean) => void
    isSubmitting:boolean
    initialData?: any
    openFor:string
}

const addressSchema = yup.object().shape({
  address: yup.string().required("Address type is required"),
  customAddressType: yup.string().when('address', {
    is: 'Other',
    then: (schema) => schema.required("Custom address type is required"),
    otherwise: (schema) => schema.optional(),
  }),
  landmark: yup.string().required("Landmark is required"),
  addressLine1: yup.string().required("Address Line 1 is required"),
  pincode: yup.string().required("Pincode is required").length(6, "Pincode must be 6 digits"),
})

export function AddressFormDialog({ open, onOpenChange, onSave ,openFor,isSubmitting,initialData }: AddressFormDialogProps) {
    const initialFormData = {
        address: "",
        customAddressType: "",
        landmark: "",
        addressLine1: "",
        addressLine2: "",
        pincode: "",
        city: "",
        state: "",
        country: "India"
      }
      const [formData, setFormData] = useState(initialData || initialFormData)
      useEffect(() => {
        if (initialData) {
          setFormData(initialData)
        } else {
          setFormData(initialFormData)
        }
      }, [initialData])
  const handlePincodeChange = async (pincode: string) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        const [data] = await response.json()
        if (data.Status === "Success") {
          const postOffice = data.PostOffice[0]
          setFormData({
            ...formData,
            city: postOffice.District,
            state: postOffice.State,
            pincode
          })
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error)
      }
    }
  }

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async () => {
    try {
      await addressSchema.validate(formData, { abortEarly: false })
      onSave(formData)
      onOpenChange(false)
      setErrors({})
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {}
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setFormData(initialData)
      setErrors({})
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{openFor=="add"?"Add New Address":"Update Address"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Address Type *</Label>
            <Select
              value={formData.address}
              onValueChange={(value) => {
                setFormData({ ...formData, address: value })
                setErrors({ ...errors, address: "" })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
          </div>

          {formData.address === "Other" && (
            <div className="space-y-2">
              <Label>Custom Address Type *</Label>
              <Input
                value={formData.customAddressType}
                onChange={(e) => {
                  setFormData({ ...formData, customAddressType: e.target.value })
                  setErrors({ ...errors, customAddressType: "" })
                }}
                placeholder="Enter custom address type"
              />
              {errors.customAddressType && <p className="text-sm text-destructive">{errors.customAddressType}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label>Landmark *</Label>
            <Input
              value={formData.landmark}
              onChange={(e) => {
                setFormData({ ...formData, landmark: e.target.value })
                setErrors({ ...errors, landmark: "" })
              }}
            />
            {errors.landmark && <p className="text-sm text-destructive">{errors.landmark}</p>}
          </div>

          <div className="space-y-2">
            <Label>Address Line 1 *</Label>
            <Input
              value={formData.addressLine1}
              onChange={(e) => {
                setFormData({ ...formData, addressLine1: e.target.value })
                setErrors({ ...errors, addressLine1: "" })
              }}
            />
            {errors.addressLine1 && <p className="text-sm text-destructive">{errors.addressLine1}</p>}
          </div>

          <div className="space-y-2">
            <Label>Address Line 2</Label>
            <Input
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pincode *</Label>
              <Input
                value={formData.pincode}
                onChange={(e) => {
                  setFormData({ ...formData, pincode: e.target.value })
                  setErrors({ ...errors, pincode: "" })
                  handlePincodeChange(e.target.value)
                }}
              />
              {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={formData.city} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>State</Label>
              <Input value={formData.state} disabled />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={formData.country} disabled />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full"onClick={handleSubmit}>
  {isSubmitting ? (
   <Loader text="Saving..." />
  ) : (
    "Save Address"
  )}
</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}