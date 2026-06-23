"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/lib/hooks/useApi";
import { CircleNotch } from "@phosphor-icons/react";

export default function AdminAuthGuard({ children }) {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useUserProfile({
    retry: false, // Don't retry if the user is 401 Unauthorized
  });
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (isError || !profile || profile.role !== 'admin') {
        // Kick them out to the homepage to hide the existence of the admin portal
        router.replace("/portal-access");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [isLoading, isError, profile, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0C1A2E]">
        <CircleNotch size={48} className="text-[#0B6E72] animate-spin mb-4" />
        <p className="text-white font-medium animate-pulse">Verifying Access...</p>
      </div>
    );
  }

  return children;
}
