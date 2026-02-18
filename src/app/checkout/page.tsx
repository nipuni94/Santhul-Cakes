"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { CheckCircle, CreditCard, Download, Home, Calendar, Tag } from "lucide-react";
import Link from "next/link";

const MIN_DAYS_AHEAD = 5;
const minDate = new Date();
minDate.setDate(minDate.getDate() + MIN_DAYS_AHEAD);
const minDateString = minDate.toISOString().split('T')[0];

const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    whatsapp: Yup.string()
        .matches(/^[0-9+\s]+$/, "Invalid phone number")
        .required("WhatsApp number is mandatory"),
    address: Yup.string().required("Delivery address is required"),
    city: Yup.string().required("City is required"),
    deliveryDate: Yup.date()
        .min(minDate, `Order must be at least ${MIN_DAYS_AHEAD} days in advance`)
        .required("Delivery date is required"),
});



export default function CheckoutPage() {
    const { items, cartTotal, subtotal, discount, couponCode, applyCoupon, removeCoupon, clearCart } = useCart();
    const { addOrder, settings } = useStore();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [orderTotal, setOrderTotal] = useState(0);
    const [promoCode, setPromoCode] = useState("");

    const handleApplyCoupon = async () => {
        if (!promoCode.trim()) return;
        const success = await applyCoupon(promoCode);
        if (success) setPromoCode("");
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            await addOrder({
                customer_name: values.fullName,
                customer_phone: values.whatsapp,
                shipping_address: values.address,
                city: values.city,
                items: items,
                total_amount: cartTotal,
                status: "Pending",
                type: "Standard",
                delivery_date: values.deliveryDate,
                notes: values.notes
            });

            console.log("Order placed:", { ...values, items, total: cartTotal });
            setOrderTotal(cartTotal);
            setIsOrderPlaced(true);
            clearCart();
            toast.success("Order placed successfully!");
        } catch (error) {
            console.error("Failed to place order:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isOrderPlaced) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-feather py-20">
                <div className="max-w-lg w-full mx-4">
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-serif text-navy mb-2">Order Confirmed!</h1>
                        <p className="text-muted mb-8">Your order has been placed successfully.</p>

                        <div className="text-left bg-feather p-6 rounded-2xl mb-8">
                            <h3 className="font-serif font-bold text-navy mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-pink" /> Payment Instructions
                            </h3>
                            <p className="text-sm text-muted mb-4">
                                Please deposit <strong className="text-navy">Rs. {orderTotal.toLocaleString()}</strong> to the account below and send the receipt via WhatsApp.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted">Bank</span><span className="font-medium text-navy">{settings?.bankDetails?.bank || "Contact Store"}</span></div>
                                <div className="flex justify-between"><span className="text-muted">Account Name</span><span className="font-medium text-navy">{settings?.bankDetails?.accountName || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-muted">Account No</span><span className="font-medium text-navy">{settings?.bankDetails?.accountNumber || "-"}</span></div>
                                <div className="flex justify-between"><span className="text-muted">Branch</span><span className="font-medium text-navy">{settings?.bankDetails?.branch || "-"}</span></div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => window.print()}>
                                <Download className="w-4 h-4" /> Receipt
                            </Button>
                            <Link href="/"><Button><Home className="w-4 h-4" /> Home</Button></Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-feather">
                <div className="text-center">
                    <h1 className="text-2xl font-serif text-navy mb-2">Cart is Empty</h1>
                    <Link href="/shop"><Button>Go to Shop</Button></Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-feather pt-28 pb-16">
            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                    <h1 className="text-3xl font-serif text-navy mb-8">Checkout</h1>
                    <Formik
                        initialValues={{ fullName: "", whatsapp: "", address: "", city: "", deliveryDate: "", notes: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-5 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Full Name</label>
                                    <Field name="fullName" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all" placeholder="John Doe" />
                                    <ErrorMessage name="fullName" component="div" className="text-red-400 text-xs mt-1" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">
                                        WhatsApp Number <span className="text-pink">*</span>
                                    </label>
                                    <Field name="whatsapp" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all" placeholder="+94 77..." />
                                    <ErrorMessage name="whatsapp" component="div" className="text-red-400 text-xs mt-1" />
                                    <p className="text-[10px] text-muted mt-1">We&apos;ll contact you on WhatsApp for order confirmation.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Delivery Address</label>
                                    <Field name="address" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all" placeholder="123 Street..." />
                                    <ErrorMessage name="address" component="div" className="text-red-400 text-xs mt-1" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">City</label>
                                    {settings?.servingCities && settings.servingCities.length > 0 ? (
                                        <div className="relative">
                                            <Field
                                                as="select"
                                                name="city"
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all appearance-none bg-white"
                                            >
                                                <option value="">Select a city...</option>
                                                {settings.servingCities.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </Field>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <Field name="city" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all" placeholder="Colombo" />
                                    )}
                                    <ErrorMessage name="city" component="div" className="text-red-400 text-xs mt-1" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">
                                        Requested Delivery/Pickup Date <span className="text-pink">*</span>
                                    </label>
                                    <div className="relative">
                                        <Field
                                            name="deliveryDate"
                                            type="date"
                                            min={minDateString}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <ErrorMessage name="deliveryDate" component="div" className="text-red-400 text-xs mt-1" />
                                    <p className="text-[10px] text-muted mt-1">Orders require at least {MIN_DAYS_AHEAD} days notice.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Notes (optional)</label>
                                    <Field as="textarea" name="notes" rows={3} className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all resize-none" />
                                </div>

                                {/* Payment Method */}
                                <div className="pt-2">
                                    <h3 className="text-xs font-semibold text-navy mb-3 tracking-wide uppercase flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-pink" /> Payment Method
                                    </h3>
                                    <div className="p-4 bg-pink-light rounded-xl border border-pink/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink to-pink-dark shadow-sm shadow-pink/30" />
                                            <span className="font-semibold text-navy text-sm">Bank Deposit / Transfer</span>
                                        </div>
                                        <p className="text-[10px] text-muted mt-1 ml-7">
                                            Bank details will be shown after placing the order.
                                        </p>
                                    </div>
                                </div>

                                <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                                    {isSubmitting ? "Processing..." : `Place Order  •  Rs. ${cartTotal.toLocaleString()}`}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Order Summary */}
                <div className="h-fit sticky top-28">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-serif font-bold text-navy mb-6">Your Order</h3>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.cartId} className="flex gap-4 items-center">
                                    <div className="relative w-14 h-14 bg-feather rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                        {/* Added Image support here just in case, though original had div */}
                                        <div className="w-full h-full bg-feather" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-semibold text-sm text-navy truncate">{item.name}</h4>
                                        {item.selectedWeight && <p className="text-[10px] text-muted">{item.selectedWeight}</p>}
                                        {item.selectedFlavor && <p className="text-[10px] text-muted">{item.selectedFlavor}</p>}
                                        <p className="text-[10px] text-muted">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-semibold text-sm text-navy shrink-0">
                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-muted">
                                <span>Subtotal</span>
                                <span>Rs. {subtotal.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount ({couponCode})</span>
                                    <span>- Rs. {discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-muted">
                                <span>Delivery</span>
                                <span className="text-xs text-pink font-medium">Calculated later</span>
                            </div>

                            {/* Coupon Input */}
                            <div className="pt-2">
                                {couponCode ? (
                                    <div className="bg-green-50 text-green-700 text-xs p-2 rounded-lg flex justify-between items-center border border-green-100">
                                        <span className="font-semibold">{couponCode} applied</span>
                                        <button onClick={removeCoupon} type="button" className="text-red-500 hover:text-red-700 font-bold ml-2 text-[10px] uppercase">Remove</button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon Code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-pink uppercase"
                                        />
                                        <Button size="sm" type="button" onClick={handleApplyCoupon} variant="outline" className="h-[30px] px-3 text-xs">Apply</Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between font-bold text-lg text-navy pt-3 border-t border-gray-100 mt-2">
                                <span>Total</span>
                                <span className="text-gradient">Rs. {cartTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
