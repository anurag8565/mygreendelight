'use client'

import { setUserdata } from '@/redux/userSlice'
import { setWishlist, hydrateWishlist } from '@/redux/WishlistSlice'
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
      dispatch(hydrateWishlist({ userId: null }))
      return
    }

    if (status !== "authenticated") {
      return
    }

    const getme = async () => {
      try {
        const result = await axios.get("/api/me")

        if (typeof result.data === 'object' && result.data !== null && result.data.email) {
          dispatch(setUserdata(result.data))
          const userId = result.data._id ? String(result.data._id) : null
          const validWishlist = Array.isArray(result.data.wishlist)
            ? result.data.wishlist.filter((w: any) => w && typeof w === 'object' && w.name)
            : []
          if (validWishlist.length > 0) {
            dispatch(setWishlist({ items: validWishlist, userId }))
          } else {
            dispatch(hydrateWishlist({ userId }))
          }
        } else if (session?.user?.email) {
          dispatch(setUserdata(session.user as any))
          const rawId = (session.user as any)?._id || (session.user as any)?.id || null
          const userId = rawId ? String(rawId) : null
          try {
            const wRes = await axios.get("/api/wishlist")
            if (wRes.data?.success && Array.isArray(wRes.data?.wishlist) && wRes.data.wishlist.length > 0) {
              dispatch(setWishlist({ items: wRes.data.wishlist, userId }))
            } else {
              dispatch(hydrateWishlist({ userId }))
            }
          } catch (_) {
            dispatch(hydrateWishlist({ userId }))
          }
        }
      } catch (error) {
        if (session?.user?.email) {
          dispatch(setUserdata(session.user as any))
          const rawId = (session.user as any)?._id || (session.user as any)?.id || null
          const userId = rawId ? String(rawId) : null
          dispatch(hydrateWishlist({ userId }))
        }
      }
    }

    getme()
  }, [dispatch, session, status])
}

export default useGetMe