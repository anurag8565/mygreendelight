import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import React from "react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/admin");
  }

  await connectDb();
  const dbUser = await User.findOne({ email: session.user.email }).select("role").lean();

  if (!dbUser || dbUser.role !== "admin") {
    redirect("/user");
  }

  return <>{children}</>;
}

