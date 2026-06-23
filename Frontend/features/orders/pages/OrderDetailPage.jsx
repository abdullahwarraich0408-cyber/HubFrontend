"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  CaretRight,
  DownloadSimple,
  ArrowsClockwise,
  Headset,
  MapPin,
  Receipt,
  FileText,
  VideoCamera,
  ChatCircleText,
  CalendarCheck,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { HorizontalTrackingTimeline } from "@/shared/components/HorizontalTrackingTimeline";
import { useOrderDetail } from "@/lib/hooks/useApi";
import { formatDoctorDisplayName } from "@/lib/hooks/useTelehealth";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";

export function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { openSignIn } = useAuthModal();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data: order, isLoading, isError } = useOrderDetail(params.id, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-20 text-center">
        <p className="text-[var(--color-neutral-500)] mb-4">Sign in to view order details</p>
        <Button onClick={() => openSignIn({ redirect: "/orders" })}>Sign In</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-20 text-center">
        <p className="text-[var(--color-neutral-500)]">Loading order...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-20 text-center">
        <p className="text-[var(--color-neutral-500)] mb-4">Order not found</p>
        <Button onClick={() => router.push("/orders")}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-[900px] mx-auto px-4 md:px-[80px]">
        <div className="flex items-center gap-2 text-[12px] text-[var(--color-neutral-500)] mb-6">
          <Link href="/orders" className="hover:text-[var(--color-brand-primary)]">Orders</Link>
          <CaretRight size={12} weight="bold" />
          <span className="text-[var(--color-ink-headline)] font-mono">{order.id}</span>
        </div>

        <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 md:p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[20px] md:text-[24px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)]">
                  {order.title}
                </h1>
                <Badge status={order.status} />
              </div>
              <p className="font-mono text-[13px] text-[var(--color-neutral-500)]">{order.id}</p>
              <p className="text-[13px] text-[var(--color-neutral-500)] mt-1">Placed on {order.date}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[var(--color-neutral-400)] uppercase font-semibold">Total paid</p>
              <p className="text-[28px] font-bold text-[var(--color-brand-primary)]">PKR {order.total.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {order.type === "medicines" && (
              <Button variant="secondary" className="h-[44px] text-[12px]" leftIcon={<DownloadSimple size={16} />}>
                Download Invoice
              </Button>
            )}
            {order.type === "doctor" && (
              <>
                <Link href={order.appointmentsHref || "/account/appointments"}>
                  <Button variant="secondary" className="h-[44px] text-[12px] w-full" leftIcon={<CalendarCheck size={16} />}>
                    My Appointments
                  </Button>
                </Link>
                {order.consultationHref && order.rawStatus !== "completed" && (
                  <Link href={order.consultationHref}>
                    <Button className="h-[44px] text-[12px] w-full" leftIcon={<VideoCamera size={16} weight="fill" />}>
                      Join Consultation
                    </Button>
                  </Link>
                )}
                {order.canViewChat && order.chatHref && (
                  <Link href={order.chatHref}>
                    <Button variant="secondary" className="h-[44px] text-[12px] w-full" leftIcon={<ChatCircleText size={16} />}>
                      {order.chatReadOnly
                        ? "View Chat History"
                        : `Chat with ${formatDoctorDisplayName(order.vendor)}`}
                    </Button>
                  </Link>
                )}
              </>
            )}
            <Link
              href={order.reorderHref}
              className="inline-flex items-center justify-center w-full h-[44px] text-[12px] font-semibold gap-2 bg-white text-[var(--color-neutral-900)] border border-[var(--color-neutral-200)] rounded-[var(--radius-md)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] transition-colors"
            >
              <ArrowsClockwise size={16} />
              {order.type === "doctor" ? "Book Again" : order.type === "lab" ? "Book Again" : "Reorder"}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center w-full h-[44px] text-[12px] font-semibold gap-2 bg-white text-[var(--color-neutral-900)] border border-[var(--color-neutral-200)] rounded-[var(--radius-md)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] transition-colors"
            >
              <Headset size={16} />
              Support
            </Link>
            {order.reportAvailable && order.reportUrl && (
              <a href={order.reportUrl} target="_blank" rel="noopener noreferrer" className="contents">
                <Button variant="secondary" className="h-[44px] text-[12px] w-full" leftIcon={<DownloadSimple size={16} />}>
                  Download Report
                </Button>
              </a>
            )}
            {order.prescriptionAvailable && (
              <Link href="/account/appointments">
                <Button variant="secondary" className="h-[44px] text-[12px] w-full" leftIcon={<FileText size={16} />}>
                  View Appointment
                </Button>
              </Link>
            )}
          </div>
        </div>

        {order.type === "doctor" && (
          <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 md:p-8 mb-6">
            <h2 className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-3">Consultation access</h2>
            {order.rawStatus === "pending" && (
              <p className="text-[14px] text-[var(--color-neutral-600)]">
                Your payment is recorded. Waiting for the doctor to <strong>confirm</strong> your appointment.
                After confirmation, the <strong>Join Consultation</strong> button will appear here and on{" "}
                <Link href="/account/appointments" className="text-[var(--color-brand-primary)] font-semibold hover:underline">
                  My Appointments
                </Link>
                .
              </p>
            )}
            {order.rawStatus === "confirmed" && order.isOnline && !order.canJoin && order.consultationHref && (
              <p className="text-[14px] text-[var(--color-neutral-600)]">
                Doctor confirmed your online visit. You can open the consultation room — video joins{" "}
                <strong>15 minutes before</strong> your scheduled slot ({order.slot}).
              </p>
            )}
            {order.canJoin && (
              <p className="text-[14px] text-[var(--color-neutral-600)] mb-4">
                Your consultation room is ready. Use <strong>Join Consultation</strong> for video, or{" "}
                <strong>{order.chatReadOnly ? "View Chat History" : "Chat"}</strong> to message your doctor.
              </p>
            )}
            {order.rawStatus === "completed" && order.canViewChat && (
              <p className="text-[14px] text-[var(--color-neutral-600)]">
                Consultation completed. Use <strong>View Chat History</strong> to read your past messages with the doctor.
              </p>
            )}
            {order.paymentStatus && (
              <p className="text-[13px] text-[var(--color-neutral-500)] mt-3">
                Payment status: <strong className="capitalize">{order.paymentStatus}</strong> · PKR {order.total.toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 md:p-8 mb-6">
          <h2 className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-6">Track Status</h2>
          <HorizontalTrackingTimeline steps={order.tracking} />
        </div>

        <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 md:p-8 mb-6">
          <h2 className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-4">Order Details</h2>

          <div className="space-y-4 mb-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-[var(--color-surface-subtle)] rounded-[12px]">
                <div className="w-14 h-14 rounded-[10px] overflow-hidden bg-white border border-[var(--color-neutral-200)] shrink-0">
                  <img src={item.img} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[var(--color-ink-headline)] truncate">{item.name}</p>
                  <p className="text-[12px] text-[var(--color-neutral-500)]">Qty: {item.qty}</p>
                </div>
                <p className="text-[14px] font-bold shrink-0">PKR {(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-[var(--color-neutral-200)]">
            <div className="flex items-start gap-2 text-[13px]">
              <MapPin size={16} className="text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[var(--color-neutral-600)]">Delivery / Collection</p>
                <p className="text-[var(--color-neutral-500)]">{order.deliveryAddress}</p>
              </div>
            </div>
            {order.slot && (
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-neutral-600)]">
                <Receipt size={16} className="text-[var(--color-brand-primary)]" />
                <span>Slot: <strong>{order.slot}</strong></span>
              </div>
            )}
            {order.specialty && (
              <p className="text-[13px] text-[var(--color-neutral-600)]">
                Specialty: <strong>{order.specialty}</strong>
              </p>
            )}
            {order.testName && (
              <p className="text-[13px] text-[var(--color-neutral-600)]">
                Test: <strong>{order.testName}</strong>
              </p>
            )}
            <p className="text-[13px] text-[var(--color-neutral-600)]">
              Provider: <strong>{order.vendor}</strong>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-dashed border-[var(--color-neutral-200)] flex justify-between items-center">
            <span className="text-[15px] font-bold">Order Total</span>
            <span className="text-[20px] font-bold text-[var(--color-brand-primary)]">PKR {order.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[var(--color-brand-mist)] rounded-[16px] border border-[var(--color-brand-light)] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Headset size={24} className="text-[var(--color-brand-primary)]" weight="duotone" />
            <div>
              <p className="text-[14px] font-bold text-[var(--color-ink-headline)]">Need help with this order?</p>
              <p className="text-[12px] text-[var(--color-neutral-500)]">Our support team is available 24/7</p>
            </div>
          </div>
          <Link href="/contact">
            <Button className="h-[40px] px-6 text-[13px]">Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
