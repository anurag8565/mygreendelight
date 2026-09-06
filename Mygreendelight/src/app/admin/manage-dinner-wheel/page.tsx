import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ManageDinnerWheelPage() {
  redirect("/admin");
}
