'use client'
import React from 'react'
import { motion } from "framer-motion"
import { ArrowRight, Bike, ShoppingCart } from 'lucide-react'
type proptype={
    nextstep:(s:number)=>void
}
function Welcome({nextstep}:proptype) {
    return (
        <div className='flex flex-col justify-center items-center p-6 min-h-screen text-center'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='flex items-center gap-3 '>
                <ShoppingCart className='text-green-600 w-10 h-10' />
                <h1 className='text-4xl font-bold text-green-600'>MY GREEN DELIGHT</h1>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className='mt-4 text-lg text-gray-600 max-w-md'>
                My Green Delight: your one-stop grocery shop.
                Fast, smart, and hassle-free shopping.
                Delivered to your door.
            </motion.p>
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className='mt-10 flex items-center gap-10 justify-center'>
                <Bike className='text-orange-600 w-24 h-24 md:h-32 md:w-32' />
                <ShoppingCart className='text-green-600 w-24 h-24 md:h-32 md:w-32' />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className='mt-6'>
                <button className='bg-green-600 inline-flex gap-2 mt-10 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-green-700 transition-colors'onClick={()=>nextstep(2)}>Next <ArrowRight/></button>
            </motion.div>

        </div>
    )
}

export default Welcome
