"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminPassword } from "@/actions/store";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await verifyAdminPassword(password);
            if (result.success) {
                toast.success("Welcome back, Admin!");
                router.push("/admin");
            } else {
                toast.error("Invalid password");
            }
        } catch (error) {
            toast.error("Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-feather">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-pink/10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-pink" />
                    </div>
                    <h1 className="text-2xl font-serif text-navy font-bold">Admin Access</h1>
                    <p className="text-muted text-sm mt-2">Enter your secure password to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wide">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink/50 transition-all text-navy"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-4 text-base shadow-lg shadow-pink/20"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Access Dashboard"}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">Restricted Area. Authorized Personnel Only.</p>
                </div>
            </div>
        </div>
    );
}
