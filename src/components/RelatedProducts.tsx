"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface RelatedProductsProps {
    currentProduct: Product;
    maxItems?: number;
}

export const RelatedProducts = ({ currentProduct, maxItems = 4 }: RelatedProductsProps) => {
    const { products } = useStore();

    // Find related products: same categories, excluding current
    const related = products
        .filter(p => p.id !== currentProduct.id)
        .map(p => {
            // Score based on shared categories
            const currentCats = currentProduct.categories || [currentProduct.category];
            const productCats = p.categories || [p.category];
            const sharedCats = currentCats.filter(c => productCats.includes(c));
            return { product: p, score: sharedCats.length };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxItems)
        .map(item => item.product);

    // Fall back to featured products if not enough related
    const fallback = related.length < maxItems
        ? products
            .filter(p => p.id !== currentProduct.id && p.is_featured && !related.find(r => r.id === p.id))
            .slice(0, maxItems - related.length)
        : [];

    const displayProducts = [...related, ...fallback];

    if (displayProducts.length === 0) return null;

    return (
        <section className="mt-20">
            <h2 className="text-2xl font-serif text-navy mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {displayProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};
