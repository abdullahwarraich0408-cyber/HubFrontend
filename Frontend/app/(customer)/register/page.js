import { Suspense } from "react";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}
