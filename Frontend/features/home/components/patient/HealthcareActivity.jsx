"use client";

import Link from "next/link";
import {
  CalendarBlank,
  Package,
  Flask,
  ArrowRight,
  VideoCamera,
} from "@phosphor-icons/react";

function ActivityCard({ icon: Icon, title, children, empty, emptyAction }) {
  return (
    <article className="flex h-full flex-col rounded-[20px] border border-[#102A43]/08 bg-white p-5 shadow-[0_4px_16px_rgba(16,42,67,0.04)]">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F7FA] text-[#0B6E99]">
          <Icon size={18} weight="duotone" />
        </span>
        <h3 className="text-[15px] font-semibold text-[#102A43]">{title}</h3>
      </div>
      {empty ? (
        <div className="flex flex-1 flex-col">
          <p className="text-[14px] font-medium text-[#102A43]">{empty.title}</p>
          <p className="mt-1 flex-1 text-[13px] leading-relaxed text-[#627D98]">
            {empty.description}
          </p>
          <Link
            href={emptyAction.href}
            className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#0B6E99]"
          >
            {emptyAction.label}
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      ) : (
        children
      )}
    </article>
  );
}

function pickUpcomingAppointment(appointments = []) {
  const active = appointments.filter((a) =>
    ["confirmed", "pending", "in_progress"].includes(String(a.status || "").toLowerCase())
  );
  return active[0] || null;
}

function pickActiveOrder(orders = []) {
  const active = orders.filter((o) => {
    const status = String(o.status || "").toLowerCase();
    return !["delivered", "cancelled", "completed"].includes(status);
  });
  return active[0] || null;
}

function pickUpcomingLab(bookings = []) {
  const active = bookings.filter((b) => {
    const status = String(b.status || "").toLowerCase();
    return !["completed", "cancelled", "reported"].includes(status);
  });
  return active[0] || null;
}

export function HealthcareActivity({
  appointments = [],
  orders = [],
  labBookings = [],
  isLoading,
}) {
  const appointment = pickUpcomingAppointment(appointments);
  const order = pickActiveOrder(orders);
  const lab = pickUpcomingLab(labBookings);

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-5 text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold text-[#102A43]">
          Your Healthcare
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[180px] animate-pulse rounded-[20px] bg-[#E8EEF2]" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-5 text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold text-[#102A43]">
        Your Healthcare
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ActivityCard
          icon={CalendarBlank}
          title="Upcoming Appointment"
          empty={
            appointment
              ? null
              : {
                  title: "No upcoming appointments",
                  description:
                    "Find a psychologist or healthcare professional when you need one.",
                }
          }
          emptyAction={{
            href: "/doctors?specialty=psychologist",
            label: "Find Care",
          }}
        >
          {appointment ? (
            <div className="flex flex-1 flex-col">
              <p className="text-[15px] font-semibold text-[#102A43]">
                {appointment.doctorName || "Healthcare professional"}
              </p>
              <p className="mt-0.5 text-[13px] text-[#627D98]">
                {appointment.specialty || "Consultation"}
              </p>
              <p className="mt-3 text-[13px] text-[#334E68]">
                {appointment.date}
                {appointment.slot ? ` · ${appointment.slot}` : ""}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#627D98]">
                {appointment.isOnline ? (
                  <>
                    <VideoCamera size={12} /> Online consultation
                  </>
                ) : (
                  "In-clinic visit"
                )}
              </p>
              <Link
                href={`/account/appointments/${appointment.id}`}
                className="mt-auto inline-flex h-10 items-center justify-center rounded-xl bg-[#0B6E99] text-[13px] font-semibold text-white hover:bg-[#073B4C]"
              >
                View Appointment
              </Link>
            </div>
          ) : null}
        </ActivityCard>

        <ActivityCard
          icon={Package}
          title="Medicine Orders"
          empty={
            order
              ? null
              : {
                  title: "No active medicine orders",
                  description: "Browse pharmacies when you need medicines or supplies.",
                }
          }
          emptyAction={{ href: "/vendors", label: "Browse Pharmacies" }}
        >
          {order ? (
            <div className="flex flex-1 flex-col">
              <p className="text-[15px] font-semibold text-[#102A43]">
                {order.title || order.vendor || "Medicine order"}
              </p>
              <p className="mt-1 text-[13px] capitalize text-[#627D98]">
                Status: {String(order.status || "").replace(/_/g, " ")}
              </p>
              {order.date ? (
                <p className="mt-1 text-[12px] text-[#627D98]">{order.date}</p>
              ) : null}
              <Link
                href={order.sourceId ? `/orders/${order.sourceId}` : order.id ? `/orders/${order.id}` : "/orders"}
                className="mt-auto inline-flex h-10 items-center justify-center rounded-xl bg-[#0B6E99] text-[13px] font-semibold text-white hover:bg-[#073B4C]"
              >
                Track Order
              </Link>
            </div>
          ) : null}
        </ActivityCard>

        <ActivityCard
          icon={Flask}
          title="Lab Bookings"
          empty={
            lab
              ? null
              : {
                  title: "No upcoming lab tests",
                  description: "Book diagnostic tests and request home sampling where available.",
                }
          }
          emptyAction={{ href: "/lab-tests", label: "Explore Lab Tests" }}
        >
          {lab ? (
            <div className="flex flex-1 flex-col">
              <p className="text-[15px] font-semibold text-[#102A43]">
                {lab.testName || lab.name || "Lab booking"}
              </p>
              <p className="mt-1 text-[13px] text-[#627D98]">
                {lab.lab || lab.labName || lab.laboratory || "Laboratory"}
              </p>
              {lab.collectionDate || lab.date || lab.scheduledAt ? (
                <p className="mt-2 text-[13px] text-[#334E68]">
                  {lab.collectionDate || lab.date || lab.scheduledAt}
                  {lab.timeSlot ? ` · ${lab.timeSlot}` : ""}
                </p>
              ) : null}
              <Link
                href="/orders"
                className="mt-auto inline-flex h-10 items-center justify-center rounded-xl bg-[#0B6E99] text-[13px] font-semibold text-white hover:bg-[#073B4C]"
              >
                View Booking
              </Link>
            </div>
          ) : null}
        </ActivityCard>
      </div>
    </section>
  );
}
