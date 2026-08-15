"use client";

import { Suspense } from "react";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-[#627D98]">
          Loading profile…
        </div>
      }
    >
      <ProfilePage />
    </Suspense>
  );
}
