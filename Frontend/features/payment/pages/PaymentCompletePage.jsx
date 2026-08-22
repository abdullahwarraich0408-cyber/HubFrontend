"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import { paymentsApi } from "@/lib/api/index";
import { useAuth } from "@/lib/auth/AuthProvider";
import { openSignInModal } from "@/lib/authModalEvents";

function PaymentCompleteInner() {
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [status, setStatus] = useState("loading");
  const [purpose, setPurpose] = useState("order");

  useEffect(() => {
    if (authLoading) return;

    const cancelled = searchParams.get("cancelled");
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const purposeParam = searchParams.get("purpose") || "order";
    setPurpose(purposeParam);

    if (cancelled === "true") {
      setStatus("cancelled");
      toast.error("Payment was cancelled");
      return;
    }

    if (!isAuthenticated) {
      openSignInModal({ redirect: `/payment/complete?${searchParams.toString()}` });
      return;
    }

    if (success === "true" && sessionId) {
      paymentsApi
        .verifyStripeSession(sessionId)
        .then((result) => {
          if (result.paid) {
            setPurpose(result.purpose || purposeParam);
            setStatus("paid");
            toast.success("Payment successful");
          } else {
            setStatus("unpaid");
            toast.error("Payment not completed");
          }
        })
        .catch((error) => {
          setStatus("error");
          toast.error(error.message || "Could not verify payment");
        });
      return;
    }

    setStatus("idle");
  }, [authLoading, isAuthenticated, searchParams]);

  const links =
    purpose === "lab"
      ? [
          { href: "/orders", label: "View orders" },
          { href: "/account/reports", label: "My reports" },
        ]
      : purpose === "appointment"
        ? [
            { href: "/account/appointments", label: "My appointments" },
            { href: "/doctors", label: "Browse doctors" },
          ]
        : [
            { href: "/orders", label: "View orders" },
            { href: "/", label: "Back home" },
          ];

  return (
    <div className="min-h-[calc(100vh-180px)] bg-[var(--color-surface-subtle)] flex items-center justify-center px-4">
      <div className="bg-white border border-neutral-200 rounded-[16px] p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-[var(--color-brand-primary)] border-t-transparent animate-spin mx-auto mb-4" />
            <h1 className="text-[20px] font-bold mb-2">Confirming payment…</h1>
            <p className="text-[14px] text-neutral-500">Please wait while we verify your Stripe payment.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} weight="fill" className="text-green-600" />
            </div>
            <h1 className="text-[20px] font-bold mb-2">Payment successful</h1>
            <p className="text-[14px] text-neutral-500 mb-6">
              Your {purpose === "lab" ? "lab booking" : purpose === "appointment" ? "appointment" : "order"} is confirmed.
            </p>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button className="w-full">{link.label}</Button>
                </Link>
              ))}
            </div>
          </>
        )}

        {(status === "cancelled" || status === "unpaid" || status === "error") && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <WarningCircle size={36} weight="fill" className="text-amber-600" />
            </div>
            <h1 className="text-[20px] font-bold mb-2">
              {status === "cancelled" ? "Payment cancelled" : "Payment incomplete"}
            </h1>
            <p className="text-[14px] text-neutral-500 mb-6">
              You can retry payment from your bookings or cart.
            </p>
            <div className="flex flex-col gap-2">
              <Link href={purpose === "appointment" ? "/account/appointments" : purpose === "lab" ? "/lab-tests/cart" : "/checkout"}>
                <Button className="w-full">Try again</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" className="w-full">
                  Home
                </Button>
              </Link>
            </div>
          </>
        )}

        {status === "idle" && (
          <>
            <h1 className="text-[20px] font-bold mb-2">Payment</h1>
            <p className="text-[14px] text-neutral-500 mb-6">No payment session found.</p>
            <Link href="/">
              <Button className="w-full">Go home</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export function PaymentCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-180px)] flex items-center justify-center text-[14px] text-neutral-500">
          Loading…
        </div>
      }
    >
      <PaymentCompleteInner />
    </Suspense>
  );
}
