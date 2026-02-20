"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown } from "lucide-react";

interface DescriptionAccordionProps {
    description: string;
}

export default function DescriptionAccordion({ description }: DescriptionAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Preprocess: convert single \n to markdown line breaks
    const processed = description.replace(/\n/g, "  \n");

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-5 py-4 bg-white hover:bg-feather transition-colors text-left"
                type="button"
            >
                <span className="text-sm font-semibold text-navy">Description</span>
                <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="px-5 pb-5 pt-2 bg-white prose prose-sm prose-pink prose-headings:text-navy max-w-none text-muted leading-relaxed">
                    <ReactMarkdown>{processed}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
