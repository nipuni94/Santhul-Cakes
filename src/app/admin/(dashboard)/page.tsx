"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { ShoppingBag, Users, DollarSign, TrendingUp, Package, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const { orders, products } = useStore();

    const totalRevenue = orders
        .filter((o) => o.status !== "Cancelled")
        .reduce((acc, curr) => acc + curr.total_amount, 0);

    const pendingOrders = orders.filter((o) => o.status === "Pending").length;
    const completedOrders = orders.filter((o) => o.status === "Completed").length;

    const stats = [
        {
            label: "Total Revenue",
            value: `Rs. ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-green-100 text-green-600",
        },
        {
            label: "Pending Orders",
            value: pendingOrders,
            icon: Clock,
            color: "bg-amber-100 text-amber-600",
        },
        {
            label: "Completed Orders",
            value: completedOrders,
            icon: Package,
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Total Products",
            value: products.length,
            icon: ShoppingBag,
            color: "bg-pink-100 text-pink",
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-navy mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4"
                        >
                            <div className={cn("p-3 rounded-full", stat.color)}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-navy">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-navy mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                            <div key={order.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-50">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-navy">{order.customer_name}</span>
                                    <span className="text-xs text-muted">{order.items.length} items • {order.status}</span>
                                </div>
                                <span className="text-sm font-semibold text-navy">Rs. {order.total_amount.toLocaleString()}</span>
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <p className="text-sm text-center text-gray-400 py-4">No recent orders.</p>
                        )}
                    </div>
                </div>

                {/* Low Stock / Featured / Other Widget */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-navy mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/products" className="p-4 rounded-xl bg-pink/5 text-pink font-medium hover:bg-pink hover:text-white transition-all text-sm flex flex-col items-center gap-2">
                            <ShoppingBag className="w-6 h-6" /> Add Product
                        </Link>
                        <Link href="/admin/promotions" className="p-4 rounded-xl bg-navy/5 text-navy font-medium hover:bg-navy hover:text-white transition-all text-sm flex flex-col items-center gap-2">
                            <TrendingUp className="w-6 h-6" /> Create Promo
                        </Link>
                        <Link href="/admin/orders/new" className="p-4 rounded-xl bg-green-50 text-green-600 font-medium hover:bg-green-600 hover:text-white transition-all text-sm flex flex-col items-center gap-2 col-span-2">
                            <Package className="w-6 h-6" /> Create New Order
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
