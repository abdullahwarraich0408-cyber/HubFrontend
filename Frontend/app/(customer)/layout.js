import { CustomerNavbar } from "@/shared/layout/CustomerNavbar";
import { MainNavigation } from "@/shared/layout/MainNavigation";
import { Footer } from "@/shared/layout/Footer";
import { AuthModalProvider } from "@/features/auth/context/AuthModalContext";

export default function CustomerLayout({ children }) {
  return (
    <AuthModalProvider>
      <CustomerNavbar />
      <MainNavigation />
      <main className="flex-1 w-full bg-[var(--color-surface-base)]">
        {children}
      </main>
      <Footer />
    </AuthModalProvider>
  );
}
