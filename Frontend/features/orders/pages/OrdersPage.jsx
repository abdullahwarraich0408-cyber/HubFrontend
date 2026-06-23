"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Package,
  Pill,
  Stethoscope,
  Flask,
  FileText,
  ArrowRight,
} from "@phosphor-icons/react";
import { OrderCard } from "../components/OrderCard";
import { ORDER_TYPES } from "../data/mockOrders";
import Link from "next/link";
import { useAllOrders } from "@/lib/hooks/useApi";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";

const TABS = [
  { id: "all", label: "All", fullLabel: "All Orders", icon: Package },
  { id: "medicines", label: "Meds", fullLabel: "Medicines", icon: Pill },
  { id: "prescription", label: "Rx", fullLabel: "Prescriptions", icon: FileText },
  { id: "doctor", label: "Doctors", fullLabel: "Appointments", icon: Stethoscope },
  { id: "lab", label: "Labs", fullLabel: "Lab Tests", icon: Flask },
];

function OrderSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-4 sm:p-5 animate-pulse">
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-xl bg-[var(--color-neutral-100)] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--color-neutral-100)] rounded w-2/3" />
          <div className="h-3 bg-[var(--color-neutral-100)] rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function OrdersPage() {
  const [activeSubtab, setActiveSubtab] = useState("all");
  const { openSignIn } = useAuthModal();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data: orders = [], isLoading, isError, refetch } = useAllOrders({
    enabled: isAuthenticated,
  });

  const filtered = useMemo(
    () => (activeSubtab === "all" ? orders : orders.filter((o) => o.type === activeSubtab)),
    [orders, activeSubtab]
  );

  const counts = useMemo(
    () => ({
      all: orders.length,
      medicines: orders.filter((o) => o.type === "medicines").length,
      prescription: orders.filter((o) => o.type === "prescription").length,
      doctor: orders.filter((o) => o.type === "doctor").length,
      lab: orders.filter((o) => o.type === "lab").length,
    }),
    [orders]
  );

  const stats = useMemo(() => {
    const active = orders.filter((o) => ["pending", "processing", "shipped"].includes(o.status)).length;
    const completed = orders.filter((o) => ["delivered", "shipped"].includes(o.status)).length;
    return { total: orders.length, active, completed };
  }, [orders]);

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[60vh] bg-[var(--color-surface-subtle)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-mist)] flex items-center justify-center mx-auto mb-5">
            <Package size={32} className="text-[var(--color-brand-primary)]" weight="duotone" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-ink-headline)] mb-2">Sign in to view orders</h1>
          <p className="text-[14px] text-[var(--color-neutral-500)] mb-6 leading-relaxed">
            Track medicines, prescriptions, doctor visits, and lab tests in one place.
          </p>
          <button
            onClick={() => openSignIn({ redirect: "/orders" })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-primary)] text-white rounded-xl font-semibold text-[14px]"
          >
            Sign In
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-5 sm:py-8">
      <div className="w-full max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-[28px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)]">
            My Orders
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--color-neutral-500)] mt-1">
            Track all your bookings and purchases
          </p>
        </div>

        {/* Stats — 3 equal columns on all screen sizes */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
          {[
            { label: "Total", value: stats.total },
            { label: "Active", value: stats.active },
            { label: "Done", value: stats.completed },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-[var(--color-neutral-200)] px-3 py-3 sm:px-4 sm:py-4 text-center"
            >
              <p className="text-xl sm:text-2xl font-bold text-[var(--color-ink-headline)] tabular-nums">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-[11px] text-[var(--color-neutral-500)] uppercase tracking-wide font-semibold mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Filter tabs — horizontal scroll on mobile */}
        <div className="mb-5 sm:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide"
            role="tablist"
            aria-label="Filter orders"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubtab === tab.id;
              const count = counts[tab.id] ?? 0;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveSubtab(tab.id)}
                  className={`snap-start shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold border transition-colors ${
                    isActive
                      ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]"
                      : "bg-white text-[var(--color-neutral-600)] border-[var(--color-neutral-200)] hover:border-[var(--color-brand-primary)]/40"
                  }`}
                >
                  <Icon size={15} weight={isActive ? "fill" : "regular"} />
                  <span className="sm:hidden">{tab.label}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                  <span
                    className={`text-[10px] min-w-[1.25rem] px-1 py-0.5 rounded-full ${
                      isActive ? "bg-white/25" : "bg-[var(--color-neutral-100)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-8 sm:p-10 text-center">
            <h3 className="text-lg font-bold text-[var(--color-ink-headline)] mb-2">Could not load orders</h3>
            <p className="text-[14px] text-[var(--color-neutral-500)] mb-5">Please try again.</p>
            <button
              onClick={() => refetch()}
              className="px-5 py-2.5 bg-[var(--color-brand-primary)] text-white text-[14px] font-semibold rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--color-neutral-200)] p-8 sm:p-12 text-center">
            <Package size={40} weight="duotone" className="text-[var(--color-neutral-300)] mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-ink-headline)] mb-2">No orders yet</h3>
            <p className="text-[14px] text-[var(--color-neutral-500)] mb-6 max-w-xs mx-auto">
              {activeSubtab === "all"
                ? "Your orders will appear here after you book."
                : `No ${TABS.find((t) => t.id === activeSubtab)?.fullLabel?.toLowerCase()} yet.`}
            </p>
            <Link
              href={
                activeSubtab === "doctor"
                  ? "/doctors"
                  : activeSubtab === "lab"
                    ? "/lab-tests"
                    : activeSubtab === "prescription"
                      ? "/"
                      : "/browse"
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-brand-primary)] text-white text-[14px] font-semibold rounded-xl"
            >
              {activeSubtab === "doctor"
                ? "Book a Doctor"
                : activeSubtab === "lab"
                  ? "Book a Lab Test"
                  : activeSubtab === "prescription"
                    ? "Upload Prescription"
                    : "Shop Medicines"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
