"use client";

import React, { useEffect, useState } from "react";
import { Review } from "@/types";
import { updateReviewStatus, deleteReview } from "@/actions/reviews";
import { fetchReviews } from "@/actions/fetchReviews";
import { Button } from "@/components/ui/Button";
import { Check, X, Trash2, Star, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

    const loadReviews = async () => {
        const data = await fetchReviews() as Review[];
        setReviews(data.sort((a: Review, b: Review) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await updateReviewStatus(id, status);
            toast.success(`Review ${status}`);
            loadReviews(); // Refresh list
        } catch (error) {
            toast.error("Failed to update review");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            await deleteReview(id);
            toast.success("Review deleted");
            loadReviews();
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const filteredReviews = reviews.filter(r => r.status === filter);

    return (
        <div className="p-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-navy mb-8">User Reviews</h1>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 pb-1">
                {['pending', 'approved', 'rejected'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={cn(
                            "pb-2 px-1 text-sm font-medium capitalize transition-all relative",
                            filter === f ? "text-pink" : "text-muted hover:text-navy"
                        )}
                    >
                        {f} ({reviews.filter(r => r.status === f).length})
                        {filter === f && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink rounded-t-full" />}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-navy">{review.userName}</span>
                                    <span className="text-xs text-muted flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {new Date(review.date).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-muted">• Product ID: {review.productId}</span>
                                </div>
                                <div className="flex text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-current" : "text-gray-200")} />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed bg-feather p-3 rounded-lg">
                                    &ldquo;{review.comment}&rdquo;
                                </p>
                            </div>

                            <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                                {filter === 'pending' && (
                                    <>
                                        <Button
                                            size="sm"
                                            className="bg-green-500 hover:bg-green-600 text-white w-full"
                                            onClick={() => handleStatusUpdate(review.id, 'approved')}
                                        >
                                            <Check className="w-4 h-4 mr-2" /> Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 w-full"
                                            onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                        >
                                            <X className="w-4 h-4 mr-2" /> Reject
                                        </Button>
                                    </>
                                )}
                                {filter === 'approved' && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-orange-500 hover:bg-orange-50 hover:text-orange-600 border-orange-200 w-full"
                                        onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                    >
                                        <X className="w-4 h-4 mr-2" /> Reject
                                    </Button>
                                )}
                                {filter === 'rejected' && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-green-500 hover:bg-green-50 hover:text-green-600 border-green-200 w-full"
                                        onClick={() => handleStatusUpdate(review.id, 'approved')}
                                    >
                                        <Check className="w-4 h-4 mr-2" /> Approve
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-gray-400 hover:text-red-600 w-full mt-auto"
                                    onClick={() => handleDelete(review.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-muted">
                        No {filter} reviews found.
                    </div>
                )}
            </div>
        </div>
    );
}
