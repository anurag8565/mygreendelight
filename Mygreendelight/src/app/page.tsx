import { auth } from '@/auth'
import Deliveryboydashbord from '@/components/Deliveryboydashbord'
import EditMobile from '@/components/EditMobile'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import Userdashbord from '@/components/Userdashbord'
import connectDb from '@/lib/db'
import User from '@/model/user.model'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

export const dynamic = "force-dynamic";

async function Home() {
  try {
    await connectDb();
  } catch (err) {
    console.error("DB connection error on Home:", err);
  }

  let session = null;
  try {
    session = await auth();
  } catch (err) {
    console.warn("Auth check warning on Home:", err);
  }

  let user = null;
  if (session?.user?.email) {
    try {
      user = await User.findOne({
        email: { $regex: new RegExp(`^${session.user.email}$`, "i") }
      });
    } catch (uErr) {
      console.error("User lookup error on Home:", uErr);
    }
  }

  // Only logged-in regular users / delivery boys with incomplete profiles need completion
  if (user && user.role !== "admin" && (!user.mobile || !user.role)) {
    return <EditMobile />;
  }

  const plainUser = user ? JSON.parse(JSON.stringify(user)) : null;

  return (
    <>
      {user?.role === "admin" && (
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

      {user?.role === "deliveryboy" ? (
        <Deliveryboydashbord />
      ) : (
        <Userdashbord />
      )}
      <Footer />
    </>
  );
}

export default Home