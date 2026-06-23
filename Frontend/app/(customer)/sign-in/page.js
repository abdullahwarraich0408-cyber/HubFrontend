"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";

function SignInRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openSignIn } = useAuthModal();

  useEffect(() => {
    const redirect = searchParams.get("redirect") || "/";
    const expired = searchParams.get("expired") === "true";

    openSignIn({ redirect, expired });

    const destination = redirect.startsWith("/sign-in") ? "/" : redirect;
    router.replace(destination);
  }, [openSignIn, router, searchParams]);

  return null;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignInRedirect />
    </Suspense>
  );
}
