"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Phone, Mail, MapPin, Heart, MessageCircle, Music2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export const Footer = () => {
    const pathname = usePathname();
    const { settings } = useStore();

    if (pathname.startsWith("/admin")) return null;

    const displayAddress = settings?.address || "123 Cake Lane, Sweet City";
    const displayPhone = settings?.phone || "+94 77 123 4567";
    const displayEmail = settings?.email || "hello@santhulcakes.com";
    const displayFooterText = settings?.footerText || "Crafting sweet memories with homemade love. Every cake is a masterpiece, baked with the finest ingredients and passion.";

    return (
        <footer className="bg-navy text-white relative overflow-hidden">
            {/* Decorative gradient top edge */}
            <div className="h-1 bg-gradient-to-r from-pink via-pink-glow to-pink" />

            <div className="container mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1 space-y-5">
                        <div className="flex flex-col items-start gap-3">
                            <div className="relative w-16 h-16">
                                <Image
                                    src="/logo_footer.png"
                                    alt="Santhul Cake House"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {displayFooterText}
                        </p>
                        {(() => {
                            const socialLinks = [
                                { key: 'whatsapp', url: settings?.socialLinks?.whatsapp, title: 'WhatsApp', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg> },
                                { key: 'facebook', url: settings?.socialLinks?.facebook, title: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
                                { key: 'instagram', url: settings?.socialLinks?.instagram, title: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
                                { key: 'tiktok', url: settings?.socialLinks?.tiktok, title: 'TikTok', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg> },
                            ].filter(link => link.url && link.url !== '#');

                            return socialLinks.length > 0 ? (
                                <div className="flex gap-3">
                                    {socialLinks.map(link => (
                                        <a
                                            key={link.key}
                                            href={link.url!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-full bg-white/5 hover:bg-pink hover:text-white text-gray-400 transition-all duration-300"
                                            title={link.title}
                                            aria-label={link.title}
                                        >
                                            {link.icon}
                                        </a>
                                    ))}
                                </div>
                            ) : null;
                        })()}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif text-lg mb-6 !text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Shop All Cakes", href: "/shop" },
                                { label: "Custom Orders", href: "/custom-order" },
                                { label: "Our Story", href: "/about" },
                                { label: "Contact Us", href: "/contact" },
                                { label: "FAQ", href: "/legal/faq" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-pink text-sm transition-colors duration-300 hover:pl-1"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact - Multi-Location Support */}
                    <div>
                        <h4 className="font-serif text-lg mb-6 !text-white">Get in Touch</h4>
                        <div className="space-y-6">
                            {(settings?.locations && settings.locations.length > 0 ? settings.locations : [{ id: "1", name: "", address: settings?.address || "123 Cake Lane, Sweet City", phone: settings?.phone || "+94 77 123 4567" }]).map((loc, index) => (
                                <ul key={index} className="space-y-2">
                                    {loc.name && <li className="text-pink font-semibold text-xs uppercase tracking-wide mb-1">{loc.name}</li>}
                                    <li className="flex items-start gap-3 text-gray-400 text-sm">
                                        <MapPin className="w-4 h-4 text-pink shrink-0 mt-0.5" />
                                        <span>{loc.address}</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-400 text-sm">
                                        <Phone className="w-4 h-4 text-pink shrink-0" />
                                        <span>{loc.phone}</span>
                                    </li>
                                </ul>
                            ))}

                            <ul className="space-y-4 pt-2 border-t border-white/10">
                                <li className="flex items-center gap-3 text-gray-400 text-sm">
                                    <Mail className="w-4 h-4 text-pink shrink-0" />
                                    <span>{settings?.email || "hello@santhulcakes.com"}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Hours & Legal */}
                    <div>
                        <h4 className="font-serif text-lg mb-6 !text-white">Order & Delivery</h4>
                        <div className="space-y-3 text-sm mb-8">
                            <p className="text-gray-400 border-l-2 border-pink/30 pl-3 py-1">Online Orders: <span className="text-white font-semibold">24/7</span></p>
                        </div>

                        <h4 className="font-serif text-lg mb-4 !text-white">Legal</h4>
                        <ul className="space-y-2">
                            {[
                                { label: "Privacy Policy", href: "/legal/privacy-policy" },
                                { label: "Terms of Service", href: "/legal/terms-of-service" },
                                { label: "Refund Policy", href: "/legal/refund-policy" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-pink text-sm transition-colors duration-300 hover:pl-1 flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-pink/50" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p className="flex items-center gap-1">
                        &copy; {new Date().getFullYear()} Santhul Cake House. Made with
                        <Heart className="w-3 h-3 text-pink fill-pink" />
                    </p>
                    <p>
                        Developed by{" "}
                        <a
                            href="https://nexcey.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink hover:underline uppercase font-bold tracking-wider"
                        >
                            NEXCEY
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};
