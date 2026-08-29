'use client'
import Welcome from '@/components/Welcome'
import Registerform from '@/components/Registerform'
import React, { useState } from 'react'

function Register() {
    const [step , setstep]=useState(1)  
  return (
    <div>
      {step == 1 ?<Welcome nextstep={setstep} />: <Registerform/>}
    </div>
  )
}

export default Register
