"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Button } from "./ui/Button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
    const { items, removeItem, updateQuantity, cartTotal, subtotal, discount, couponCode, applyCoupon, removeCoupon } = useCart();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [promoCode, setPromoCode] = useState("");

    const handleApplyCoupon = async () => {
        if (!promoCode.trim()) return;
        const success = await applyCoupon(promoCode);
        if (success) setPromoCode("");
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden"; // Prevent scrolling
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        ref={sidebarRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col border-l border-pink/10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-feather/50">
                            <h2 className="font-serif text-xl text-navy flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-pink" />
                                Your Cart <span className="text-sm font-sans text-muted font-normal">({items.length})</span>
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-navy"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                                    <div className="w-20 h-20 bg-pink/10 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-pink" />
                                    </div>
                                    <p className="text-navy font-medium">Your cart is empty</p>
                                    <Button variant="outline" onClick={onClose}>Start Shopping</Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.cartId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-4 p-3 rounded-2xl hover:bg-feather transition-colors group"
                                    >
                                        <div className="relative w-20 h-20 bg-white border border-gray-100 rounded-xl overflow-hidden shrink-0">
                                            {item.image_url ? (
                                                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full shimmer" />
                                            )}
                                        </div>

                                        <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h3 className="font-serif font-bold text-navy text-sm leading-tight truncate pr-2">{item.name}</h3>
                                                        {item.selectedWeight && <p className="text-xs text-muted mt-0.5">{item.selectedWeight}</p>}
                                                        {item.selectedFlavor && <p className="text-xs text-muted mt-0.5">{item.selectedFlavor}</p>}
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.cartId)}
                                                        className="text-gray-300 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-pink text-xs font-semibold mt-1">Rs. {(item.selectedPrice || item.price).toLocaleString()}</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full h-7 w-fit px-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                                                        className="w-6 h-full flex items-center justify-center hover:text-pink transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-4 text-center text-xs font-bold text-navy">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                        className="w-6 h-full flex items-center justify-center hover:text-pink transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="text-xs font-medium text-gray-500 ml-auto">
                                                    Total: <span className="text-navy">Rs. {((item.selectedPrice || item.price) * item.quantity).toLocaleString()}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-white border-t border-gray-100 space-y-4">
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted">Subtotal</span>
                                        <span className="font-medium text-navy">Rs. {subtotal.toLocaleString()}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-sm text-green-600">
                                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount ({couponCode})</span>
                                            <span>- Rs. {discount.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {/* Coupon Input */}
                                    <div>
                                        {couponCode ? (
                                            <div className="bg-green-50 text-green-700 text-xs p-2 rounded-lg flex justify-between items-center border border-green-100">
                                                <span className="font-semibold">{couponCode} applied</span>
                                                <button onClick={removeCoupon} className="text-red-500 hover:text-red-700 font-bold ml-2 text-[10px] uppercase">Remove</button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Coupon Code"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-pink uppercase"
                                                />
                                                <Button size="sm" onClick={handleApplyCoupon} variant="outline" className="h-[30px] px-3 text-xs">Apply</Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                                        <span className="text-sm text-muted font-medium">Total</span>
                                        <span className="text-xl font-serif font-bold text-navy">Rs. {cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Link href="/checkout" onClick={onClose} className="block">
                                    <Button size="md" className="w-full shadow-lg shadow-pink/20">
                                        Checkout Securely <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <div className="text-center">
                                    <button onClick={onClose} className="text-xs text-muted hover:text-navy transition-colors">
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
