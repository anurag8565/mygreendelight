import React from "react";
import connectDb from "@/lib/db";
import CustomBoxIngredient from "@/model/custombox.model";
import CustomBoxBuilder from "@/components/CustomBoxBuilder";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { auth } from "@/auth";

export default async function CustomBoxPage() {
  await connectDb();
  const session = await auth();
  const ingredients = await CustomBoxIngredient.find({ isAvailable: true }).sort({ category: 1 });
  const plainIngredients = JSON.parse(JSON.stringify(ingredients));

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
