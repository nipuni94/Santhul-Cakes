import React from "react";
import { getPages } from "@/lib/json-db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import FAQAccordion from "@/components/FAQAccordion";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

function parseFAQContent(content: string): { question: string; answer: string }[] {
    const items: { question: string; answer: string }[] = [];
    const lines = content.split("\n");
    let currentQuestion = "";
    let currentAnswer = "";

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("Q:") || trimmed.startsWith("Q :")) {
            if (currentQuestion && currentAnswer) {
                items.push({ question: currentQuestion, answer: currentAnswer.trim() });
            }
            currentQuestion = trimmed.replace(/^Q\s*:\s*/, "");
            currentAnswer = "";
        } else if (trimmed.startsWith("A:") || trimmed.startsWith("A :")) {
            currentAnswer = trimmed.replace(/^A\s*:\s*/, "");
        } else if (currentAnswer && trimmed) {
            currentAnswer += " " + trimmed;
        }
    }

    if (currentQuestion && currentAnswer) {
        items.push({ question: currentQuestion, answer: currentAnswer.trim() });
    }

    return items;
}

export const dynamic = "force-dynamic";

export default async function LegalPage({ params }: PageProps) {
    const pages = await getPages();
    const { slug } = await params;

    const page = pages.find((p: any) => p.slug === slug);

    if (!page) {
        console.log("Page not found in DB");
        notFound();
    }

    const isFAQ = slug === "faq";
    const faqItems = isFAQ ? parseFAQContent(page.content) : [];

    return (
        <article className="prose prose-pink prose-headings:font-serif prose-headings:text-navy max-w-none">
            {/* Page Header */}
            <div className="mb-8 pb-6 border-b border-gray-100">
                <h1 className="text-3xl md:text-4xl font-serif text-navy mb-3">{page.title}</h1>
                <div className="w-16 h-1 bg-gradient-to-r from-pink to-pink-dark rounded-full mb-4"></div>
                <p className="text-muted text-sm not-prose">
                    Last Updated: {new Date(page.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
            </div>

            {/* Content */}
            {isFAQ && faqItems.length > 0 ? (
                <div className="not-prose">
                    <FAQAccordion items={faqItems} />
                </div>
            ) : (
                <div className="text-gray-600 leading-relaxed prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-navy prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-ul:space-y-1 prose-li:text-gray-600 prose-strong:text-navy prose-p:mb-4 prose-a:text-pink prose-a:no-underline hover:prose-a:underline">
                    <ReactMarkdown>{page.content}</ReactMarkdown>
                </div>
            )}
        </article>
    );
}
