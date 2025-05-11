'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Package } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSingleProduct } from "@/app/api/api";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const fetchProduct = async () => {
        try {
            const response = await getSingleProduct(params.id);
            if(response.success==true){
                setProduct(response.product);
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

    return (
       
        <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Section - Images */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                {/* Main Product Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.productImage.frontLook}`}
                        alt={product.productName}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Other Product Views */}
                <div className="grid grid-cols-3 gap-4">
                    {Object.entries(product.productImage)
                        .filter(([key, path]) => key !== "frontLook" && path && 
                            !(key === "optional1" && !product.productImage.optional1) && 
                            !(key === "optional2" && !product.productImage.optional2))
                        .map(([key, path]) => (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                key={key}
                                className="relative aspect-square rounded-lg overflow-hidden shadow"
                            >
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${path}`}
                                    alt={`${key} view`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        ))}
                </div>

                {/* Accessories & Proof */}
                <div className="grid grid-cols-2 gap-4">
                    {product.accessoriesImage && (
                        <div>
                            <h4 className="text-sm font-medium mb-1">Accessories</h4>
                            <div className="relative aspect-square rounded-lg overflow-hidden shadow">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.accessoriesImage}`}
                                    alt="Accessories"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <h4 className="text-sm font-medium mb-1">Proof of Purchase</h4>
                        <div className="relative aspect-square rounded-lg overflow-hidden shadow">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.proofOfPurchase}`}
                                alt="Proof of Purchase"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Section - Details */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                {/* Title & Date */}
                <div>
                    <h1 className="text-3xl font-bold text-primary">{product.productName}</h1>
                    <p className="text-sm text-muted-foreground mt-1">Added on {new Date(product.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-blue-400 text-blue-600">{product.category}</Badge>
                    {product.listingType.map((type: string) => (
                        <Badge
                            key={type}
                            variant="secondary"
                            className="bg-purple-100 text-purple-800 uppercase"
                        >
                            {type}
                        </Badge>
                    ))}
                </div>

                {/* Price & Contact */}
                <div className="space-y-4 border-y border-gray-200 py-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Original Price</span>
                        <span className="text-2xl font-bold text-emerald-600">₹ {product.originalPurchasePrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                        <span>Contact Number</span>
                        <span>{product.mobileNumber}</span>
                    </div>
                </div>

                {/* Attributes */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-5 w-5" />
                        <span>Size Flexibility: <span className="text-black">{product.sizeFlexibility}</span> | Color: <span className="text-black">{product.color}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                        <span>Last Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                    <Button className="flex-1">Edit Listing</Button>
                    <Button variant="outline" className="flex-1">Download Report</Button>
                </div>
            </motion.div>
        </div>
    </div>
    );
}