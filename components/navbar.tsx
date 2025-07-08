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
  X,
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
import { getAllCategories } from "@/app/api/api";
import logo from "@/public/HomeLogo.png";
import appleTouchIcon from "@/public/apple-touch-icon.png";

type Category = {
  name: string;
  id: string;
};

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogin, setIsLogin] = useState<any>(false);
  const [userImage, setUserImage] = useState<any>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router: any = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [screenSize, setScreenSize] = useState("lg");

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setScreenSize("xs");
      } else if (width < 768) {
        setScreenSize("sm");
      } else if (width < 1024) {
        setScreenSize("md");
      } else {
        setScreenSize("lg");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

  // Mobile search toggle
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="w-full bg-primary text-primary-foreground fixed top-0 z-50 left-0 right-0">
      {/* Mobile Search Bar - Only visible when search is open */}
      {isSearchOpen && (
        <div className="md:hidden bg-primary border-b border-primary-foreground/10 px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/70" />
            <input
              type="search"
              placeholder="Search products..."
              className="pl-9 pr-10 py-2 w-full bg-white rounded text-black placeholder:text-black/70 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-black/70"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="container flex items-center justify-between h-14 sm:h-16 w-full px-2 sm:px-4">
        {/* Left Section - Menu + Search */}
        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
          {/* Mobile Menu Toggle */}
          <Sheet modal={false}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-primary-foreground h-8 w-8 sm:h-10 sm:w-10"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 sm:w-96">
              <nav className="flex flex-col gap-4 mt-6">
                <div className="pb-4 border-b border-gray-200">
                  <Image
                    src={screenSize === "xs" ? appleTouchIcon : logo}
                    alt="Logo"
                    width={screenSize === "xs" ? 60 : 200}
                    height={screenSize === "xs" ? 60 : 60}
                    className="h-auto w-16 sm:w-32 object-contain mx-auto"
                    priority
                  />
                </div>

                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.id}`}
                    className="capitalize text-lg font-medium py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Search */}
          <div className="hidden lg:flex relative flex-grow min-w-0 max-w-md">
            <div className="relative w-full border bg-white rounded">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/70" />
              <input
                type="search"
                placeholder="Search for brand, product type, colour..."
                className="pl-9 rounded pr-3 py-2 w-full bg-black/10 border border-black/20 text-black placeholder:text-black/70 focus:border-black/20 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="lg:hidden text-primary-foreground h-8 w-8 sm:h-10 sm:w-10"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        {/* Center Logo - Always centered */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-10">
          <Image
            src={screenSize === "xs" ? appleTouchIcon : logo}
            alt="Logo"
            width={screenSize === "xs" ? 40 : 200}
            height={screenSize === "xs" ? 40 : 60}
            className={`h-auto object-contain mx-auto ${
              screenSize === "xs" ? "w-10" : "w-20 sm:w-32 lg:w-48"
            }`}
            priority
          />
        </Link>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1 sm:gap-2 justify-end">
          {/* SELL Button */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <Link href={isLogin ? "/profile" : "/login"}>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 sm:gap-2 rounded-full border-2 sm:border-4 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">SELL</span>
                    <span className="sm:hidden">+</span>
                  </Button>
                </TooltipTrigger>
              </Link>
              <TooltipContent side="top">
                <p>Add New Listing</p>
              </TooltipContent>
            </Tooltip>

            {/* Notifications - Hidden on very small screens */}
            {screenSize !== "xs" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default"
                        size="icon"
                        className="rounded-full p-0 border h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
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
            )}

            {/* Wishlist - Hidden on very small screens */}
            {screenSize !== "xs" && (
              <Tooltip>
                <Link href={isLogin ? "/wishlist" : "/login"}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary-foreground h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Heart className="h-3 w-3 sm:h-5 sm:w-5" />
                      <span className="sr-only">Wishlist</span>
                    </Button>
                  </TooltipTrigger>
                </Link>
                <TooltipContent side="top">
                  <p>Wishlist</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Cart */}
            <Tooltip>
              <Link href={isLogin ? "/cart" : "/login"}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <ShoppingBag className="h-3 w-3 sm:h-5 sm:w-5" />
                    <span className="sr-only">Cart</span>
                  </Button>
                </TooltipTrigger>
              </Link>
              <TooltipContent side="top">
                <p>Cart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Profile/Login */}
          {isLogin ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full p-0 border h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Avatar className="h-full w-full">
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
                        <User className="h-3 w-3 sm:h-5 sm:w-5" color="black" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-50 z-50"
                sideOffset={5}
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
                {screenSize === "xs" && (
                  <>
                    <DropdownMenuItem asChild className="hover:bg-gray-100">
                      <Link
                        href="/wishlist"
                        className="w-full px-4 py-2 flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-100">
                      <Link
                        href="/notifications"
                        className="w-full px-4 py-2 flex items-center gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
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
                      className="text-primary-foreground h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <div className="bg-gray-100 rounded-full flex items-center justify-center w-full h-full border border-gray-200">
                        <User className="h-3 w-3 sm:h-5 sm:w-5 text-gray-600" />
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

      {/* Desktop Category Navigation - Only show if menu toggle is NOT visible */}
      {screenSize === "lg" && (
        <nav className="border-t border-primary-foreground/10">
          <div className="container flex items-center justify-center py-3">
            <div className="flex items-center gap-6 lg:gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.id}`}
                  className=" capitalize text-primary-foreground/90 hover:text-primary-foreground whitespace-nowrap transition-all duration-200 hover:scale-105 relative group"
                >
                  {category.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
