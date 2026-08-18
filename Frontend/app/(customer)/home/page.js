"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { HomePage } from "@/features/home/pages/HomePage";

export default function HomeRoutePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/home");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[14px] text-[#627D98]">
        Loading your home...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <HomePage />;
}
