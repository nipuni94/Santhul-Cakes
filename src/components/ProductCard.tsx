"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/Button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1);
    };

    return (
        <div className="group bg-white rounded-2xl overflow-hidden card-glow border border-gray-100/80 flex flex-col h-full">
            <Link
                href={`/product/${product.id}`}
                className="relative h-60 w-full overflow-hidden block bg-feather"
            >
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center shimmer">
                        <span className="relative z-10 font-script text-2xl text-pink/40">
                            Santhul
                        </span>
                    </div>
                )}

                {product.is_featured && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-pink to-pink-dark text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                        Featured
                    </span>
                )}

                {/* Hover overlay with Quick View */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/90 backdrop-blur-sm text-navy text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Quick View
                    </span>
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4 flex-grow">
                    <p className="text-[10px] text-pink font-bold uppercase tracking-[0.15em] mb-1.5">
                        {product.category}
                    </p>
                    <Link href={`/product/${product.id}`}>
                        <h3 className="text-base font-serif font-bold text-navy hover:text-pink transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-muted text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-lg font-bold text-navy">
                        Rs. {product.price.toLocaleString()}
                    </span>
                    <Button
                        size="sm"
                        className="rounded-full w-9 h-9 p-0 shadow-sm"
                        title="Add to Cart"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
