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
    // Only authenticated admins can upload
    await ensureAdmin();

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

    // Upload to Netlify Blobs
    const store = getStore({
        name: 'images',
        // On Netlify, authentication is handled automatically.
        // We only provide explicit credentials if they are set (e.g. local dev).
        ...(process.env.NETLIFY_ACCESS_TOKEN && {
            siteID: process.env.NETLIFY_SITE_ID,
            token: process.env.NETLIFY_ACCESS_TOKEN,
        })
    });

    const arrayBuffer = await file.arrayBuffer();
    // Use original name but ensuring randomness to avoid overwrites if strict
    // But we are using a smart key strategy here
    const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    await store.set(key, arrayBuffer);

    // IMPORTANT: For this to work, we need to ensure the blob store is public
    // effectively, or we proxy it. 
    // For now, on Netlify, standard access pattern for site-scoped blobs:
    // https://<site_url>/.netlify/blobs/<store_name>/<key>

    // We'll use a relative URL which works if deployed correctly
    return `/.netlify/blobs/images/${key}`;
}
