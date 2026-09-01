import React from 'react'
import Hero from './Hero'
import MandiPriceTicker from './MandiPriceTicker'
import FlashFreeGiftRush from './FlashFreeGiftRush'
import Categoryslider from './Categoryslider'
import FilteredProduceSection from './FilteredProduceSection'
import FastReorderWidget from './FastReorderWidget'
import FlashDeals from './FlashDeals'
import CombosSection from './CombosSection'
import FarmClubVIPBanner from './FarmClubVIPBanner'
import MorningSubscriptionBanner from './MorningSubscriptionBanner'
import InteractiveFarmFeatures from './InteractiveFarmFeatures'
import Grocery from '@/model/groseri.model'
import Category from '@/model/category.model'
import ComboBundle from '@/model/combo.model'
import connectDb from '@/lib/db'
import Groceryitemcard from './Groceryitemcard'
import ProductCarousel from './ProductCarousel'
import PromoBanners from './PromoBanners'
import SocietyGroupOrderWidget from './SocietyGroupOrderWidget'
import FeaturesBanner from './FeaturesBanner'
import FarmFreshPromise from './FarmFreshPromise'
import PreFooter from './PreFooter'
import Testimonials from './Testimonials'
import Link from 'next/link'
import { Sparkles, RotateCcw, ChevronRight } from 'lucide-react'

import Banner from '@/model/banner.model'
import Testimonial from '@/model/testimonial.model'
import MandiRate from '@/model/mandi.model'
import { auth } from '@/auth'
import Order from '@/model/order'

export default async function Userdashbord() {
  await connectDb()
  const session = await auth()
  
  const newGroceriesPromise = Grocery.find({}).sort({ createdAt: -1 }).limit(24)
  const topGroceriesPromise = Grocery.find({}).sort({ rating: -1, numReviews: -1 }).limit(10)
  const flashDealsPromise = Grocery.find({ stock: { $gt: 0 } }).sort({ price: 1, rating: -1 }).limit(8)
  const bannersPromise = Banner.find({}).sort({ createdAt: -1 }).limit(5)
  const categoriesPromise = Category.find({}).sort({ createdAt: -1 })
  const testimonialsPromise = Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 })
  const mandiRatesPromise = MandiRate.find({ isActive: true }).sort({ updatedAt: -1 })
  
  let orderAgainGroceriesPromise: Promise<any[]> = Promise.resolve([])
  if (session?.user?.id) {
    orderAgainGroceriesPromise = Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .then(orders => {
        const recentProductIds = new Set();
        orders.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            if (item.grocery) recentProductIds.add(item.grocery.toString());
          });
        });
        if (recentProductIds.size > 0) {
          return Grocery.find({ _id: { $in: Array.from(recentProductIds) } }).limit(10);
        }
        return [];
      });
  }

  const comboBundlesPromise = ComboBundle.find({ isActive: true }).lean()

  const [newGroceries, topGroceries, flashDeals, banners, categories, testimonials, mandiRates, orderAgain, comboBundles] = await Promise.all([
    newGroceriesPromise,
    topGroceriesPromise,
    flashDealsPromise,
    bannersPromise,
    categoriesPromise,
    testimonialsPromise,
    mandiRatesPromise,
    orderAgainGroceriesPromise,
    comboBundlesPromise
  ]);

  const plainNew = JSON.parse(JSON.stringify(newGroceries))
  const plainTop = JSON.parse(JSON.stringify(topGroceries))
  const plainFlash = JSON.parse(JSON.stringify(flashDeals))
  const plainBanners = JSON.parse(JSON.stringify(banners))
  const plainCategories = JSON.parse(JSON.stringify(categories))
  const plainTestimonials = JSON.parse(JSON.stringify(testimonials))
  const plainMandiRates = JSON.parse(JSON.stringify(mandiRates))
  const plainOrderAgain = JSON.parse(JSON.stringify(orderAgain))
  const plainCombos = JSON.parse(JSON.stringify(comboBundles || []))

  return (
    <div className="bg-white w-full max-w-full overflow-x-hidden font-sans">
      {/* 1. High-Converting Sliding Hero Banner (Database-driven from MongoDB) */}
      <Hero banners={plainBanners} />

      {/* 🎁 2. Flash 3-4 Minute Free Gift Rush & 10-15 Min Express Delivery */}
      <FlashFreeGiftRush />

      {/* 3. Shop by Category (Zero Flicker & Preloaded from Database) */}
      <Categoryslider categories={plainCategories} />

      {/* 4. 🏷️ 1-Tap Filter Chips & Daily Mandi Harvest Specials (Primary Shopping Feed) */}
      <FilteredProduceSection groceries={plainNew} />

      {/* 5. Live Bhopal Mandi Rate & Price Drop Ticker */}
      <MandiPriceTicker initialRates={plainMandiRates} />

      {/* ⚡ 1-Click Fast Reorder Regular Farm Basket (Only for Logged in repeat buyers) */}
      <FastReorderWidget />

      {/* 6. Live Flash Deals & Discounts */}
      <FlashDeals products={plainFlash} />

      {/* 7. ⚡ Save-More Value Combos & Multipacks */}
      <CombosSection initialCombos={plainCombos} />

      {/* 8. 🏆 MyGreenDelight Farm Club VIP Green Pass Banner */}
      <FarmClubVIPBanner />

      {/* 9. Order Again (For logged in users with previous order history) */}
      {plainOrderAgain && plainOrderAgain.length > 0 && (
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-5 sm:py-8">
           <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2.5">
                 <div className="w-8 h-8 rounded-2xl bg-green-100 flex items-center justify-center text-[#0f8646]">
                    <RotateCcw size={18} />
                 </div>
                 <div>
                    <h2 className="text-base sm:text-2xl font-black text-gray-900">
                       Order Again
                    </h2>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                       Quickly reorder your previous staples
                    </p>
                 </div>
              </div>
           </div>

           <ProductCarousel>
             {plainOrderAgain.map((item: any) => (
                <div key={item._id} className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[300px] sm:h-[320px]">
                   <Groceryitemcard item={item} />
                </div>
             ))}
           </ProductCarousel>
        </div>
      )}

      {/* 10. Top Rated Products Grid */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-6 sm:py-10">
         <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Sparkles size={18} />
               </div>
               <div>
                  <h2 className="text-base sm:text-2xl font-black text-gray-900">
                     Top Rated Bhopal Favorites
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                     Highest customer rated produce this week
                  </p>
               </div>
            </div>
            <Link
               href="/shop"
               className="text-[#0f8646] hover:text-[#0c6a38] font-black text-xs sm:text-sm flex items-center gap-0.5 group transition"
            >
               <span>View all</span>
               <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-6">
           {plainTop.map((item: any) => (
             <Groceryitemcard key={item._id} item={item} />
           ))}
         </div>
      </div>

      {/* 11. Dual Authentic Promo Banners */}
      <PromoBanners banners={plainBanners.slice(1, 3)} />

      {/* 12. 🥗 Specialized Farm Experiences (Custom Salad Box, Recipe Kits, Gift Hampers) */}
      <InteractiveFarmFeatures />

      {/* 13. 🥛 Subah 7:00 AM Morning Milk & Veggie Subscription Banner */}
      <MorningSubscriptionBanner />

      {/* 14. 👥 Bhopal Society & Colony Group Orders (5% Community OFF) */}
      <SocietyGroupOrderWidget />

      {/* 15. Customer Testimonials & Reviews (Preloaded from MongoDB) */}
      <Testimonials initialTestimonials={plainTestimonials} />

      {/* 16. Farm to Fork Freshness Promise */}
      <FarmFreshPromise />

      {/* 17. Why Choose MyGreenDelight Features */}
      <FeaturesBanner />

      {/* 18. PreFooter Trust Elements */}
      <PreFooter />
    </div>
  )
}
