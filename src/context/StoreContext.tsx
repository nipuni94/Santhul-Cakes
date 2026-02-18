"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, Order, Category, StoreSettings, Promotion, Message } from "@/types";
import { toast } from "sonner";
import {
    createProduct,
    updateProduct as updateProductAction,
    deleteProduct as deleteProductAction,
    createCategory,
    deleteCategory as deleteCategoryAction,
    createOrder,
    updateOrderStatus as updateOrderStatusAction,
    deleteOrder as deleteOrderAction,
    updateStoreSettings as updateStoreSettingsAction,
    createPromotion as createPromotionAction,
    deletePromotion as deletePromotionAction,
    createMessage as createMessageAction,
    deleteMessage as deleteMessageAction,
    markMessageRead as markMessageReadAction,
    getPublicData,
    getAdminData
} from "@/actions/store";
import { usePathname } from "next/navigation";

interface StoreContextType {
    products: Product[];
    categories: Category[];
    orders: Order[];
    settings: StoreSettings | null;
    promotions: Promotion[];
    messages: Message[];
    isLoading: boolean;

    refreshStore: () => Promise<void>;

    // Actions
    addProduct: (product: Omit<Product, "id">) => Promise<void>;
    updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;

    addCategory: (category: Omit<Category, "id">) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    addOrder: (order: Omit<Order, "id" | "date">) => Promise<void>;
    updateOrderStatus: (id: string | number, status: Order["status"]) => Promise<void>;
    deleteOrder: (id: string | number) => Promise<void>;

    updateSettings: (settings: Partial<StoreSettings>) => Promise<void>;

    addPromotion: (promo: Omit<Promotion, "id">) => Promise<void>;
    deletePromotion: (id: string) => Promise<void>;

    sendMessage: (msg: Omit<Message, "id" | "date" | "read">) => Promise<void>;
    deleteMessage: (id: number | string) => Promise<void>;
    markMessageRead: (id: number | string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin') && !pathname?.includes('/admin/login');

    // Initial Load — public pages get public data only, admin pages get full data
    useEffect(() => {
        const init = async () => {
            try {
                if (isAdminRoute) {
                    // Admin pages: fetch full data (auth checked server-side)
                    try {
                        const data = await getAdminData();
                        setProducts(data.products || []);
                        setCategories(data.categories || []);
                        setOrders(data.orders || []);
                        setSettings(data.settings || null);
                        setPromotions(data.promotions || []);
                        setMessages(data.messages || []);
                    } catch {
                        // If admin data fails (not authenticated), fall back to public
                        const data = await getPublicData();
                        setProducts(data.products || []);
                        setCategories(data.categories || []);
                        setPromotions(data.promotions || []);
                        setSettings(data.settings || null);
                    }
                } else {
                    // Public pages: only get products, categories, active promotions, settings
                    const data = await getPublicData();
                    setProducts(data.products || []);
                    setCategories(data.categories || []);
                    setPromotions(data.promotions || []);
                    setSettings(data.settings || null);
                }
            } catch (error) {
                console.error("Failed to load store data", error);
                toast.error("Failed to load data. Please refresh.");
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, [isAdminRoute]);

    // Sync Helper (re-fetch after mutations)
    const refreshStore = async () => {
        try {
            if (isAdminRoute) {
                const data = await getAdminData();
                setProducts(data.products || []);
                setCategories(data.categories || []);
                setOrders(data.orders || []);
                setSettings(data.settings || null);
                setPromotions(data.promotions || []);
                setMessages(data.messages || []);
            } else {
                const data = await getPublicData();
                setProducts(data.products || []);
                setCategories(data.categories || []);
                setPromotions(data.promotions || []);
                setSettings(data.settings || null);
            }
        } catch {
            // Silently fail on refresh
        }
    };

    // Product Actions
    const addProduct = async (product: Omit<Product, "id">) => {
        await createProduct(product);
        await refreshStore();
        toast.success("Product added successfully");
    };

    const updateProduct = async (id: number, updates: Partial<Product>) => {
        await updateProductAction(id, updates);
        await refreshStore();
        toast.success("Product updated");
    };

    const deleteProduct = async (id: number) => {
        await deleteProductAction(id);
        await refreshStore();
        toast.success("Product deleted");
    };

    // Category Actions
    const addCategory = async (category: Omit<Category, "id">) => {
        await createCategory(category);
        await refreshStore();
        toast.success("Category created");
    };

    const deleteCategory = async (id: string) => {
        await deleteCategoryAction(id);
        await refreshStore();
        toast.success("Category deleted");
    };

    // Order Actions
    const addOrder = async (orderData: Omit<Order, "id" | "date">) => {
        await createOrder(orderData);
        await refreshStore();
    };

    const updateOrderStatus = async (id: string | number, status: Order["status"]) => {
        await updateOrderStatusAction(id, status);
        await refreshStore();
        toast.success(`Order status updated to ${status}`);
    };

    const deleteOrder = async (id: string | number) => {
        await deleteOrderAction(id);
        await refreshStore();
        toast.success("Order deleted");
    };

    // Settings
    const updateSettings = async (updates: Partial<StoreSettings>) => {
        await updateStoreSettingsAction(updates);
        await refreshStore();
        toast.success("Store settings updated");
    };

    // Promotions
    const addPromotion = async (promo: Omit<Promotion, "id">) => {
        await createPromotionAction(promo);
        await refreshStore();
        toast.success("Promotion created");
    };

    const deletePromotion = async (id: string) => {
        await deletePromotionAction(id);
        await refreshStore();
        toast.success("Promotion removed");
    };

    // Messages
    const sendMessage = async (msg: Omit<Message, "id" | "date" | "read">) => {
        await createMessageAction(msg);
        await refreshStore();
        toast.success("Message sent successfully");
    };

    const deleteMessage = async (id: number | string) => {
        await deleteMessageAction(id);
        await refreshStore();
        toast.success("Message deleted");
    };

    const markMessageRead = async (id: number | string) => {
        await markMessageReadAction(id);
        await refreshStore();
    };

    return (
        <StoreContext.Provider
            value={{
                products,
                categories,
                orders,
                settings,
                promotions,
                messages,
                isLoading,
                refreshStore,
                addProduct,
                updateProduct,
                deleteProduct,
                addCategory,
                deleteCategory,
                addOrder,
                updateOrderStatus,
                deleteOrder,
                updateSettings,
                addPromotion,
                deletePromotion,
                sendMessage,
                deleteMessage,
                markMessageRead
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within a StoreProvider");
    return context;
};
