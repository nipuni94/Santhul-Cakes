"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

export default function ContactPage() {
    const { settings, sendMessage } = useStore();

    const locations = settings?.locations && settings.locations.length > 0
        ? settings.locations
        : [{ id: "1", name: "Main Store", address: settings?.address || "123 Cake Lane, Sweet City", phone: settings?.phone || "+94 77 123 4567" }];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-white border-b border-gray-100 pt-28 pb-12">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-pink font-semibold text-sm tracking-widest uppercase">
                        Reach Out
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-navy mt-2 mb-4">
                        Get in Touch
                    </h1>
                    <div className="w-16 h-1 bg-gradient-to-r from-pink to-pink-dark mx-auto rounded-full mb-4" />
                    <p className="text-muted max-w-lg mx-auto">
                        Have a question or a special request? We&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-feather">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 bg-navy rounded-3xl p-8 text-white shadow-xl">
                            <h2 className="text-2xl font-serif !text-white mb-8">Contact Information</h2>

                            <div className="space-y-8">
                                {locations.map((loc, index) => (
                                    <div key={index} className="space-y-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                        {loc.name && <h3 className="!text-pink font-semibold text-sm uppercase tracking-wide">{loc.name}</h3>}

                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl text-pink shrink-0">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-pink/70 text-[10px] mb-1 uppercase tracking-widest font-bold">Phone / WhatsApp</p>
                                                <p className="font-medium">{loc.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl text-pink shrink-0">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-pink/70 text-[10px] mb-1 uppercase tracking-widest font-bold">Location</p>
                                                <p className="font-medium whitespace-pre-line">{loc.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                                    <div className="p-3 bg-white/5 rounded-xl text-pink shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-pink/70 text-[10px] mb-1 uppercase tracking-widest font-bold">Email</p>
                                        <p className="font-medium">{settings?.email || "hello@santhulcakes.com"}</p>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-serif text-navy mb-6">Send a Message</h2>
                            <Formik
                                initialValues={{ name: "", phone: "", subject: "", message: "" }}
                                validationSchema={Yup.object({
                                    name: Yup.string().required("Name is required"),
                                    phone: Yup.string().required("Phone is required"),
                                    subject: Yup.string().required("Subject is required"),
                                    message: Yup.string().required("Message is required"),
                                })}
                                onSubmit={async (values, { setSubmitting, resetForm }) => {
                                    try {
                                        await sendMessage({
                                            name: values.name,
                                            phone: values.phone,
                                            subject: values.subject,
                                            message: values.message,
                                            type: "Contact"
                                        });
                                        resetForm();
                                        // Toast handled in context
                                    } catch (error) {
                                        console.error("Failed to send message", error);
                                        toast.error("Failed to send message");
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Your Name</label>
                                                <Field name="name" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all" />
                                                <ErrorMessage name="name" component="div" className="text-red-400 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Phone Number</label>
                                                <Field name="phone" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all" />
                                                <ErrorMessage name="phone" component="div" className="text-red-400 text-xs mt-1" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Subject</label>
                                            <Field name="subject" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all" />
                                            <ErrorMessage name="subject" component="div" className="text-red-400 text-xs mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-navy mb-1.5 tracking-wide uppercase">Message</label>
                                            <Field as="textarea" name="message" rows={4} className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/30 focus:border-pink text-sm transition-all resize-none" />
                                            <ErrorMessage name="message" component="div" className="text-red-400 text-xs mt-1" />
                                        </div>

                                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? "Sending..." : <>Send Message <Send className="w-4 h-4 ml-2" /></>}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
