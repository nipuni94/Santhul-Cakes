import React from "react";
import { Metadata } from "next";
import ProductClient from "./ProductClient";
import { getPublicData } from "@/actions/store";
import { Product } from "@/types";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const { products } = await getPublicData();
    const product = products.find((p: Product) => p.id.toString() === id);

    if (!product) {
        return {
            title: "Product Not Found",
            description: "The requested cake could not be found."
        };
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.image_url ? [{ url: product.image_url }] : [],
        }
    };
}

export default async function ProductPage(props: PageProps) {
    const params = await props.params;
    const { id } = params;

    // We pass the ID to the client component
    // The client component will look up the full product from the StoreContext
    // This maintains the "Single Source of Truth" for the cart and app state
    return <ProductClient initialProductId={Number(id)} />;
}
