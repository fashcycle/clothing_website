import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2, Package, Pencil, Check } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDate, formatDateToDDMMYYYY } from "@/app/utils/dateUtils";
import { useRouter } from "next/navigation";
import { deleteSingleProduct } from "@/app/api/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useState } from "react";
import { ProductEditDialog } from "../ProductEditDialog";

export function ProductList({ products, page, totalPages, setPage, refetch }: any) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const handleEdit = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const router = useRouter();

  const handleViewProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProductId) return;
    try {
      const res = await deleteSingleProduct(selectedProductId);
      if (res.success === true) {
        toast.success("Product removed successfully!");
        if (typeof refetch === "function") {
          refetch();
        }
      } else {
        toast.error(res.message || "Failed to remove product");
      }
    } catch {
      toast.error("Failed to remove product");
    } finally {
      setShowDeleteModal(false);
      setSelectedProductId(null);
    }
  };

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-8 mb-6 shadow-sm">
          <Package className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          No Products Listed Yet
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
          You haven't added any products to your inventory yet. Start by listing your first product to begin earning!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push("/profile")}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-white font-medium rounded-lg shadow-md transition-all duration-200"
          >
            Add Your First Product
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/help")}
            className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            Learn How to List
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 cursor-pointer">
      {products.map((product: any, index: number) => {
        const confirmDelete = (e: React.MouseEvent, id: string) => {
          e.stopPropagation();
          setSelectedProductId(id);
          setShowDeleteModal(true);
        };

        const handleConfirmAvailability = (e: React.MouseEvent) => {
          e.stopPropagation();
          toast.success("Availability confirmed!");
        };

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={(e) => handleViewProduct(e, product.id)}
            className="group flex flex-col md:flex-row items-center justify-between border border-gray-200 rounded-xl p-4 md:p-5 hover:bg-gradient-to-r from-primary/10 to-accent/5 shadow-md transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-x-0 md:space-x-5 space-y-4 md:space-y-0 w-full">
              <div className="relative h-32 w-32 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={product.productImage.frontLook || "/placeholder.svg"}
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 w-full md:w-auto">
                <div>
                  <div className="flex flex-col md:flex-row md:gap-4 md:items-center">
                    <h4 className="font-semibold text-lg md:text-xl text-primary tracking-wide">
                      {product.productName}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 md:mb-6">
                    Added on {formatDate(product.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.listingType.map((type: string) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 uppercase"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-gray-600 font-medium">
                  <span>
                    Color:{" "}
                    <span className="text-black capitalize">
                      {product.color}
                    </span>
                  </span>
                  <span>
                    Size: <span className="text-black">{product.size}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2 w-full md:w-auto mt-4 md:mt-0">
              <div className="text-right w-full">
                <div className="flex flex-col md:flex-row justify-between md:justify-end items-start md:items-center gap-4 md:gap-10 w-full">
                  <Badge
                    variant={
                      product.status === "Active" ? "default" : "outline"
                    }
                    className={
                      product.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "text-gray-500"
                    }
                  >
                    {product.status}
                  </Badge>
                  <div className="font-bold text-lg md:text-xl text-emerald-600">
                    ₹ {product.originalPurchasePrice}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {product.rentalCount} Rentals
                </div>
                <div className="text-sm font-semibold text-emerald-600">
                  + {product.earnings} Earned
                </div>
                {product.status === "APPROVED" ? (
                  <div className="flex items-center text-sm text-primary mt-4 font-medium group/view cursor-pointer justify-end">
                    <span className="group-hover/view:translate-x-1 transition-transform">
                      View Product
                    </span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover/view:translate-x-1 transition-transform" />
                  </div>
                ) : (
                  ""
                )}
                <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-600 w-full sm:w-auto"
                    onClick={(e) => confirmDelete(e, product.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600 w-full sm:w-auto"
                    onClick={handleConfirmAvailability}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Availability
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={(e) => handleEdit(e, product)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev: number) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() =>
              setPage((prev: number) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </Button>
        </div>
      )}
      <ProductEditDialog
        open={showEditModal}
        product={selectedProduct}
        onClose={() => setShowEditModal(false)}
        onUpdate={() => {
          if (typeof refetch === "function") {
            refetch();
          }
        }}
      />
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
