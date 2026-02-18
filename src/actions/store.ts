'use server';

import { getDb, saveDb } from '@/lib/json-db';
import { Product, Order, Category, StoreSettings, Promotion, Message } from '@/types';
import { revalidatePath } from 'next/cache';
import { ensureAdmin, createAdminSession, destroyAdminSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// ============================================================
// ADMIN-PROTECTED ACTIONS (require authentication)
// ============================================================

// Products
export async function createProduct(product: Omit<Product, 'id'>) {
    await ensureAdmin();
    const db = await getDb();
    const newProduct = { ...product, id: Date.now(), created_at: new Date().toISOString() };
    db.products.push(newProduct);
    await saveDb(db);
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');
    return newProduct;
}

export async function updateProduct(id: number, updates: Partial<Product>) {
    await ensureAdmin();
    const db = await getDb();
    db.products = db.products.map((p: Product) => p.id === id ? { ...p, ...updates } : p);
    await saveDb(db);
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');
}

export async function deleteProduct(id: number) {
    await ensureAdmin();
    const db = await getDb();
    db.products = db.products.filter((p: Product) => p.id !== id);
    await saveDb(db);
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');
}

// Categories
export async function createCategory(category: Omit<Category, 'id'>) {
    await ensureAdmin();
    const db = await getDb();
    const newCategory = { ...category, id: Date.now().toString() };
    db.categories.push(newCategory);
    await saveDb(db);
    revalidatePath('/shop');
    revalidatePath('/admin/categories');
    return newCategory;
}

export async function deleteCategory(id: string) {
    await ensureAdmin();
    const db = await getDb();
    db.categories = db.categories.filter((c: Category) => c.id !== id);
    await saveDb(db);
    revalidatePath('/shop');
    revalidatePath('/admin/categories');
}

// Orders (admin management)
export async function updateOrderStatus(id: string | number, status: Order['status']) {
    await ensureAdmin();
    const db = await getDb();
    db.orders = db.orders.map((o: Order) => String(o.id) === String(id) ? { ...o, status } : o);
    await saveDb(db);
    revalidatePath('/admin/orders');
}

export async function deleteOrder(id: string | number) {
    await ensureAdmin();
    const db = await getDb();
    db.orders = db.orders.filter((o: Order) => String(o.id) !== String(id));
    await saveDb(db);
    revalidatePath('/admin/orders');
}

// Settings
export async function updateStoreSettings(updates: Partial<StoreSettings>) {
    await ensureAdmin();
    const db = await getDb();
    db.settings = { ...db.settings, ...updates };
    await saveDb(db);
    revalidatePath('/');
}

// Promotions
export async function createPromotion(promo: Omit<Promotion, 'id'>) {
    await ensureAdmin();
    const db = await getDb();
    const newPromo = { ...promo, id: Date.now().toString() };
    db.promotions.push(newPromo);
    await saveDb(db);
    revalidatePath('/admin/promotions');
    return newPromo;
}

export async function deletePromotion(id: string) {
    await ensureAdmin();
    const db = await getDb();
    db.promotions = db.promotions.filter((p: Promotion) => p.id !== id);
    await saveDb(db);
    revalidatePath('/admin/promotions');
}

// Messages (admin management)
export async function deleteMessage(id: number | string) {
    await ensureAdmin();
    const db = await getDb();
    db.messages = db.messages.filter((m: Message) => m.id !== id);
    await saveDb(db);
    revalidatePath('/admin/messages');
}

export async function markMessageRead(id: number | string) {
    await ensureAdmin();
    const db = await getDb();
    db.messages = db.messages.map((m: Message) => m.id === id ? { ...m, read: true } : m);
    await saveDb(db);
    revalidatePath('/admin/messages');
}

// Admin Data (full db including orders, messages, settings)
export async function getAdminData() {
    await ensureAdmin();
    return await getDb();
}

// ============================================================
// PUBLIC ACTIONS (no auth required)
// ============================================================

// Public Data (only products, categories, active promotions, settings)
export async function getPublicData() {
    const db = await getDb();
    return {
        products: db.products || [],
        categories: db.categories || [],
        promotions: (db.promotions || []).filter((p: Promotion) => p.isActive),
        settings: db.settings || null,
    };
}

// Validate coupon server-side (no code leak)
export async function validateCoupon(code: string, subtotal: number) {
    const db = await getDb();
    const promo = (db.promotions || []).find(
        (p: Promotion) => p.code.toLowerCase() === code.trim().toLowerCase() && p.isActive
    );
    if (!promo) return { valid: false, discount: 0 };
    const discount = promo.discountType === 'percentage'
        ? (subtotal * promo.value) / 100
        : promo.value;
    return { valid: true, discount, code: promo.code, discountType: promo.discountType, value: promo.value };
}

// Create Order (public - customers can place orders)
export async function createOrder(orderData: Omit<Order, 'id' | 'date'>) {
    const db = await getDb();
    const newOrder = {
        ...orderData,
        id: `ORD-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString()
    };
    db.orders.unshift(newOrder);
    await saveDb(db);
    revalidatePath('/admin/orders');
    return newOrder;
}

// Create Message (public - contact form & custom orders)
export async function createMessage(msg: Omit<Message, 'id' | 'date' | 'read'>) {
    const db = await getDb();
    const newMessage = {
        ...msg,
        id: Date.now(),
        date: new Date().toISOString(),
        read: false
    };
    db.messages.unshift(newMessage);
    await saveDb(db);
    revalidatePath('/admin/messages');
    return newMessage;
}

// ============================================================
// AUTH ACTIONS
// ============================================================

export async function verifyAdminPassword(password: string) {
    const HASHED_PASSWORD_ENV = process.env.ADMIN_PASSWORD_HASH;
    const PLAIN_PASSWORD_ENV = process.env.ADMIN_PASSWORD;

    if (!HASHED_PASSWORD_ENV && !PLAIN_PASSWORD_ENV) {
        console.error("CRITICAL: ADMIN_PASSWORD_HASH or ADMIN_PASSWORD environment variable is not set. Admin login is disabled.");
        return { success: false };
    }

    let isValid = false;

    if (HASHED_PASSWORD_ENV) {
        try {
            isValid = await bcrypt.compare(password, HASHED_PASSWORD_ENV);
        } catch (error) {
            console.error("Bcrypt comparison error:", error);
            isValid = false;
        }
    } else if (PLAIN_PASSWORD_ENV) {
        // Fallback to strict equality check if using plain text env var
        isValid = password === PLAIN_PASSWORD_ENV;
    }

    if (isValid) {
        await createAdminSession();
        return { success: true };
    }
    return { success: false };
}

export async function logoutAdmin() {
    await destroyAdminSession();
    revalidatePath('/admin');
}
