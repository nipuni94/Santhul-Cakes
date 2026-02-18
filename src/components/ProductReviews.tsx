"use client";

import React, { useState } from "react";
import { Review } from "@/types";
import { addReview } from "@/actions/reviews";
import { Button } from "@/components/ui/Button";
import { Star, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductReviewsProps {
    productId: number;
    reviews: Review[];
}

export const ProductReviews = ({ productId, reviews = [] }: ProductReviewsProps) => {
    const [rating, setRating] = useState(5);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Only show approved reviews
    const approvedReviews = reviews.filter(r => r.status === 'approved');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await addReview(productId, name, rating, comment);
            setHasSubmitted(true);
            toast.success("Review submitted! It will appear after approval.");
            setName("");
            setComment("");
            setRating(5);
        } catch (error) {
            toast.error("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-12 border-t border-gray-100">
            <h2 className="text-2xl font-serif text-navy mb-8">Customer Reviews</h2>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Review List */}
                <div className="space-y-6">
                    {approvedReviews.length > 0 ? (
                        approvedReviews.map((review) => (
                            <div key={review.id} className="bg-feather p-6 rounded-2xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink font-bold shadow-sm">
                                        {review.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-navy text-sm">{review.userName}</h4>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-current" : "text-gray-200")} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="ml-auto text-xs text-muted">
                                        {new Date(review.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-muted text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl text-muted text-sm">
                            No reviews yet. Be the first to share your experience!
                        </div>
                    )}
                </div>

                {/* Review Form */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
                    {!hasSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="font-bold text-navy mb-4">Write a Review</h3>

                            <div>
                                <label className="block text-xs font-semibold text-navy mb-1">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={cn(
                                                "transition-colors",
                                                star <= rating ? "text-yellow-400" : "text-gray-200 hover:text-yellow-200"
                                            )}
                                        >
                                            <Star className="w-6 h-6 fill-current" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-navy mb-1">Your Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 bg-feather border-none rounded-xl text-sm focus:ring-1 focus:ring-pink outline-none"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-navy mb-1">Your Review</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 bg-feather border-none rounded-xl text-sm focus:ring-1 focus:ring-pink outline-none resize-none"
                                    placeholder="Tell us what you liked..."
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-10 space-y-3">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                                <Star className="w-8 h-8 fill-current" />
                            </div>
                            <h3 className="font-bold text-navy text-lg">Thank You!</h3>
                            <p className="text-muted text-sm">
                                Your review has been submitted and is pending approval.
                            </p>
                            <Button variant="outline" onClick={() => setHasSubmitted(false)} size="sm" className="mt-4">
                                Write Another
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
