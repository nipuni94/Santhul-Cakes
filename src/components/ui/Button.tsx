import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary:
                "bg-gradient-to-r from-pink to-pink-dark text-white shadow-lg shadow-pink/25 hover:shadow-xl hover:shadow-pink/30 hover:scale-[1.02]",
            secondary:
                "bg-navy text-white shadow-lg shadow-navy/20 hover:bg-navy-light hover:shadow-xl hover:scale-[1.02]",
            outline:
                "border-2 border-pink text-pink hover:bg-pink hover:text-white",
            ghost:
                "text-navy hover:bg-pink-light hover:text-pink",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-2.5 text-sm",
            lg: "px-8 py-3.5 text-base",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "rounded-full font-semibold tracking-wide transition-all duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
