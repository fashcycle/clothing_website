"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ProductList } from "@/components/dashboard/product-list"
import { getUserProducts } from "../api/api"
import { Loader } from "@/components/ui/loader"

// Mock data
const recentOrders = [
  {
    id: "ORD-001",
    product: "Designer Lehenga",
    date: "2023-04-15",
    status: "Delivered",
    amount: "₹500",
    type: "Rental",
    image: "https://images.unsplash.com/photo-1610189020382-668a5fc65ebf?q=80&w=1000",
  },
  {
    id: "ORD-002",
    product: "Wedding Sherwani",
    date: "2023-04-10",
    status: "On Rent",
    amount: "₹1,200",
    type: "Rental",
    image: "https://images.unsplash.com/photo-1599032909756-5deb82fea3b0?q=80&w=1000",
  },
  {
    id: "ORD-003",
    product: "Silk Saree",
    date: "2023-04-05",
    status: "Completed",
    amount: "₹3,500",
    type: "Purchase",
    image: "https://images.unsplash.com/photo-1610189020382-668a5fc65ebf?q=80&w=1000",
  },
]
const savedItems = [
  {
    id: "SAV-001",
    title: "Designer Top",
    price: "₹2,500",
    rentalPrice: "₹350",
    image: "https://images.unsplash.com/photo-1551048632-24e444b48a3e?q=80&w=1000",
  },
  {
    id: "SAV-002",
    title: "Formal Suit",
    price: "₹6,000",
    rentalPrice: "₹900",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false);
const[myListings,setMyListings]=useState([])
useEffect(() => {
  if (activeTab === "listings" && myListings?.length==0) {
    listProductApi();
  }
}, [activeTab]);
const listProductApi = async () => {
  setIsLoading(true);
  try {
    const response = await getUserProducts();
    if (response.success === true) {
      const formattedProducts = response.products.map((product: any) => ({
        _id: product._id,
        productName: product.productName,
        status: product.status || "Active",
        frontLook: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.productImage.frontLook}`,
        rentalCount: product.rentalCount || 0,
        earnings: product.earnings || "₹0",
        category: product.category,
        originalPurchasePrice: product.originalPurchasePrice,
        color: product.color,
        size: product.size,
        listingType: product.listingType,
        createdAt: new Date(product.createdAt).toLocaleDateString('en-IN')
      }));
      setMyListings(formattedProducts);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link href="/profile">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
Add New Listing              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="saved">Saved Items</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹6,050</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">2 items returning soon</p>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">8 total rental transactions</p>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">+2 new items this week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 hover-scale">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden mr-4">
                          <Image
                            src={order.image || "/placeholder.svg"}
                            alt={order.product}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{order.product}</p>
                          <p className="text-xs text-muted-foreground">
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
                          >
                            {order.status}
                          </Badge>
                          <div className="text-sm font-medium">{order.amount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/orders" className="text-sm text-primary hover:underline">
                    View all orders
                  </Link>
                </CardFooter>
              </Card>
              <Card className="col-span-3 hover-scale">
                <CardHeader>
                  <CardTitle>Upcoming Returns</CardTitle>
                  <CardDescription>Items that need to be returned soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden mr-4">
                        <Image
                          src="https://images.unsplash.com/photo-1599032909756-5deb82fea3b0?q=80&w=1000"
                          alt="Wedding Sherwani"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Wedding Sherwani</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>Return in 2 days</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Extend
                      </Button>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">Rental Period</div>
                        <div className="font-medium">75% complete</div>
                      </div>
                      <Progress value={75} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View all your past rentals and purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                          <Image
                            src={order.image || "/placeholder.svg"}
                            alt={order.product}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{order.product}</h4>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
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
                            className="mt-2"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{order.amount}</div>
                        <div className="text-sm text-muted-foreground">{order.type}</div>
                        <Button variant="ghost" size="sm" className="mt-2">
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
            <Card>
              <CardHeader>
                <CardTitle>My Listings</CardTitle>
                <CardDescription>Manage your items listed for rent or sale</CardDescription>
              </CardHeader>
              <CardContent>
  {isLoading ? (
    <div className="flex justify-center py-8">
      <Loader text="Loading products..." />
    </div>
  ) : (
    <ProductList
      products={myListings}
      onEditClick={(product:any) => {
        console.log('Edit product:', product)
      }}
    />
  )}
</CardContent>
             
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Items</CardTitle>
                <CardDescription>Items you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {savedItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover-scale">
                      <div className="relative h-48 w-full">
                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full"
                        >
                          <Heart className="h-4 w-4 fill-primary text-primary" />
                          <span className="sr-only">Remove from saved</span>
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Buy for</div>
                            <div className="font-medium">{item.price}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Rent for</div>
                            <div className="font-medium">{item.rentalPrice}/day</div>
                          </div>
                        </div>
                        <Button className="w-full mt-4">View Details</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rental Analytics</CardTitle>
                <CardDescription>Track the performance of your listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h4 className="font-medium mb-2">Monthly Earnings</h4>
                    <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Earnings chart will appear here</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Popular Items</h4>
                    <div className="space-y-4">
                      {myListings.map((listing) => (
                        <div key={listing.id} className="flex items-center">
                          <div className="relative h-12 w-12 rounded-md overflow-hidden mr-4">
                            <Image
                              src={listing.image || "/placeholder.svg"}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{listing.title}</p>
                            <p className="text-sm text-muted-foreground">{listing.rentalCount} rentals</p>
                          </div>
                          <div className="font-medium">{listing.earnings}</div>
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
  )
}

