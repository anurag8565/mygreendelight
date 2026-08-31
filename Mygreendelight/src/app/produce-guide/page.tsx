import React from "react";
import connectDb from "@/lib/db";
import ProduceGuide from "@/model/produceGuide.model";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { auth } from "@/auth";
import { Thermometer, Clock, Lightbulb, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ProduceGuidePage() {
  await connectDb();
  const session = await auth();
  const guides = await ProduceGuide.find({}).sort({ createdAt: 1 });

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        role: (session.user as any).role || "user",
        image: (session.user as any).image || "",
        password: "",
      }
    : {
        name: "Guest",
        email: "",
        role: "user" as const,
        image: "",
        password: "",
      };

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col justify-between">
      <Nav user={user} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-[#0f8646] font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Farm-to-Kitchen Freshness Handbook</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
            Produce Ripeness & Kitchen Storage Guide
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
            Learn authentic Indian kitchen storage hacks, shelf-life secrets, and preservation techniques for every harvest.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((g: any) => (
            <div
              key={g._id?.toString()}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Info */}
                <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shrink-0 border border-gray-100 shadow-2xs">
                    {g.icon}
                  </div>
                  <div>
                    <h2 className="font-black text-base sm:text-lg text-gray-900 leading-snug">
                      {g.category}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-bold mt-1">
                      <span className="flex items-center gap-1 text-emerald-800">
                        <Thermometer size={12} /> {g.temperature}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-800">
                        <Clock size={12} /> ~{g.shelfLifeDays} Days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Storage advice */}
                <div className="space-y-3 text-xs mb-4">
                  <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100">
                    <span className="font-black text-gray-900 block mb-0.5">📍 Where to Keep</span>
                    <p className="text-gray-600 font-medium leading-relaxed">{g.idealStorage}</p>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-1 font-black text-blue-900 mb-0.5">
                      <Lightbulb size={13} className="text-amber-500 fill-amber-400" />
                      <span>Desi Kitchen Hack</span>
                    </div>
                    <p className="text-blue-950 font-medium leading-relaxed">{g.kitchenHacks}</p>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                    <span className="font-black text-emerald-950 block mb-0.5">👁️ Ripeness Check</span>
                    <p className="text-emerald-900 font-medium leading-relaxed">{g.ripenessTips}</p>
                  </div>
                </div>
              </div>

              {/* Cleanliness Tag */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500">
                <span className="flex items-center gap-1 text-[#0f8646]">
                  <ShieldCheck size={14} /> 100% Ozone Sanitized
                </span>
                <Link
                  href="/shop"
                  className="text-gray-800 hover:text-[#0f8646] font-black flex items-center gap-0.5 transition"
                >
                  <span>Shop Fresh</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
