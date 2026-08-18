// import { CookiePolicyPage } from "@/features/legal/pages/CookiePolicyPage";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Cookie Policy & Preference Center | Medzoos",
  description: "Manage your cookie preferences and learn how Medzoos uses cookies.",
};

export default function Page() {
  // Cookie policy currently disabled — redirecting to Privacy Policy
  redirect("/privacy-policy");
  // return <CookiePolicyPage />;
}
