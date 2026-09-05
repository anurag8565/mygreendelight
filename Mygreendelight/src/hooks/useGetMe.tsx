'use client'

import { setUserdata } from '@/redux/userSlice'
import { setWishlist } from '@/redux/WishlistSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/redux/store'

function useGetMe() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {

    console.log("USEGETME RUNNING")

    const getme = async () => {
      try {

        const result = await axios.get("/api/me")

        console.log("API ME DATA", result.data)

        if (typeof result.data === 'object' && result.data !== null) {
          dispatch(setUserdata(result.data))
          if (result.data.wishlist) {
            dispatch(setWishlist(result.data.wishlist))
          }
        } else {
          dispatch(setUserdata(null))
        }

      } catch (error) {
        console.log("GETME ERROR", error)
      }
    }

    getme()

  }, [dispatch])
}

export default useGetMe