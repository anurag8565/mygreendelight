import { auth } from '@/auth';
import connectDb from '@/lib/db';
import User from '@/model/user.model';
import Deliveryboydashbord from '@/components/Deliveryboydashbord';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delivery Partner Hub | SubziQuick Bhopal',
  description: 'Rider dispatch, live navigation, customer OTP verification and route dashboard.',
};

export default async function DeliveryBoyPage() {
  await connectDb();
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/deliveryboy');
  }

  const user = await User.findOne({ email: session.user.email }).lean();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'deliveryboy' && user.role !== 'admin') {
    redirect('/user');
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="min-h-screen bg-[#f8faf9] text-gray-900 font-sans">
      <Deliveryboydashbord initialUser={plainUser} />
    </div>
  );
}
