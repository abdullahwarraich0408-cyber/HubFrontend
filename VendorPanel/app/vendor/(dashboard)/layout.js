import { VendorDashboardLayout } from "./VendorDashboardLayout";

export const metadata = {
  title: "Vendor Portal | PharmaHub",
  description: "Manage your pharmacy products and orders.",
};

export default function VendorLayout({ children }) {
  return <VendorDashboardLayout>{children}</VendorDashboardLayout>;
}
