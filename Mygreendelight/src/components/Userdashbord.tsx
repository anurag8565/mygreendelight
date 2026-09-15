import React from 'react'
import Hero from './Hero'
import TrustRibbon from './TrustRibbon'
import Categoryslider from './Categoryslider'
import FilteredProduceSection from './FilteredProduceSection'
import FlashDeals from './FlashDeals'
import DailyRewardWidget from './DailyRewardWidget'
import Grocery from '@/model/groseri.model'
import Category from '@/model/category.model'
import ComboBundle from '@/model/combo.model'
import connectDb from '@/lib/db'
import Groceryitemcard from './Groceryitemcard'
import ProductCarousel from './ProductCarousel'
import FarmFreshPromise from './FarmFreshPromise'
import BhopalSocietyPool from './BhopalSocietyPool'
import BhopalParchiShopping from './BhopalParchiShopping'
import Testimonials from './Testimonials'
import { RotateCcw } from 'lucide-react'

import Banner from '@/model/banner.model'
import Testimonial from '@/model/testimonial.model'
import Setting from '@/model/setting.model'
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
  let storeSetting: any = null;

  try {
    await connectDb();

    const newGroceriesPromise = Grocery.find({ status: { $ne: 'draft' } }).sort({ isFeatured: -1, createdAt: -1 }).limit(300).lean();
    const flashDealsPromise = Grocery.find({ stock: { $gt: 0 }, status: { $ne: 'draft' } }).sort({ price: 1, rating: -1 }).limit(10).lean();
    const featuredGroceriesPromise = Grocery.find({
      status: { $ne: 'draft' },
      isFeatured: true,
    }).sort({ createdAt: -1 }).limit(16).lean();
    const bannersPromise = Banner.find({ isActive: { $ne: false } }).sort({ order: 1, createdAt: -1 }).lean();
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
    const settingPromise = Setting.findOne({ key: "store_delivery_settings" }).lean().catch(() => null);

    const results = await Promise.all([
      newGroceriesPromise.catch(() => []),
      flashDealsPromise.catch(() => []),
      featuredGroceriesPromise.catch(() => []),
      bannersPromise.catch(() => []),
      categoriesPromise.catch(() => []),
      testimonialsPromise.catch(() => []),
      orderAgainGroceriesPromise,
      comboBundlesPromise,
      settingPromise,
    ]);

    newGroceries = results[0] || [];
    flashDeals = results[1] || [];
    featuredGroceries = results[2] || [];
    banners = results[3] || [];
    categories = results[4] || [];
    testimonials = results[5] || [];
    orderAgain = results[6] || [];
    comboBundles = results[7] || [];
    storeSetting = results[8] || null;
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
  const plainGoogleSettings = storeSetting ? JSON.parse(JSON.stringify(storeSetting)) : null;

  return (
    <div className="bg-[#faf9f5] w-full max-w-full overflow-x-clip font-sans">
      {/* 1. Hero Banner */}
      <Hero banners={plainBanners} />

      {/* 1.5 Quick Commerce Trust & Speed Ribbon */}
      <TrustRibbon />

      {/* 2. Shop by Category Circles */}
      <Categoryslider categories={plainCategories} />

      {/* 3. Daily Lucky Scratch Card & Rewards (Claim Discount at the Top) */}
      <DailyRewardWidget />

      {/* 4. Interactive Fresh Produce Section (3 Tabs: Vegetables, Fruits, Exotics + Grid/List Switcher) */}
      <FilteredProduceSection groceries={plainNew} />

      {/* 5. Live Flash Deals & Steal Discounts */}
      {plainFlash && plainFlash.length > 0 && (
        <FlashDeals products={plainFlash} />
      )}

      {/* 6. Bhopal Community Society Bulk-Drop & Pool Savings */}
      <BhopalSocietyPool />

      {/* 8. Bhopal Parchi & WhatsApp Voice Shopping (No Typing Required) */}
      <BhopalParchiShopping />

      {/* 9. Tone 2: Order Again Carousel (Soft Warm Stone #f7f6f2) */}
      {plainOrderAgain && plainOrderAgain.length > 0 && (
        <div className="w-full py-4 sm:py-6 bg-[#f7f6f2] border-b border-stone-200/70 font-sans">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">
             <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                   <RotateCcw size={18} className="text-[#0a3d24]" />
                   <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-stone-900 tracking-tight font-heading">
                      Order Again
                   </h2>
                </div>
             </div>

             <ProductCarousel>
               {plainOrderAgain.map((item: any) => (
                  <div key={item._id} className="w-[170px] sm:w-[210px] md:w-[225px] snap-start shrink-0 flex flex-col h-[335px] sm:h-[355px]">
                     <Groceryitemcard item={item} />
                  </div>
               ))}
             </ProductCarousel>
          </div>
        </div>
      )}

      {/* 10. Tone 1: Customer Testimonials & Reviews (Pure White) */}
      <Testimonials
        initialTestimonials={plainTestimonials}
        initialGoogleSettings={plainGoogleSettings}
      />

      {/* 11. Tone 2: Farm to Fork Freshness Promise & Trust Guarantee (Soft Luxury Gray #f8f9fa) */}
      <FarmFreshPromise />
    </div>
  )
}
