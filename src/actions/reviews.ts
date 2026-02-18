"use server";

import { getDb, saveDb } from "@/lib/json-db";
import { Review } from "@/types";
import { revalidatePath } from "next/cache";
import { ensureAdmin } from "@/lib/auth";

export async function addReview(productId: number, userName: string, rating: number, comment: string) {
    const db = await getDb();
    const newReview: Review = {
        id: Date.now().toString(),
        productId,
        userName,
        rating,
        comment,
        date: new Date().toISOString(),
        status: 'pending' // Default status
    };

    db.reviews.push(newReview);
    await saveDb(db);

    // No revalidatePath needed here as it won't show up until approved
    return { success: true };
}

export async function updateReviewStatus(reviewId: string, status: 'approved' | 'rejected') {
    await ensureAdmin();
    const db = await getDb();
    const reviewIndex = db.reviews.findIndex((r: any) => r.id === reviewId);

    if (reviewIndex === -1) {
        throw new Error("Review not found");
    }

    db.reviews[reviewIndex].status = status;
    await saveDb(db);
    revalidatePath('/admin/reviews');
    revalidatePath('/shop'); // Basic revalidation
    revalidatePath(`/product/${db.reviews[reviewIndex].productId}`);
}

export async function deleteReview(reviewId: string) {
    await ensureAdmin();
    const db = await getDb();
    const reviewIndex = db.reviews.findIndex((r: any) => r.id === reviewId);

    if (reviewIndex === -1) {
        throw new Error("Review not found");
    }

    const productId = db.reviews[reviewIndex].productId;
    db.reviews.splice(reviewIndex, 1);
    await saveDb(db);
    revalidatePath('/admin/reviews');
    revalidatePath(`/product/${productId}`);
}
