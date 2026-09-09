'use client'

import { setUserdata } from '@/redux/userSlice'
import { setWishlist } from '@/redux/WishlistSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'

function useGetMe() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      dispatch(setUserdata(null))
      dispatch(setWishlist({ items: [], userId: null }))
      return
    }

    const getme = async () => {
      try {
        const result = await axios.get("/api/me")

        if (typeof result.data === 'object' && result.data !== null && result.data.email) {
          dispatch(setUserdata(result.data))
          const validWishlist = Array.isArray(result.data.wishlist)
            ? result.data.wishlist.filter((w: any) => w && typeof w === 'object' && w.name)
            : []
          dispatch(setWishlist({ items: validWishlist, userId: result.data._id ? String(result.data._id) : null }))
        } else if (session?.user?.email) {
          dispatch(setUserdata(session.user as any))
          try {
            const wRes = await axios.get("/api/wishlist")
            if (wRes.data?.success && Array.isArray(wRes.data?.wishlist)) {
              dispatch(setWishlist({ items: wRes.data.wishlist, userId: (session.user as any)?._id || (session.user as any)?.id || null }))
            }
          } catch (_) {}
        }
      } catch (error) {
        if (session?.user?.email) {
          dispatch(setUserdata(session.user as any))
          try {
            const wRes = await axios.get("/api/wishlist")
            if (wRes.data?.success && Array.isArray(wRes.data?.wishlist)) {
              dispatch(setWishlist({ items: wRes.data.wishlist, userId: (session.user as any)?._id || (session.user as any)?.id || null }))
            }
          } catch (_) {}
        }
      }
    }

    getme()
  }, [dispatch, session, status])
}

export default useGetMe