import React from "react";
import connectDb from "@/lib/db";
import CustomBoxIngredient from "@/model/custombox.model";
import CustomBoxBuilder from "@/components/CustomBoxBuilder";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function CustomBoxPage() {
  let plainIngredients: any[] = [];
  try {
    await connectDb();
    const ingredients = await CustomBoxIngredient.find({ isAvailable: true }).sort({ category: 1 });
    plainIngredients = JSON.parse(JSON.stringify(ingredients));
  } catch (dbErr) {
    console.warn("CustomBoxIngredient fetch warning:", dbErr);
  }
  const session = await auth();

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        role: (session.user as any).role || "user",
        image: (session.user as any).image || "",
        password: "",
      }
    : {
        name: "Guest",
        email: "",
        role: "user" as const,
        image: "",
        password: "",
      };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      <Nav user={user} />
      <main className="flex-1">
        <CustomBoxBuilder initialIngredients={plainIngredients} />
      </main>
      <Footer />
    </div>
  );
}
