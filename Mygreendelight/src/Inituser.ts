'use client'
import React from 'react'
import useGetMe from './hooks/useGetMe'
import { useCartSync } from './hooks/useCartSync'

function Inituser() {
  useGetMe()
  useCartSync()
  return null
}

export default Inituser
