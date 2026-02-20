"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, LayoutGrid, List, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ShopFilters } from "@/components/ShopFilters";
import { Button } from "@/components/ui/Button";
import { ProductGridSkeleton, CategoryStripSkeleton } from "@/components/Skeletons";
import { EmptySearch } from "@/components/EmptyState";

function ShopContent() {
    const { products, categories, isLoading } = useStore();
    const searchParams = useSearchParams();
    const router = useRouter();

    // States
    const [searchTerm, setSearchTerm] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [itemsPerPage, setItemsPerPage] = useState(16);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Debounced search
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 300);
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [inputValue]);

    // Initial load handling could be here but store does it

    // Handle initial category from URL
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
            setSelectedCategories([categoryParam]);
        }
    }, [searchParams]);

    const handleCategoryChange = (categoryName: string) => {
        // If clicking "All Products" (empty string or special handling), clear filters
        if (categoryName === "All Products") {
            setSelectedCategories([]);
            return;
        }

        // Toggle category
        setSelectedCategories(prev => {
            if (prev.includes(categoryName)) {
                return prev.filter(c => c !== categoryName);
            } else {
                // For top bar behavior (single selectish perception but supports multiple in filter), 
                // we might want to just set it if coming from top bar, but let's stick to toggle for now
                // actually, let's make the top bar exclusive for better UX if used there? 
                // The reference implies "All Products" vs specific. Let's keep multi-select support but top bar sets single.
                return [...prev, categoryName];
            }
        });
    };

    const handleTopBarCategoryClick = (categoryName: string) => {
        if (categoryName === "All Products") {
            setSelectedCategories([]);
        } else {
            // Treat New Arrivals and others as standard categories
            setSelectedCategories([categoryName]);
        }
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 20000]);
        setSearchTerm("");
        setInputValue("");
        setIsFilterOpen(false);
    };

    // Filter Logic
    const filteredProducts = products.filter((p) => {
        // Search
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Category (Match any selected)
        // Ensure both singular category and multiple categories are checked
        const productCategories = [p.category, ...(p.categories || [])];
        const matchesCategory = selectedCategories.length === 0 ||
            selectedCategories.some(cat => productCategories.includes(cat));

        // Price
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Pagination Logic (Simplified for now: Just limit display)
    const displayedProducts = filteredProducts.slice(0, itemsPerPage);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-feather">
                <div className="sticky top-0 z-40 pointer-events-none">
                    <div className="h-20 md:h-24" />
                    <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm pointer-events-auto py-3">
                        <div className="container mx-auto px-6">
                            <CategoryStripSkeleton />
                        </div>
                    </div>
                </div>
                <section className="container mx-auto px-6 py-8">
                    <ProductGridSkeleton count={8} />
                </section>
            </div>
        );
    }

    const topCategories = ["All Products", ...categories.map(c => c.name).filter(c => !["Custom", "Custom Order"].includes(c)), "New Arrivals"];

    return (
        <div className="min-h-screen bg-feather">
            <ShopFilters
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onClearFilters={handleClearFilters}
            />

            {/* Page Header & Toolbar */}
            <section className="bg-white border-b border-gray-100 pt-28 pb-8 shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col gap-6">
                        {/* Title & Search Row */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <h1 className="text-3xl font-serif text-navy">
                                Sweet Creations
                            </h1>

                            <div className="relative flex-1 md:max-w-md w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search cakes..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Toolbar Row - Modified to include categories on left */}
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                            {/* Categories (Left Side) */}
                            <div className="w-full lg:w-auto py-2">
                                <div className="flex flex-wrap items-center gap-2 px-1">
                                    {topCategories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleTopBarCategoryClick(cat)}
                                            className={cn(
                                                "whitespace-nowrap transition-all duration-300 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide hover:scale-105",
                                                (cat === "All Products" && selectedCategories.length === 0) || selectedCategories.includes(cat)
                                                    ? "bg-pink text-white border-pink shadow-md shadow-pink/20"
                                                    : "bg-white text-navy border-gray-200 hover:border-pink hover:text-pink hover:bg-white"
                                            )}
                                        >
                                            {cat === "New Arrivals" && <Sparkles className="w-3 h-3 mr-1.5 inline-block" />}
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* View Controls (Right Side) */}
                            <div className="flex flex-wrap justify-end items-center gap-4 w-full lg:w-auto">
                                <div className="hidden sm:flex items-center gap-2">
                                    <span className="text-navy font-medium">Show:</span>
                                    {[8, 16, 24, 32].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setItemsPerPage(num)}
                                            className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                                                itemsPerPage === num ? "bg-pink text-white font-bold" : "hover:bg-gray-100"
                                            )}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* View Toggle */}
                                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={cn("p-2 rounded-md transition-all", viewMode === "grid" ? "bg-white text-navy shadow-sm" : "text-gray-400 hover:text-navy")}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={cn("p-2 rounded-md transition-all", viewMode === "list" ? "bg-white text-navy shadow-sm" : "text-gray-400 hover:text-navy")}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => setIsFilterOpen(true)}
                                        className="flex items-center gap-2 px-4 whitespace-nowrap h-10"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" /> Filters
                                        {(selectedCategories.length > 0 || priceRange[1] < 20000) && (
                                            <span className="w-2 h-2 rounded-full bg-pink block" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    {displayedProducts.length > 0 ? (
                        <div className={cn(
                            "grid gap-8",
                            viewMode === "grid"
                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                : "grid-cols-1"
                        )}>
                            {displayedProducts.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={viewMode === "list" ? "flex gap-6 bg-white p-4 rounded-2xl border border-gray-100 hover:border-pink/30 hover:shadow-lg transition-all" : ""}
                                >
                                    {viewMode === "grid" ? (
                                        <ProductCard product={product} />
                                    ) : (
                                        // List View Card Implementation
                                        <div className="flex flex-col sm:flex-row gap-6 w-full items-center">
                                            {/* Reuse product card logic or simplified list view */}
                                            {/* For simplicity, reusing ProductCard but wrapping it or implementing custom list item */}
                                            {/* Let's build a quick list view item here */}
                                            <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden shrink-0">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-grow text-center sm:text-left">
                                                <div className="text-xs text-pink font-semibold uppercase tracking-wider mb-1">{product.category}</div>
                                                <h3 className="font-serif text-2xl text-navy mb-2">{product.name}</h3>
                                                <p className="text-muted text-sm mb-4 line-clamp-2">{product.description}</p>
                                                <div className="flex items-center justify-center sm:justify-start gap-4">
                                                    <span className="text-xl font-bold text-navy">Rs. {product.price.toLocaleString()}</span>
                                                    <Button size="sm" onClick={() => router.push(`/product/${product.id}`)}>
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <EmptySearch onClear={handleClearFilters} />
                    )}
                </div>
            </section>
        </div >
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-feather pt-28 pb-16 flex items-center justify-center">
                <div className="animate-pulse text-muted">Loading shop...</div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
