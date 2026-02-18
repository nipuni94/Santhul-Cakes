"use client";

import React from "react";
import { ShoppingBag, Search, Package, MessageSquare, Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export const EmptyState = ({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction
}: EmptyStateProps) => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 bg-pink/5 rounded-full flex items-center justify-center mb-6">
            {icon || <Package className="w-10 h-10 text-pink/40" />}
        </div>
        <h3 className="text-lg font-serif text-navy mb-2">{title}</h3>
        <p className="text-muted text-sm max-w-sm mb-6">{description}</p>
        {actionLabel && actionHref && (
            <Link href={actionHref}>
                <Button variant="outline" size="sm">{actionLabel}</Button>
            </Link>
        )}
        {actionLabel && onAction && !actionHref && (
            <Button variant="outline" size="sm" onClick={onAction}>{actionLabel}</Button>
        )}
    </div>
);

// Pre-built empty states for common scenarios
export const EmptyCart = () => (
    <EmptyState
        icon={<ShoppingBag className="w-10 h-10 text-pink/40" />}
        title="Your cart is empty"
        description="Looks like you haven't added any cakes yet. Browse our collection and find something sweet!"
        actionLabel="Browse Shop"
        actionHref="/shop"
    />
);

export const EmptySearch = ({ onClear }: { onClear?: () => void }) => (
    <EmptyState
        icon={<Search className="w-10 h-10 text-pink/40" />}
        title="No results found"
        description="We couldn't find any products matching your search. Try different keywords or clear filters."
        actionLabel={onClear ? "Clear Filters" : undefined}
        onAction={onClear}
    />
);

export const EmptyOrders = () => (
    <EmptyState
        icon={<Package className="w-10 h-10 text-pink/40" />}
        title="No orders yet"
        description="When customers place orders, they'll appear here."
    />
);

export const EmptyMessages = () => (
    <EmptyState
        icon={<MessageSquare className="w-10 h-10 text-pink/40" />}
        title="No messages"
        description="Customer inquiries and custom order requests will show up here."
    />
);

export const EmptyProducts = () => (
    <EmptyState
        icon={<Inbox className="w-10 h-10 text-pink/40" />}
        title="No products"
        description="Your product catalog is empty. Add your first product to get started!"
        actionLabel="Add Product"
        actionHref="/admin/products/new"
    />
);
