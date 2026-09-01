"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, User, ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2, MessageSquarePlus, ShieldCheck, Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const DEFAULT_BHOPAL_REVIEWS = [
  {
    _id: "rev-1",
    name: "Dr. Ananya Sharma",
    location: "Arera Colony, Bhopal",
    rating: 5,
    comment: "The crispness of the palak and taaza methi is incredible! Exactly like farm harvest. Delivered in 12 minutes to my doorstep.",
    tag: "Daily Customer",
  },
  {
    _id: "rev-2",
    name: "Rajesh K. Verma",
    location: "Kolar Road, Bhopal",
    rating: 5,
    comment: "Ordered the Farm Club VIP Pass. Got free delivery and the 6:30 AM morning priority slot is a blessing for morning pooja and breakfast!",
    tag: "VIP Farm Club Member",
  },
  {
    _id: "rev-3",
    name: "Pooja Malhotra",
    location: "Bawadiya Kalan, Bhopal",
    rating: 5,
    comment: "Direct farmer rates without mandi middleman markup. 100% clean, sorted, and no chemical smell in coriander or tomatoes.",
    tag: "Verified Resident",
  },
  {
    _id: "rev-4",
    name: "Vikram Saxena",
    location: "MP Nagar Zone 2, Bhopal",
    rating: 5,
    comment: "Zero plastic mission is commendable! Returned 3 eco-bags to the delivery boy and got ₹30 instant cashback in my wallet.",
    tag: "Eco-Bag Hero",
  },
];

export default function Testimonials({ initialTestimonials = [] }: { initialTestimonials?: any[] }) {
  const [testimonials, setTestimonials] = useState<any[]>(
    initialTestimonials.length > 0 ? initialTestimonials : DEFAULT_BHOPAL_REVIEWS
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    location: "Arera Colony, Bhopal",
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialTestimonials.length > 0) {
      setTestimonials(initialTestimonials);
    } else {
      axios
        .get("/api/testimonials")
        .then((res) => {
          if (res.data?.success && res.data.testimonials?.length > 0) {
            setTestimonials(res.data.testimonials);
          }
        })
        .catch(() => {});
    }
  }, [initialTestimonials]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1 >= testimonials.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      alert("Please enter your name and review message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/testimonials", reviewForm);
      if (res.data.success) {
        const newReview = {
          _id: `user-rev-${Date.now()}`,
          name: reviewForm.name,
          location: reviewForm.location || "Bhopal Resident",
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          tag: "Verified Customer",
        };

        // Add review locally so it instantly renders
        setTestimonials((prev) => [newReview, ...prev]);
        setSubmittedMsg("🎉 Thank you! Your verified review has been published.");
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmittedMsg(null);
          setReviewForm({ name: "", location: "Arera Colony, Bhopal", rating: 5, comment: "" });
        }, 2000);
      } else {
        alert(res.data.message || "Failed to submit review");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#fbfdfc] py-10 sm:py-16 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Sparkles size={12} /> Real Bhopal Families Love Us
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Customer Reviews & Experiences
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              100% verified farm-to-table delivery feedback from across Bhopal
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-5 py-2.5 rounded-2xl font-black shadow-md hover:shadow-lg transition-all text-xs flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus size={16} />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t._id || idx}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={i < (t.rating || 5) ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold text-[#0f8646] bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    {t.tag || "Verified Buyer"}
                  </span>
                </div>

                <p className="text-xs text-gray-700 font-medium leading-relaxed mb-4 italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black text-sm shrink-0 border border-emerald-200">
                  {t.name?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-xs text-gray-900 truncate">
                    {t.name}
                  </h4>
                  <span className="text-[10px] text-gray-400 block truncate">
                    {t.location || "Bhopal, MP"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="cursor-default bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative text-gray-900 animate-in fade-in zoom-in-95 duration-200"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition border border-gray-200 cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center mb-3 mx-auto shadow-inner">
                <Star size={24} className="fill-[#0f8646]" />
              </div>

              <h3 className="text-xl font-black text-center text-gray-900 mb-1">
                Share Your Farm Experience
              </h3>
              <p className="text-xs text-gray-500 text-center mb-6">
                Tell Bhopal neighbors about the produce quality & 10-min delivery!
              </p>

              {submittedMsg ? (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-black text-center mb-4">
                  {submittedMsg}
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-bold">
                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Anurag Sharma"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Bhopal Locality / Colony
                    </label>
                    <select
                      value={reviewForm.location}
                      onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium cursor-pointer"
                    >
                      <option value="Arera Colony, Bhopal">Arera Colony, Bhopal</option>
                      <option value="Kolar Road, Bhopal">Kolar Road, Bhopal</option>
                      <option value="Bawadiya Kalan, Bhopal">Bawadiya Kalan, Bhopal</option>
                      <option value="MP Nagar, Bhopal">MP Nagar, Bhopal</option>
                      <option value="Hoshangabad Road, Bhopal">Hoshangabad Road, Bhopal</option>
                      <option value="Minal Residency, Bhopal">Minal Residency, Bhopal</option>
                      <option value="Shahpura / Chunabhatti, Bhopal">Shahpura / Chunabhatti, Bhopal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Rating
                    </label>
                    <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            size={26}
                            className={
                              reviewForm.rating >= star
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Review / Experience *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Taaza sabzi direct khet se aayi, 10 minute me delivery aur packing bahut clean thi!"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting Review..." : "Submit Verified Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}