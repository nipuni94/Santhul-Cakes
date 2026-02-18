'use server';

import { put } from '@vercel/blob';
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

    // Upload to Vercel Blob
    // 'access: public' makes it accessible via the returned URL
    const blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true // Default is true, but good to be explicit
    });

    return blob.url;
}
