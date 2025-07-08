"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Package,
  Heart,
  Upload,
  CreditCard,
  TrendingUp,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProductList } from "@/components/dashboard/product-list";
import { getUserProducts } from "../api/api";
import { Loader } from "@/components/ui/loader";

// Mock data
const recentOrders = [
  {
    id: "ORD-001",
    product: "Designer Lehenga",
    date: "2023-04-15",
    status: "Delivered",
    amount: "₹500",
    type: "Rental",
    image:
      "https://images.unsplash.com/photo-1610189020382-668a5fc65ebf?q=80&w=1000",
  },
  {
    id: "ORD-002",
    product: "Wedding Sherwani",
    date: "2023-04-10",
    status: "On Rent",
    amount: "₹1,200",
    type: "Rental",
    image:
      "https://images.unsplash.com/photo-1599032909756-5deb82fea3b0?q=80&w=1000",
  },
  {
    id: "ORD-003",
    product: "Silk Saree",
    date: "2023-04-05",
    status: "Completed",
    amount: "₹3,500",
    type: "Purchase",
    image:
      "https://images.unsplash.com/photo-1610189020382-668a5fc65ebf?q=80&w=1000",
  },
];
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [myListings, setMyListings] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Can be fixed or selectable
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      if (activeTab === "overview" || activeTab === "listings") {
        await listProductApi(page); // Pass the current page as param
      }
    };

    fetchProducts();
    // Only re-run when activeTab or page changes
  }, [activeTab, page]);

  const listProductApi = async (currentPage: number) => {
    setIsLoading(true);
    try {
      // Send page and limit as params to backend
      const response = await getUserProducts({ page: currentPage, limit });
      if (response.success === true) {
        const formattedProducts = response.products.map((product: any) => ({
          id: product.id,
          productName: product.productName,
          status: product.status || "Active",
          frontLook: product.productImage.frontLook,
          rentalCount: product.rentalCount || 0,
          earnings: product.earnings || "₹0",
          category: product.category,
          originalPurchasePrice: product.originalPurchasePrice,
          color: product.color,
          size: product.size,
          listingType: product.listingType,
          createdAt: new Date(product.createdAt).toLocaleDateString("en-IN"),
        }));

        setMyListings(formattedProducts);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        background: `linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--primary) / 0.15))`,
      }}
    >
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-pulse-gentle {
          animation: pulse 2s ease-in-out infinite;
        }

        .gradient-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
        }

        .gradient-card-2 {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border: none;
          color: white;
        }

        .gradient-card-3 {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border: none;
          color: white;
        }

        .gradient-card-4 {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          border: none;
          color: white;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .tab-active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      `}</style>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2 animate-fadeInUp">
          <div>
            <h2 className="text-4xl bg-primary text-primary-foreground font-bold tracking-tight bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your business.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/profile">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Upload className="mr-2 h-4 w-4" />
                Add New Listing
              </Button>
            </Link>
          </div>
        </div>

        <Tabs
          defaultValue="overview"
          className="space-y-4 animate-slideIn"
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              Active Orders
            </TabsTrigger>
            <TabsTrigger
              value="listings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              My Listings
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">
                    Total Earnings
                  </CardTitle>
                  <CreditCard className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">₹ 0</div>
                  <p className="text-xs text-blue-600">+0% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 via-white to-green-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">
                    Total Listings
                  </CardTitle>
                  <ShoppingBag className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">
                   {totalItems}
                  </div>
                  {/* <p className="text-xs text-green-600">
                    8 total rental transactions
                  </p> */}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7  w-full">
              <Card
                className="col-span-8 glass-card hover-lift animate-fadeInUp"
                style={{ animationDelay: "0.3s" }}
              >
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center">
                    <Package className="mr-2 h-5 w-5 text-purple-600" />
                    Active Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <div
                        key={order.id}
                        className="flex items-center p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-300 animate-slideIn"
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden mr-4 shadow-md">
                          <Image
                            src={order.image || "/placeholder.svg"}
                            alt={order.product}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none text-gray-800">
                            {order.product}
                          </p>
                          <p className="text-xs text-gray-600">
                            {order.date} · {order.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "outline"
                                : order.status === "On Rent"
                                ? "secondary"
                                : "default"
                            }
                            className={`${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : order.status === "On Rent"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-purple-100 text-purple-800 border-purple-300"
                            } shadow-sm`}
                          >
                            {order.status}
                          </Badge>
                          <div className="text-sm font-semibold text-gray-800">
                            {order.amount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href="/orders"
                    className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium transition-colors duration-200"
                  >
                    View all orders →
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="glass-card hover-lift animate-fadeInUp">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                  Order History
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View all your past rentals and purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentOrders.map((order, index) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b border-white/30 pb-4 animate-slideIn"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <div className="flex items-center">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden mr-4 shadow-lg">
                          <Image
                            src={order.image || "/placeholder.svg"}
                            alt={order.product}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {order.product}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>{order.date}</span>
                          </div>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "outline"
                                : order.status === "On Rent"
                                ? "secondary"
                                : "default"
                            }
                            className={`mt-2 ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : order.status === "On Rent"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-purple-100 text-purple-800 border-purple-300"
                            } shadow-sm`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800 text-lg">
                          {order.amount}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.type}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-all duration-200"
                        >
                          Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-4">
            <Card className="glass-card hover-lift animate-fadeInUp">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-purple-600" />
                  My Listings
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your items listed for rent or sale
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="relative">
                      <Loader text="Loading products..." />
                      <div className="absolute inset-0 shimmer rounded-lg"></div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fadeInUp">
                    <ProductList
                      products={myListings}
                      page={page}
                      totalPages={totalPages}
                      setPage={setPage}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="glass-card hover-lift animate-fadeInUp">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                  Rental Analytics
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Track the performance of your listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div
                    className="animate-fadeInUp"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <h4 className="font-medium mb-4 text-gray-800 flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-purple-600" />
                      Monthly Earnings
                    </h4>
                    <div className="h-[200px] w-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center shadow-inner border border-white/30">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-2 animate-pulse-gentle" />
                        <span className="text-gray-600 font-medium">
                          Earnings chart will appear here
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="animate-fadeInUp"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <h4 className="font-medium mb-4 text-gray-800 flex items-center">
                      <Heart className="mr-2 h-4 w-4 text-purple-600" />
                      Popular Items
                    </h4>
                    <div className="space-y-4">
                      {myListings?.map((listing: any, index: number) => (
                        <div
                          key={listing.id}
                          className="flex items-center p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-300 animate-slideIn"
                          style={{ animationDelay: `${0.1 * index}s` }}
                        >
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden mr-4 shadow-md">
                            <Image
                              src={listing.image || "/placeholder.svg"}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {listing.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {listing.rentalCount} rentals
                            </p>
                          </div>
                          <div className="font-semibold text-gray-800">
                            {listing.earnings}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
