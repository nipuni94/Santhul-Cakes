import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-feather">
            <div className="text-center px-6">
                <h1 className="text-8xl font-serif text-pink mb-4">404</h1>
                <h2 className="text-2xl font-serif text-navy mb-3">Page Not Found</h2>
                <p className="text-muted mb-8 max-w-md mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find your way back.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/">
                        <Button variant="primary">Go Home</Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="outline">Browse Shop</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
