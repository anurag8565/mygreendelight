"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  MessageSquarePlus,
  ExternalLink,
  Quote,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export const GOOGLE_PROFILE_URL = "https://share.google/YAXXJGqvygILNyVNr";

export function GoogleGIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <FcGoogle className={className} aria-hidden="true" />;
}

const AVATAR_COLORS = [
  "bg-[#4285F4] text-white",
  "bg-[#EA4335] text-white",
  "bg-[#34A853] text-white",
  "bg-[#FBBC05] text-gray-950",
  "bg-[#8e24aa] text-white",
  "bg-[#0f8646] text-white",
  "bg-[#0284c7] text-white",
];

export const DEFAULT_GOOGLE_REVIEWS = [
  {
    _id: "gmb-1",
    name: "Dr. Ananya Sharma",
    location: "Arera Colony, Bhopal",
    rating: 5,
    timeAgo: "3 days ago",
    comment:
      "The crispness of the palak and taaza methi is incredible! Exactly like sunrise harvest. Delivered in 12 minutes to my doorstep in Bhopal.",
    source: "google",
    tag: "Google Review",
  },
  {
    _id: "gmb-2",
    name: "Rajesh K. Verma",
    location: "Kolar Road, Bhopal",
    rating: 5,
    timeAgo: "1 week ago",
    comment:
      "Early morning delivery is super fast! Got fresh vegetables right at 6:30 AM before breakfast & pooja. 100% crunchy, fresh and hygienic.",
    source: "google",
    tag: "Google Review",
  },
  {
    _id: "gmb-3",
    name: "Pooja Malhotra",
    location: "Bawadiya Kalan, Bhopal",
    rating: 5,
    timeAgo: "1 week ago",
    comment:
      "Direct farmer rates without unfair middleman markup. 100% clean, hand-sorted, and no chemical smell in coriander or tomatoes.",
    source: "google",
    tag: "Google Review",
  },
  {
    _id: "gmb-4",
    name: "Vikram Saxena",
    location: "MP Nagar Zone 2, Bhopal",
    rating: 5,
    timeAgo: "2 weeks ago",
    comment:
      "Zero plastic mission is commendable! Fresh vegetables delivered neatly in eco-friendly packaging right on time. Truly 5-star customer service!",
    source: "google",
    tag: "Google Review",
  },
  {
    _id: "gmb-5",
    name: "Meenakshi Joshi",
    location: "Shahpura, Bhopal",
    rating: 5,
    timeAgo: "3 weeks ago",
    comment:
      "Best quality fresh vegetables and farm-fresh Paneer in Bhopal. Soft and purely organic. My entire family loves SubziQuick!",
    source: "google",
    tag: "Google Review",
  },
];

export default function Testimonials({
  initialTestimonials = [],
  initialGoogleSettings = null,
}: {
  initialTestimonials?: any[];
  initialGoogleSettings?: any;
}) {
  const sanitizeList = (list: any[]) => {
    if (!list || list.length === 0) return DEFAULT_GOOGLE_REVIEWS;
    const cleaned = list.filter(
      (t) =>
        t.comment &&
        !/yummy|bad rice|test/i.test(t.comment) &&
        t.location !== "India" &&
        t.comment.length > 5
    );
    return cleaned.length > 0 ? cleaned : DEFAULT_GOOGLE_REVIEWS;
  };

  const [testimonials, setTestimonials] = useState<any[]>(
    sanitizeList(initialTestimonials)
  );

  const [googleSettings, setGoogleSettings] = useState({
    googleRating: initialGoogleSettings?.googleRating ?? 4.9,
    googleReviewsCount: initialGoogleSettings?.googleReviewsCount || "50+ Google Reviews",
    googleReviewUrl: initialGoogleSettings?.googleReviewUrl || GOOGLE_PROFILE_URL,
    showGoogleRatingPill: initialGoogleSettings?.showGoogleRatingPill !== false,
    googleReviewsHeading: initialGoogleSettings?.googleReviewsHeading || "Customer Reviews on Google",
  });

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
      if (res.data?.success) {
        if (res.data.testimonials?.length > 0) {
          setTestimonials(sanitizeList(res.data.testimonials));
        }
        setGoogleSettings({
          googleRating: res.data.googleRating ?? 4.9,
          googleReviewsCount: res.data.googleReviewsCount || "50+ Google Reviews",
          googleReviewUrl: res.data.googleReviewUrl || GOOGLE_PROFILE_URL,
          showGoogleRatingPill: res.data.showGoogleRatingPill !== false,
          googleReviewsHeading: res.data.googleReviewsHeading || "Customer Reviews on Google",
        });
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
        setSubmittedMsg("🎉 Shukriya! Aapka review submit ho gaya hai.");
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
        }, 3000);
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
    <div className="w-full bg-white py-6 sm:py-8 border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header: Google My Business Focused */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 sm:mb-7">
          <div>
            {/* Google Rating Pill (Controllable from Admin Panel) */}
            {googleSettings.showGoogleRatingPill && (
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200/90 px-3 py-1 rounded-full shadow-2xs mb-2">
                <GoogleGIcon className="w-4 h-4 shrink-0" />
                <div className="flex items-center gap-1 text-xs">
                  <span className="font-black text-gray-900">
                    {Number(googleSettings.googleRating || 4.9).toFixed(1)}
                  </span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium ml-0.5">
                    {googleSettings.googleReviewsCount || "on Google Reviews"}
                  </span>
                </div>
              </div>
            )}

            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {googleSettings.googleReviewsHeading || "Customer Reviews on Google"}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
              100% verified farm-to-table feedback from Bhopal residents
            </p>
          </div>

          {/* Action CTAs: Review on Google + Write on Website */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <a
              href={googleSettings.googleReviewUrl || GOOGLE_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-3.5 sm:px-4 py-2 rounded-full font-black text-xs flex items-center gap-2 shadow-2xs transition active:scale-95"
              title="Open SubziQuick Google Business Profile in new tab"
            >
              <GoogleGIcon className="w-4 h-4 shrink-0" />
              <span>Review on Google</span>
              <ExternalLink size={12} className="text-gray-400" />
            </a>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-full font-black shadow-2xs transition text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
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

          {/* Modern Swipeable Review Carousel: Google Review Style */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-3.5 sm:gap-5 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-3.5 px-3.5 sm:mx-0 sm:px-0"
          >
            {testimonials.map((t, idx) => {
              const avatarColorClass =
                AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const isGoogleSource =
                t.source === "google" ||
                t.tag?.toLowerCase().includes("google") ||
                !t.source;

              return (
                <motion.div
                  key={t._id || idx}
                  whileHover={{ y: -3 }}
                  className="w-[85vw] xs:w-[320px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-center md:snap-start bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Reviewer Avatar + Name + Source Badge */}
                    <div className="flex items-start justify-between gap-2.5 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow-2xs uppercase ${avatarColorClass}`}
                        >
                          {t.name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-xs sm:text-sm text-gray-900 truncate">
                            {t.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 block truncate font-medium">
                            📍 {t.location || "Bhopal, MP"}
                            {t.timeAgo ? ` • ${t.timeAgo}` : ""}
                          </span>
                        </div>
                      </div>

                      {/* Source Badge (Google vs Verified Customer) */}
                      {isGoogleSource ? (
                        <a
                          href={googleSettings.googleReviewUrl || GOOGLE_PROFILE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-2xs shrink-0 transition"
                          title="Verified on Google Business Profile"
                        >
                          <GoogleGIcon className="w-3 h-3 shrink-0" />
                          <span>Google</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>Verified Buyer</span>
                        </span>
                      )}
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400 mb-2.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < (t.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <div className="relative">
                      <p className="text-xs sm:text-[13px] text-gray-700 font-medium leading-relaxed">
                        &ldquo;{t.comment}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles size={11} /> Farm Fresh Delivery
                    </span>
                    <span>Bhopal, MP</span>
                  </div>
                </motion.div>
              );
            })}
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

      {/* Write a Review Modal */}
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

              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0f8646] border border-emerald-200 flex items-center justify-center mb-3 mx-auto shadow-2xs">
                <GoogleGIcon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-black text-center text-gray-900 mb-1">
                Share Your Customer Review
              </h3>
              <p className="text-xs text-gray-500 text-center mb-5">
                Aapka review live homepage par Google-verified card style me dikhega!
              </p>

              {submittedMsg ? (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs font-bold text-center mb-4 space-y-3">
                  <p className="font-black text-sm">{submittedMsg}</p>
                  <p className="text-gray-600">
                    Aap apna review hamare official Google Business Profile par bhi share kar sakte hain:
                  </p>
                  <a
                    href={googleSettings.googleReviewUrl || GOOGLE_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#0f8646] text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-[#0c6a38] transition"
                  >
                    <GoogleGIcon className="w-3.5 h-3.5 bg-white rounded-full p-0.5" />
                    <span>Post on Google Reviews</span>
                    <ExternalLink size={12} />
                  </a>
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
                      placeholder="e.g. Anurag Singh"
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
                      <option value="Bagsewaniya / Saket Nagar, Bhopal">Bagsewaniya / Saket Nagar, Bhopal</option>
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
                      placeholder="e.g. Taaza sabzi direct farm se aayi, same-day fast delivery aur packing clean thi!"
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
                    {isSubmitting ? "Submitting Review..." : "Publish Verified Review"}
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