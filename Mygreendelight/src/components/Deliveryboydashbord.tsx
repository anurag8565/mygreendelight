'use client'

import React from 'react'
import Deliveryboy from './Deliveryboy'

interface Props {
  initialUser?: any;
}

export default function Deliveryboydashbord({ initialUser }: Props) {
  return (
    <Deliveryboy initialUser={initialUser} />
  )
}
