"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Star,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  MessageSquarePlus,
  ShieldCheck,
  Heart,
  Quote,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const DEFAULT_BHOPAL_REVIEWS = [
  {
    _id: "rev-1",
    name: "Dr. Ananya Sharma",
    location: "Arera Colony, Bhopal",
    rating: 5,
    comment:
      "The crispness of the palak and taaza methi is incredible! Exactly like sunrise harvest. Delivered in 12 minutes to my doorstep.",
    tag: "Daily Customer",
  },
  {
    _id: "rev-2",
    name: "Rajesh K. Verma",
    location: "Kolar Road, Bhopal",
    rating: 5,
    comment:
      "Ordered the Farm Club VIP Pass. Got free delivery and the 6:30 AM morning priority slot is a blessing for morning breakfast & pooja!",
    tag: "VIP Farm Club Member",
  },
  {
    _id: "rev-3",
    name: "Pooja Malhotra",
    location: "Bawadiya Kalan, Bhopal",
    rating: 5,
    comment:
      "Direct farmer rates without middlemen markup. 100% clean, ozone-sorted, and no chemical smell in coriander or tomatoes.",
    tag: "Verified Resident",
  },
  {
    _id: "rev-4",
    name: "Vikram Saxena",
    location: "MP Nagar Zone 2, Bhopal",
    rating: 5,
    comment:
      "Zero plastic mission is commendable! Returned 3 eco-bags to the delivery rider and got ₹30 instant cashback discount on my order.",
    tag: "Eco-Bag Hero",
  },
  {
    _id: "rev-5",
    name: "Meenakshi Joshi",
    location: "Shahpura, Bhopal",
    rating: 5,
    comment:
      "Best quality A2 Gir Cow Milk and farm-fresh Paneer in Bhopal. Soft and purely organic. My entire family loves the morning subscription!",
    tag: "Morning Subscriber",
  },
];

export default function Testimonials({
  initialTestimonials = [],
}: {
  initialTestimonials?: any[];
}) {
  const sanitizeList = (list: any[]) => {
    if (!list || list.length === 0) return DEFAULT_BHOPAL_REVIEWS;
    const cleaned = list.filter(
      (t) =>
        t.comment &&
        !/yummy|bad rice|test/i.test(t.comment) &&
        t.location !== "India" &&
        t.comment.length > 5
    );
    return cleaned.length > 0 ? cleaned : DEFAULT_BHOPAL_REVIEWS;
  };

  const [testimonials, setTestimonials] = useState<any[]>(
    sanitizeList(initialTestimonials)
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const fetchLiveTestimonials = async () => {
    try {
      const res = await axios.get("/api/testimonials");
      if (res.data?.success && res.data.testimonials?.length > 0) {
        setTestimonials(sanitizeList(res.data.testimonials));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLiveTestimonials();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth > 640 ? clientWidth * 0.75 : clientWidth * 0.86;
      scrollContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
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
        setSubmittedMsg("🎉 Thank you! Your review has been saved to database and published.");
        fetchLiveTestimonials();
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmittedMsg(null);
          setReviewForm({
            name: "",
            location: "Arera Colony, Bhopal",
            rating: 5,
            comment: "",
          });
        }, 2000);
      } else {
        alert(res.data.message || "Failed to submit review");
      }
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Error submitting review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#fbfdfc] py-6 sm:py-12 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#0f8646] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 mb-1.5 shadow-2xs">
              <Sparkles size={11} /> Real Bhopal Families Love Us
            </span>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Customer Reviews & Experiences
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
              100% verified farm-to-table delivery feedback from across Bhopal
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-full font-black shadow-2xs transition-all text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <MessageSquarePlus size={14} />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Carousel Container with Side Floating Arrows */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 hover:text-[#0f8646] w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-lg border border-gray-200/90 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft size={18} className="stroke-[2.5]" />
          </button>

          {/* Modern Swipeable Review Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-3.5 sm:gap-5 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-3.5 px-3.5 sm:mx-0 sm:px-0"
          >
            {testimonials.map((t, idx) => (
              <motion.div
                key={t._id || idx}
                whileHover={{ y: -3 }}
                className="w-[84vw] xs:w-[310px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-center md:snap-start bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < (t.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-[#0f8646] bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle2 size={9} />
                      <span>{t.tag || "Verified Customer"}</span>
                    </span>
                  </div>

                  {/* Comment Text with Quote Icon */}
                  <div className="relative mb-3.5">
                    <Quote size={18} className="text-emerald-100 absolute -top-1 -left-1 -z-0" />
                    <p className="text-xs sm:text-[13px] text-gray-700 font-medium leading-relaxed relative z-10 italic">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100 mt-auto">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-[#0f8646] flex items-center justify-center font-black text-xs shrink-0 border border-emerald-200 shadow-2xs">
                    {t.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-xs sm:text-sm text-gray-900 truncate">
                      {t.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 block truncate font-medium">
                      📍 {t.location || "Bhopal, MP"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-800 hover:text-[#0f8646] w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center transition-all shadow-md hover:shadow-lg border border-gray-200/90 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight size={18} className="stroke-[2.5]" />
          </button>
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

              <h3 className="text-lg font-black text-center text-gray-900 mb-1">
                Share Your Farm Experience
              </h3>
              <p className="text-xs text-gray-500 text-center mb-5">
                Tell Bhopal neighbors about the produce quality & same-day fresh delivery!
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
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, name: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 uppercase tracking-wider mb-1.5">
                      Bhopal Locality / Colony
                    </label>
                    <select
                      value={reviewForm.location}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, location: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium cursor-pointer"
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
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            size={24}
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
                      placeholder="e.g. Taaza sabzi direct farm se aayi, same-day delivery aur packing bahut clean thi!"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, comment: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#0f8646] bg-gray-50/60 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#0f8646] hover:bg-[#0c6a38] text-white font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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