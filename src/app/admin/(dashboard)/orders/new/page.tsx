"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Product, CartItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Search, User, ShoppingBag } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const orderSchema = Yup.object().shape({
    customer_name: Yup.string().required("Required"),
    customer_phone: Yup.string().required("Required"),

    // Made address/city optional for pickup? No, kept required for simplicity.
    shipping_address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    delivery_date: Yup.date().required("Required"),
});

export default function AdminNewOrderPage() {
    const { products, addOrder, settings, messages } = useStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const msgId = searchParams.get("convertFromMessage");

    const [orderItems, setOrderItems] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<string>("");

    // Custom Item State
    const [customName, setCustomName] = useState("");
    const [customPrice, setCustomPrice] = useState("");
    const [customQty, setCustomQty] = useState(1);

    // Initial Form Values State
    const [initialValues, setInitialValues] = useState({
        customer_name: "",
        customer_phone: "",
        shipping_address: "",
        city: "Colombo",
        delivery_date: new Date().toISOString().split('T')[0],
        notes: ""
    });

    // Load message details if converting
    useEffect(() => {
        if (msgId && messages.length > 0) {
            const msg = messages.find(m => m.id.toString() === msgId);
            if (msg) {
                setInitialValues({
                    customer_name: msg.name,
                    customer_phone: msg.phone || "",
                    shipping_address: "",
                    city: msg.city || "Colombo",
                    delivery_date: msg.deliveryDate || new Date().toISOString().split('T')[0],
                    notes: `Converted from Custom Order.\nEmail: ${msg.email}\nTheme: ${msg.theme || 'N/A'}\nFlavor: ${msg.flavor || 'N/A'}\nWeight: ${msg.weight || 'N/A'}\nMessage: ${msg.message}`
                });
                toast.info("Pre-filled details from Custom Order request");
            }
        }
    }, [msgId, messages]);

    // Filter products
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddItem = () => {
        if (!selectedProduct) return;

        let price = selectedProduct.price;
        if (selectedVariant) {
            const variant = selectedProduct.variants?.find(v => v.name === selectedVariant);
            if (variant) price = variant.price;
        }

        const newItem: CartItem = {
            ...selectedProduct,
            cartId: `manual-${Date.now()}`,
            quantity: quantity,
            price: price,
            selectedWeight: selectedVariant || undefined,
            selectedPrice: price
        };

        setOrderItems([...orderItems, newItem]);
        setSelectedProduct(null);
        setQuantity(1);
        setSelectedVariant("");
        setSearchTerm("");
        toast.success("Item added to order");
    };

    const handleAddCustomItem = () => {
        if (!customName || !customPrice) {
            toast.error("Name and Price are required");
            return;
        }

        const newItem: CartItem = {
            id: Date.now(),
            name: customName,
            price: parseFloat(customPrice),
            description: "Custom item",
            category: "Custom",
            is_featured: false,
            quantity: customQty,
            cartId: `manual-custom-${Date.now()}`,
            image_url: "/logo.png",
            selectedWeight: "Custom",
            selectedPrice: parseFloat(customPrice)
        };

        setOrderItems([...orderItems, newItem]);
        setCustomName("");
        setCustomPrice("");
        setCustomQty(1);
        toast.success("Custom item added");
    };

    const handleRemoveItem = (cartId: string) => {
        setOrderItems(orderItems.filter(i => i.cartId !== cartId));
    };

    const calculateTotal = () => {
        return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        if (orderItems.length === 0) {
            toast.error("Please add at least one product");
            setSubmitting(false);
            return;
        }

        try {
            await addOrder({
                ...values, // customer_name, phone, etc.
                items: orderItems,
                total_amount: calculateTotal(),
                status: "Pending",
                type: "Standard", // Or "Custom" if converted? Let's keep Standard for manual orders usually, or maybe Add a type selector?
                // Actually, if it's from custom order message, maybe set type to Custom.
                // But generally admin manual orders are standard unless specified.
                date: new Date().toISOString(),
            });
            toast.success("Order created successfully");
            router.push("/admin/orders");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create order");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-navy mb-8 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-pink" /> Create New Order
            </h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Customer Details */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" /> Customer Details
                        </h2>

                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={orderSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-navy block mb-1">Name</label>
                                        <Field name="customer_name" className="w-full p-2 border rounded-lg text-sm" placeholder="John Doe" />
                                        <ErrorMessage name="customer_name" component="div" className="text-red-500 text-xs" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-navy block mb-1">Phone / WhatsApp</label>
                                        <Field name="customer_phone" className="w-full p-2 border rounded-lg text-sm" placeholder="+94 77..." />
                                        <ErrorMessage name="customer_phone" component="div" className="text-red-500 text-xs" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-navy block mb-1">Address</label>
                                        <Field as="textarea" name="shipping_address" rows={2} className="w-full p-2 border rounded-lg text-sm" />
                                        <ErrorMessage name="shipping_address" component="div" className="text-red-500 text-xs" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-navy block mb-1">City</label>
                                        {settings?.servingCities && settings.servingCities.length > 0 ? (
                                            <Field as="select" name="city" className="w-full p-2 border rounded-lg text-sm bg-white">
                                                {settings.servingCities.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </Field>
                                        ) : (
                                            <Field name="city" className="w-full p-2 border rounded-lg text-sm" />
                                        )}
                                        <ErrorMessage name="city" component="div" className="text-red-500 text-xs" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-navy block mb-1">Delivery Date</label>
                                        <Field type="date" name="delivery_date" className="w-full p-2 border rounded-lg text-sm" />
                                        <ErrorMessage name="delivery_date" component="div" className="text-red-500 text-xs" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-navy block mb-1">Notes</label>
                                        <Field as="textarea" name="notes" rows={4} className="w-full p-2 border rounded-lg text-sm" />
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex justify-between font-bold text-lg text-navy mb-4">
                                            <span>Total</span>
                                            <span>Rs. {calculateTotal().toLocaleString()}</span>
                                        </div>
                                        <Button type="submit" disabled={isSubmitting} className="w-full">
                                            Create Order
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                {/* Right: Product Selection */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Add Product Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4" /> Add Products
                        </h2>

                        <div className="flex gap-4 mb-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 p-2 border rounded-lg text-sm"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Product Results */}
                        {searchTerm && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto mb-4 p-1">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => setSelectedProduct(product)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedProduct?.id === product.id ? 'border-pink bg-pink/5 ring-1 ring-pink' : 'border-gray-100 hover:border-pink/50'}`}
                                    >
                                        <div className="w-full h-24 bg-gray-100 rounded-md mb-2 overflow-hidden">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="font-bold text-xs text-navy truncate">{product.name}</p>
                                        <p className="text-xs text-pink">Rs. {product.price}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Selected Product Controls */}
                        {selectedProduct && (
                            <div className="bg-gray-50 p-4 rounded-lg flex flex-wrap gap-4 items-end animate-in fade-in">
                                <div>
                                    <label className="text-xs font-semibold text-navy block mb-1">Product</label>
                                    <div className="font-bold text-sm bg-white px-3 py-2 rounded border border-gray-200 w-48 truncate">
                                        {selectedProduct.name}
                                    </div>
                                </div>

                                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                                    <div>
                                        <label className="text-xs font-semibold text-navy block mb-1">Variant</label>
                                        <select
                                            value={selectedVariant}
                                            onChange={(e) => setSelectedVariant(e.target.value)}
                                            className="p-2 border rounded-lg text-sm w-32 focus:outline-none focus:border-pink"
                                        >
                                            <option value="">Default</option>
                                            {selectedProduct.variants.map(v => (
                                                <option key={v.name} value={v.name}>{v.name} - {v.price}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-semibold text-navy block mb-1">Qty</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="p-2 border rounded-lg text-sm w-20 focus:outline-none focus:border-pink"
                                    />
                                </div>

                                <Button onClick={handleAddItem} size="sm">
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Add Custom Item Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Custom Item
                        </h2>
                        <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg">
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-xs font-semibold text-navy block mb-1">Item Name</label>
                                <input
                                    type="text"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    placeholder="e.g. Special Cake Request"
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-xs font-semibold text-navy block mb-1">Price (Rs)</label>
                                <input
                                    type="number"
                                    value={customPrice}
                                    onChange={(e) => setCustomPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                            </div>
                            <div className="w-20">
                                <label className="text-xs font-semibold text-navy block mb-1">Qty</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={customQty}
                                    onChange={(e) => setCustomQty(parseInt(e.target.value) || 1)}
                                    className="w-full p-2 border rounded-lg text-sm"
                                />
                            </div>
                            <Button onClick={handleAddCustomItem} size="sm" variant="outline">
                                Add Item
                            </Button>
                        </div>
                    </div>

                    {/* Order Items List */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-navy mb-4">Order Items</h2>
                        {orderItems.length > 0 ? (
                            <div className="space-y-3">
                                {orderItems.map((item) => (
                                    <div key={item.cartId} className="flex items-center justify-between p-3 bg-feather rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-md overflow-hidden border border-gray-200">
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-navy">{item.name}</p>
                                                <p className="text-xs text-muted">
                                                    {item.selectedWeight ? `${item.selectedWeight} • ` : ''}
                                                    {item.quantity} x Rs. {item.price}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-sm text-navy">
                                                Rs. {(item.price * item.quantity).toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveItem(item.cartId)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted text-sm border-2 border-dashed border-gray-100 rounded-lg">
                                No items added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
