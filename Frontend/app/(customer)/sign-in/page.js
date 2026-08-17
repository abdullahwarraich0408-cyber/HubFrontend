import { Suspense } from "react";
import { LoginPage } from "@/features/auth/pages/LoginPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-white" />}>
      <LoginPage />
    </Suspense>
  );
}
