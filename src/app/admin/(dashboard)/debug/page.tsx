import { ensureAdmin } from "@/lib/auth";
import { getDb } from "@/lib/json-db";

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    await ensureAdmin();

    const envCheck = {
        DATABASE_URL: !!process.env.DATABASE_URL,
        NETLIFY_DATABASE_URL: !!process.env.NETLIFY_DATABASE_URL,
        NETLIFY_DATABASE_URL_UNPOOLED: !!process.env.NETLIFY_DATABASE_URL_UNPOOLED,
        NETLIFY_ACCESS_TOKEN: !!process.env.NETLIFY_ACCESS_TOKEN,
        NETLIFY_SITE_ID: !!process.env.NETLIFY_SITE_ID,
    };

    let dbStatus = "Checking...";
    let dataSummary = null;
    let errorMsg = null;

    try {
        console.log("Debug Page: Fetching DB...");
        const db = await getDb();
        dbStatus = "Connected ✅";
        dataSummary = {
            products: db.products?.length || 0,
            categories: db.categories?.length || 0,
            orders: db.orders?.length || 0,
            reviews: db.reviews?.length || 0,
            pages: db.pages?.length || 0,
            isUsingInitialData: db === (await import("@/lib/json-db")).default // loose check
        };
    } catch (e: any) {
        dbStatus = "Failed ❌";
        errorMsg = e.message;
        console.error("Debug Page Error:", e);
    }

    return (
        <div className="p-8 space-y-8 bg-white max-w-4xl mx-auto my-10 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-red-600">⚠️ System Debug Application</h1>

            <section className="space-y-2">
                <h2 className="text-xl font-semibold">1. Environment Variables</h2>
                <pre className="bg-gray-100 p-4 rounded text-sm">
                    {JSON.stringify(envCheck, null, 2)}
                </pre>
            </section>

            <section className="space-y-2">
                <h2 className="text-xl font-semibold">2. Database Connection</h2>
                <div className={`p-4 rounded border ${errorMsg ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <p className="font-bold">{dbStatus}</p>
                    {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
                </div>
            </section>

            {dataSummary && (
                <section className="space-y-2">
                    <h2 className="text-xl font-semibold">3. Data Integrity</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm">
                        {JSON.stringify(dataSummary, null, 2)}
                    </pre>
                </section>
            )}
        </div>
    );
}
