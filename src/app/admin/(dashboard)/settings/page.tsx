"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Save, Plus, Trash2, MapPin, Building, CreditCard, Cake, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/actions/upload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Schema handling nested arrays
const settingsSchema = Yup.object().shape({
    storeName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    footerText: Yup.string().required("Required"),
    locations: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Required"),
            address: Yup.string().required("Required"),
            phone: Yup.string().required("Required"),
        })
    ),
    servingCities: Yup.array().of(Yup.string().required("Required")),
    // New fields
    bankDetails: Yup.object().shape({
        bank: Yup.string().required("Bank Name Required"),
        accountName: Yup.string().required("Account Name Required"),
        accountNumber: Yup.string().required("Account Number Required"),
        branch: Yup.string().required("Branch Required"),
    }),
    customOrder: Yup.object().shape({
        flavors: Yup.array().of(Yup.string().required("Required")).min(1, "At least one flavor required"),
    }),
    showcase: Yup.object().shape({
        heroImage: Yup.string().nullable(),
        aboutImage: Yup.string().nullable(),
    }),
});

const ImageUploader = ({ fieldName, label, value, setFieldValue }: { fieldName: string, label: string, value: string, setFieldValue: (field: string, value: any) => void }) => {
    const isVideo = value?.endsWith('.webm');

    return (
        <div>
            <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wide">{label}</label>
            <div className="flex items-start gap-4">
                <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                    {value ? (
                        isVideo ? (
                            <video src={value} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                        ) : (
                            <Image src={value} alt={label} fill className="object-cover" />
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Upload Media</span>
                        <input
                            type="file"
                            accept="image/*,video/webm"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    try {
                                        const toastId = toast.loading("Uploading...");
                                        const url = await uploadFile(formData);
                                        setFieldValue(fieldName, url);
                                        toast.dismiss(toastId);
                                        toast.success("Upload successful!");
                                    } catch (error) {
                                        toast.error("Upload failed");
                                        console.error(error);
                                    }
                                }
                            }}
                        />
                    </label>
                    <p className="text-[10px] text-muted mt-2">Images: JPG, PNG, WebP. Video: WebM (Hero only, max 50MB).</p>
                    {value && (
                        <button
                            type="button"
                            onClick={() => setFieldValue(fieldName, "")}
                            className="text-xs text-red-500 hover:underline mt-1 block"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
            <ErrorMessage name={fieldName} component="div" className="text-red-500 text-xs mt-1" />
        </div>
    );
};

export default function AdminSettingsPage() {
    const { settings, updateSettings } = useStore();

    if (!settings) return <div>Loading...</div>;

    const handleSubmit = async (values: any) => {
        try {
            await updateSettings(values);
            toast.success("Settings saved successfully");
        } catch (error) {
            toast.error("Failed to save settings");
        }
    };

    return (
        <div className="p-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-navy mb-8">Store Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <Formik
                    initialValues={{
                        storeName: settings.storeName || "",
                        email: settings.email || "",
                        footerText: settings.footerText || "",
                        phone: settings.phone || "",
                        address: settings.address || "",
                        socialLinks: settings.socialLinks || { facebook: "", instagram: "", whatsapp: "", tiktok: "" },
                        locations: settings.locations && settings.locations.length > 0 ? settings.locations : [
                            { id: "1", name: "Main Branch", address: settings.address || "", phone: settings.phone || "" }
                        ],
                        servingCities: settings.servingCities || ["Colombo", "Dehiwala", "Mount Lavinia"],
                        bankDetails: settings.bankDetails || { bank: "", accountName: "", accountNumber: "", branch: "" },
                        customOrder: settings.customOrder || { flavors: ["Vanilla", "Chocolate"] },
                        showcase: settings.showcase || { heroImage: "", aboutImage: "" },
                    }}
                    validationSchema={settingsSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ values, isSubmitting, setFieldValue }) => (
                        <Form className="space-y-12">
                            {/* General Info */}
                            <section>
                                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <Building className="w-5 h-5 text-pink" /> General Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6 p-4 rounded-xl">
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wide">Store Name</label>
                                        <Field name="storeName" className="w-full p-3 border rounded-xl text-sm focus:ring-pink focus:border-pink outline-none" />
                                        <ErrorMessage name="storeName" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wide">Footer Text</label>
                                        <Field name="footerText" className="w-full p-3 border rounded-xl text-sm focus:ring-pink focus:border-pink outline-none" />
                                        <ErrorMessage name="footerText" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wide">Primary Email</label>
                                        <Field name="email" className="w-full p-3 border rounded-xl text-sm focus:ring-pink focus:border-pink outline-none" />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                            </section>

                            {/* Showcase Images */}
                            <section>
                                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <ImageIcon className="w-5 h-5 text-pink" /> Showcase Images
                                </h3>
                                <div className="grid md:grid-cols-2 gap-8 p-4">
                                    <ImageUploader
                                        fieldName="showcase.heroImage"
                                        label="Home Page Hero Image"
                                        value={values.showcase?.heroImage}
                                        setFieldValue={setFieldValue}
                                    />
                                    <ImageUploader
                                        fieldName="showcase.aboutImage"
                                        label="About Us Page Image"
                                        value={values.showcase?.aboutImage}
                                        setFieldValue={setFieldValue}
                                    />
                                </div>
                            </section>

                            {/* Bank Details */}
                            <section>
                                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <CreditCard className="w-5 h-5 text-pink" /> Bank Details
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Bank Name</label>
                                        <Field name="bankDetails.bank" placeholder="e.g. Commercial Bank" className="w-full p-3 border rounded-xl text-sm" />
                                        <ErrorMessage name="bankDetails.bank" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Branch</label>
                                        <Field name="bankDetails.branch" placeholder="e.g. Colombo 07" className="w-full p-3 border rounded-xl text-sm" />
                                        <ErrorMessage name="bankDetails.branch" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Account Name</label>
                                        <Field name="bankDetails.accountName" placeholder="e.g. Santhul Cake House" className="w-full p-3 border rounded-xl text-sm" />
                                        <ErrorMessage name="bankDetails.accountName" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1">Account Number</label>
                                        <Field name="bankDetails.accountNumber" placeholder="e.g. 8008123456" className="w-full p-3 border rounded-xl text-sm" />
                                        <ErrorMessage name="bankDetails.accountNumber" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                </div>
                            </section>

                            {/* Custom Order Flavors */}
                            <section>
                                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <Cake className="w-5 h-5 text-pink" /> Custom Order Flavors
                                </h3>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <FieldArray name="customOrder.flavors">
                                        {({ push, remove }) => (
                                            <div>
                                                <div className="flex flex-wrap gap-3 mb-4">
                                                    {values.customOrder?.flavors.map((flavor: string, index: number) => (
                                                        <div key={index} className="flex items-center bg-white border border-gray-200 rounded-lg pl-3 pr-2 py-1.5 shadow-sm">
                                                            <Field name={`customOrder.flavors.${index}`} className="bg-transparent border-none focus:ring-0 text-sm w-32 outline-none" />
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => push("New Flavor")}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" /> Add Flavor
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>
                            </section>

                            {/* Locations */}
                            <section>
                                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <MapPin className="w-5 h-5 text-pink" /> Store Locations
                                </h3>
                                <FieldArray name="locations">
                                    {({ push, remove }) => (
                                        <div className="space-y-4">
                                            {values.locations.map((loc: any, index: number) => (
                                                <div key={index} className="bg-feather p-5 rounded-xl relative group">
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-navy mb-1">Branch Name</label>
                                                            <Field name={`locations.${index}.name`} placeholder="Main Branch" className="w-full p-2 border rounded-lg text-sm" />
                                                            <ErrorMessage name={`locations.${index}.name`} component="div" className="text-red-500 text-xs" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-semibold text-navy mb-1">Address</label>
                                                            <Field name={`locations.${index}.address`} placeholder="123 Street..." className="w-full p-2 border rounded-lg text-sm" />
                                                            <ErrorMessage name={`locations.${index}.address`} component="div" className="text-red-500 text-xs" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-semibold text-navy mb-1">Phone</label>
                                                            <Field name={`locations.${index}.phone`} placeholder="+94..." className="w-full p-2 border rounded-lg text-sm" />
                                                            <ErrorMessage name={`locations.${index}.phone`} component="div" className="text-red-500 text-xs" />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                                                        title="Remove Location"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => push({ id: Date.now().toString(), name: "", address: "", phone: "" })}
                                                className="mt-2"
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Add Location
                                            </Button>
                                        </div>
                                    )}
                                </FieldArray>
                            </section>

                            {/* Delivery Cities */}
                            <section>
                                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    🚚 Delivery Areas
                                </h3>
                                <p className="text-xs text-muted mb-3">Customers can only select these cities during checkout.</p>
                                <FieldArray name="servingCities">
                                    {({ push, remove }) => (
                                        <div className="flex flex-wrap gap-2 item-center">
                                            {values.servingCities.map((city: string, index: number) => (
                                                <div key={index} className="flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1">
                                                    <Field name={`servingCities.${index}`} className="bg-transparent border-none focus:ring-0 text-sm max-w-[120px] outline-none" />
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="ml-1 p-1 rounded-full hover:bg-gray-200 text-gray-500"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => push("New City")}
                                                className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-gray-300 hover:border-pink hover:text-pink transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </section>

                            {/* Social Links */}
                            <section>
                                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    Social Media Links
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6 bg-feather p-6 rounded-2xl">
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wide">Facebook URL</label>
                                        <Field name="socialLinks.facebook" className="w-full p-3 border rounded-xl text-sm focus:ring-pink focus:border-pink outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wide">Instagram URL</label>
                                        <Field name="socialLinks.instagram" className="w-full p-3 border rounded-xl text-sm focus:ring-pink focus:border-pink outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wide">WhatsApp URL</label>
                                        <Field name="socialLinks.whatsapp" className="w-full p-3 border rounded-xl text-sm focus:ring-pink focus:border-pink outline-none" placeholder="https://wa.me/..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wide">TikTok URL</label>
                                        <Field name="socialLinks.tiktok" className="w-full p-3 border rounded-xl text-sm focus:ring-pink focus:border-pink outline-none" />
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end pt-6 sticky bottom-6 z-10">
                                <Button type="submit" size="lg" disabled={isSubmitting} className="shadow-lg shadow-pink/30">
                                    <Save className="w-4 h-4 mr-2" /> Save Settings
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
