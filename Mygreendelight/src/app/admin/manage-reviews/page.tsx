"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Star, Trash2, CheckCircle2, AlertCircle, Loader2, Sparkles, Filter } from "lucide-react";
import axios from "axios";

export default function ManageReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/admin/reviews");
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string, reviewId: string) => {
    if (!confirm("Are you sure you want to remove this customer review?")) return;
    try {
      const res = await axios.delete("/api/admin/reviews", {
        data: { productId, reviewId },
      });
      if (res.data.success) {
        setMsg({ type: "success", text: res.data.message });
        setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
      }
    } catch (error: any) {
      setMsg({ type: "error", text: error.response?.data?.message || "Failed to remove review" });
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === "all") return true;
    return r.rating === filterRating;
  });

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="flex-1 min-w-0 w-full p-4 sm:p-8 pt-18 sm:pt-20 lg:pt-8 max-w-6xl mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                <Star size={20} className="fill-amber-500 text-amber-500" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Customer Product Reviews & Ratings
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Inspect real verified customer ratings, feedbacks, and moderate reviews across all groceries.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-400 block uppercase">Total Verified Reviews</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{totalReviews}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-400 block uppercase">Overall Average Rating</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#0f8646]">{avgRating}</span>
              <div className="flex text-amber-400">
                {"★".repeat(Math.round(Number(avgRating)))}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <span className="text-xs font-bold text-gray-400 block uppercase">5-Star Customer Reviews</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{fiveStarCount}</span>
          </div>
        </div>

        {msg && (
          <div
            className={`p-4 rounded-xl mb-6 text-xs sm:text-sm font-bold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {msg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-gray-500 mr-2 flex items-center gap-1 shrink-0">
            <Filter size={14} /> Filter:
          </span>
          {["all", 5, 4, 3, 2, 1].map((f: any) => (
            <button
              key={f}
              onClick={() => setFilterRating(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition shrink-0 cursor-pointer ${
                filterRating === f
                  ? "bg-[#0f8646] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "All Reviews" : `★ ${f} Stars`}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 size={32} className="animate-spin text-[#0f8646] mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-400">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <Star size={36} className="text-gray-300 mx-auto mb-2" />
            <h3 className="font-black text-gray-800">No reviews found</h3>
            <p className="text-xs text-gray-400 mt-1">Customer reviews submitted on products will show here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => (
              <div
                key={rev.reviewId}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Product Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={rev.productImage}
                        alt={rev.productName}
                        className="w-10 h-10 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-gray-900 truncate block">
                          {rev.productName}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {rev.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(rev.productId, rev.reviewId)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      title="Remove Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={`${
                            s <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200 fill-gray-100"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-black text-gray-800 ml-1.5">
                        {rev.rating}.0
                      </span>
                    </div>

                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(rev.date).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-gray-700 leading-relaxed font-medium bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-3 pt-2 text-[11px] text-gray-500 font-bold flex items-center justify-between">
                  <span>By {rev.userName}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[9px] uppercase">
                    ✓ Verified Customer
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
