"use client";

import React, { useEffect, useState } from "react";
import { Page } from "@/types";
import { fetchPages, updatePage } from "@/actions/pages";
import { Button } from "@/components/ui/Button";
import { Loader2, Edit, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminPages() {
    const [pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const loadPages = async () => {
        try {
            const data = await fetchPages();
            setPages(data);
        } catch (err) {
            toast.error("Failed to load pages");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPages();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPage) return;

        setIsSaving(true);
        try {
            await updatePage(editingPage.id, editingPage.title, editingPage.content);
            toast.success("Page updated successfully");
            setEditingPage(null);
            loadPages();
        } catch (error) {
            toast.error("Failed to save page");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-pink" /></div>;
    }

    if (editingPage) {
        return (
            <div className="p-6 max-w-4xl">
                <Button variant="ghost" onClick={() => setEditingPage(null)} className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted hover:text-navy">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Pages
                </Button>

                <h1 className="text-2xl font-serif text-navy mb-6">Edit {editingPage.title}</h1>

                <form onSubmit={handleSave} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <label className="block text-sm font-semibold text-navy mb-2">Page Title</label>
                        <input
                            type="text"
                            value={editingPage.title}
                            onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                            className="w-full p-3 bg-feather border-none rounded-xl focus:ring-1 focus:ring-pink outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-navy mb-2">Content (Markdown supported)</label>
                        <textarea
                            value={editingPage.content}
                            onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                            rows={15}
                            className="w-full p-4 bg-feather border-none rounded-xl focus:ring-1 focus:ring-pink outline-none font-mono text-sm leading-relaxed"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setEditingPage(null)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-navy mb-8">Content Pages</h1>

            <div className="grid gap-4">
                {pages.map((page) => (
                    <div key={page.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-pink/30 transition-all">
                        <div>
                            <h3 className="font-semibold text-navy text-lg mb-1">{page.title}</h3>
                            <div className="flex items-center gap-4 text-xs text-muted">
                                <span className="bg-feather px-2 py-1 rounded-md text-navy/60 font-mono">/{page.slug}</span>
                                <span>Last updated: {new Date(page.lastUpdated).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setEditingPage(page)}
                            className="group-hover:border-pink group-hover:text-pink transition-colors"
                        >
                            <Edit className="w-4 h-4 mr-2" /> Edit Content
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
