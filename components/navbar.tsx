import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
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
import { getAllCategories, getNotifications } from "@/app/api/api";

type Category = {
  name: string;
  id: string;
};

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userImage, setUserImage] = useState<string | undefined>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState();
  const isMobile = () => {
    // Simple check for mobile device
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
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
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user-info");
      const parsedUserData = userData ? JSON.parse(userData) : null;
      if (parsedUserData) {
        setUserImage(parsedUserData.image);
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
  }, []);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
    // if (isMobile()) {
    //   window.location.href = "https://wa.me/";
    // } else {
    //   alert("Please install our app to continue!");
    // }
  };

  return (
    <header className="w-full bg-primary text-primary-foreground fixed top-0 z-50 left-0 right-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          <div className="flex items-center gap-2 flex-1 lg:flex-none">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 h-full flex flex-col p-4"
              >
                <style jsx>{`
                  .scrollable-content::-webkit-scrollbar {
                    display: none;
                  }
                  .scrollable-content {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                `}</style>
                <div className="flex flex-col gap-3 mt-6 overflow-y-auto scrollable-content mt-0">
                  <Link
                    href="/"
                    className="text-2xl font-serif font-medium mb-4"
                  >
                    Fashcycle
                  </Link>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/70" />
                    <input
                      type="search"
                      placeholder="Search for brand, product type, colour..."
                      className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 text-black placeholder:text-black/70  focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>
                  <Link
                    href={isLogin ? "/profile" : "/login"}
                    onClick={handleLinkClick}
                  >
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full flex items-center gap-3 bg-primary text-white hover:bg-primary/90 transition-colors py-3 rounded-lg font-medium md:hidden"
                    >
                      <Plus className="h-5 w-5" />
                      SELL ITEM
                    </Button>
                  </Link>
                  <div className="flex flex-col gap-3 md:hidden">
                    <Link
                      href={isLogin ? "/wishlist" : "/login"}
                      onClick={handleLinkClick}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full flex items-center gap-3 justify-start py-3 rounded-lg"
                      >
                        <Heart className="h-5 w-5" />
                        Wishlist
                      </Button>
                    </Link>
                    <Link
                      href={isLogin ? "/cart" : "/login"}
                      onClick={handleLinkClick}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full flex items-center gap-3 justify-start py-3 rounded-lg"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        Cart
                      </Button>
                    </Link>
                    <Link href="/notifications">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full flex items-center gap-3 justify-start py-3 rounded-lg"
                        onClick={handleLinkClick}
                      >
                        <Bell className="h-5 w-5" />
                        Notifications
                      </Button>
                    </Link>
                  </div>
                  <div className="border-t pt-4">
                    <Link
                      href="/"
                      className="text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors block"
                      onClick={handleLinkClick}
                    >
                      Home
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.id}`}
                        className="capitalize text-lg font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors block"
                        onClick={handleLinkClick}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden lg:flex items-center relative">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/70" />
                <input
                  type="search"
                  placeholder="Search for brand, product type, colour..."
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-300 text-black placeholder:text-black/70 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              href="/"
              className="font-serif text-xl lg:text-2xl font-medium text-primary-foreground hover:text-primary-foreground/90 transition-colors whitespace-nowrap"
            >
              Fashcycle
            </Link>
          </div>
          <div className="flex items-center gap-2 flex-1 lg:flex-none justify-end">
            <div className="hidden md:flex items-center gap-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <Link href={isLogin ? "/profile" : "/login"}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className="hidden flex items-center gap-2 border-2 text-white hover:bg-gray-100 hover:text-black transition-colors px-4 py-1 rounded-full font-medium"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">LIST</span>
                      </Button>
                    </TooltipTrigger>
                  </Link>
                  <TooltipContent side="bottom">
                    <p>Add New Listing</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full relative"
                        >
                          <Bell className="h-5 w-5" />
                          {notifications?.some((n) => !n.read) && (
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-72 z-50"
                        sideOffset={8}
                      >
                        <div className="px-3 py-2 font-semibold border-b">
                          Notifications
                        </div>

                        {notifications?.length === 0 ? (
                          <DropdownMenuItem className="py-4 text-sm text-gray-500">
                            No notifications
                          </DropdownMenuItem>
                        ) : (
                          notifications?.map((notif) => (
                            <DropdownMenuItem
                              key={notif.id}
                              className="py-3 flex flex-col gap-1"
                            >
                              <span className="font-medium text-sm">
                                {notif.title}
                              </span>
                              <span className="text-sm text-gray-500">
                                {notif.body}
                              </span>
                              <span className="text-xs text-gray-400 mt-1">
                                {new Date(notif?.createdAt).toLocaleString()}
                              </span>
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <Link href={isLogin ? "/wishlist" : "/login"}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                      >
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Wishlist</span>
                      </Button>
                    </TooltipTrigger>
                  </Link>
                  <TooltipContent side="bottom">
                    <p>Wishlist</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <Link href={isLogin ? "/cart" : "/login"}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        <span className="sr-only">Cart</span>
                      </Button>
                    </TooltipTrigger>
                  </Link>
                  <TooltipContent side="bottom">
                    <p>Cart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {isLogin ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full p-0 hover:bg-primary-foreground/20"
                  >
                    <Avatar className="h-8 w-8">
                      {userImage ? (
                        <Image
                          src={userImage}
                          alt="User Profile"
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-white">
                          <User className="h-4 w-4 text-gray-600" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 z-50"
                  sideOffset={8}
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="w-full flex items-center gap-2 px-2 py-2"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center gap-2 px-2 py-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={toggleLogout}
                    className="w-full flex items-center gap-2 px-2 py-2 text-red-600 focus:text-red-600"
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
                        className="rounded-full hover:bg-primary-foreground/20"
                      >
                        <div className="bg-white rounded-full flex items-center justify-center w-8 h-8">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="sr-only">Login</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Login</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            )}
          </div>
        </div>
        <nav className="hidden lg:block border-t border-primary-foreground/20">
          <div className="flex items-center justify-center py-3">
            <ul className="flex transition-transform duration-500 ease-in-out">
              <li className="flex justify-center gap-8">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/${category.id}`}
                    className="capitalize text-primary-foreground/90 hover:text-primary-foreground font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 relative group px-2 py-1"
                  >
                    {category.name}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </Link>
                ))}
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
