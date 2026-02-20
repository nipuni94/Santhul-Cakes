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

    const currentCats = currentProduct.categories || [currentProduct.category];

    // Find related products: same categories, excluding current
    const related = products
        .filter(p => p.id !== currentProduct.id)
        .map(p => {
            // Score based on shared categories
            const productCats = p.categories || [p.category];
            const sharedCats = currentCats.filter(c => productCats.includes(c));
            return { product: p, score: sharedCats.length };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxItems)
        .map(item => item.product);

    // Fallback: first try same primary category, then featured from any category
    let fallback: Product[] = [];
    if (related.length < maxItems) {
        const sameCategoryFallback = products
            .filter(p => p.id !== currentProduct.id && !related.find(r => r.id === p.id))
            .filter(p => {
                const pCats = p.categories || [p.category];
                return pCats.includes(currentProduct.category);
            })
            .slice(0, maxItems - related.length);
        fallback = sameCategoryFallback;

        if (related.length + fallback.length < maxItems) {
            const featuredFallback = products
                .filter(p => p.id !== currentProduct.id && p.is_featured && !related.find(r => r.id === p.id) && !fallback.find(f => f.id === p.id))
                .slice(0, maxItems - related.length - fallback.length);
            fallback = [...fallback, ...featuredFallback];
        }
    }

    const displayProducts = [...related, ...fallback];

    if (displayProducts.length === 0) return null;

    // Dynamic title: show category name if all related are from same category
    const allSameCategory = displayProducts.every(p => {
        const pCats = p.categories || [p.category];
        return pCats.includes(currentProduct.category);
    });
    const sectionTitle = allSameCategory && currentProduct.category
        ? `More from ${currentProduct.category}`
        : "You May Also Like";

    return (
        <section className="mt-20">
            <h2 className="text-2xl font-serif text-navy mb-8">{sectionTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {displayProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};
