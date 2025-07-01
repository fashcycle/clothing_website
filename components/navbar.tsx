"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  Upload,
  Plus,
  LayoutDashboard,
  LogOut,
  Bell,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

// Updated categories as requested
const categories = [
  { name: "HOME", href: "/" },
  { name: "LEHENGA", href: "/lehenga" },
  { name: "GOWN", href: "/gown" },
  { name: "SHARARA SET", href: "/sharara-set" },
  { name: "ANARKALI", href: "/anarkali" },
  { name: "SAREE", href: "/saree" },
  { name: "SUIT", href: "/suit" },
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogin, setIsLogin] = useState<any>(false);
  const [userImage, setUserImage] = useState<any>();
  const router: any = useRouter();

  const toggleLogout = () => {
    localStorage.removeItem("user-info");
    localStorage.removeItem("token");
    setIsLogin(false);
    router.push("/login");
  };
  useEffect(() => {
    function syncAuthState() {
      const token: any = localStorage.getItem("token");
      const userData: any = localStorage.getItem("user-info");
      let parsedUserData: any = JSON.parse(userData);
      if (parsedUserData) {
        setUserImage(parsedUserData?.image);
      } else {
        setUserImage(undefined);
      }
      setIsLogin(!!token);
    }
    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);
    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  });

  return (
    <header className="w-full bg-primary text-primary-foreground fixed top-0 z-50 left-0 right-0">
      <div className="container flex flex-wrap items-center justify-between h-16 w-full px-4">
        {/* ToogleMenus */}
        <div className="flex items-center gap-2 flex-1 min-w-0 md:flex-[0_0_40%]">
          <Sheet modal={false}>
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
            <SheetContent side="left">
              <nav className="flex flex-col gap-4">
                <Link href="/">Fashcycle</Link>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="text-lg font-medium"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex relative flex-grow min-w-0 ">
            <div className="relative w-[50%] border bg-white rounded">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/70" />
              <input
                type="search"
                placeholder="Search for brand, product type, colour..."
                className="pl-9 rounded pr-3 py-2 w-full bg-black/10 border border-black/20 text-black placeholder:text-black/70 focus:border-black/20 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>
        {/* ToogleMenusEnd */}

        <Link
          href="/"
          className="font-serif text-lg md:text-xl font-medium absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 whitespace-nowrap z-10 hidden md:block"
        >
          Fashcycle
        </Link>

        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap md:flex-[0_0_40%] justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-primary-foreground flex-shrink-0 focus:border-black/20 focus:ring-0"
          >
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
              <TooltipTrigger asChild>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="icon"
                      className="rounded-full p-0 border"
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-50 z-50"
                    sideOffset={5}
                  >
                    <div className="px-2 py-1.5">NOTIFICATION1</div>
                    <DropdownMenuItem>NOTIFICATION2</DropdownMenuItem>
                    <DropdownMenuItem>NOTIFICATION3</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <Link href={isLogin ? "/wishlist" : "/login"}>
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
              <Link href={isLogin ? "/cart" : "/login"}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground flex-shrink-0"
                  >
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
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full p-0 border"
                >
                  <Avatar className="h-10 w-10">
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt="User Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="h-5 w-5" color="black" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-50 z-50"
                sideOffset={5}
                style={{ overflowY: "hidden" }}
              >
                <DropdownMenuItem asChild className="hover:bg-gray-100">
                  <Link
                    href="/profile"
                    className="w-full px-4 py-2 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-gray-100">
                  <Link
                    href="/dashboard"
                    className="w-full px-4 py-2 flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={toggleLogout}
                  className="w-full px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary-foreground flex-shrink-0"
                    >
                      <div className="bg-gray-100 rounded-full flex items-center justify-center w-10 h-10 border border-gray-200">
                        <User className="h-5 w-5 text-gray-600" color="black" />
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
  );
}
