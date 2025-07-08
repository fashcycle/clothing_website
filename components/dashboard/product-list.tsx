import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDate, formatDateToDDMMYYYY } from "@/app/utils/dateUtils";
import { useRouter } from "next/navigation";

export function ProductList({ products, page, totalPages, setPage }: any) {
  const router = useRouter();

  const handleViewProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };

  return (
    <div className="space-y-6 cursor-pointer">
      {products.map((product: any, index: number) => (
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
                src={product.frontLook || "/placeholder.svg"}
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
                <Badge
                  variant="outline"
                  className="border-blue-400 text-blue-600 capitalize"
                >
                  {product.category}
                </Badge>
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
                  <span className="text-black capitalize">{product.color}</span>
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
                  variant={product.status === "Active" ? "default" : "outline"}
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
            </div>
          </div>
        </motion.div>
      ))}
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
    </div>
  );
}
