"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Category } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    selectedCategories: string[];
    onCategoryChange: (categoryName: string) => void;
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    onClearFilters: () => void;
}

export const ShopFilters = ({
    isOpen,
    onClose,
    categories,
    selectedCategories,
    onCategoryChange,
    priceRange,
    onPriceChange,
    onClearFilters,
}: ShopFiltersProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-serif text-navy">Filters</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Categories */}
                            <div>
                                <h3 className="font-semibold text-navy mb-4">Categories</h3>
                                <div className="space-y-3">
                                    {categories.map((category) => {
                                        const isSelected = selectedCategories.includes(category.name);
                                        return (
                                            <label
                                                key={category.id}
                                                className="flex items-center gap-3 cursor-pointer group"
                                            >
                                                <div
                                                    className={cn(
                                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                        isSelected
                                                            ? "bg-pink border-pink"
                                                            : "border-gray-300 group-hover:border-pink"
                                                    )}
                                                    onClick={() => onCategoryChange(category.name)}
                                                >
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <span
                                                    className={cn(
                                                        "text-sm",
                                                        isSelected ? "text-navy font-medium" : "text-gray-600"
                                                    )}
                                                >
                                                    {category.name}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="font-semibold text-navy mb-4">Price Range</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>Rs. {priceRange[0]}</span>
                                        <span>Rs. {priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20000"
                                        step="500"
                                        value={priceRange[1]}
                                        onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full accent-pink h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-muted block mb-1">Min Price</label>
                                            <input
                                                type="number"
                                                value={priceRange[0]}
                                                onChange={(e) => onPriceChange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-muted block mb-1">Max Price</label>
                                            <input
                                                type="number"
                                                value={priceRange[1]}
                                                onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value) || 0])}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                            <Button onClick={onClose} className="w-full">
                                Show Results
                            </Button>
                            <button
                                onClick={onClearFilters}
                                className="w-full py-2 text-sm text-gray-500 hover:text-navy transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
