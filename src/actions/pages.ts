"use server";

import { getDb, saveDb, getPages } from "@/lib/json-db";
import { ensureAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function fetchPages() {
    return await getPages();
}

export async function updatePage(id: string, title: string, content: string) {
    await ensureAdmin();
    const db = await getDb();
    const pageIndex = db.pages.findIndex((p: any) => p.id === id);

    if (pageIndex === -1) {
        throw new Error("Page not found");
    }

    db.pages[pageIndex].title = title;
    db.pages[pageIndex].content = content;
    db.pages[pageIndex].lastUpdated = new Date().toISOString();

    await saveDb(db);
    revalidatePath('/admin/pages');
    revalidatePath(`/legal/${db.pages[pageIndex].slug}`); // Assuming we'll have a dynamic route
}
