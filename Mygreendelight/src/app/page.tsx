import { auth } from '@/auth'
import Deliveryboydashbord from '@/components/Deliveryboydashbord'
import EditMobile from '@/components/EditMobile'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import Userdashbord from '@/components/Userdashbord'
import connectDb from '@/lib/db'
import User from '@/model/user.model'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import React from 'react'

export const dynamic = "force-dynamic";

async function Home() {

  await connectDb()

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userId = session.user.id;
  const user = userId 
    ? await User.findById(userId) 
    : await User.findOne({ email: session.user.email });

  if (!user) {
    redirect('/login')
  }

  // Only regular users / delivery boys need to complete their profile
  const incomplee = user.role !== "admin" && (!user.mobile || !user.role)

  if (incomplee) {
    return <EditMobile />
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <>
      {user.role === "admin" && (
        <div className="bg-[#093e21] text-white py-2 px-4 text-xs font-bold flex items-center justify-between sticky top-0 z-[100] shadow-md border-b border-green-800">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-gray-950 text-[10px] px-2 py-0.5 rounded font-black tracking-wide">
              ADMIN MODE
            </span>
            <span className="text-green-100 hidden sm:inline">
              You are previewing the live customer store as Administrator
            </span>
          </div>
          <Link
            href="/admin"
            className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Go to Admin Center</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
      <Nav user={plainUser} />

      {user.role === "deliveryboy" ? (
        <Deliveryboydashbord />
      ) : (
        <Userdashbord />
      )}
      <Footer />
    </>
  );
}

export default Home