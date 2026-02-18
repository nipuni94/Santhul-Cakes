"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Palette, Crown } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const { products, settings } = useStore();
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 8); // Take top 8 for 2 rows of 4

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden animated-gradient">
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-pink/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-pink-glow/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />

        <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm text-pink text-sm font-semibold shadow-sm border border-pink/10"
            >
              Est. 2019 • Homemade with Love
            </motion.span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-navy leading-[1.1]">
              Baked with{" "}
              <span className="text-gradient font-script text-6xl md:text-7xl lg:text-8xl">
                Love
              </span>
              ,<br />
              Served with Joy
            </h1>

            <p className="text-lg text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Premium homemade cakes crafted for birthdays, weddings, and every
              special moment. Custom designed to match your celebration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/shop">
                <Button size="lg">
                  Order Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/custom-order">
                <Button variant="outline" size="lg">
                  Design Your Cake
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Glowing ring behind the image */}
            <div className="absolute w-80 h-80 md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-br from-pink/30 to-pink-glow/40 blur-2xl animate-float" />
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-white flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={settings?.showcase?.heroImage || "/logo.png"}
                  alt="Santhul Cake House"
                  fill
                  className={settings?.showcase?.heroImage ? "object-cover" : "object-cover p-8"}
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us (Experience) - MOVED UP */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-pink font-semibold text-sm tracking-widest uppercase">
              Why Choose Us
            </span>
            <h2 className="text-4xl font-serif text-navy mt-3 mb-5">
              The Mouthwatering Experience
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink to-pink-dark mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Home Made",
                desc: "Authentic home-baked goodness in every slice. No factories, no shortcuts — just love.",
                color: "from-pink/10 to-pink-light",
              },
              {
                icon: Crown,
                title: "Premium Quality",
                desc: "Only the finest imported butter, Belgian chocolate, and fresh seasonal fruits.",
                color: "from-pink-glow/20 to-white",
              },
              {
                icon: Palette,
                title: "Custom Designs",
                desc: "Your imagination is our blueprint. We bring your wildest cake dreams to life.",
                color: "from-pink/10 to-pink-light",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group card-glow bg-gradient-to-br rounded-2xl p-8 border border-pink/5"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${item
                    .color.split(" ")[0]
                    .replace("from-", "")}, ${item.color.split(" ")[1]?.replace("to-", "") || "white"
                    })`,
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-pink/10 flex items-center justify-center mb-6 group-hover:bg-pink group-hover:text-white transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-pink group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-serif text-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - MOVED DOWN & UPDATED GRID */}
      <section className="py-20 bg-feather">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-pink font-semibold text-sm tracking-widest uppercase">
              Curated Favorites
            </span>
            <h2 className="text-4xl font-serif text-navy mt-3 mb-5">
              Featured Creations
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink to-pink-dark mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="outline" size="lg">
                View All Cakes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-glow rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-serif !text-white mb-4">
            Have a Special Celebration?
          </h2>
          <p className="text-gray-300 max-w-lg mx-auto mb-8">
            Let us design the perfect cake for your occasion. Share your vision,
            and we&apos;ll make it a reality.
          </p>
          <Link href="/custom-order">
            <Button size="lg">
              Start Your Custom Order <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
