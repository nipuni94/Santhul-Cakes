import { Pool } from 'pg';
import { Product, Order, Category, StoreSettings, Promotion } from '@/types';

// Initial Seed Data (Same as before)
const INITIAL_DATA = {
    products: [
        { id: 1, name: "Classic Chocolate Fudge", description: "Rich, decadent layers of velvety Belgian chocolate ganache.", price: 3500, category: "Chocolate", categories: ["Chocolate"], image_url: "", is_featured: true },
        { id: 2, name: "Vanilla Bean Dream", description: "Light vanilla sponge infused with Madagascar vanilla beans.", price: 3000, category: "Vanilla", categories: ["Vanilla"], image_url: "", is_featured: false },
        { id: 3, name: "Red Velvet Royale", description: "Southern-style red velvet with a cloud of cream cheese frosting.", price: 4200, category: "Signature", categories: ["Signature"], image_url: "", is_featured: true },
        { id: 4, name: "Tropical Mango Burst", description: "Fresh mango layers with passion fruit glaze and coconut cream.", price: 3800, category: "Fruit", categories: ["Fruit"], image_url: "", is_featured: false },
        { id: 5, name: "Butterscotch Bliss", description: "Silky butterscotch sponge with caramel drizzle and toffee bits.", price: 3200, category: "Signature", categories: ["Signature"], image_url: "", is_featured: false },
        { id: 6, name: "Strawberry Delight", description: "Fluffy sponge layered with fresh strawberries and Chantilly cream.", price: 3600, category: "Fruit", categories: ["Fruit"], image_url: "", is_featured: true },
    ],
    categories: [
        { id: "1", name: "Chocolate", slug: "chocolate" },
        { id: "2", name: "Vanilla", slug: "vanilla" },
        { id: "3", name: "Fruit", slug: "fruit" },
        { id: "4", name: "Signature", slug: "signature" },
        { id: "5", name: "Custom", slug: "custom" },
    ],
    orders: [],
    settings: {
        storeName: "Santhul Cake House",
        address: "123 Cake Lane, Sweet City",
        phone: "+94 77 123 4567",
        email: "hello@santhulcakes.com",
        socialLinks: {
            facebook: "https://facebook.com",
            instagram: "https://instagram.com",
        },
        footerText: "Crafting sweet memories with homemade love.",
        bankDetails: { bank: "", accountName: "", accountNumber: "", branch: "" },
        customOrder: { flavors: ["Vanilla", "Chocolate", "Coffee", "Fruit Gateau", "Black Forest"] },
        showcase: { heroImage: "", aboutImage: "" }
    },
    promotions: [],
    messages: [],
    reviews: [],
    pages: [
        { id: "1", slug: "terms", title: "Terms & Conditions", content: "Welcome to Santhul Cake House...", lastUpdated: new Date().toISOString() },
        { id: "2", slug: "privacy", title: "Privacy Policy", content: "Your privacy is important to us...", lastUpdated: new Date().toISOString() },
        { id: "3", slug: "cookie-policy", title: "Cookie Policy", content: "We use cookies to improve your experience...", lastUpdated: new Date().toISOString() },
        { id: "4", slug: "faq", title: "Frequently Asked Questions", content: "Q: do you deliver?\nA: Yes...", lastUpdated: new Date().toISOString() }
    ]
};

// --- DATABASE ACCESS ---

// Use a singleton pool to separate connection logic
let pool: Pool | undefined;

function getPool() {
    if (!pool) {
        console.log("🔌 Initializing DB Pool...");
        const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

        console.log("Debug: Connection string found: " + (connectionString ? "YES" : "NO"));
        if (process.env.NETLIFY_DATABASE_URL) console.log("Debug: Using NETLIFY_DATABASE_URL");

        if (!connectionString) {
            console.warn("⚠️ DATABASE_URL (or NETLIFY_DATABASE_URL) is not set. Using in-memory fallback (Changes will be lost).");
            // Return null to trigger fallback logic below
            return null;
        }
        pool = new Pool({
            connectionString: connectionString,
            ssl: { rejectUnauthorized: false } // Required for Neon
        });
    }
    return pool;
}

export async function getDb() {
    const dbPool = getPool();

    // Fallback if no DB connection
    if (!dbPool) {
        console.warn("⚠️ No DB Pool available. Returning INITIAL_DATA.");
        return INITIAL_DATA;
    }

    try {
        console.log("🔍 Reading from Database...");
        // Query the JSON blob where id = 1
        const { rows } = await dbPool.query('SELECT data FROM store_data WHERE id = 1 LIMIT 1');

        let data;

        if (rows.length > 0) {
            console.log("✅ Data found in DB.");
            data = rows[0].data;
        } else {
            // First time run: Initialize DB
            console.log("ℹ️ Database empty. Seeding initial data...");
            await saveDb(INITIAL_DATA);
            data = INITIAL_DATA;
        }

        // --- Data Integrity Checks (Migrations on read) ---
        let modified = false;

        // CRITICAL: Hydrate core data if missing (e.g. if DB was initialized with empty JSON '{}')
        if (!data.products) { console.log("⚠️ Missing products. Seeding..."); data.products = INITIAL_DATA.products; modified = true; }
        if (!data.categories) { console.log("⚠️ Missing categories. Seeding..."); data.categories = INITIAL_DATA.categories; modified = true; }
        if (!data.settings) { console.log("⚠️ Missing settings. Seeding..."); data.settings = INITIAL_DATA.settings; modified = true; }
        if (!data.orders) { data.orders = []; modified = true; }
        if (!data.promotions) { data.promotions = []; modified = true; }

        if (!data.messages) { data.messages = []; modified = true; }
        if (!data.reviews) { data.reviews = []; modified = true; }
        if (!data.pages) { data.pages = INITIAL_DATA.pages; modified = true; }

        // Ensure settings structure upgrades (only if settings exist)
        if (data.settings) {
            if (!data.settings.bankDetails) {
                data.settings.bankDetails = { bank: "", accountName: "", accountNumber: "", branch: "" };
                modified = true;
            }
            if (!data.settings.customOrder) {
                data.settings.customOrder = { flavors: ["Vanilla", "Chocolate", "Coffee", "Fruit Gateau", "Black Forest"] };
                modified = true;
            }
            if (!data.settings.showcase) {
                data.settings.showcase = { heroImage: "", aboutImage: "" };
                modified = true;
            }
        }

        if (modified) {
            console.log("⚙️ Migrating/Updating DB structure...");
            // Silently upgrade the DB structure in background
            saveDb(data).catch(err => console.error("❌ Auto-migration failed:", err));
        }

        return data;

    } catch (error) {
        console.error("❌ Database connection error:", error);
        return INITIAL_DATA;
    }
}

export async function saveDb(data: any) {
    const dbPool = getPool();
    if (!dbPool) {
        console.warn("⚠️ Cannot save: No DB connection.");
        return;
    }

    try {
        console.log("💾 Saving to Database...");
        const queryText = `
            INSERT INTO store_data (id, data)
            VALUES (1, $1)
            ON CONFLICT (id) 
            DO UPDATE SET data = $1
        `;
        await dbPool.query(queryText, [JSON.stringify(data)]);
        console.log("✅ Saved successfully.");
    } catch (error) {
        console.error("❌ Failed to save to database:", error);
        throw new Error("Database save failed");
    }
}

// --- HELPERS (Unchanged interface) ---

export async function getProducts() {
    const db = await getDb();
    return db.products;
}

export async function getCategories() {
    const db = await getDb();
    return db.categories;
}

export async function getOrders() {
    const db = await getDb();
    return db.orders;
}

export async function getSettings() {
    const db = await getDb();
    return db.settings;
}

export async function getPromotions() {
    const db = await getDb();
    return db.promotions;
}

export async function getMessages() {
    const db = await getDb();
    return db.messages;
}

export async function getReviews() {
    const db = await getDb();
    return db.reviews;
}

export async function getPages() {
    const db = await getDb();
    return db.pages;
}
