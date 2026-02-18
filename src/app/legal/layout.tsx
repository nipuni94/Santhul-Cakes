import React from "react";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-feather">
            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
