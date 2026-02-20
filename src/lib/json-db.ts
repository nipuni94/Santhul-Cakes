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
        customOrder: { flavors: ["Vanilla", "Chocolate", "Coffee", "Fruit Gateau", "Black Forest"], sizes: ["1 kg (Serves 6-8)", "2 kg (Serves 12-16)", "3 kg (Serves 20+)"] },
        showcase: { heroImage: "", aboutImage: "" },
        imageLibrary: []
    },
    promotions: [],
    messages: [],
    reviews: [],
    pages: [
        { id: "1", slug: "terms", title: "Terms & Conditions", content: `# Terms & Conditions\n\nWelcome to **Santhul Cake House**. By placing an order or using our website, you agree to the following terms and conditions.\n\n## 1. Orders & Payments\n\n- All orders must be placed at least **5 days** in advance for custom cakes.\n- Prices are listed in **Sri Lankan Rupees (LKR)** and are subject to change without prior notice.\n- Payment must be completed via bank transfer before order confirmation.\n- A **50% advance payment** is required for custom orders. The remaining balance is due upon delivery/pickup.\n\n## 2. Cancellations & Refunds\n\n- Orders may be cancelled up to **72 hours** before the delivery date for a full refund.\n- Cancellations made within **72 hours** of delivery will incur a **30% cancellation fee**.\n- Custom-designed cakes that have already been started are **non-refundable**.\n- Refunds will be processed within **7-10 business days** via the original payment method.\n\n## 3. Delivery\n\n- We deliver within our designated serving cities listed on the website.\n- Delivery charges may apply based on your location and will be communicated at checkout.\n- We are not responsible for delays caused by traffic, weather, or other circumstances beyond our control.\n- Customers must ensure someone is available to receive the order at the specified delivery time.\n\n## 4. Product Quality\n\n- All our cakes are freshly baked using high-quality ingredients.\n- Images on the website are for illustration purposes. The final product may vary slightly in appearance.\n- Custom cakes are made to match your design as closely as possible, but minor variations may occur due to the handmade nature of our products.\n\n## 5. Allergies & Dietary Information\n\n- Our products may contain **nuts, dairy, eggs, gluten**, and other allergens.\n- Please inform us of any allergies at the time of ordering.\n- We cannot guarantee a completely allergen-free environment.\n\n## 6. Intellectual Property\n\n- All content on this website, including images, logos, and text, is the property of Santhul Cake House.\n- Reproduction without written permission is prohibited.\n\n## 7. Changes to Terms\n\n- We reserve the right to update these terms at any time. Changes will be posted on this page with the updated date.\n\n---\n\n*If you have any questions about these terms, please contact us via our Contact page or WhatsApp.*`, lastUpdated: new Date().toISOString() },
        { id: "2", slug: "privacy", title: "Privacy Policy", content: `# Privacy Policy\n\nAt **Santhul Cake House**, your privacy is important to us. This policy explains how we collect, use, and protect your personal information.\n\n## 1. Information We Collect\n\n- **Personal Information**: Name, phone number, email address, delivery address when you place an order or contact us.\n- **Order Information**: Product selections, custom cake details, delivery preferences, and payment records.\n- **Website Usage**: We may collect anonymous analytics data to improve our website experience.\n\n## 2. How We Use Your Information\n\n- To process and deliver your orders.\n- To communicate with you about your orders via WhatsApp, phone, or email.\n- To improve our products and services based on your feedback.\n- To send promotional offers (only if you have opted in).\n\n## 3. Information Sharing\n\n- We do **not** sell, trade, or rent your personal information to third parties.\n- We may share your delivery details with our trusted delivery partners solely for the purpose of completing your order.\n\n## 4. Data Security\n\n- We implement reasonable security measures to protect your personal information.\n- However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.\n\n## 5. Cookies\n\n- Our website may use cookies to enhance your browsing experience. See our Cookie Policy for more details.\n\n## 6. Your Rights\n\n- You may request access to, correction of, or deletion of your personal data by contacting us.\n- You can opt out of promotional communications at any time.\n\n## 7. Changes to This Policy\n\n- We may update this privacy policy from time to time. Changes will be reflected on this page.\n\n---\n\n*For privacy-related inquiries, please reach out via our Contact page.*`, lastUpdated: new Date().toISOString() },
        { id: "3", slug: "cookie-policy", title: "Cookie Policy", content: `# Cookie Policy\n\n**Santhul Cake House** uses cookies and similar technologies on our website to provide a better browsing experience.\n\n## What Are Cookies?\n\nCookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve functionality.\n\n## How We Use Cookies\n\n- **Essential Cookies**: Required for the website to function properly (e.g., shopping cart, admin authentication).\n- **Analytics Cookies**: Help us understand how visitors interact with our website so we can improve it.\n- **Preference Cookies**: Remember your choices and settings for a personalized experience.\n\n## Managing Cookies\n\n- You can control cookies through your browser settings. Most browsers allow you to block or delete cookies.\n- Please note that disabling certain cookies may affect the functionality of our website.\n\n## Third-Party Cookies\n\n- We may use third-party services (such as analytics providers) that set their own cookies. These are governed by their respective privacy policies.\n\n---\n\n*If you have questions about our use of cookies, please contact us.*`, lastUpdated: new Date().toISOString() },
        { id: "4", slug: "faq", title: "Frequently Asked Questions", content: `Q: Do you deliver island-wide?\nA: We currently deliver within our designated serving cities. You can check the available delivery areas during checkout. For locations outside our delivery zones, please contact us to discuss options.\n\nQ: How far in advance should I place a custom order?\nA: Custom cake orders require a minimum of 5 days advance notice. For elaborate designs or during peak seasons (holidays, wedding season), we recommend placing orders at least 2 weeks ahead.\n\nQ: Can I specify dietary requirements for my cake?\nA: Yes! Please let us know about any dietary requirements or allergies when placing your order. We offer egg-free and can accommodate certain dietary needs. However, please note our kitchen handles common allergens including nuts, dairy, and gluten.\n\nQ: What payment methods do you accept?\nA: We accept bank transfers. A 50% advance payment is required for custom orders, with the remaining balance due upon delivery or pickup. Payment details will be shared when you place your order.\n\nQ: Can I cancel or modify my order?\nA: Orders can be cancelled up to 72 hours before the delivery date for a full refund. Modifications are subject to availability and timing. Custom cakes that have already been started cannot be cancelled. Please contact us as soon as possible if you need changes.\n\nQ: Do you provide cake tasting sessions?\nA: We occasionally offer tasting sessions for wedding cakes and large custom orders. Please contact us to schedule a tasting appointment.\n\nQ: How should I store my cake after delivery?\nA: Most of our cakes should be stored in the refrigerator and consumed within 2-3 days for the best taste and freshness. Remove from the fridge 30 minutes before serving for optimal flavor. Fondant cakes should be kept at room temperature away from direct sunlight.\n\nQ: Can I send a cake as a surprise gift?\nA: Absolutely! We love helping you surprise your loved ones. Just provide the recipient's details as the delivery address and include any special message you'd like on the cake. We will coordinate delivery discreetly.\n\nQ: Do your prices include delivery charges?\nA: Delivery charges are calculated separately based on your location and will be shown at checkout. Pickup from our store is always free!\n\nQ: Can I use a reference image for my custom cake design?\nA: Yes, we encourage sharing reference images! You can share them via WhatsApp after placing your custom order. Our team will work to match your vision as closely as possible.`, lastUpdated: new Date().toISOString() }
    ]
};

// --- DATABASE ACCESS ---

// Use a singleton pool to separate connection logic
let pool: Pool | undefined;

function getPool() {
    if (!pool) {
        console.log("🔌 Initializing DB Pool...");

        // Prioritize UNPOOLED connection for serverless/Netlify to avoid transaction mode errors
        const connectionString =
            process.env.NETLIFY_DATABASE_URL_UNPOOLED ||
            process.env.NETLIFY_DATABASE_URL ||
            process.env.DATABASE_URL;

        console.log("Debug: Connection string found: " + (connectionString ? "YES" : "NO"));

        if (process.env.NETLIFY_DATABASE_URL_UNPOOLED) console.log("Debug: Using NETLIFY_DATABASE_URL_UNPOOLED");
        else if (process.env.NETLIFY_DATABASE_URL) console.log("Debug: Using NETLIFY_DATABASE_URL");
        else if (process.env.DATABASE_URL) console.log("Debug: Using DATABASE_URL");

        if (!connectionString) {
            console.warn("⚠️ NO DATABASE URL FOUND. Using in-memory fallback (Changes will be lost).");
            console.warn("Please check Netlify Check > Environment Variables.");
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
                data.settings.customOrder = { flavors: ["Vanilla", "Chocolate", "Coffee", "Fruit Gateau", "Black Forest"], sizes: ["1 kg (Serves 6-8)", "2 kg (Serves 12-16)", "3 kg (Serves 20+)"] };
                modified = true;
            } else if (!data.settings.customOrder.sizes) {
                data.settings.customOrder.sizes = ["1 kg (Serves 6-8)", "2 kg (Serves 12-16)", "3 kg (Serves 20+)"];
                modified = true;
            }
            if (!data.settings.showcase) {
                data.settings.showcase = { heroImage: "", aboutImage: "" };
                modified = true;
            }
            if (!data.settings.imageLibrary) {
                data.settings.imageLibrary = [];
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
