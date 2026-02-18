"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    ListOrdered,
    Tags,
    Settings,
    LogOut,
    Store,
    MessageSquare,
    Layers,
    Menu,
    X,
    Star,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAdmin } from "@/actions/store";
import { toast } from "sonner";

const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    { href: "/admin/orders", label: "Orders", icon: ListOrdered },
    { href: "/admin/promotions", label: "Promotions", icon: Tags },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/pages", label: "Pages", icon: FileText },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const handleLogout = async () => {
        await logoutAdmin();
        toast.success("Logged out successfully");
        router.push("/admin/login");
    };

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-[60] lg:hidden p-2.5 rounded-xl bg-navy text-white shadow-lg hover:bg-navy/90 transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 bottom-0 w-64 bg-navy text-white flex flex-col z-50 transition-transform duration-300 ease-in-out",
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-white/10">
                    <h1 className="font-serif text-2xl text-pink">Santhul</h1>
                    <p className="text-xs text-gray-400 tracking-widest uppercase">Admin Panel</p>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-pink text-white shadow-lg shadow-pink/20"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                                <span className="font-medium text-sm">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <Store className="w-5 h-5" />
                        <span className="font-medium text-sm">View Store</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
