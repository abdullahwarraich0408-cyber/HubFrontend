"use client";

import { Button } from "@/shared/components/Button";

export default function VendorError({ error, reset }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-[16px] p-10 text-center max-w-lg mx-auto mt-12">
      <h1 className="font-heading text-2xl font-bold text-ink-headline">Something went wrong while loading this page.</h1>
      <p className="text-sm text-neutral-500 mt-2">{error?.message || "Please try again."}</p>
      <Button className="mt-6" onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
}
