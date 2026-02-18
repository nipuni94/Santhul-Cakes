"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Order } from "@/types";
import { Button } from "@/components/ui/Button";
import { Eye, CheckCircle, Clock, Package, XCircle, Search, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to get status color
const getStatusColor = (status: Order["status"]) => {
    switch (status) {
        case "Pending":
            return "bg-amber-100 text-amber-700 border-amber-200";
        case "Confirmed":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "Completed":
            return "bg-green-100 text-green-700 border-green-200";
        case "Cancelled":
            return "bg-red-100 text-red-700 border-red-200";
        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
};

export default function AdminOrdersPage() {
    const { orders, updateOrderStatus, refreshStore, deleteOrder } = useStore();
    const [filter, setFilter] = useState("All");
    const [viewOrder, setViewOrder] = useState<Order | null>(null);

    useEffect(() => {
        refreshStore();
    }, []);

    const filteredOrders = filter === "All"
        ? orders
        : orders.filter((o) => o.status === filter);

    // Sort by date desc
    const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleDelete = async (id: string | number) => {
        if (confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) {
            await deleteOrder(id);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-navy">Orders</h1>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                    {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-1.5 text-xs font-semibold rounded-md transition-colors",
                                filter === f ? "bg-navy text-white shadow-sm" : "text-gray-500 hover:text-navy hover:bg-gray-50"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-feather text-navy font-semibold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Delivery</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-xs text-muted">{order.id}</td>
                                <td className="p-4">
                                    <div className="font-medium text-navy">{order.customer_name}</div>
                                    <div className="text-xs text-muted">{order.customer_phone}</div>
                                </td>
                                <td className="p-4">
                                    <span className="text-navy">{order.items.length} items</span>
                                </td>
                                <td className="p-4 text-sm text-navy">
                                    {order.delivery_date || "-"}
                                </td>
                                <td className="p-4 font-medium text-navy">Rs. {order.total_amount.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={cn("px-2 py-1 rounded-full text-xs font-semibold border", getStatusColor(order.status))}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setViewOrder(order)}
                                            className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-lg"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        {order.status === "Pending" && (
                                            <button
                                                onClick={() => updateOrderStatus(String(order.id), "Confirmed")}
                                                className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"
                                                title="Mark Confirmed"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                        {order.status === "Confirmed" && (
                                            <button
                                                onClick={() => updateOrderStatus(String(order.id), "Completed")}
                                                className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg"
                                                title="Mark Completed"
                                            >
                                                <Package className="w-4 h-4" />
                                            </button>
                                        )}
                                        {(order.status === "Pending" || order.status === "Confirmed") && (
                                            <button
                                                onClick={() => updateOrderStatus(String(order.id), "Cancelled")}
                                                className="text-orange-500 hover:bg-orange-50 p-1.5 rounded-lg"
                                                title="Cancel Order"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                                            title="Delete Order"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {sortedOrders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="w-10 h-10 text-gray-200" />
                                        <p>No orders found matching this filter.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {viewOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-navy">Order Details #{viewOrder.id}</h2>
                            <button onClick={() => setViewOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Bar */}
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-muted font-semibold uppercase">Status</p>
                                    <span className={cn("px-2 py-0.5 rounded text-xs font-bold border mt-1 inline-block", getStatusColor(viewOrder.status))}>
                                        {viewOrder.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted font-semibold uppercase">Order Date</p>
                                    <p className="text-sm font-medium text-navy">{new Date(viewOrder.date).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-navy mb-2 flex items-center gap-2">Customer</h3>
                                    <div className="text-sm space-y-1">
                                        <p><span className="text-muted">Name:</span> {viewOrder.customer_name}</p>
                                        <p><span className="text-muted">Phone:</span> {viewOrder.customer_phone}</p>
                                        <p><span className="text-muted">Email:</span> {viewOrder.customer_email || "N/A"}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy mb-2">Shipping</h3>
                                    <div className="text-sm space-y-1">
                                        <p>{viewOrder.shipping_address}</p>
                                        <p>{viewOrder.city}</p>
                                        <p className="mt-2"><span className="text-muted">Delivery Date:</span> {viewOrder.delivery_date}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="font-bold text-navy mb-3">Items</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-xs uppercase text-muted">
                                            <tr>
                                                <th className="p-3">Product</th>
                                                <th className="p-3 text-center">Qty</th>
                                                <th className="p-3 text-right">Price</th>
                                                <th className="p-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {viewOrder.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-3">
                                                        <p className="font-medium text-navy">{item.name}</p>
                                                        {item.selectedWeight && <p className="text-xs text-muted">{item.selectedWeight}</p>}
                                                        {item.selectedFlavor && <p className="text-xs text-muted">{item.selectedFlavor}</p>}
                                                        {item.message && <p className="text-xs text-pink italic">Msg: {item.message}</p>}
                                                    </td>
                                                    <td className="p-3 text-center">{item.quantity}</td>
                                                    <td className="p-3 text-right">Rs.{item.price}</td>
                                                    <td className="p-3 text-right font-medium">Rs.{(item.price * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 font-bold text-navy">
                                            <tr>
                                                <td colSpan={3} className="p-3 text-right">Total Amount</td>
                                                <td className="p-3 text-right">Rs. {viewOrder.total_amount.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Notes */}
                            {viewOrder.notes && (
                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                    <h3 className="font-bold text-amber-800 text-sm mb-1">Notes</h3>
                                    <p className="text-sm text-amber-900 whitespace-pre-wrap">{viewOrder.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                            <Button variant="outline" onClick={() => setViewOrder(null)}>Close</Button>
                            <Button onClick={() => { window.print(); }}>Print Order</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
