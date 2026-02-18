import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    const { key } = await params;
    console.log(`📥 API: Request for image key: ${key}`);

    if (!key) {
        return new NextResponse("Missing key", { status: 400 });
    }

    try {
        const storeConfig = {
            name: 'images',
            ...(process.env.NETLIFY_ACCESS_TOKEN && {
                siteID: process.env.NETLIFY_SITE_ID,
                token: process.env.NETLIFY_ACCESS_TOKEN,
            })
        };

        console.log("🛠️ API: Initializing store with config keys:", Object.keys(storeConfig));
        const store = getStore(storeConfig);

        const blob = await store.get(key, { type: 'blob' });

        if (!blob) {
            console.warn(`⚠️ API: Image not found for key: ${key}`);
            return new NextResponse("Image not found", { status: 404 });
        }

        console.log(`✅ API: Found blob for key: ${key}, Type: ${blob.type}, Size: ${blob.size}`);

        return new NextResponse(blob as any, {
            headers: {
                'Content-Type': blob.type || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (error) {
        console.error("❌ API: Error serving image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
