"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/context/StoreContext";

export default function AboutPage() {
    const { settings } = useStore();
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="bg-white border-b border-gray-100 pt-28 pb-16">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-pink font-semibold text-sm tracking-widest uppercase">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-6xl font-script text-navy mt-3 mb-4">
                        Santhul Cake House
                    </h1>
                    <div className="w-16 h-1 bg-gradient-to-r from-pink to-pink-dark mx-auto rounded-full mb-6" />
                    <p className="text-muted max-w-xl mx-auto text-lg font-light italic">
                        &ldquo;Baking is love made edible.&rdquo;
                    </p>
                </div>
            </section>

            {/* Story Content */}
            <section className="py-20 bg-feather">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, rotate: 3 }}
                            whileInView={{ opacity: 1, rotate: 2 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-xl"
                        >
                            <Image
                                src={settings?.showcase?.aboutImage || "/logo.png"}
                                alt="Santhul Cake House"
                                fill
                                className={settings?.showcase?.aboutImage ? "object-cover" : "object-contain p-12"}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-serif text-navy">
                                From Our Home to Yours
                            </h2>
                            <p className="text-muted leading-relaxed">
                                Santhul Cake House started in 2019 as a small passion project in
                                a home kitchen. Driven by a love for baking and a desire to
                                share happiness, we set out to create cakes that not only look
                                stunning but taste like home.
                            </p>
                            <p className="text-muted leading-relaxed">
                                We believe in quality over quantity. That&apos;s why every single
                                cake involves:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Premium imported butter & chocolates",
                                    "Farm-fresh eggs & fruits",
                                    "Zero preservatives",
                                    "Personalized attention to detail",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-navy font-medium text-sm">
                                        <Star className="w-4 h-4 text-pink fill-pink shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4">
                                <Link href="/shop">
                                    <Button>
                                        Taste the Difference <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
