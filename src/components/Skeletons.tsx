"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Base skeleton pulse element
export const Skeleton = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("animate-pulse bg-gray-200 rounded-lg", className)}
        {...props}
    />
);

// Skeleton for ProductCard
export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <Skeleton className="aspect-square w-full rounded-none" />
        <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-9 w-28 rounded-full" />
            </div>
        </div>
    </div>
);

// Skeleton grid for Shop page
export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

// Skeleton for Product Detail page
export const ProductDetailSkeleton = () => (
    <div className="min-h-screen bg-feather pt-28 pb-16">
        <div className="container mx-auto px-6">
            <Skeleton className="h-4 w-32 mb-8" />
            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <Skeleton className="aspect-square rounded-3xl" />
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-24 rounded-full" />
                        <Skeleton className="h-10 w-24 rounded-full" />
                        <Skeleton className="h-10 w-24 rounded-full" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-20 rounded-full" />
                        <Skeleton className="h-10 w-20 rounded-full" />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-12 w-32 rounded-full" />
                        <Skeleton className="h-12 flex-1 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Skeleton for Category strip
export const CategoryStripSkeleton = () => (
    <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
        ))}
    </div>
);

// Skeleton for Admin table rows
export const TableRowSkeleton = ({ cols = 5, rows = 5 }: { cols?: number; rows?: number }) => (
    <>
        {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-gray-50">
                {Array.from({ length: cols }).map((_, c) => (
                    <td key={c} className="p-4">
                        <Skeleton className={cn("h-4", c === 0 ? "w-12 h-12" : "w-20")} />
                    </td>
                ))}
            </tr>
        ))}
    </>
);

// Skeleton for homepage hero section
export const HeroSkeleton = () => (
    <div className="min-h-screen flex items-center justify-center bg-feather">
        <div className="text-center space-y-6 max-w-2xl mx-auto px-6">
            <Skeleton className="h-6 w-40 mx-auto rounded-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-5 w-2/3 mx-auto" />
            <div className="flex gap-4 justify-center pt-4">
                <Skeleton className="h-12 w-36 rounded-full" />
                <Skeleton className="h-12 w-36 rounded-full" />
            </div>
        </div>
    </div>
);
