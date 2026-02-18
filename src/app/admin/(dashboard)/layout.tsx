import { Sidebar } from "@/components/admin/Sidebar";
import React from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
        redirect("/admin/login");
    }

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar />
            <main className="flex-1 ml-0 lg:ml-64 p-4 pt-16 lg:p-8 lg:pt-8 overflow-y-auto no-scrollbar">
                {children}
            </main>
        </div>
    );
}
