"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from 'next/image';
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
  const [userImage, setUserImage] = useState<any>()
  useEffect(() => {
    const userData: any = localStorage.getItem('user-info');
    let parsedUserData: any = JSON.parse(userData);
    if (parsedUserData) {
      setUserImage(parsedUserData?.image)
    }
  }, [])

  return (

<header className="w-full bg-primary text-primary-foreground fixed top-0 z-50 left-0 right-0">
<div className="container flex flex-wrap items-center justify-between h-16 max-w-full px-4">
    <div className="flex items-center gap-2 flex-1 min-w-0 md:flex-[0_0_40%]">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-serif text-xl"
            >
              Fashcycle
            </Link>
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="text-lg font-medium">
                {category.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex relative flex-grow min-w-0 ">
      <div className="relative w-[50%] border bg-white rounded-l">
  {/* Search Icon positioned inside the input */}
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/70" />

  {/* Input with padding on the left to make space for the icon */}
  <input
    type="search"
    placeholder="Search for brand, product type, colour..."
    className="pl-9 pr-3 py-2 w-full bg-black/10 border border-black/20 text-black placeholder:text-black/70 focus:border-black/20 focus:ring-0 focus:outline-none"  />
</div>
      </div>
    </div>

    <Link
      href="/"
      className="font-serif text-lg md:text-xl font-medium absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 whitespace-nowrap z-10 hidden md:block"
    >
      Fashcycle
    </Link>

    <div className="flex  items-center gap-2 flex-wrap min-w-0 md:flex-nowrap md:flex-[0_0_40%] justify-end">
      <Button variant="ghost" size="icon" className="hidden text-primary-foreground flex-shrink-0 focus:border-black/20 focus:ring-0">
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>

      <TooltipProvider delayDuration={0}>
      <Tooltip>
          <Link href={isLogin ? "/profile" : "/login"}>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2 rounded-full border-4 flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">SELL</span>
              </Button>
            </TooltipTrigger>
          </Link>
          <TooltipContent side="top">
            <p>Add New Listing</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <Link href="/wishlist">
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className=" md:flex text-primary-foreground flex-shrink-0"
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </TooltipTrigger>
          </Link>
          <TooltipContent side="top">
            <p>Wishlist</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
        <Link href="/cart">
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground flex-shrink-0">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </TooltipTrigger>
          </Link>
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
                  <Link href="/profile">
                    <Button variant="default" size="icon" className="rounded-full p-0 border flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        {userImage? (
                          <Image
                            src={userImage}
                            alt="User Profile"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="sr-only">Profile</span>
                    </Button>
                  </Link>
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
                <Button variant="ghost" size="icon" className="text-primary-foreground flex-shrink-0">
                  <div className="bg-gray-100 rounded-full flex items-center justify-center w-10 h-10 border border-gray-200">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
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
