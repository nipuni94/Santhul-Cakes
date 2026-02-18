export interface ProductVariant {
    name: string;
    price: number;
}

export interface ProductFlavor {
    name: string;
    price: number; // Extra cost
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number; // Base price
    category: string; // Primary category (kept for compatibility)
    categories?: string[]; // Multiple categories support
    variants?: ProductVariant[]; // New: Multiple sizes/prices
    flavors?: ProductFlavor[]; // New: Multiple base types
    image_url: string;
    is_featured: boolean;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    slug: string;
}

export interface Promotion {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    value: number;
    description: string;
    isActive: boolean;
}

export interface StoreSettings {
    storeName: string;
    primaryColor?: string; // e.g. #E75D86

    // Multi-location support
    locations: {
        id: string;
        name: string; // e.g. "Main Street Branch"
        address: string;
        phone: string;
        googleMapsUrl?: string;
    }[];

    // Legacy fields (maintained for backward compatibility if needed, or mapped to first location)
    address: string;
    phone: string;

    email: string;
    socialLinks: {
        facebook: string;
        instagram: string;
        whatsapp?: string;
        tiktok?: string;
    };
    footerText: string;

    // Delivery
    servingCities: string[]; // List of allowed cities for delivery

    // Bank Details
    bankDetails?: {
        bank: string;
        accountName: string;
        accountNumber: string;
        branch: string;
    };

    // Custom Order Configuration
    customOrder?: {
        flavors: string[];
    };

    // Showcase Images
    showcase?: {
        heroImage: string;
        aboutImage: string;
    };
}

export interface CartItem extends Product {
    cartId: string; // Unique ID for cart item (handles variants)
    quantity: number;
    selectedWeight?: string; // This will map to variant name
    selectedFlavor?: string; // New: Selected flavor name
    selectedPrice?: number; // Price at time of add
    message?: string;
}

export interface Order {
    id: string | number;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    shipping_address: string;
    city: string;
    items: CartItem[];
    total_amount: number;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    type: 'Standard' | 'Custom';
    date: string; // Order placed date
    delivery_date: string; // Requested completion date
    notes?: string;
}

export interface Message {
    id: number | string;
    name: string;
    email?: string;
    phone?: string;
    subject: string;
    message: string;
    date: string; // Submission date
    read: boolean;
    type: 'Contact' | 'CustomOrder';

    // Custom Order Specifics
    deliveryDate?: string;
    flavor?: string;
    weight?: string;
    theme?: string;
    city?: string;
}

export interface Review {
    id: string;
    productId: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Page {
    id: string;
    slug: string;
    title: string;
    content: string;
    lastUpdated: string;
}
