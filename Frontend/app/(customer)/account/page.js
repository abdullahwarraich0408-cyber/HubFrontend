import { redirect } from "next/navigation";

export default function AccountSettingsRedirect() {
  redirect("/profile?tab=settings");
}
