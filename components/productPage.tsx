'use client';

import React from 'react';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Home, MapPin, Package, ShoppingCart, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addToCart, getAllProducts, getCartItems, getSingleProduct, getWishlistedProducts } from "@/app/api/api";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

export default function ProductPage({ id }: { id: string }) {
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<string[]>([]);
    const router = useRouter();
    const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
    const [user, setUser] = useState<any>("")
    const [products, setProducts] = useState([])
    const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true);
    }, []);
    const fetchProduct = async () => {

        try {
            const response = await getSingleProduct(id);
            if (response.success === true) {
                setIsLoading(false)
                setProduct(response.product);
                // Set the initial selected image to frontLook
                if (response.product?.productImage?.frontLook) {
                    setSelectedImage(response.product.productImage.frontLook);
                }
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCartItems = async () => {
        try {
            const response = await getCartItems();
            if (response.success) {
                const cartProductIds = response.cart.map((item: any) => item.productId);
                setCartItems(cartProductIds);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }

    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8 h-full">
                <Loader text="Loading product..." />
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-8">Product not found</div>;
    }
    const handleAddToCart = async (productId: string) => {
        try {
            let obj: any = {
                "productId": productId,
                "quantity": 1
            }
            setIsAddingToCart(productId);
            const response = await addToCart(obj);
            if (response.success) {
                fetchCartItems()
                toast.success("Added to cart successfully!");
            }
        } catch (error) {
            toast.error("Failed to add to cart");
            console.error('Error adding to cart:', error);
        } finally {
            setIsAddingToCart(null);
        }
    };
    const fetchProducts = async () => {
        try {
            const response = await getAllProducts();
            if (response.success) {

                const sortedProducts = response.products.sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setProducts(sortedProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchWishlist = async () => {
        try {
            const response = await getWishlistedProducts();
            if (response.success) {
                const wishlistIds = response.products;
                setWishlistedItems(wishlistIds);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    useEffect(() => {
        setIsClient(true);
        let userData: any = localStorage.getItem("user-info")
        setUser(JSON.parse(userData))
        setIsClient(true);
        fetchProducts();
        fetchCartItems();
        fetchWishlist();
    }, []);
    useEffect(() => {
        setIsClient(true)
        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Create an array of all product images
    let productImages: any
    useEffect(() => {
        if (product) {
            productImages = Object.entries(product?.productImage)
                .filter(([key, path]) => path &&
                    !(key === "optional1" && !product?.productImage?.optional1) &&
                    !(key === "optional2" && !product?.productImage?.optional2))
                .map(([key, path]) => ({ key, path }));
        }
    }, [product])


    return (
        <div className="max-w-7xl mx-auto  py-8">
            <div className="flex items-center text-sm mb-6 gap-2">
                <Link href="/" className="hover:underline flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Home
                </Link>
                <span>/</span>
                <Link href="/" className="hover:underline">All Categories</Link>
                <span>/</span>
                <Link href="/dashboard" className="hover:underline capitalize">{product?.category}</Link>
                <span>/</span>
                <span className="text-gray-500">{product?.productName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Section - Images */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                >
                    {/* Main Product Image */}
                    <div className="relative">
                        <div className="relative h-[500px] w-full rounded-md overflow-hidden shadow-md">
                            <Image
                                src={selectedImage || product?.productImage?.frontLook}
                                alt={product?.productName}
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        {/* Navigation arrows */}
                        {productImages?.length > 1 && (
                            <>
                                <button
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                                    onClick={() => {
                                        const currentIndex = productImages?.findIndex((img: any) => img.path === selectedImage);
                                        const prevIndex = (currentIndex - 1 + productImages?.length) % productImages.length;
                                        setSelectedImage(productImages[prevIndex]?.path);
                                    }}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                                    onClick={() => {
                                        const currentIndex = productImages?.findIndex((img: any) => img.path === selectedImage);
                                        const nextIndex = (currentIndex + 1) % productImages?.length;
                                        setSelectedImage(productImages[nextIndex]?.path);
                                    }}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2">
                        {productImages?.map((image: any, index: any) => (
                            <div
                                key={image.key}
                                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border ${selectedImage === image.path ? 'border-black' : 'border-gray-200'}`}
                                onClick={() => setSelectedImage(image.path)}
                            >
                                <Image
                                    src={image.path}
                                    alt={`${image.key} view`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}

                        {/* Additional thumbnails for proof of purchase */}
                        {product?.proofOfPurchase && (
                            <div
                                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border ${selectedImage === product?.proofOfPurchase ? 'border-black' : 'border-gray-200'}`}
                                onClick={() => setSelectedImage(product?.proofOfPurchase)}
                            >
                                <Image
                                    src={product?.proofOfPurchase}
                                    alt="Proof of Purchase"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Right Section - Details */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-center mb-1">{product?.productName}</h1>
                    <p className="text-center mb-6">{product?.color} {product?.category}, {product?.size}</p>

                    {/* Price Display */}
                    <div className="bg-gray-100 p-6 rounded-lg mb-6 text-center">
                        <p className="text-lg text-gray-600 mb-2">{product?.listingType.includes('rent') ? "Rent Price" : "Sell Price"}</p>
                        {product?.listingType.includes('rent') ?
                            <p className="text-4xl font-bold text-emerald-600">₹{Math.round((product?.originalPurchasePrice) * 21 / 100)} for 3 days</p>
                            :
                            <p className="text-4xl font-bold text-emerald-600">₹{Math.round(product?.originalPurchasePrice * 50 / 100)}</p>
                        }
                    </div>

                    {/* Buy Button */}
                    <div className="flex gap-4 mb-6">
                        {product?.listingType?.includes('rent') &&
                            <Button className="w-1/2 border-emerald-600 bg-primary text-primary-foreground py-5 text-lg rounded-lg shadow-sm  transition">
                                RENT NOW
                            </Button>
                        }
                        {product?.listingType?.includes('sell') &&
                            <Button className="w-1/2 bg-primary text-primary-foreground py-5 text-lg rounded-lg shadow-md transition">
                                BUY NOW
                            </Button>
                        }

                        <Button
                            onClick={() => cartItems?.includes(product?.id)
                                ? router.push('/cart')
                                : handleAddToCart(product?.id)
                            }
                            disabled={isAddingToCart === product?.id}
                            className="w-1/2  py-5 text-lg rounded-lg shadow-md transition"
                            variant={cartItems.includes(product?.id) ? "default" : "outline"}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {isAddingToCart === product?.id
                                ? 'Adding...'
                                : cartItems.includes(product?.id)
                                    ? 'Go to Cart'
                                    : 'Add to Cart'
                            }
                        </Button>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4">
                        <Badge variant="outline" className="border-blue-400 bg-blue-100 text-blue-800 rounded-full px-3 capitalize">
                            {product?.category}
                        </Badge>
                        {product?.listingType?.map((type: string) => (
                            <Badge
                                key={type}
                                variant="secondary"
                                className="bg-green-100 text-green-800 rounded-full px-3 uppercase"
                            >
                                {type}
                            </Badge>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="font-semibold mb-2">{product?.productName}</h2>
                        <p className="text-gray-700">
                            {product?.description || `Quality ${product?.productName} in ${product?.color}. Size ${product?.size} with ${product?.sizeFlexibility} flexibility.`}
                        </p>


                    </div>

                    {/* Product Details Table */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">BRAND</span>
                            <span className="font-medium">FashCycle</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">SIZE</span>
                            <span className="font-medium">{product.size}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">SIZE FLEXIBILITY</span>
                            <span className="font-medium">{product.sizeFlexibility}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">COLOUR</span>
                            <span className="font-medium capitalize">{product.color}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">{product?.listingType?.includes('sell') ? "BUY FOR" : "RENTAL PRICE"}</span>
                            {product?.listingType?.includes('rent') ?
                                <span className="font-medium">₹{Math.round((product?.originalPurchasePrice) * 21 / 100)} for 3 days</span>
                                :
                                <span className="font-medium">₹{Math.round(product?.originalPurchasePrice * 50 / 100)}</span>
                            }
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">PRODUCT CONDITION</span>
                            <span className="font-medium">Excellent</span>
                        </div>
                    </div>

                    {/* Purchase Policy */}
                    <p className="text-xs text-center text-gray-500 mt-6">
                        All purchases are verified and guaranteed authentic.
                    </p>


                </motion.div>
            </div>
        </div>
    );
}