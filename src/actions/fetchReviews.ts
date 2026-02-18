"use server";

import { getReviews } from "@/lib/json-db";

export async function fetchReviews() {
    const reviews = await getReviews();
    return reviews;
}
