"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { CartItem, Product } from "@/types";
import { validateCoupon } from "@/actions/store";

interface ProductWithSelections extends Product {
    selectedWeight?: string;
    selectedPrice?: number;
    selectedFlavor?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: ProductWithSelections, quantity: number) => void;
    removeItem: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;

    // Financials
    subtotal: number;
    discount: number;
    cartTotal: number;

    // Coupons
    couponCode: string | null;
    applyCoupon: (code: string) => Promise<boolean>;
    removeCoupon: () => void;

    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);

    // Load from local storage on mount (client-side only)
    useEffect(() => {
        const saved = localStorage.getItem("santhul-cart");
        if (saved) {
            try {
                const parsed: CartItem[] = JSON.parse(saved);
                const migrated = parsed.map(item => ({
                    ...item,
                    cartId: item.cartId || `legacy-${item.id}-${Date.now()}-${Math.random()}`
                }));
                setItems(migrated);
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("santhul-cart", JSON.stringify(items));
    }, [items]);

    const addItem = (product: ProductWithSelections, quantity: number) => {
        let isUpdate = false;
        const selectedWeight = product.selectedWeight;
        const selectedPrice = product.selectedPrice;
        const selectedFlavor = product.selectedFlavor;

        setItems((prev) => {
            const existing = prev.find((item) =>
                item.id === product.id &&
                item.selectedWeight === selectedWeight &&
                item.selectedFlavor === selectedFlavor
            );

            if (existing) {
                isUpdate = true;
                return prev.map((item) =>
                    item.cartId === existing.cartId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            const itemPrice = selectedPrice || product.price;
            const newItem: CartItem = {
                ...product,
                price: itemPrice,
                quantity,
                cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                selectedWeight,
                selectedFlavor,
                selectedPrice: itemPrice
            };
            return [...prev, newItem];
        });

        if (isUpdate) {
            toast.success("Updated cart quantity");
        } else {
            toast.success("Added to cart");
        }
    };

    const removeItem = (cartId: string) => {
        setItems((prev) => prev.filter((item) => item.cartId !== cartId));
        toast.info("Item removed");
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
        setCouponCode(null);
        setDiscount(0);
    };

    // Financials
    const subtotal = items.reduce((total, item) => {
        const itemPrice = item.selectedPrice || item.price;
        return total + itemPrice * item.quantity;
    }, 0);

    const cartTotal = Math.max(0, subtotal - discount);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    // Server-side coupon validation
    const applyCoupon = async (code: string): Promise<boolean> => {
        try {
            const result = await validateCoupon(code, subtotal);
            if (result.valid) {
                setCouponCode(code);
                setDiscount(result.discount);
                toast.success("Coupon applied!");
                return true;
            } else {
                toast.error("Invalid or expired coupon code");
                return false;
            }
        } catch {
            toast.error("Failed to validate coupon");
            return false;
        }
    };

    // Recalculate discount when subtotal changes (if coupon is applied)
    useEffect(() => {
        if (couponCode) {
            validateCoupon(couponCode, subtotal).then(result => {
                if (result.valid) {
                    setDiscount(result.discount);
                } else {
                    setCouponCode(null);
                    setDiscount(0);
                }
            });
        }
    }, [subtotal, couponCode]);

    const removeCoupon = () => {
        setCouponCode(null);
        setDiscount(0);
        toast.info("Coupon removed");
    };

    return (
        <CartContext.Provider value={{
            items, addItem, removeItem, updateQuantity, clearCart,
            subtotal, discount, cartTotal, cartCount,
            couponCode, applyCoupon, removeCoupon
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
