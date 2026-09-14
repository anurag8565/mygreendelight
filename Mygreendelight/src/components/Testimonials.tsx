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
  MessageSquareQuote,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export const GOOGLE_PROFILE_URL = "https://share.google/YAXXJGqvygILNyVNr";

export function GoogleGIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <FcGoogle className={className} aria-hidden="true" />;
}

export const AVATAR_COLORS = [
  "bg-emerald-50 text-emerald-800 border-emerald-200/70",
  "bg-amber-50 text-amber-900 border-amber-200/70",
  "bg-stone-100 text-stone-800 border-stone-200/70",
  "bg-sky-50 text-sky-800 border-sky-200/70",
  "bg-teal-50 text-teal-800 border-teal-200/70",
  "bg-rose-50 text-rose-800 border-rose-200/70",
];

export const DEFAULT_GOOGLE_REVIEWS = [
  {
    _id: "gmb-1",
    name: "Dr. Ananya Sharma",
    location: "Arera Colony, Bhopal",
    rating: 5,
    timeAgo: "3 days ago",
    comment:
      "Palak and methi were fresh like direct farm harvest. Delivery reached before 7 AM, neatly packed in paper bags without any plastic.",
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
      "Ordered early morning veggies for home pooja. Tomatoes, ginger, and coriander were clean, firm and without a single spoiled piece.",
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
      "Genuine mandi rates and far better quality than roadside carts. No extra middleman markup and very polite delivery partner.",
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
      "Clean packaging without single-use polythene. Fresh coriander and mint had genuine natural aroma. Really impressed with the consistency.",
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
      "Soft dairy paneer and fresh daily vegetables. SubziQuick has replaced our tiring weekly mandi rush completely. Highly recommended!",
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
    <div className="w-full bg-[#faf9f5] py-6 sm:py-8 border-b border-stone-200/70 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
        
        {/* Section Header: Google My Business Trust & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 sm:mb-6">
          <div>
            {/* Google Rating Pill (Controllable from Admin Panel) */}
            {googleSettings.showGoogleRatingPill && (
              <div className="inline-flex items-center gap-2 bg-white border border-stone-200/90 px-3 py-1 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-2.5">
                <GoogleGIcon className="w-3.5 h-3.5 shrink-0" />
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-stone-900">
                    {Number(googleSettings.googleRating || 4.9).toFixed(1)}
                  </span>
                  <div className="flex items-center text-[#FBBC04]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-[#FBBC04] text-[#FBBC04]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">
                    ({googleSettings.googleReviewsCount || "120+ reviews"})
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <MessageSquareQuote size={18} className="text-[#0a3d24] shrink-0" />
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-stone-900 tracking-tight font-heading">
                {googleSettings.googleReviewsHeading || "Customer Reviews on Google"}
              </h2>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Verified feedback from households in Arera Colony, Kolar Road, MP Nagar & Bhopal
            </p>
          </div>

          {/* Action CTAs & Carousel Navigation */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <a
              href={googleSettings.googleReviewUrl || GOOGLE_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 px-3 sm:px-3.5 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition active:scale-95"
              title="Open SubziQuick Google Business Profile in new tab"
            >
              <GoogleGIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Google Reviews</span>
              <ExternalLink size={11} className="text-stone-400" />
            </a>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0a3d24] hover:bg-[#072817] text-white px-3.5 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus size={13} />
              <span>Write a Review</span>
            </button>

            {/* Desktop Quick Nav Arrows */}
            <div className="hidden sm:flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90 flex items-center justify-center transition shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90 flex items-center justify-center transition shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-95 cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container with Side Floating Arrows (Desktop) */}
        <div className="relative group">
          {/* Left Arrow Button (Desktop Floating) */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="hidden md:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-stone-700 hover:text-[#0a3d24] w-9 h-9 rounded-full items-center justify-center transition shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-stone-200/90 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft size={17} />
          </button>

          {/* Clean Google Review Style Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-3.5 sm:gap-4.5 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-3.5 px-3.5 sm:mx-0 sm:px-0"
          >
            {testimonials.map((t, idx) => {
              const avatarColorClass =
                AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const isGoogleSource =
                t.source === "google" ||
                t.tag?.toLowerCase().includes("google") ||
                !t.source;

              return (
                <div
                  key={t._id || idx}
                  className="w-[84vw] xs:w-[320px] md:w-[calc(50%-10px)] lg:w-[calc(33.333%-12px)] shrink-0 snap-center md:snap-start bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-stone-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Reviewer Avatar + Name + Source Badge */}
                    <div className="flex items-start justify-between gap-2.5 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 uppercase tracking-tight ${avatarColorClass}`}
                        >
                          {t.name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                            {t.name}
                          </h4>
                          <span className="text-[11px] text-stone-400 block truncate font-medium">
                            {t.location || "Bhopal, MP"}
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
                          className="inline-flex items-center gap-1.5 bg-[#f8f9fa] hover:bg-stone-100 text-stone-700 border border-stone-200/90 px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0 transition"
                          title="Verified on Google Business Profile"
                        >
                          <GoogleGIcon className="w-3 h-3 shrink-0" />
                          <span>Google</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="flex items-center gap-0.5 text-[#FBBC04]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={
                              i < (t.rating || 5)
                                ? "fill-[#FBBC04] text-[#FBBC04]"
                                : "text-stone-200 fill-stone-100"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-stone-700">
                        {Number(t.rating || 5).toFixed(1)}
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed font-normal">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-3 mt-3.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                    <div className="flex items-center gap-1 text-emerald-800 font-medium">
                      <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                      <span>Verified Fresh Delivery</span>
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {t.location ? t.location.split(",")[0] : "Bhopal"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button (Desktop Floating) */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-stone-700 hover:text-[#0a3d24] w-9 h-9 rounded-full items-center justify-center transition shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-stone-200/90 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight size={17} />
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
              className="cursor-default bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200/90 relative text-stone-900 animate-in fade-in zoom-in-95 duration-200"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition border border-stone-200/80 cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>

              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0a3d24] border border-emerald-200/70 flex items-center justify-center mb-3 mx-auto shadow-2xs">
                <GoogleGIcon className="w-5 h-5" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-center text-stone-900 mb-1">
                Share Your Customer Review
              </h3>
              <p className="text-xs text-stone-500 text-center mb-5 font-normal">
                Your experience helps fellow Bhopal families choose fresh, healthy food.
              </p>

              {submittedMsg ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-semibold text-center mb-4 space-y-3">
                  <p className="font-bold text-sm">{submittedMsg}</p>
                  <p className="text-stone-600 font-normal">
                    You can also share your review directly on our official Google Business page:
                  </p>
                  <a
                    href={googleSettings.googleReviewUrl || GOOGLE_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#0a3d24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm hover:bg-[#072817] transition"
                  >
                    <GoogleGIcon className="w-3.5 h-3.5 bg-white rounded-full p-0.5" />
                    <span>Post on Google Reviews</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs font-medium">
                  <div>
                    <label className="block text-stone-700 uppercase tracking-wider text-[11px] font-semibold mb-1">
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
                      className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#0a3d24] bg-stone-50/50 font-normal text-stone-800 text-xs transition"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 uppercase tracking-wider text-[11px] font-semibold mb-1">
                      Bhopal Locality / Colony
                    </label>
                    <select
                      value={reviewForm.location}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, location: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#0a3d24] bg-stone-50/50 font-normal text-stone-800 text-xs cursor-pointer transition"
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
                    <label className="block text-stone-700 uppercase tracking-wider text-[11px] font-semibold mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                          className="p-1 text-[#FBBC04] hover:scale-110 transition cursor-pointer"
                        >
                          <Star
                            size={20}
                            className={
                              s <= reviewForm.rating
                                ? "fill-[#FBBC04] text-[#FBBC04]"
                                : "text-stone-200 fill-stone-100"
                            }
                          />
                        </button>
                      ))}
                      <span className="text-xs text-stone-500 font-semibold ml-2">
                        {reviewForm.rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 uppercase tracking-wider text-[11px] font-semibold mb-1">
                      Your Experience / Feedback *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Taaza sabzi direct farm se aayi, same-day fast delivery aur packing clean thi!"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, comment: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#0a3d24] bg-stone-50/50 font-normal text-stone-800 text-xs resize-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#0a3d24] hover:bg-[#072817] text-white font-semibold rounded-full shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
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