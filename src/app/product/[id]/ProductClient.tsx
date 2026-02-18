"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Product, ProductVariant, ProductFlavor, Review } from "@/types";
import { cn } from "@/lib/utils";
import { ProductDetailSkeleton } from "@/components/Skeletons";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ProductReviews } from "@/components/ProductReviews";
import { fetchReviews } from "@/actions/fetchReviews";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductClientProps {
    initialProductId: number;
}

export default function ProductClient({ initialProductId }: ProductClientProps) {
    const { products, isLoading } = useStore();
    const { addItem } = useCart();
    const router = useRouter();

    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await fetchReviews();
                setReviews(data);
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            }
        };
        loadReviews();
    }, []);

    // Find product from store (Client Side Data) 
    // We rely on StoreContext because it handles the "Live" state better than passing server props which might get stale if not revalidated carefully
    const product = products.find((p: Product) => p.id === initialProductId);

    // Set default variant if available and not selected
    useEffect(() => {
        if (product) {
            if (product.variants && product.variants.length > 0 && !selectedVariant) {
                setSelectedVariant(product.variants[0]);
            }
            if (product.flavors && product.flavors.length > 0 && !selectedFlavor) {
                setSelectedFlavor(product.flavors[0]);
            }
        }
    }, [product, selectedVariant, selectedFlavor]);

    const handleAddToCart = () => {
        if (!product) return;

        const price = selectedVariant ? selectedVariant.price : product.price;
        const finalPrice = product.flavors && selectedFlavor ? price + selectedFlavor.price : price;

        addItem({
            ...product,
            price: finalPrice,
            selectedWeight: selectedVariant?.name,
            selectedFlavor: selectedFlavor?.name,
            selectedPrice: finalPrice
        }, quantity);

        toast.success("Added to cart!");
    };

    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-feather">
                <div className="text-center">
                    <h1 className="text-3xl font-serif text-navy mb-2">Product Not Found</h1>
                    <p className="text-muted mb-6">The cake you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/shop"><Button>Back to Shop</Button></Link>
                </div>
            </div>
        );
    }

    const currentPrice = product.price + (selectedVariant ? selectedVariant.price : 0) + (selectedFlavor ? selectedFlavor.price : 0);

    return (
        <div className="min-h-screen bg-feather pt-28 pb-16">
            <div className="container mx-auto px-6">
                <Breadcrumbs items={[
                    { label: "Shop", href: "/shop" },
                    { label: product.category || "Products", href: `/shop?category=${product.category}` },
                    { label: product.name }
                ]} />

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Image */}
                    <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                        {product.image_url ? (
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                        ) : (
                            <div className="absolute inset-0 shimmer flex items-center justify-center">
                                <span className="relative z-10 font-script text-5xl text-pink/30">Santhul</span>
                            </div>
                        )}
                        {product.is_featured && (
                            <span className="absolute top-4 left-4 bg-gradient-to-r from-pink to-pink-dark text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                                Best Seller
                            </span>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-8">
                        <div>
                            <span className="text-pink font-bold text-xs tracking-[0.2em] uppercase">
                                {Array.isArray(product.categories) ? product.categories.join(", ") : product.category}
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-serif text-navy mt-2 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mt-5">
                                <span className="text-3xl font-bold text-gradient">
                                    Rs. {currentPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <p className="text-muted leading-relaxed text-base">
                            {product.description}
                        </p>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-sm font-semibold text-navy">Select Size</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.name}
                                            onClick={() => setSelectedVariant(v)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                                                selectedVariant?.name === v.name
                                                    ? "bg-pink text-white border-pink shadow-lg shadow-pink/20"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-pink hover:text-pink"
                                            )}
                                        >
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Flavors */}
                        {product.flavors && product.flavors.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-sm font-semibold text-navy">Select Base / Flavor</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.flavors.map((f) => (
                                        <button
                                            key={f.name}
                                            onClick={() => setSelectedFlavor(f)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                                                selectedFlavor?.name === f.name
                                                    ? "bg-navy text-white border-navy shadow-lg shadow-navy/20"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy"
                                            )}
                                        >
                                            {f.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-semibold text-navy">Quantity</span>
                                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-muted hover:bg-feather transition-colors font-medium"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-bold text-navy">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-muted hover:bg-feather transition-colors font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button size="lg" className="flex-grow" onClick={handleAddToCart}>
                                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                                </Button>
                                <Button size="lg" variant="outline" className="w-12 p-0 shrink-0">
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <ProductReviews productId={product.id} reviews={reviews.filter(r => r.productId === product.id)} />

                <RelatedProducts currentProduct={product} />
            </div>
        </div>
    );
}
