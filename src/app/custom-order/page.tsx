"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { ChevronRight, ChevronLeft, CheckCircle, Sparkles, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

const steps = ["Flavor", "Size", "Design", "Details", "Contact"];

const MIN_DAYS_AHEAD = 5;
const minDate = new Date();
minDate.setDate(minDate.getDate() + MIN_DAYS_AHEAD);
const minDateString = minDate.toISOString().split('T')[0];

const validationSchemas = [
    Yup.object({ flavor: Yup.string().required("Please select a flavor") }),
    Yup.object({ size: Yup.string().required("Please select a size") }),
    Yup.object({ theme: Yup.string().required("Please describe your theme") }),
    Yup.object({
        message: Yup.string().max(50, "Message too long"),
        deliveryDate: Yup.date()
            .min(minDate, `Date must be at least ${MIN_DAYS_AHEAD} days in advance`)
            .required("Date is required"),
    }),
    Yup.object({
        name: Yup.string().required("Name is required"),
        city: Yup.string().required("City is required"),
        whatsapp: Yup.string()
            .matches(/^[0-9+\s]+$/, "Invalid phone number")
            .required("WhatsApp number is mandatory"),
    }),
];

const initialValues = {
    flavor: "",
    size: "",
    theme: "",
    message: "",
    deliveryDate: "",
    name: "",
    whatsapp: "",
    city: "",
};

export default function CustomOrderPage() {
    const { sendMessage, settings } = useStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleNext = (validateForm: any, setTouched: any) => {
        validateForm().then((errors: any) => {
            setTouched(
                Object.keys(errors).reduce((acc: any, key: string) => ({ ...acc, [key]: true }), {})
            );
            if (Object.keys(errors).length === 0) {
                setCurrentStep((prev) => prev + 1);
            }
        });
    };

    const handlePrev = () => setCurrentStep((prev) => prev - 1);

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            await sendMessage({
                name: values.name,
                phone: values.whatsapp,
                subject: `Custom Order: ${values.theme.substring(0, 20)}...`,
                message: `Flavor: ${values.flavor}\nSize: ${values.size}\nTheme: ${values.theme}\nWording: ${values.message}\nCity: ${values.city}`,
                type: "CustomOrder",
                deliveryDate: values.deliveryDate,
                flavor: values.flavor,
                weight: values.size, // Mapping size to weight
                theme: values.theme,
                city: values.city
            });
            setIsSubmitted(true);
            // toast.success handled in context
        } catch (error) {
            console.error("Failed to submit custom order", error);
            toast.error("Failed to submit order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-feather py-20">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full mx-4 bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center"
                >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-serif text-navy mb-3">Request Received!</h2>
                    <p className="text-muted mb-6">
                        We have received your custom cake request.
                    </p>
                    <div className="bg-pink-light p-4 rounded-xl text-sm text-pink-dark mb-6">
                        We will review your design and contact you via <strong>WhatsApp</strong> shortly.
                    </div>
                    <Link href="/"><Button>Back to Home</Button></Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-feather">
            {/* Header */}
            <section className="bg-white border-b border-gray-100 pt-28 pb-12">
                <div className="container mx-auto px-6 text-center">
                    <span className="inline-flex items-center gap-2 text-pink font-semibold text-sm tracking-widest uppercase">
                        Custom Creation
                    </span>
                    <h1 className="text-4xl md:text-5xl font-script text-navy mt-3 mb-4">
                        Design Your Cake
                    </h1>
                    <div className="w-16 h-1 bg-gradient-to-r from-pink to-pink-dark mx-auto rounded-full mb-4" />
                    <p className="text-muted max-w-md mx-auto">
                        Let&apos;s create something unique together, step by step.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 py-12 max-w-2xl">
                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-10 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-pink to-pink-dark -translate-y-1/2 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                    {steps.map((step, index) => (
                        <div key={step} className="relative flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2",
                                    index < currentStep
                                        ? "bg-pink border-pink text-white shadow-md shadow-pink/20"
                                        : index === currentStep
                                            ? "bg-white border-pink text-pink shadow-md"
                                            : "bg-white border-gray-200 text-gray-400"
                                )}
                            >
                                {index < currentStep ? "✓" : index + 1}
                            </div>
                            <span className="text-[10px] text-muted mt-2 font-medium hidden sm:block">
                                {step}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchemas[currentStep]}
                    onSubmit={handleSubmit}
                >
                    {({ values, validateForm, setTouched, isSubmitting }) => (
                        <Form className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col min-h-[380px]">
                            <div className="flex-grow">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-5"
                                    >
                                        <h2 className="text-2xl font-serif text-navy mb-6">{steps[currentStep]}</h2>

                                        {currentStep === 0 && (
                                            <div className="grid grid-cols-2 gap-3">
                                                {(settings?.customOrder?.flavors || ["Vanilla", "Chocolate", "Coffee"]).map((f) => (
                                                    <label
                                                        key={f}
                                                        className={cn(
                                                            "cursor-pointer p-4 rounded-xl border-2 transition-all text-center text-sm",
                                                            values.flavor === f
                                                                ? "border-pink bg-pink-light font-bold text-pink shadow-sm"
                                                                : "border-gray-100 text-muted hover:border-pink/30 hover:bg-feather"
                                                        )}
                                                    >
                                                        <Field type="radio" name="flavor" value={f} className="hidden" />
                                                        {f}
                                                    </label>
                                                ))}
                                                <ErrorMessage name="flavor" component="div" className="text-red-400 text-xs col-span-2 text-center" />
                                            </div>
                                        )}

                                        {currentStep === 1 && (
                                            <div className="space-y-3">
                                                {(settings?.customOrder?.sizes || ["1 kg (Serves 6-8)", "2 kg (Serves 12-16)", "3 kg (Serves 20+)"]).map((s) => (
                                                    <label
                                                        key={s}
                                                        className={cn(
                                                            "cursor-pointer block p-4 rounded-xl border-2 transition-all text-sm",
                                                            values.size === s
                                                                ? "border-pink bg-pink-light font-bold text-pink shadow-sm"
                                                                : "border-gray-100 text-muted hover:border-pink/30 hover:bg-feather"
                                                        )}
                                                    >
                                                        <Field type="radio" name="size" value={s} className="hidden" />
                                                        {s}
                                                    </label>
                                                ))}
                                                <ErrorMessage name="size" component="div" className="text-red-400 text-xs" />
                                            </div>
                                        )}

                                        {currentStep === 2 && (
                                            <div className="space-y-3">
                                                <label className="block text-xs font-semibold text-navy tracking-wide uppercase">
                                                    Describe your theme / design idea
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="theme"
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all resize-none min-h-[120px]"
                                                    placeholder="E.g., Blue ocean theme with mermaid topper..."
                                                />
                                                <ErrorMessage name="theme" component="div" className="text-red-400 text-xs" />
                                                <p className="text-[10px] text-muted">
                                                    You can share reference images via WhatsApp later.
                                                </p>
                                            </div>
                                        )}

                                        {currentStep === 3 && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">
                                                        Requested Date <span className="text-pink">*</span>
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
                                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">
                                                        Wording on Cake (Optional)
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="message"
                                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all"
                                                        placeholder="Happy Birthday..."
                                                    />
                                                    <ErrorMessage name="message" component="div" className="text-red-400 text-xs mt-1" />
                                                </div>
                                            </div>
                                        )}

                                        {currentStep === 4 && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Your Name</label>
                                                    <Field
                                                        type="text"
                                                        name="name"
                                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all"
                                                    />
                                                    <ErrorMessage name="name" component="div" className="text-red-400 text-xs mt-1" />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Delivery City</label>
                                                    {settings?.servingCities && settings.servingCities.length > 0 ? (
                                                        <div className="relative">
                                                            <Field
                                                                as="select"
                                                                name="city"
                                                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all appearance-none bg-white"
                                                            >
                                                                <option value="">Select a city...</option>
                                                                {settings.servingCities.map((city: string) => (
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
                                                        WhatsApp Number <span className="text-pink">*</span>
                                                    </label>
                                                    <Field
                                                        type="tel"
                                                        name="whatsapp"
                                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all"
                                                        placeholder="+94 7..."
                                                    />
                                                    <ErrorMessage name="whatsapp" component="div" className="text-red-400 text-xs mt-1" />
                                                    <p className="text-[10px] text-muted mt-1">
                                                        We&apos;ll contact you on WhatsApp for confirmation and pricing.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-50">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handlePrev}
                                    disabled={currentStep === 0 || isSubmitting}
                                    className={currentStep === 0 ? "invisible" : ""}
                                >
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </Button>

                                {currentStep < steps.length - 1 ? (
                                    <Button type="button" onClick={() => handleNext(validateForm, setTouched)}>
                                        Next <ChevronRight className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Sending..." : "Submit Request"}
                                    </Button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
