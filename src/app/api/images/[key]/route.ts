import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> } // Standard Next.js 15+ async params
) {
    const { key } = await params;

    if (!key) {
        return new NextResponse("Missing key", { status: 400 });
    }

    try {
        const store = getStore({
            name: 'images',
            siteID: process.env.NETLIFY_SITE_ID,
            token: process.env.NETLIFY_ACCESS_TOKEN,
        });

        const blob = await store.get(key, { type: 'blob' });

        if (!blob) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // Return the blob with appropriate headers
        // Casting blob to any because Netlify Blob types might differ slightly from standard Response body types
        return new NextResponse(blob as any, {
            headers: {
                'Content-Type': blob.type || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (error) {
        console.error("Error serving image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
