"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-muted flex-wrap">
                <li>
                    <Link
                        href="/"
                        className="hover:text-pink transition-colors inline-flex items-center gap-1"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        {item.href && index < items.length - 1 ? (
                            <Link
                                href={item.href}
                                className="hover:text-pink transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-navy font-medium truncate max-w-[200px]">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};
