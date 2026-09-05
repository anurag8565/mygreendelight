'use client'

import { setUserdata } from '@/redux/userSlice'
import { setWishlist } from '@/redux/WishlistSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'
import type { AppDispatch } from '@/redux/store'

function useGetMe() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: session, status } = useSession()

  useEffect(() => {
    const getme = async () => {
      try {
        if (status === "unauthenticated") {
          dispatch(setUserdata(null))
          return
        }

        const result = await axios.get("/api/me")

        if (typeof result.data === 'object' && result.data !== null && result.data._id) {
          dispatch(setUserdata(result.data))
          if (result.data.wishlist) {
            dispatch(setWishlist(result.data.wishlist))
          }
        } else if (session?.user) {
          // Fallback if session exists but API was delayed
          dispatch(setUserdata({
            name: session.user.name || "Customer",
            email: session.user.email || "",
            role: (session.user as any).role || "user",
            image: session.user.image || "",
          }))
        } else {
          dispatch(setUserdata(null))
        }
      } catch (error) {
        if (session?.user) {
          dispatch(setUserdata({
            name: session.user.name || "Customer",
            email: session.user.email || "",
            role: (session.user as any).role || "user",
            image: session.user.image || "",
          }))
        } else {
          dispatch(setUserdata(null))
        }
      }
    }

    getme()
  }, [dispatch, session, status])
}

export default useGetMe