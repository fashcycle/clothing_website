import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDate, formatDateToDDMMYYYY } from "@/app/utils/dateUtils";
import { useRouter } from "next/navigation";

export function ProductList({ products }: any) {
  const router = useRouter();

  const handleViewProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
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
          className="group flex items-center justify-between border border-gray-200 rounded-xl p-5 hover:bg-gradient-to-r from-primary/10 to-accent/5 shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-5">
            <div className="relative h-32 w-32 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src={product.frontLook || "/placeholder.svg"}
                alt={product.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex gap-4">
                  <h4 className="font-semibold text-xl text-primary tracking-wide">
                    {product.productName}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {" "}
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
              <div className="flex gap-6 text-sm text-gray-600 font-medium ">
                <span>
                  🎨 Color:{" "}
                  <span className="text-black capitalize">{product.color}</span>
                </span>
                <span>
                  📏 Size: <span className="text-black">{product.size}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="text-right">
              <div className="flex gap-10">
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
                <div className="font-bold text-xl text-emerald-600">
                  ₹ {product.originalPurchasePrice}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {product.rentalCount} Rentals
              </div>
              <div className="text-sm font-semibold text-emerald-600">
                + {product.earnings} Earned
              </div>
              <div className="flex items-center text-sm text-primary mt-6 font-medium group/view cursor-pointer">
                <span className="group-hover/view:translate-x-1 transition-transform">
                  View Product
                </span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover/view:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
