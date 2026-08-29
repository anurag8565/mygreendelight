import React from 'react'
import Hero from './Hero'
import DeliveryRadarStrip from './DeliveryRadarStrip'
import Categoryslider from './Categoryslider'
import FlashDeals from './FlashDeals'
import Grocery from '@/model/groseri.model'
import connectDb from '@/lib/db'
import Groceryitemcard from './Groceryitemcard'
import ProductCarousel from './ProductCarousel'
import PromoBanners from './PromoBanners'
import FeaturesBanner from './FeaturesBanner'
import FarmFreshPromise from './FarmFreshPromise'
import PreFooter from './PreFooter'
import Testimonials from './Testimonials'
import Link from 'next/link'
import { Flame, Sparkles, RotateCcw, ChevronRight } from 'lucide-react'

import Banner from '@/model/banner.model'
import { auth } from '@/auth'
import Order from '@/model/order'

export default async function Userdashbord() {
  await connectDb()
  const session = await auth()
  
  const newGroceriesPromise = Grocery.find({}).sort({ createdAt: -1 }).limit(12)
  const topGroceriesPromise = Grocery.find({}).sort({ rating: -1, numReviews: -1 }).limit(10)
  const flashDealsPromise = Grocery.find({ stock: { $gt: 0 } }).sort({ price: 1, rating: -1 }).limit(8)
  const bannersPromise = Banner.find({}).sort({ createdAt: -1 }).limit(5)
  
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

  const [newGroceries, topGroceries, flashDeals, banners, orderAgain] = await Promise.all([
    newGroceriesPromise,
    topGroceriesPromise,
    flashDealsPromise,
    bannersPromise,
    orderAgainGroceriesPromise
  ]);

  const plainNew = JSON.parse(JSON.stringify(newGroceries))
  const plainTop = JSON.parse(JSON.stringify(topGroceries))
  const plainFlash = JSON.parse(JSON.stringify(flashDeals))
  const plainBanners = JSON.parse(JSON.stringify(banners))
  const plainOrderAgain = JSON.parse(JSON.stringify(orderAgain))

  return (
    <div className="bg-white w-full max-w-full overflow-x-hidden">
      {/* 1. Hero Banner */}
      <Hero banner={plainBanners[0]} />

      {/* 2. Live 10-15 Min Express Delivery Radar Strip */}
      <DeliveryRadarStrip />

      {/* 3. Shop by Category */}
      <Categoryslider />

      {/* 4. Live Flash Deals with Real Reverse Countdown Clock */}
      <FlashDeals products={plainFlash} />
      
      {/* 5. Best Deals for You */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-6 sm:py-10">
         <div className="flex items-center justify-between mb-5 sm:mb-7">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Flame size={18} />
               </div>
               <div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900">
                     Best Deals for You
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                     Handpicked discounts on daily grocery essentials
                  </p>
               </div>
            </div>
            <Link
               href="/shop"
               className="text-[#0f8646] hover:text-[#0c6a38] font-bold text-xs sm:text-sm flex items-center gap-1 group transition"
            >
               <span>View All</span>
               <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
         </div>

         <ProductCarousel>
           {plainNew.map((item: any) => (
              <div key={item._id} className="w-[155px] sm:w-[200px] md:w-[210px] snap-start shrink-0 flex flex-col h-[300px] sm:h-[320px]">
                 <Groceryitemcard item={item} />
              </div>
           ))}
         </ProductCarousel>
      </div>

      {/* 6. Order Again (For logged in users with order history) */}
      {plainOrderAgain && plainOrderAgain.length > 0 && (
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 pb-6 sm:pb-10">
           <div className="flex items-center justify-between mb-5 sm:mb-7">
              <div className="flex items-center gap-2.5">
                 <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-[#0f8646]">
                    <RotateCcw size={18} />
                 </div>
                 <div>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900">
                       Order Again
                    </h2>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                       Quickly reorder items you previously purchased
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

      {/* 7. Dual Promo Banners (Coupon code copyable) */}
      <PromoBanners banners={plainBanners.slice(1, 3)} />

      {/* 8. Farm to Fork Freshness Promise (Desktop) */}
      <div className="hidden md:block">
        <FarmFreshPromise />
      </div>

      {/* 9. Why Choose MyGreenDelight (Desktop) */}
      <div className="hidden md:block">
        <FeaturesBanner />
      </div>

      {/* 10. Top Rated Products Grid */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-6 sm:py-12">
         <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Sparkles size={18} />
               </div>
               <div>
                  <h2 className="text-base sm:text-2xl font-black text-gray-900">
                     Top Rated Produce
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                     Highest customer rated daily groceries
                  </p>
               </div>
            </div>
            <Link
               href="/shop"
               className="text-[#0f8646] hover:text-[#0c6a38] font-bold text-xs sm:text-sm flex items-center gap-0.5 group transition"
            >
               <span>View all</span>
               <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-6">
           {plainTop.map((item: any) => (
             <Groceryitemcard key={item._id} item={item} />
           ))}
         </div>
      </div>

      {/* 11. Customer Testimonials & Reviews (Desktop) */}
      <div className="hidden md:block">
        <Testimonials />
      </div>

      {/* 12. PreFooter Trust Elements (Desktop) */}
      <div className="hidden md:block">
        <PreFooter />
      </div>
    </div>
  )
}
