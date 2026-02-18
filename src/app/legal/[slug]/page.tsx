import React from "react";
import { getPages } from "@/lib/json-db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}



export const dynamic = "force-dynamic";

export default async function LegalPage({ params }: PageProps) {
    const pages = await getPages();
    const { slug } = await params;

    // console.log("Requested Slug:", slug);
    // console.log("Available Pages:", pages.map((p: any) => p.slug));

    const page = pages.find((p: any) => p.slug === slug);

    if (!page) {
        console.log("Page not found in DB");
        notFound();
    }

    return (
        <article className="prose prose-pink prose-headings:font-serif prose-headings:text-navy max-w-none">
            <h1 className="text-4xl font-serif text-navy mb-2">{page.title}</h1>
            <p className="text-muted text-sm mb-8 pb-8 border-b border-gray-100">
                Last Updated: {new Date(page.lastUpdated).toLocaleDateString()}
            </p>
            <div className="text-gray-600 leading-relaxed">
                <ReactMarkdown>{page.content}</ReactMarkdown>
            </div>
        </article>
    );
}
