import Link from "next/link";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

export default function VendorNotFound() {
  return (
    <div className="bg-white border border-neutral-200 rounded-[16px] p-10 text-center max-w-lg mx-auto mt-12">
      <h1 className="font-heading text-2xl font-bold text-ink-headline">Page not found</h1>
      <p className="text-sm text-neutral-500 mt-2">This record is unavailable or does not belong to your pharmacy.</p>
      <Link href={partnerRoutes.vendor.dashboard} className="inline-block mt-6 text-sm font-semibold text-brand-primary hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
