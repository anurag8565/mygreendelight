"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, User, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

export default function Testimonials({ initialTestimonials = [] }: { initialTestimonials?: any[] }) {
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials);
  const [loading, setLoading] = useState(initialTestimonials.length === 0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", location: "", rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (initialTestimonials.length > 0) {
      setTestimonials(initialTestimonials);
      setLoading(false);
      return;
    }
    fetchTestimonials();
  }, [initialTestimonials]);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("/api/testimonials");
      if (res.data.success) {
        setTestimonials(res.data.testimonials);
      }
    } catch (error) {
      console.error("Error fetching testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1 >= testimonials.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? Math.max(0, testimonials.length - 2) : prev - 1));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/testimonials", reviewForm);
      if (res.data.success) {
        alert(res.data.message || "Review submitted successfully!");
        setIsModalOpen(false);
        setReviewForm({ name: "", location: "", rating: 5, comment: "" });
      } else {
        alert(res.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null; // Only hide while loading

  return (
    <div className="w-full bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">What Our Customers Say</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 bg-[#0f8646] hover:bg-[#0c6a38] text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all text-sm"
          >
            Write a Review
          </button>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-green-50 p-8 text-center rounded-2xl border border-green-100">
            <p className="text-gray-600 mb-2 font-medium">No reviews yet!</p>
            <p className="text-sm text-gray-500">Be the first to share your experience with us.</p>
          </div>
        ) : (
          <div className="relative group px-4">
            {/* Slider Container */}
            <div className="flex gap-6 overflow-hidden snap-x snap-mandatory hide-scrollbar">
              {testimonials.map((t, index) => (
                <div 
                  key={t._id} 
                  className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] bg-gray-50/80 border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
                  style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: "transform 0.5s ease-in-out" }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
                      {t.image ? (
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-[#0f8646]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">{t.name}</h4>
                      <span className="text-xs text-gray-500 font-medium">{t.location || "India"}</span>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed text-sm">"{t.comment}"</p>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 3 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-[#0f8646] hover:border-[#0f8646] z-10 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-[#0f8646] hover:border-[#0f8646] z-10 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Review Modal Portal */}
      <AnimatePresence>
        {isModalOpen && mounted && createPortal(
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[1000]" onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-[1001] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                  <input required type="text" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0f8646] focus:border-transparent outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City / Location</label>
                  <input type="text" value={reviewForm.location} onChange={e => setReviewForm({...reviewForm, location: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0f8646] focus:border-transparent outline-none" placeholder="Arera Colony, Bhopal" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className={`transition-transform hover:scale-110 ${reviewForm.rating >= star ? "text-yellow-400" : "text-gray-300"}`}>
                        <Star size={28} className={reviewForm.rating >= star ? "fill-yellow-400" : ""} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Experience</label>
                  <textarea required value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#0f8646] focus:border-transparent outline-none resize-none" placeholder="Tell us what you loved..." />
                </div>
                
                <button disabled={isSubmitting} type="submit" className="w-full bg-[#0f8646] hover:bg-[#0c6a38] text-white py-3 rounded-lg font-bold shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          </>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}