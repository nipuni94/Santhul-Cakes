"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { CartSidebar } from "./CartSidebar";

// Reordered as requested: Home, About, Shop, Custom Orders, Contact
const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shop", href: "/shop" },
    { name: "Custom Orders", href: "/custom-order" },
    { name: "Contact", href: "/contact" },
];

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const pathname = usePathname();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Don't render the main header on admin routes
    if (pathname.startsWith("/admin")) return null;

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    isScrolled
                        ? "glass py-3 border-none shadow-none"
                        : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo - Image Only */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className={cn("relative transition-all duration-300", isScrolled ? "w-10 h-10" : "w-14 h-14")}>
                            <Image
                                src="/logo.png"
                                alt="Santhul Cake House"
                                fill
                                className="object-cover rounded-full shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all"
                            />
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "relative px-5 py-2 text-sm font-medium transition-colors rounded-full",
                                    pathname === link.href
                                        ? "text-pink bg-pink-light/80"
                                        : "text-navy/80 hover:text-navy hover:bg-white/50"
                                )}
                            >
                                {link.name}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink rounded-full mb-1.5"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2.5 rounded-full text-navy hover:bg-pink-light hover:text-pink transition-all duration-300 cursor-pointer"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-pink text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm shadow-pink/30 animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2.5 rounded-full text-navy hover:bg-pink-light transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute top-full left-0 right-0 glass shadow-xl overflow-hidden lg:hidden border-t border-gray-100"
                        >
                            <nav className="flex flex-col p-6 gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center justify-between",
                                            pathname === link.href
                                                ? "text-pink bg-pink-light"
                                                : "text-navy hover:bg-feather hover:text-pink"
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                        {pathname === link.href && <div className="w-1.5 h-1.5 bg-pink rounded-full" />}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Cart Sidebar */}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};
