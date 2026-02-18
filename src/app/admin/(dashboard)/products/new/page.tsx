"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/actions/upload";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    price: Yup.number().required("Price is required").min(0),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
});

export default function AddProductPage() {
    const router = useRouter();
    const { addProduct } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            let imageUrl = "";

            if (selectedFile) {
                try {
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    imageUrl = await uploadFile(formData);
                } catch (error) {
                    console.error("Upload failed:", error);
                    toast.warning("Image upload failed. Product saved without image.");
                }
            }

            await addProduct({
                ...values,
                price: Number(values.price),
                image_url: imageUrl,
                categories: [values.category],
            });

            router.push("/admin/products");
        } catch (error) {
            toast.error("Failed to add product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-serif text-navy mb-8">Add New Product</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <Formik
                    initialValues={{ name: "", price: "", category: "", description: "", is_featured: false }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden h-64",
                                        imagePreview ? "border-pink" : "border-gray-300 hover:border-pink hover:bg-pink/5"
                                    )}
                                >
                                    {imagePreview ? (
                                        <>
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <p className="text-white font-medium">Click to Change</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                            <p className="text-gray-500 text-sm">Click to upload image</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <Field name="name" className="w-full p-3 border rounded-lg" />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                                    <Field name="price" type="number" className="w-full p-3 border rounded-lg" />
                                    <ErrorMessage name="price" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <Field as="select" name="category" className="w-full p-3 border rounded-lg bg-white">
                                        <option value="">Select Category</option>
                                        <option value="Chocolate">Chocolate</option>
                                        <option value="Vanilla">Vanilla</option>
                                        <option value="Fruit">Fruit</option>
                                        <option value="Signature">Signature</option>
                                    </Field>
                                    <ErrorMessage name="category" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div className="flex items-center pt-8">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Field type="checkbox" name="is_featured" className="w-5 h-5 text-pink rounded border-gray-300 focus:ring-pink" />
                                        <span className="text-gray-700 font-medium">Mark as Featured</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <Field as="textarea" name="description" rows={4} className="w-full p-3 border rounded-lg" />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Product"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
