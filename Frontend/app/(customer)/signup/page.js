import { Suspense } from "react";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-white" />}>
      <RegisterPage />
    </Suspense>
  );
}
