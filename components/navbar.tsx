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
  ChevronLeft,
  ChevronRight,
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

type Category = {
  name: string;
  id: string;
};

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogin, setIsLogin] = useState<any>(false);
  const [userImage, setUserImage] = useState<any>();
  const router: any = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Category slider functions
  const categoriesPerSlide = 6;
  const totalSlides = Math.ceil((categories.length + 1) / categoriesPerSlide); // +1 for Home
  const canGoLeft = currentSlide > 0;
  const canGoRight = currentSlide < totalSlides - 1;

  const slideLeft = () => {
    if (canGoLeft) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slideRight = () => {
    if (canGoRight) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

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
                <li key="home">
                  <Link href="/" className="text-lg font-medium">
                    Home
                  </Link>
                </li>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.name}
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
        <div className="container flex items-center justify-center">
          <div className="flex items-center gap-4">
            {/* Debug info - remove in production */}
            <div className="text-xs text-primary-foreground/70 absolute top-0 left-0">
              {currentSlide}/{totalSlides - 1} | L:{canGoLeft.toString()} | R:
              {canGoRight.toString()}
            </div>

            {canGoLeft && (
              <Button
                variant="ghost"
                size="icon"
                onClick={slideLeft}
                className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            <div className="overflow-hidden">
              <ul
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  width: `${totalSlides * 100}%`, // Fixed: use totalSlides, not categories.length
                }}
              >
                {Array.from({ length: totalSlides }, (_, slideIndex) => {
                  const startIndex = slideIndex * categoriesPerSlide;
                  const endIndex = startIndex + categoriesPerSlide;

                  return (
                    <li
                      key={slideIndex}
                      className="flex justify-center py-3"
                      style={{ width: `${100 / totalSlides}%` }} // Fixed: use totalSlides
                    >
                      <div className="flex space-x-8">
                        {slideIndex === 0 && (
                          <Link
                            href="/"
                            className="category-link text-primary-foreground/90 hover:text-primary-foreground whitespace-nowrap transition-all duration-200 hover:scale-105 hover:drop-shadow-lg relative group"
                          >
                            Home
                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                          </Link>
                        )}

                        {categories
                          .slice(
                            slideIndex === 0 ? 0 : startIndex - 1, // Adjust for Home link
                            slideIndex === 0
                              ? categoriesPerSlide - 1
                              : endIndex - 1
                          )
                          .map((category, index) => (
                            <Link
                              key={`${slideIndex}-${index}`} // Fixed: use index instead of category.id
                              href={`/${category.id}`} // Fixed: add leading slash
                              className="category-link text-primary-foreground/90 hover:text-primary-foreground whitespace-nowrap transition-all duration-200 hover:scale-105 hover:drop-shadow-lg relative group"
                            >
                              {category.name}
                              {/* <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span> */}
                            </Link>
                          ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {canGoRight && (
              <Button
                variant="ghost"
                size="icon"
                onClick={slideRight}
                className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
