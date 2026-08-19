import { AdminSidebar } from "@/shared/layout/AdminSidebar";
import { AdminHeader } from "@/shared/layout/AdminHeader";
import AdminAuthGuard from "./AdminAuthGuard";

export const metadata = {
  title: "Admin Portal | Medzoos",
  description: "Platform administration and overview.",
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-[#F6F8FA] font-[var(--font-plus-jakarta-sans)]">
        <AdminSidebar />
        <div className="flex-1 transition-all duration-300 ease-in-out ml-[270px] flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}

