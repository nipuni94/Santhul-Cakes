"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Mail, Phone, Calendar, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";

export default function AdminMessagesPage() {
    const { messages, deleteMessage, markMessageRead, refreshStore } = useStore();
    const [selectedMessage, setSelectedMessage] = useState<number | string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Refresh on mount to get latest messages
    useEffect(() => {
        refreshStore();
    }, []);

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by date desc
    const sortedMessages = [...filteredMessages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const activeMessage = messages.find(m => m.id === selectedMessage);

    const handleSelectMessage = async (id: number | string) => {
        setSelectedMessage(id);
        const msg = messages.find(m => m.id === id);
        if (msg && !msg.read) {
            await markMessageRead(id);
        }
    };

    const handleDelete = async (id: number | string) => {
        if (confirm("Are you sure you want to delete this message?")) {
            await deleteMessage(id);
            if (selectedMessage === id) {
                setSelectedMessage(null);
            }
            toast.success("Message deleted");
        }
    };

    return (
        <div className="flex h-screen -m-8">
            {/* List */}
            <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-navy mb-4">Messages ({messages.filter(m => !m.read).length} new)</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink/50"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sortedMessages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => handleSelectMessage(msg.id)}
                            className={cn(
                                "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative group",
                                selectedMessage === msg.id ? "bg-pink/5 border-l-4 border-l-pink" : "border-l-4 border-l-transparent",
                                !msg.read && "bg-blue-50/50"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={cn("text-sm text-navy truncate pr-2", !msg.read ? "font-bold" : "font-medium")}>{msg.name}</h4>
                                <span className="text-xs text-muted whitespace-nowrap">{new Date(msg.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs font-semibold text-gray-700 truncate mb-1">{msg.subject}</p>
                            <p className="text-xs text-gray-500 truncate line-clamp-2">{msg.message}</p>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {sortedMessages.length === 0 && (
                        <div className="p-8 text-center text-muted text-sm">No messages found.</div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-gray-50 flex flex-col">
                {activeMessage ? (
                    <div className="h-full flex flex-col">
                        <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-navy mb-2">{activeMessage.subject}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    {activeMessage.email && (
                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {activeMessage.email}</span>
                                    )}
                                    {activeMessage.phone && (
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {activeMessage.phone}</span>
                                    )}
                                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                                        {activeMessage.type}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {activeMessage.type === 'CustomOrder' && (
                                    <Link href={`/admin/orders/new?convertFromMessage=${activeMessage.id}`}>
                                        <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors mr-2">
                                            Convert to Order
                                        </button>
                                    </Link>
                                )}
                                <span className="text-xs text-muted bg-gray-100 px-2 py-1 rounded">{new Date(activeMessage.date).toLocaleString()}</span>
                                <button
                                    onClick={() => handleDelete(activeMessage.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Message"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 flex-1 overflow-y-auto">
                            <p className="text-navy leading-relaxed whitespace-pre-wrap">
                                {activeMessage.message}
                            </p>
                        </div>
                        <div className="p-4 bg-white border-t border-gray-200">
                            <textarea
                                className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink/50 h-32 text-sm"
                                placeholder="Type your reply here..."
                            ></textarea>
                            <div className="flex justify-end mt-4">
                                <button className="bg-pink text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-pink-dark transition-colors shadow-lg shadow-pink/20">
                                    Send Reply (Simulation)
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-400">Select a message to view details</p>
                    </div>
                )}
            </div>
        </div >
    );
}
