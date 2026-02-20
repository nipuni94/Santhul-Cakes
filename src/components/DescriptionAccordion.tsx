"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown } from "lucide-react";

interface DescriptionAccordionProps {
    description: string;
}

export default function DescriptionAccordion({ description }: DescriptionAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [needsExpand, setNeedsExpand] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // Preprocess: convert single \n to markdown line breaks
    const processed = description.replace(/\n/g, "  \n");

    useEffect(() => {
        if (contentRef.current) {
            // If content height > ~4.5rem (3 lines), show the expand toggle
            setNeedsExpand(contentRef.current.scrollHeight > 72);
        }
    }, [description]);

    return (
        <div>
            <h3 className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                Description
                <div className="flex-1 h-px bg-gray-100" />
            </h3>
            <div className="relative">
                <div
                    ref={contentRef}
                    className={`text-muted text-sm leading-relaxed prose prose-sm prose-pink prose-headings:text-navy max-w-none transition-all duration-500 ease-in-out overflow-hidden ${!isOpen && needsExpand ? "max-h-[4.5rem]" : "max-h-[2000px]"
                        }`}
                >
                    <ReactMarkdown>{processed}</ReactMarkdown>
                </div>
                {/* Gradient fade overlay when collapsed */}
                {!isOpen && needsExpand && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-feather to-transparent pointer-events-none" />
                )}
            </div>
            {needsExpand && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="mt-2 flex items-center gap-1.5 text-pink text-xs font-semibold hover:text-pink-dark transition-colors group"
                    type="button"
                >
                    {isOpen ? "Show Less" : "Read More"}
                    <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>
            )}
        </div>
    );
}
