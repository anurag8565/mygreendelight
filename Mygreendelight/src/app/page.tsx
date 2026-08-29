import { auth } from '@/auth'
import Admindashbord from '@/components/Admindashbord'
import Deliveryboydashbord from '@/components/Deliveryboydashbord'
import EditMobile from '@/components/EditMobile'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import Userdashbord from '@/components/Userdashbord'
import connectDb from '@/lib/db'
import User from '@/model/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

export const dynamic = "force-dynamic";

async function Home() {

  await connectDb()

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await User.findById(session.user.id)

  if (!user) {
    redirect('/login')
  }

  // ✅ FIXED
  const incomplee = !user.mobile || !user.role

  if (incomplee) {
    return <EditMobile />
  }

  const plainUser = JSON.parse(JSON.stringify(user))

  return (
    <>
      <Nav user={plainUser} />

      {user.role === "user" ? (
        <Userdashbord />
      ) : user.role === "admin" ? (
        <Admindashbord />
      ) : (
        <Deliveryboydashbord />
      )}
      <Footer/>
    </>
    
  )
}

export default Home