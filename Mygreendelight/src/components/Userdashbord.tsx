import React from 'react'
import Hero from './Hero'
import TrustRibbon from './TrustRibbon'
import Categoryslider from './Categoryslider'
import FilteredProduceSection from './FilteredProduceSection'
import FlashDeals from './FlashDeals'
import CombosSection from './CombosSection'
import DailyRewardWidget from './DailyRewardWidget'
import Grocery from '@/model/groseri.model'
import Category from '@/model/category.model'
import ComboBundle from '@/model/combo.model'
import connectDb from '@/lib/db'
import Groceryitemcard from './Groceryitemcard'
import ProductCarousel from './ProductCarousel'
import FarmFreshPromise from './FarmFreshPromise'
import BhopalCompetitorSEOShowcase from './BhopalCompetitorSEOShowcase'
import Testimonials from './Testimonials'
import { RotateCcw } from 'lucide-react'

import Banner from '@/model/banner.model'
import Testimonial from '@/model/testimonial.model'
import { auth } from '@/auth'
import Order from '@/model/order'

export default async function Userdashbord() {
  let session = null;
  try {
    session = await auth();
  } catch (authErr) {
    console.warn("Userdashbord auth check warning:", authErr);
  }

  let newGroceries: any[] = [];
  let flashDeals: any[] = [];
  let featuredGroceries: any[] = [];
  let banners: any[] = [];
  let categories: any[] = [];
  let testimonials: any[] = [];
  let orderAgain: any[] = [];
  let comboBundles: any[] = [];

  try {
    await connectDb();

    const newGroceriesPromise = Grocery.find({ status: { $ne: 'draft' } }).sort({ isFeatured: -1, createdAt: -1 }).limit(300).lean();
    const flashDealsPromise = Grocery.find({ stock: { $gt: 0 }, status: { $ne: 'draft' } }).sort({ price: 1, rating: -1 }).limit(10).lean();
    const featuredGroceriesPromise = Grocery.find({
      status: { $ne: 'draft' },
      isFeatured: true,
    }).sort({ createdAt: -1 }).limit(16).lean();
    const bannersPromise = Banner.find({}).sort({ createdAt: -1 }).limit(5).lean();
    const categoriesPromise = Category.find({}).sort({ createdAt: -1 }).lean();
    const testimonialsPromise = Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 }).lean();

    let orderAgainGroceriesPromise: Promise<any[]> = Promise.resolve([]);
    if (session?.user?.id) {
      orderAgainGroceriesPromise = Order.find({ user: session.user.id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .then(async orders => {
          const recentProductIds = new Set();
          orders.forEach((order: any) => {
            order.items?.forEach((item: any) => {
              if (item.grocery) recentProductIds.add(item.grocery.toString());
            });
          });
          if (recentProductIds.size > 0) {
            return Grocery.find({ _id: { $in: Array.from(recentProductIds) } }).limit(10).lean();
          }
          return [];
        })
        .catch(() => []);
    }

    const comboBundlesPromise = ComboBundle.find({ isActive: true }).lean().catch(() => []);

    const results = await Promise.all([
      newGroceriesPromise.catch(() => []),
      flashDealsPromise.catch(() => []),
      featuredGroceriesPromise.catch(() => []),
      bannersPromise.catch(() => []),
      categoriesPromise.catch(() => []),
      testimonialsPromise.catch(() => []),
      orderAgainGroceriesPromise,
      comboBundlesPromise,
    ]);

    newGroceries = results[0] || [];
    flashDeals = results[1] || [];
    featuredGroceries = results[2] || [];
    banners = results[3] || [];
    categories = results[4] || [];
    testimonials = results[5] || [];
    orderAgain = results[6] || [];
    comboBundles = results[7] || [];
  } catch (err) {
    console.error("Userdashbord data fetch error:", err);
  }

  const plainNew = JSON.parse(JSON.stringify(newGroceries || []));
  const plainFlash = JSON.parse(JSON.stringify(flashDeals || []));
  const plainFeatured = JSON.parse(JSON.stringify(featuredGroceries || []));
  const plainBanners = JSON.parse(JSON.stringify(banners || []));
  const plainCategories = JSON.parse(JSON.stringify(categories || []));
  const plainTestimonials = JSON.parse(JSON.stringify(testimonials || []));
  const plainOrderAgain = JSON.parse(JSON.stringify(orderAgain || []));
  const plainCombos = JSON.parse(JSON.stringify(comboBundles || []));

  return (
    <div className="bg-white w-full max-w-full overflow-x-clip font-sans">
      {/* 1. Hero Banner */}
      <Hero banners={plainBanners} />

      {/* 1.5 Quick Commerce Trust & Speed Ribbon */}
      <TrustRibbon />

      {/* 2. Shop by Category Slider */}
      <Categoryslider categories={plainCategories} />

      {/* 3. Interactive Fresh Produce Section (3 Tabs: Vegetables, Fruits, Exotics + Grid/List Switcher) */}
      <FilteredProduceSection groceries={plainNew} />

      {/* 4. Live Flash Deals & Steal Discounts */}
      {plainFlash && plainFlash.length > 0 && (
        <FlashDeals products={plainFlash} />
      )}

      {/* 5. Save-More Value Combos & Multipacks */}
      {plainCombos && plainCombos.length > 0 && (
        <CombosSection initialCombos={plainCombos} />
      )}

      {/* 7. Tone 1: Daily Lucky Scratch Card & Rewards (Pure White) */}
      <DailyRewardWidget />

      {/* 9. Tone 2: Order Again Carousel (Soft Luxury Gray #f8f9fa) */}
      {plainOrderAgain && plainOrderAgain.length > 0 && (
        <div className="w-full py-5 sm:py-8 bg-[#f8f9fa] border-y border-gray-100 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
             <div className="flex items-center justify-between mb-3.5 sm:mb-5">
                <div className="flex items-center gap-2">
                   <RotateCcw size={18} className="text-[#0c831f]" />
                   <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                      Order Again
                   </h2>
                </div>
             </div>

             <ProductCarousel>
               {plainOrderAgain.map((item: any) => (
                  <div key={item._id} className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[320px] sm:h-[340px]">
                     <Groceryitemcard item={item} />
                  </div>
               ))}
             </ProductCarousel>
          </div>
        </div>
      )}

      {/* 10. Tone 1: Customer Testimonials & Reviews (Pure White) */}
      <Testimonials initialTestimonials={plainTestimonials} />

      {/* 11. Tone 2: Farm to Fork Freshness Promise & Trust Guarantee (Soft Luxury Gray #f8f9fa) */}
      <FarmFreshPromise />

      {/* 12. Competitor Comparison, Bhopal Locality Hubs & Google FAQ Schema */}
      <BhopalCompetitorSEOShowcase />
    </div>
  )
}
