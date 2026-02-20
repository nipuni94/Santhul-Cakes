"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="border border-gray-100 rounded-xl overflow-hidden bg-white"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="flex items-center justify-between w-full px-6 py-4 hover:bg-feather transition-colors text-left gap-4"
                        type="button"
                    >
                        <span className="text-sm font-semibold text-navy leading-snug">
                            {item.question}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 text-pink shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                        <div className="px-6 pb-5 text-muted text-sm leading-relaxed border-t border-gray-50 pt-3">
                            {item.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
