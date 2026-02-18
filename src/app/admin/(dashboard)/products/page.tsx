"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Image as ImageIcon, Star, StarOff, X, Copy } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/actions/upload";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const productSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    price: Yup.number().positive("Must be positive").required("Required"),
    description: Yup.string().required("Required"),
    categories: Yup.array().of(Yup.string()).min(1, "Select at least one category"),
    variants: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Required"),
            price: Yup.number().positive("Must be positive").required("Required"),
        })
    ),
    flavors: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Required"),
            price: Yup.number().min(0, "Must be positive").required("Required"),
        })
    ),
});

export default function AdminProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSubmit = (values: any, { resetForm }: any) => {
        const primaryCategory = values.categories[0];
        const productData = {
            ...values,
            category: primaryCategory,
            image_url: values.image_url,
            is_featured: values.is_featured,
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }
        resetForm();
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this product?")) {
            deleteProduct(id);
        }
    };

    const toggleFeatured = (product: Product) => {
        updateProduct(product.id, { is_featured: !product.is_featured });
    };

    const handleDuplicate = (product: Product) => {
        const { id, ...data } = product;
        addProduct({
            ...data,
            name: `${data.name} (Copy)`,
            image_url: data.image_url || "", // Ensure it's not undefined
        });
        toast.success("Product duplicated");
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-navy">Products</h1>
                <Button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}>
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-feather text-navy font-semibold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Categories</th>
                            <th className="p-4">Price / Variants</th>
                            <th className="p-4 text-center">Featured</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg relative overflow-hidden">
                                        {product.image_url ? (
                                            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-navy">{product.name}</td>
                                <td className="p-4 text-muted">
                                    <div className="flex flex-wrap gap-1">
                                        {(product.categories || [product.category]).map(c => (
                                            <span key={c} className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{c}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 font-medium">
                                    {product.variants && product.variants.length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted">Base: Rs. {product.price.toLocaleString()}</span>
                                            {product.variants.map((v, i) => (
                                                <span key={i} className="text-xs text-navy bg-pink/10 px-1.5 py-0.5 rounded w-fit">
                                                    {v.name}: Rs.{v.price}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span>Rs. {product.price.toLocaleString()}</span>
                                    )}
                                    {product.flavors && product.flavors.length > 0 && (
                                        <div className="flex flex-col gap-1 mt-1 border-t border-gray-100 pt-1">
                                            <span className="text-[10px] text-muted">Flavors:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {product.flavors.map((f, i) => (
                                                    <span key={i} className="text-[10px] bg-purple-50 text-purple-700 px-1 rounded">
                                                        {f.name} (+{f.price})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => toggleFeatured(product)}
                                        className={cn("p-1.5 rounded-full transition-colors", product.is_featured ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100" : "text-gray-300 hover:text-gray-400")}
                                        title="Toggle Featured"
                                    >
                                        {product.is_featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                                    </button>
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDuplicate(product)} className="text-purple-500 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors" title="Duplicate">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted">No products found. Add your first one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold text-navy mb-6">{editingProduct ? "Edit Product" : "New Product"}</h2>

                        <Formik
                            initialValues={{
                                name: editingProduct?.name || "",
                                price: editingProduct?.price || "",
                                description: editingProduct?.description || "",
                                categories: editingProduct?.categories || (editingProduct?.category ? [editingProduct.category] : []),
                                variants: editingProduct?.variants || [],
                                flavors: editingProduct?.flavors || [],
                                is_featured: editingProduct?.is_featured || false,
                                image_url: editingProduct?.image_url || "",
                            }}
                            validationSchema={productSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Product Name</label>
                                        <Field name="name" className="w-full p-2 border rounded-lg text-sm focus:ring-pink focus:border-pink outline-none" placeholder="e.g. Chocolate Dream Cake" />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Product Image</label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                {values.image_url ? (
                                                    <Image src={values.image_url} alt="Preview" fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-300">
                                                        <ImageIcon className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const formData = new FormData();
                                                                formData.append('file', file);
                                                                try {
                                                                    const toastId = toast.loading("Uploading...");
                                                                    const url = await uploadFile(formData);
                                                                    setFieldValue('image_url', url);
                                                                    toast.dismiss(toastId);
                                                                    toast.success("Image uploaded!");
                                                                } catch (error) {
                                                                    toast.error("Upload failed");
                                                                    console.error(error);
                                                                }
                                                            }
                                                        }}
                                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink hover:file:bg-pink-100"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-muted mt-1">Leave empty to keep existing image (if editing).</p>
                                                <Field name="image_url" type="hidden" />
                                                <ErrorMessage name="image_url" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Base Price (Rs)</label>
                                        <Field type="number" name="price" className="w-full p-2 border rounded-lg text-sm focus:ring-pink focus:border-pink outline-none" />
                                        <ErrorMessage name="price" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Categories (Select Multiple)</label>
                                        <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                                            {categories.map(c => (
                                                <label key={c.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        name="categories"
                                                        value={c.name}
                                                        checked={values.categories.includes(c.name)}
                                                        onChange={e => {
                                                            if (e.target.checked) {
                                                                setFieldValue("categories", [...values.categories, c.name]);
                                                            } else {
                                                                setFieldValue("categories", values.categories.filter((cat: string) => cat !== c.name));
                                                            }
                                                        }}
                                                        className="rounded text-pink focus:ring-pink"
                                                    />
                                                    <span className="text-sm text-navy">{c.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <ErrorMessage name="categories" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Variants (Sizes/Weights)</label>
                                        <FieldArray name="variants">
                                            {({ push, remove }) => (
                                                <div className="space-y-2">
                                                    {values.variants.map((variant: any, index: number) => (
                                                        <div key={index} className="flex gap-2 items-start">
                                                            <div className="flex-1">
                                                                <Field name={`variants.${index}.name`} placeholder="Size (e.g. 1kg)" className="w-full p-2 border rounded-lg text-sm text-xs" />
                                                                <ErrorMessage name={`variants.${index}.name`} component="div" className="text-red-500 text-[10px]" />
                                                            </div>
                                                            <div className="w-24">
                                                                <Field name={`variants.${index}.price`} placeholder="Extra (+)" type="number" className="w-full p-2 border rounded-lg text-sm text-xs" />
                                                                <ErrorMessage name={`variants.${index}.price`} component="div" className="text-red-500 text-[10px]" />
                                                            </div>
                                                            <button type="button" onClick={() => remove(index)} className="p-2 text-red-400 hover:text-red-600">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <Button type="button" variant="outline" size="sm" onClick={() => push({ name: "", price: "" })} className="w-full text-xs">
                                                        <Plus className="w-3 h-3 mr-1" /> Add Variant
                                                    </Button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Flavors (Base Types)</label>
                                        <FieldArray name="flavors">
                                            {({ push, remove }) => (
                                                <div className="space-y-2">
                                                    {values.flavors.map((flavor: any, index: number) => (
                                                        <div key={index} className="flex gap-2 items-start">
                                                            <div className="flex-1">
                                                                <Field name={`flavors.${index}.name`} placeholder="Flavor (e.g. Chocolate)" className="w-full p-2 border rounded-lg text-sm text-xs" />
                                                                <ErrorMessage name={`flavors.${index}.name`} component="div" className="text-red-500 text-[10px]" />
                                                            </div>
                                                            <div className="w-24">
                                                                <Field name={`flavors.${index}.price`} placeholder="Extra Price" type="number" className="w-full p-2 border rounded-lg text-sm text-xs" />
                                                                <ErrorMessage name={`flavors.${index}.price`} component="div" className="text-red-500 text-[10px]" />
                                                            </div>
                                                            <button type="button" onClick={() => remove(index)} className="p-2 text-red-400 hover:text-red-600">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <Button type="button" variant="outline" size="sm" onClick={() => push({ name: "", price: 0 })} className="w-full text-xs">
                                                        <Plus className="w-3 h-3 mr-1" /> Add Flavor
                                                    </Button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Description</label>
                                        <Field as="textarea" name="description" rows={3} className="w-full p-2 border rounded-lg text-sm focus:ring-pink focus:border-pink outline-none resize-none" />
                                        <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Field type="checkbox" name="is_featured" className="w-4 h-4 text-pink rounded border-gray-300 focus:ring-pink" />
                                        <label className="text-sm text-navy font-medium">Feature this product on Home page</label>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                        <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={isSubmitting}>{editingProduct ? "Save Changes" : "Create Product"}</Button>
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
