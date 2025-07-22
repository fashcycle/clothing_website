import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  ShoppingBag,
  Wallet,
  Tag,
  IndianRupee,
  X,
} from "lucide-react";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function OrderDetailsDialog({
  isOpen,
  onClose,
  order,
}: OrderDetailsDialogProps) {
  const item = order.items[0];
console.log(order)
  // Simple date formatting function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            Order Details
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order ID Section */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                <Tag className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">Order ID</p>
                <p className="text-sm text-gray-600 font-mono break-all">{order.id}</p>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="grid gap-4 sm:gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Order Placed On
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(order.orderedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Scheduled From
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(item.rentFrom)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Scheduled To
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(item.rentTo)}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-orange-600" />
              Payment Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Wallet className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Convenience Fee
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{order.convenienceFee || "0"}
                </p>
              </div>

              <div className="border-t border-orange-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IndianRupee className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        Total Amount
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Demo component to showcase the dialog
function OrderDetailsDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  const sampleOrder = {
    id: "ORD-2024-001234",
    orderedAt: "2024-01-15T10:30:00Z",
    convenienceFee: 50,
    totalAmount: 2500,
    items: [
      {
        rentFrom: "2024-01-20T00:00:00Z",
        rentTo: "2024-01-25T00:00:00Z",
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Order Details Dialog Demo
        </h1>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" />
          View Order Details
        </button>
      </div>

      <OrderDetailsDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        order={sampleOrder}
      />
    </div>
  );
}

export default OrderDetailsDemo;