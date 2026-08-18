"use client";

import { usePathname } from "next/navigation";
import { CustomerNavbar } from "@/shared/layout/CustomerNavbar";
import { MainNavigation } from "@/shared/layout/MainNavigation";
import { Footer } from "@/shared/layout/Footer";
import { AuthModalProvider } from "@/features/auth/context/AuthModalContext";
import { useAuth } from "@/lib/auth/AuthProvider";

export function CustomerShell({ children }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  const isMarketingHome = pathname === "/" && (isLoading || !isAuthenticated);
  const isPatientHome =
    isAuthenticated && (pathname === "/" || pathname === "/home");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/sign-in" ||
    pathname === "/signup" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-otp" ||
    pathname?.startsWith("/reset-password");

  return (
    <AuthModalProvider>
      {isMarketingHome || isAuthPage ? (
        children
      ) : (
        <>
          <CustomerNavbar />
          <MainNavigation />
          <main className="w-full flex-1 bg-[var(--color-surface-base)]">
            {children}
          </main>
          {!isPatientHome ? <Footer /> : null}
        </>
      )}
    </AuthModalProvider>
  );
}
