import { AdminSidebar } from "@/shared/layout/AdminSidebar";
import AdminAuthGuard from "./AdminAuthGuard";

export const metadata = {
  title: "Admin Portal | PharmaHub",
  description: "Platform administration and overview.",
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-[#F6F8FA] font-[var(--font-plus-jakarta-sans)]">
        <AdminSidebar />
        <div className="flex-1 transition-all duration-300 ease-in-out ml-[260px]">
          <main className="min-h-full p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}

