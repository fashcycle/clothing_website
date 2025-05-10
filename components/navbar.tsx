"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, ShoppingBag, User, Heart, Menu, Upload, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useSession, signIn, signOut } from "next-auth/react"

// Updated categories as requested
const categories = [
  { name: "LEHENGA", href: "/lehenga" },
  { name: "GOWN", href: "/gown" },
  { name: "SHARARA SET", href: "/sharara-set" },
  { name: "ANARKALI", href: "/anarkali" },
  { name: "SAREE", href: "/saree" },
  { name: "SUIT", href: "/suit" },
]

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // Using dummy auth state for demo
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLogin, setIsLogin] = useState<any>("")

  useEffect(() => {
  
      const userInfo: any = localStorage.getItem('user-info');
      let parsedData = JSON.parse(userInfo)
      setIsLogin(!!parsedData); 
    
  }, []);

  const toggleLogin = () => {
    // For demo purposes only - in production this would use signIn/signOut from next-auth
    setIsLoggedIn(!isLoggedIn)
  }
  const[userImage,setUserImage]=useState<any>()
  useEffect(()=>{
    const userData:any = localStorage.getItem('user-info');
    let parsedUserData:any = JSON.parse(userData);  
    if(parsedUserData){
      setUserImage(parsedUserData?.image)
    }
  },[])

  return (
    // <header className="w-full bg-primary text-primary-foreground">
    <header className="w-full bg-primary text-primary-foreground fixed top-0 z-50 left-0 right-0">      {/* Top bar with search and logo */}
      <div className="container flex h-16 items-center justify-between max-w-[100vw] overflow-x-hidden">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="flex items-center gap-2 font-serif text-xl">
                  StyleSwap
                </Link>
                {categories.map((category) => (
                  <Link key={category.name} href={category.href} className="text-lg font-medium">
                    {category.name}
                  </Link>
                ))}

              </nav>
            </SheetContent>
          </Sheet>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for brand, product type, colour..."
              className="search-input pl-10"
            />
          </div>
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-serif text-xl font-medium">
          StyleSwap
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <Link href="/profile">
                <TooltipTrigger asChild>
                  <Button variant="contained" size="sm" className=" md:flex items-center gap-2 rounded-full border-4 ">
                    <Plus className="h-4 w-4" />
                    <span>SELL</span>
                  </Button>
                </TooltipTrigger>
              </Link>
              <TooltipContent side="top">
                <p>Add New Listing</p>
              </TooltipContent>
            </Tooltip>
            {/* Wishlist Button */}
            <Tooltip>
              <Link href="/wishlist">
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex text-primary-foreground">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Wishlist</span>
                  </Button>
                </TooltipTrigger>
              </Link>
              <TooltipContent side="top">
                <p>Wishlist</p>
              </TooltipContent>
            </Tooltip>

            {/* Cart Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="sr-only">Cart</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Cart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isLogin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground">
                        <Avatar className="h-10 w-10">
                          <Link href="/dashboard">
                            <Avatar className="cursor-pointer">
                            <AvatarImage src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${userImage}` || "/placeholder.svg"} />
                            <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          </Link>
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Profile</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/listings">My Listings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleLogin}>Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary-foreground">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Login</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Login</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          )}
        </div>
      </div>

      {/* Categories navigation */}
      <nav className="hidden md:block border-t border-primary-foreground/10">
        <div className="container flex justify-center">
          <ul className="flex space-x-8 py-3">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={category.href}
                  className="category-link text-primary-foreground/90 hover:text-primary-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

