'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Home, MapPin, Package, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSingleProduct } from "@/app/api/api";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchProduct = async () => {
        try {
            const response = await getSingleProduct(params.id);
            if (response.success === true) {
                setProduct(response.product);
                // Set the initial selected image to frontLook
                if (response.product?.productImage?.frontLook) {
                    setSelectedImage(response.product.productImage.frontLook);
                }
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-8">Product not found</div>;
    }

    // Create an array of all product images
    const productImages: any = Object.entries(product.productImage)
        .filter(([key, path]) => path &&
            !(key === "optional1" && !product.productImage.optional1) &&
            !(key === "optional2" && !product.productImage.optional2))
        .map(([key, path]) => ({ key, path }));

    return (
        <div className="max-w-7xl mx-auto  py-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm mb-6 gap-2">
                <Link href="/" className="hover:underline flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Home
                </Link>
                <span>/</span>
                <Link href="/dashboard" className="hover:underline">All Categories</Link>
                <span>/</span>
                <Link href="/dashboard" className="hover:underline capitalize">{product.category}</Link>
                <span>/</span>
                <span className="text-gray-500">{product.productName}</span>
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
                                src={selectedImage || product.productImage.frontLook}
                                alt={product.productName}
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
                                        const currentIndex = productImages.findIndex((img:any) => img.path === selectedImage);
                                        const prevIndex = (currentIndex - 1 + productImages.length) % productImages.length;
                                        setSelectedImage(productImages[prevIndex].path);
                                    }}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                                    onClick={() => {
                                        const currentIndex = productImages.findIndex((img:any) => img.path === selectedImage);
                                        const nextIndex = (currentIndex + 1) % productImages.length;
                                        setSelectedImage(productImages[nextIndex].path);
                                    }}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2">
                        {productImages.map((image: any, index: any) => (
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
                        {product.proofOfPurchase && (
                            <div
                                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border ${selectedImage === product.proofOfPurchase ? 'border-black' : 'border-gray-200'}`}
                                onClick={() => setSelectedImage(product.proofOfPurchase)}
                            >
                                <Image
                                    src={product.proofOfPurchase}
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
                    <h1 className="text-3xl font-bold text-center mb-1">{product.productName}</h1>
                    <p className="text-center mb-6">{product.color} {product.category}, {product.size}</p>

                    {/* Price Display */}
                    <div className="bg-gray-100 p-6 rounded-lg mb-6 text-center">
                        <p className="text-lg text-gray-600 mb-2">Sale Price</p>
                        <p className="text-4xl font-bold text-emerald-600">₹{product.originalPurchasePrice}</p>
                    </div>

                    {/* Buy Button */}
                    <div className="flex gap-4 mb-6">
                        <Button className="w-1/2 bg-primary text-primary-foreground py-5 text-lg rounded-lg shadow-md transition">
                            BUY NOW
                        </Button>
                        <Button variant="outline" className="w-1/2 border-emerald-600 text-emerald-600 py-5 text-lg rounded-lg shadow-sm hover:bg-emerald-50 transition">
                            RENT NOW
                        </Button>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4">
                        <Badge variant="outline" className="border-blue-400 bg-blue-100 text-blue-800 rounded-full px-3 capitalize">
                            {product.category}
                        </Badge>
                        {product.listingType.map((type: string) => (
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
                        <h2 className="font-semibold mb-2">{product.productName}</h2>
                        <p className="text-gray-700">
                            {product.description || `Quality ${product.productName} in ${product.color}. Size ${product.size} with ${product.sizeFlexibility} flexibility.`}
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
                            <span className="text-gray-600">RETAIL PRICE</span>
                            <span className="font-medium">₹{product.originalPurchasePrice}</span>
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