"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const categorySchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    slug: Yup.string().required("Required").matches(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
});

export default function AdminCategoriesPage() {
    const { categories, addCategory, deleteCategory } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSubmit = (values: any, { resetForm }: any) => {
        addCategory(values);
        resetForm();
        setIsFormOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this category? Products in this category will not be deleted but may lose their association.")) {
            deleteCategory(id);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-navy">Categories</h1>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-4 h-4" /> Add Category
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl">
                <table className="w-full text-left text-sm">
                    <thead className="bg-feather text-navy font-semibold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-navy">{category.name}</td>
                                <td className="p-4 text-muted font-mono text-xs">{category.slug}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-muted">No categories found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-navy mb-6">New Category</h2>
                        <Formik
                            initialValues={{ name: "", slug: "" }}
                            validationSchema={categorySchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, setFieldValue }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Category Name</label>
                                        <Field
                                            name="name"
                                            className="w-full p-2 border rounded-lg text-sm focus:ring-pink focus:border-pink outline-none"
                                            onChange={(e: any) => {
                                                setFieldValue("name", e.target.value);
                                                // Auto-generate slug
                                                setFieldValue("slug", e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                                            }}
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Slug (URL friendly)</label>
                                        <Field name="slug" className="w-full p-2 border rounded-lg text-sm bg-gray-50 font-mono" />
                                        <ErrorMessage name="slug" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                        <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                        <Button type="submit">Create</Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
}
