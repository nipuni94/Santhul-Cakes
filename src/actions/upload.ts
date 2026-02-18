'use server';

import { getStore } from '@netlify/blobs';
import { extname } from 'path';
import { ensureAdmin } from '@/lib/auth';

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

export async function uploadFile(formData: FormData) {
    console.log("📂 Starting file upload...");

    // Only authenticated admins can upload
    try {
        await ensureAdmin();
        console.log("✅ Admin authenticated");
    } catch (e) {
        console.error("❌ Auth failed:", e);
        throw e;
    }

    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`);
    }

    // Extract and validate extension
    const originalExt = extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
        throw new Error(`Invalid file extension: ${originalExt}`);
    }

    try {
        // Upload to Netlify Blobs
        console.log("🔄 Initializing Netlify Blobs store...");
        const store = getStore({
            name: 'images',
            // On Netlify, authentication is handled automatically.
            // We only provide explicit credentials if they are set (e.g. local dev).
            ...(process.env.NETLIFY_ACCESS_TOKEN && {
                siteID: process.env.NETLIFY_SITE_ID,
                token: process.env.NETLIFY_ACCESS_TOKEN,
            })
        });

        console.log("🔄 Processing file buffer...");
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Use original name but ensuring randomness to avoid overwrites if strict
        // But we are using a smart key strategy here
        const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

        console.log(`⬆️ Uploading to store with key: ${key}`);
        // Cast to any to bypass potential strict type mismatch with BlobInput
        await store.set(key, buffer as any);

        console.log("✅ Upload successful");
        return `/api/images/${key}`;

    } catch (error: any) {
        console.error("❌ Netlify Blob Upload Error:", error);
        // Log environment status for debugging (don't log secrets)
        console.log("Debug Info:", {
            hasSiteID: !!process.env.NETLIFY_SITE_ID,
            hasToken: !!process.env.NETLIFY_ACCESS_TOKEN,
            blobContext: !!process.env.NETLIFY_BLOBS_CONTEXT
        });
        throw new Error(`Upload failed: ${error.message}`);
    }
}
