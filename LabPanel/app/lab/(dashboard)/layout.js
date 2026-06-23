import { LabDashboardLayout } from "./LabDashboardLayout";

export const metadata = {
  title: "Lab Portal | PharmaHub",
  description: "Manage lab bookings, tests, and reports.",
};

export default function LabLayout({ children }) {
  return <LabDashboardLayout>{children}</LabDashboardLayout>;
}
