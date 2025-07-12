"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Package } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export function RecentOrdersList({
  orders,
  page,
  totalPages,
  setPage,
  slice = "",
}: {
  orders: any[];
  page: number;
  totalPages: number;
  setPage: (val: number) => void;
  slice?: string;
}) {
  const router = useRouter();

  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      ORDER_CONFIRMED: "Confirmed",
      ORDER_PLACED: "Placed",
      DELIVERED: "Delivered",
      ON_RENT: "On Rent",
      RETURNED: "Returned",
    };
    return map[status] || status;
  };

  const handleOrderDetails = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    router.push(`/orders/${orderId}`);
  };
  if (orders.length === 0) {
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
          No Active Orders Yet
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
          You haven't any products to your inventory yet. Start by listing your
          first product to begin earning!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 cursor-pointer">
      {(slice ? orders.slice(0, Number(slice)) : orders).map(
        (order: any, index: number) => {
          const item = order.items[0];
          const product = item?.product;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={(e) => handleOrderDetails(e, order.id)}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between border border-gray-200 rounded-xl p-4 md:p-5 hover:bg-gradient-to-r from-primary/10 to-accent/5 shadow-md transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row w-full gap-4 sm:items-center">
                <div className="relative h-20 w-20 rounded-xl mx-auto overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <Image
                    src={product?.productImage?.frontLook || "/placeholder.svg"}
                    alt={product?.productName || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <h4 className="text-base sm:text-lg font-semibold text-primary">
                    {product?.productName}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(order.orderedAt), "dd MMM yyyy")}
                    </div>

                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 capitalize"
                    >
                      {item?.type}
                    </Badge>

                    <Badge
                      className={`${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "ON_RENT"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between sm:ml-auto text-right mt-2 sm:mt-0">
                  <div className="text-emerald-600 font-bold text-lg sm:text-xl">
                    ₹{order.totalAmount}
                  </div>
                  <div className="text-sm font-medium text-purple-700 flex items-center justify-end mt-2 group-hover:translate-x-1 transition-transform">
                    Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
