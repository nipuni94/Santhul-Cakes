"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Plus, Trash2, Tag } from "lucide-react";

// Types derived from context
import { Promotion } from "@/types";

const promotionSchema = Yup.object().shape({
    code: Yup.string().required("Required").uppercase(),
    value: Yup.number().positive("Must be positive").required("Required"),
    description: Yup.string().required("Required"),
});

export default function AdminPromotionsPage() {
    const { promotions, addPromotion, deletePromotion } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Initial dummy data for demo if empty? Handled by context init ideally, 
    // but context init was empty. Let's rely on user adding.

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-navy">Promotions</h1>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-4 h-4" /> Add Promotion
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo) => (
                    <div key={promo.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-pink/10 text-pink font-mono font-bold px-3 py-1 rounded-md tracking-wider">
                                {promo.code}
                            </span>
                            <button
                                onClick={() => deletePromotion(promo.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-navy font-bold text-lg mb-1">
                            {promo.discountType === 'percentage' ? `${promo.value}% OFF` : `Rs. ${promo.value} OFF`}
                        </h3>
                        <p className="text-sm text-muted">{promo.description}</p>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs text-green-600 font-semibold">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Active
                        </div>
                    </div>
                ))}

                {promotions.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
                        <Tag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-muted">No active promotions. Create one to boost sales!</p>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-navy mb-6">New Promotion</h2>
                        <Formik
                            initialValues={{ code: "", value: "", description: "", discountType: "percentage" }}
                            validationSchema={promotionSchema}
                            onSubmit={(values: any, { resetForm }) => {
                                addPromotion({ ...values, isActive: true });
                                resetForm();
                                setIsFormOpen(false);
                            }}
                        >
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-navy mb-1">Promo Code</label>
                                    <Field name="code" className="w-full p-2 border rounded-lg text-sm focus:ring-pink focus:border-pink outline-none uppercase" placeholder="SUMMER25" />
                                    <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Type</label>
                                        <Field as="select" name="discountType" className="w-full p-2 border rounded-lg text-sm focus:ring-pink focus:border-pink outline-none">
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (Rs)</option>
                                        </Field>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Value</label>
                                        <Field type="number" name="value" className="w-full p-2 border rounded-lg text-sm focus:ring-pink focus:border-pink outline-none" />
                                        <ErrorMessage name="value" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-navy mb-1">Description</label>
                                    <Field name="description" className="w-full p-2 border rounded-lg text-sm focus:ring-pink focus:border-pink outline-none" placeholder="Summer sale discount..." />
                                    <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                    <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                    <Button type="submit">Create Promo</Button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
}
