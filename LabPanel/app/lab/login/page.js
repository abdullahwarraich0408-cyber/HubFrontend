import { LabLoginPage } from "@/features/auth/pages/LabLoginPage";

export const metadata = {
  title: "Lab Login | Medzoos Lab Portal",
  description: "Sign in to your diagnostic laboratory operations portal.",
};

export default function LabLoginRoute() {
  return <LabLoginPage />;
}
