import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddressFormDialog } from "./address-form-dialog";
import { Pencil, Plus, Trash } from "lucide-react";
import { motion } from "framer-motion";

interface AddressListProps {
  addresses: Array<{
    id: string;
    address: string;
    landmark: string;
    addressLine1: string;
    addressLine2?: string;
    pincode: string | { pincode: string }; // Assuming pincode can be a string or an object with a pincode property
    city: string;
    state: string;
    country: string;
    customAddressType: string | null;
  }>;
  onAddressUpdate: (addressId: string, updatedAddress: any) => Promise<void>;
  onAddressDelete?: (addressId: string) => Promise<void>;
  onAddNewAddress: (newAddress: any) => Promise<void>;
}

export function AddressList({
  addresses,
  onAddressUpdate,
  onAddressDelete,
  onAddNewAddress,
}: AddressListProps) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleSaveAddress = async (addressData: any) => {
    try {
      if (editingAddress) {
        await onAddressUpdate(editingAddress.id, addressData);
      } else {
        await onAddNewAddress(addressData);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setShowAddressForm(false);
      setEditingAddress(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <CardTitle>Saved Addresses</CardTitle>
            <CardDescription>Manage your delivery addresses</CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditingAddress(null);
              setShowAddressForm(true);
            }}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <p className="text-lg text-muted-foreground mb-4 text-center">
                No addresses found
                <br />
                Please add an address
              </p>
            </motion.div>
          ) : (
            addresses?.map((address) => (
              <div
                key={address.id}
                className="border rounded-lg p-4 space-y-1 hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {address.customAddressType || address.addressType}
                    </span>
                    <Badge variant="outline">
                      {typeof address.pincode === "string"
                        ? address.pincode
                        : address.pincode.pincode}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {onAddressDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddressDelete(address.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.landmark}
                </p>
                <div className="flex gap-1">
                  <p className="text-sm text-muted-foreground">
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className="text-sm text-muted-foreground">
                      {address.addressLine2}
                    </p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.pincode.city}, {address.pincode.state},{" "}
                  {address.pincode.country}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <AddressFormDialog
        openFor={editingAddress ? "edit" : "add"}
        open={showAddressForm}
        onOpenChange={setShowAddressForm}
        onSave={handleSaveAddress}
        setIsSubmitting={setIsSubmitting}
        isSubmitting={isSubmitting}
        initialData={editingAddress}
      />
    </>
  );
}
