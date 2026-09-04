import React from 'react'
import Hero from './Hero'
import MandiPriceTicker from './MandiPriceTicker'
import Categoryslider from './Categoryslider'
import FilteredProduceSection from './FilteredProduceSection'
import FlashDeals from './FlashDeals'
import FeaturedProduceSection from './FeaturedProduceSection'
import CombosSection from './CombosSection'
import DailyRewardWidget from './DailyRewardWidget'
import Grocery from '@/model/groseri.model'
import Category from '@/model/category.model'
import ComboBundle from '@/model/combo.model'
import connectDb from '@/lib/db'
import Groceryitemcard from './Groceryitemcard'
import ProductCarousel from './ProductCarousel'
import FarmFreshPromise from './FarmFreshPromise'
import PreFooter from './PreFooter'
import Testimonials from './Testimonials'
import { RotateCcw } from 'lucide-react'

import Banner from '@/model/banner.model'
import Testimonial from '@/model/testimonial.model'
import MandiRate from '@/model/mandi.model'
import { auth } from '@/auth'
import Order from '@/model/order'

export default async function Userdashbord() {
  await connectDb()
  const session = await auth()
  
  const newGroceriesPromise = Grocery.find({}).sort({ createdAt: -1 }).limit(30)
  const flashDealsPromise = Grocery.find({ stock: { $gt: 0 } }).sort({ price: 1, rating: -1 }).limit(10)
  const featuredGroceriesPromise = Grocery.find({ rating: { $gte: 4.5 } }).sort({ rating: -1, numReviews: -1 }).limit(10)
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

  const [newGroceries, flashDeals, featuredGroceries, banners, categories, testimonials, mandiRates, orderAgain, comboBundles] = await Promise.all([
    newGroceriesPromise,
    flashDealsPromise,
    featuredGroceriesPromise,
    bannersPromise,
    categoriesPromise,
    testimonialsPromise,
    mandiRatesPromise,
    orderAgainGroceriesPromise,
    comboBundlesPromise,
  ]);

  const plainNew = JSON.parse(JSON.stringify(newGroceries))
  const plainFlash = JSON.parse(JSON.stringify(flashDeals))
  const plainFeatured = JSON.parse(JSON.stringify(featuredGroceries))
  const plainBanners = JSON.parse(JSON.stringify(banners))
  const plainCategories = JSON.parse(JSON.stringify(categories))
  const plainTestimonials = JSON.parse(JSON.stringify(testimonials))
  const plainMandiRates = JSON.parse(JSON.stringify(mandiRates))
  const plainOrderAgain = JSON.parse(JSON.stringify(orderAgain))
  const plainCombos = JSON.parse(JSON.stringify(comboBundles || []))

  return (
    <div className="bg-white w-full max-w-full overflow-x-hidden font-sans space-y-2 sm:space-y-4">
      {/* 1. High-Converting Sliding Hero Banner (Managed in Admin /managebanners) */}
      <Hero banners={plainBanners} />

      {/* 2. Shop by Category Slider (Managed in Admin /manage-categories) */}
      <Categoryslider categories={plainCategories} />

      {/* 3. 🔥 Live Flash Deals & Steal Discounts (Managed in Admin /manage-flash-deals) */}
      {plainFlash && plainFlash.length > 0 && (
        <FlashDeals products={plainFlash} />
      )}

      {/* 4. 👑 Bhopal Top Bestsellers & Featured Picks (Top Rated & Customer Favorites) */}
      {plainFeatured && plainFeatured.length > 0 && (
        <FeaturedProduceSection products={plainFeatured} />
      )}

      {/* 5. Live Bhopal Mandi Rate & Price Drop Ticker (Managed in Admin /manage-mandi) */}
      <MandiPriceTicker initialRates={plainMandiRates} />

      {/* 6. 🥬 Daily Fresh Farm Mandi & 1-Tap Category Filter Grid (Managed in Admin /viewgrocery) */}
      <FilteredProduceSection groceries={plainNew} />

      {/* 7. ⚡ Save-More Value Combos & Multipacks (Managed in Admin /manage-combos) */}
      {plainCombos && plainCombos.length > 0 && (
        <CombosSection initialCombos={plainCombos} />
      )}

      {/* 8. 🎁 Daily Lucky Scratch Card & Rewards (Managed in Admin /manage-rewards) */}
      <DailyRewardWidget />

      {/* 9. Order Again Carousel (Only for logged in users with previous orders) */}
      {plainOrderAgain && plainOrderAgain.length > 0 && (
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-4 sm:py-6">
           <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-7 h-7 rounded-xl bg-green-100 flex items-center justify-center text-[#0f8646]">
                    <RotateCcw size={16} />
                 </div>
                 <div>
                    <h2 className="text-base sm:text-xl font-black text-gray-900">
                       Order Again
                    </h2>
                    <p className="text-[11px] text-gray-500">
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

      {/* 10. Customer Testimonials & Reviews (Managed in Admin /managetestimonials) */}
      <Testimonials initialTestimonials={plainTestimonials} />

      {/* 11. Farm to Fork Freshness Promise & Trust Guarantee */}
      <FarmFreshPromise />

      {/* 12. PreFooter Trust Elements */}
      <PreFooter />
    </div>
  )
}
