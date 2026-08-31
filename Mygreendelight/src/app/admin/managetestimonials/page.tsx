"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Check,
  X,
  Trash2,
  Star,
  User,
  Plus,
  RefreshCw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    comment: "",
    rating: 5,
    status: "approved",
  });
  const [isAdding, setIsAdding] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/testimonials");
      if (res.data.success) {
        setTestimonials(res.data.testimonials || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await axios.put(`/api/admin/testimonials/${id}`, { status });
      if (res.data.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status } : t))
        );
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await axios.delete(`/api/admin/testimonials/${id}`);
      if (res.data.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (error) {
      alert("Failed to delete testimonial");
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await axios.post("/api/admin/testimonials", addForm);
      if (res.data.success) {
        alert("Testimonial added successfully!");
        setIsAddModalOpen(false);
        setAddForm({ name: "", comment: "", rating: 5, status: "approved" });
        fetchTestimonials();
      }
    } catch (error) {
      alert("Failed to add review");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Customer Testimonials & Reviews
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Approve, moderate and manage customer reviews for the home page slider
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTestimonials}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Testimonial</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 size={36} className="animate-spin text-[#0f8646] mb-3" />
              <p className="text-xs font-bold text-gray-500">
                Loading Testimonials...
              </p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-200/80 shadow-xs max-w-md mx-auto">
              <Star size={36} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-gray-900 mb-1">
                No testimonials found
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Add verified customer reviews to build trust across Bhopal!
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#0f8646] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                + Add First Review
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div>
                    {/* Top User Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-green-50 text-[#0f8646] flex items-center justify-center font-black text-xs">
                          {t.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-gray-900">
                            {t.name}
                          </h4>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full ${
                              t.status === "approved"
                                ? "bg-green-100 text-[#0f8646]"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={
                              i < t.rating ? "fill-amber-400" : "text-gray-200"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 mb-4">
                      "{t.comment}"
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {t.status !== "approved" ? (
                        <button
                          onClick={() => updateStatus(t._id, "approved")}
                          className="bg-green-50 hover:bg-green-100 text-[#0f8646] px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Check size={13} /> Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => updateStatus(t._id, "pending")}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-bold transition"
                        >
                          Unapprove
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => deleteTestimonial(t._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Review"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </main>
      </div>

      {/* Add Testimonial Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-lg font-black text-gray-900">
                Add Customer Review
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma (Arera Colony)"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                  Star Rating (1 - 5)
                </label>
                <select
                  value={addForm.rating}
                  onChange={(e) =>
                    setAddForm({ ...addForm, rating: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars (Good)</option>
                  <option value={3}>⭐⭐⭐ 3 Stars (Average)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                  Review Text *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Vegetables were super crisp and delivered in 12 minutes!"
                  value={addForm.comment}
                  onChange={(e) =>
                    setAddForm({ ...addForm, comment: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-6 py-2.5 rounded-xl bg-[#0f8646] hover:bg-[#0c6a38] text-white font-extrabold shadow-md disabled:opacity-50"
                >
                  {isAdding ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}