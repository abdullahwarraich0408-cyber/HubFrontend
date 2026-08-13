import { DoctorDashboardLayout } from "./DoctorDashboardLayout";

export const metadata = {
  title: "Doctor Portal | Medzoos",
  description: "Manage your appointments and patient schedule.",
};

export default function DoctorLayout({ children }) {
  return <DoctorDashboardLayout>{children}</DoctorDashboardLayout>;
}
