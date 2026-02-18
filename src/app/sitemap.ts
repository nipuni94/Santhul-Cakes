import { MetadataRoute } from 'next';
import { Product } from '@/types';
import { getPublicData } from '@/actions/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://santhul-cakes.netlify.app';

    // Static routes
    const routes = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/custom-order',
        '/legal/privacy',
        '/legal/terms',
        '/legal/cookie-policy',
        '/legal/faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes (Products)
    try {
        const { products } = await getPublicData();
        const productRoutes = products.map((product: Product) => ({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: new Date(), // Ideally this would be product.updated_at if available
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }));

        return [...routes, ...productRoutes];
    } catch (error) {
        console.error("Failed to generate product sitemap:", error);
        return routes;
    }
}
