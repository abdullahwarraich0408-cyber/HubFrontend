"use client";

import Link from "next/link";
import { ArrowRight, FileText, UploadSimple } from "@phosphor-icons/react";
import { PrescriptionUploadZone } from "@/features/home/components/PrescriptionUploadZone";
import { usePrescriptionOrders } from "@/lib/hooks/useApi";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";

export default function PrescriptionPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openSignIn } = useAuthModal();
  const { data: orders = [], isLoading } = usePrescriptionOrders({
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#627D98]">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F4F8] text-[#0B6E99]">
            <FileText size={28} weight="duotone" />
          </div>
          <h1 className="text-[22px] font-bold text-[#102A43]">Prescriptions</h1>
          <p className="mt-2 text-[14px] text-[#627D98]">
            Sign in to upload prescriptions and track pharmacy assignment.
          </p>
          <Button className="mt-5" onClick={() => openSignIn({ redirect: "/prescription" })}>
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8] py-8 md:py-10">
      <div className="home-container mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
            Prescriptions
          </p>
          <h1 className="mt-1 text-[clamp(1.6rem,3vw,2rem)] font-bold tracking-tight text-[#102A43]">
            Upload & track prescriptions
          </h1>
          <p className="mt-2 text-[14px] text-[#627D98]">
            Send your prescription to partner pharmacies and follow the order status.
          </p>
        </div>

        <div className="mb-8 overflow-hidden rounded-[20px] border border-[#0B6E99]/12 bg-white p-5 shadow-[0_8px_28px_rgba(11,110,153,0.08)] md:p-6">
          <div className="mb-4 flex items-center gap-2 text-[#0B6E99]">
            <UploadSimple size={20} weight="bold" />
            <h2 className="text-[16px] font-bold text-[#102A43]">New upload</h2>
          </div>
          <PrescriptionUploadZone />
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-bold text-[#102A43]">Recent prescriptions</h2>
          <Link
            href="/orders?type=prescription"
            className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0B6E99]"
          >
            All Rx orders
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-[14px] text-[#627D98]">Loading prescriptions…</p>
        ) : orders.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[#0B6E99]/25 bg-white px-5 py-10 text-center">
            <p className="text-[14px] text-[#627D98]">
              No prescription orders yet. Upload one above to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 10).map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 rounded-[16px] border border-[#102A43]/08 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[13px] font-bold text-[#102A43]">
                      {order.shortId || order.id}
                    </span>
                    <Badge status={order.status} />
                  </div>
                  <p className="mt-1 text-[12px] text-[#627D98]">
                    {order.createdAtLabel ||
                      (order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "Recent")}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#334E68]">
                    {order.assignedVendor?.name ||
                      order.currentVendor?.name ||
                      "Finding pharmacy…"}
                  </p>
                </div>
                <Link href={`/prescription/${order.id}`}>
                  <Button variant="secondary" className="h-9 text-[12px]">
                    Track
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
