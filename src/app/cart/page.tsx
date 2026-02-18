"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus, Tag } from "lucide-react";
import { EmptyCart } from "@/components/EmptyState";

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, subtotal, discount, couponCode, applyCoupon, removeCoupon } = useCart();
    const [promoCode, setPromoCode] = useState("");

    const handleApplyCoupon = async () => {
        if (!promoCode.trim()) return;
        const success = await applyCoupon(promoCode);
        if (success) setPromoCode("");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-feather pt-28 pb-16">
                <EmptyCart />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-feather pt-28 pb-16">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-serif text-navy mb-10">Your Cart</h1>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.cartId} className="flex gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm items-center">
                                <div className="relative w-20 h-20 bg-feather rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                    <img
                                        src={item.image_url || "/placeholder-cake.png"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-grow min-w-0">
                                    <h3 className="font-serif font-bold text-navy truncate">{item.name}</h3>
                                    {item.selectedWeight && <p className="text-sm text-muted">{item.selectedWeight}</p>}
                                    {item.selectedFlavor && <p className="text-sm text-muted">{item.selectedFlavor}</p>}
                                    <p className="text-pink font-semibold text-sm mt-0.5">
                                        Rs. {(item.selectedPrice || item.price).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 border border-gray-200 rounded-full overflow-hidden shrink-0">
                                    <button
                                        onClick={() => updateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-feather transition-colors"
                                    >
                                        <Minus className="w-3 h-3 text-muted" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold text-navy">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-feather transition-colors"
                                    >
                                        <Plus className="w-3 h-3 text-muted" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeItem(item.cartId)}
                                    className="p-2 text-gray-300 hover:text-red-400 transition-colors shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 sticky top-28">
                            <h3 className="text-lg font-serif font-bold text-navy mb-6">Order Summary</h3>

                            <div className="space-y-3 text-sm text-muted mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-navy font-medium">Rs. {subtotal.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 animate-in fade-in slide-in-from-top-1">
                                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount ({couponCode})</span>
                                        <span className="font-medium">- Rs. {discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-xs text-pink font-medium">Calculated at checkout</span>
                                </div>
                            </div>

                            {/* Coupon Input */}
                            <div className="mb-6 pt-4 border-t border-gray-100">
                                {couponCode ? (
                                    <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg flex justify-between items-center border border-green-100">
                                        <span className="font-semibold flex items-center gap-2">
                                            <Tag className="w-3 h-3" /> {couponCode} applied!
                                        </span>
                                        <button onClick={removeCoupon} className="text-red-500 hover:text-red-700 font-bold ml-2 text-[10px] uppercase tracking-wide hover:underline">Remove</button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon Code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink uppercase transition-colors"
                                        />
                                        <Button size="sm" onClick={handleApplyCoupon} variant="outline" className="shrink-0">Apply</Button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between font-bold text-lg text-navy">
                                <span>Total</span>
                                <span className="text-gradient">Rs. {cartTotal.toLocaleString()}</span>
                            </div>

                            <Link href="/checkout" className="block">
                                <Button className="w-full" size="lg">
                                    Checkout <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <div className="text-center mt-4">
                                <Link href="/shop" className="text-xs text-muted hover:text-pink transition-colors">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
