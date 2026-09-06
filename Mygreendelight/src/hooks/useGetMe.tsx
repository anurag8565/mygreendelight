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
      return
    }

    const getme = async () => {
      try {
        const result = await axios.get("/api/me")

        if (typeof result.data === 'object' && result.data !== null && result.data.email) {
          dispatch(setUserdata(result.data))
          if (result.data.wishlist) {
            dispatch(setWishlist(result.data.wishlist))
          }
        } else if (session?.user?.email) {
          dispatch(setUserdata(session.user as any))
        }
      } catch (error) {
        if (session?.user?.email) {
          dispatch(setUserdata(session.user as any))
        }
      }
    }

    getme()
  }, [dispatch, session, status])
}

export default useGetMe