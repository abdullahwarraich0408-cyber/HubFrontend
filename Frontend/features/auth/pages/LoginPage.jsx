"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { needsProfileCompletion } from "@/lib/auth/needsProfileCompletion";
import { completeWebLogin } from "@/features/auth/lib/completeWebLogin";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthFlow } from "@/features/auth/components/AuthFlow";

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (needsProfileCompletion(user)) return;
    router.replace(redirectTo || "/");
  }, [authLoading, isAuthenticated, user, redirectTo, router]);

  return (
    <AuthLayout>
      <AuthFlow onAuthenticated={() => completeWebLogin({ router, redirectTo })} />
    </AuthLayout>
  );
}
