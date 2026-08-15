"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

function pickUpcomingAppointment(appointments = []) {
  return (
    appointments.find((a) =>
      ["confirmed", "pending", "in_progress"].includes(String(a.status || "").toLowerCase())
    ) || null
  );
}

function pickActiveOrder(orders = []) {
  return (
    orders.find((o) => {
      const status = String(o.status || "").toLowerCase();
      return !["delivered", "cancelled", "completed"].includes(status);
    }) || null
  );
}

function pickUpcomingLab(bookings = []) {
  return (
    bookings.find((b) => {
      const status = String(b.status || "").toLowerCase();
      return !["completed", "cancelled", "reported", "report_uploaded", "rejected"].includes(
        status
      );
    }) || null
  );
}

function ActivityColumn({ title, children, href, linkLabel }) {
  return (
    <div className="flex flex-1 flex-col py-1 md:px-6 md:first:pl-0 md:last:pr-0">
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#627D98]">
        {title}
      </h3>
      <div className="mt-3 flex-1">{children}</div>
      <Link
        href={href}
        className="group mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#0B6E99]"
      >
        {linkLabel}
        <ArrowRight
          size={13}
          weight="bold"
          className="transition-transform group-hover:translate-x-[3px]"
        />
      </Link>
    </div>
  );
}

export function HealthcareActivityRow({
  appointments = [],
  orders = [],
  labBookings = [],
  isLoading,
}) {
  const appointment = pickUpcomingAppointment(appointments);
  const order = pickActiveOrder(orders);
  const lab = pickUpcomingLab(labBookings);

  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="home-container mx-auto">
        <h2 className="text-[clamp(1.6rem,2.8vw,2.25rem)] font-semibold tracking-tight text-[#102A43]">
          Your Healthcare
        </h2>

        {isLoading ? (
          <div className="mt-8 h-28 animate-pulse rounded-[16px] bg-[#E8EEF2]" />
        ) : (
          <div className="mt-8 flex flex-col divide-y divide-[#102A43]/08 border-y border-[#102A43]/08 md:flex-row md:divide-x md:divide-y-0">
            <ActivityColumn
              title="Appointments"
              href="/account/appointments"
              linkLabel={appointment ? "View appointments" : "Find Care"}
            >
              {appointment ? (
                <>
                  <p className="text-[16px] font-semibold text-[#102A43]">
                    {appointment.doctorName || "Healthcare professional"}
                  </p>
                  <p className="mt-1 text-[13px] text-[#627D98]">
                    {appointment.date}
                    {appointment.slot ? ` · ${appointment.slot}` : ""}
                  </p>
                </>
              ) : (
                <p className="text-[15px] text-[#627D98]">No upcoming appointments</p>
              )}
            </ActivityColumn>

            <ActivityColumn
              title="Medicine Orders"
              href="/orders"
              linkLabel={order ? "View orders" : "Browse Pharmacies"}
            >
              {order ? (
                <>
                  <p className="text-[16px] font-semibold text-[#102A43]">
                    {order.title || order.vendor || "Active order"}
                  </p>
                  <p className="mt-1 text-[13px] capitalize text-[#627D98]">
                    Status: {String(order.status || "").replace(/_/g, " ")}
                  </p>
                </>
              ) : (
                <p className="text-[15px] text-[#627D98]">No active medicine orders</p>
              )}
            </ActivityColumn>

            <ActivityColumn
              title="Lab Bookings"
              href={lab ? "/account/reports" : "/lab-tests"}
              linkLabel={lab ? "View bookings" : "Explore Lab Tests"}
            >
              {lab ? (
                <>
                  <p className="text-[16px] font-semibold text-[#102A43]">
                    {lab.testName || "Lab booking"}
                  </p>
                  <p className="mt-1 text-[13px] text-[#627D98]">
                    {lab.lab || "Laboratory"}
                    {lab.collectionDate ? ` · ${lab.collectionDate}` : ""}
                  </p>
                </>
              ) : (
                <p className="text-[15px] text-[#627D98]">No upcoming lab tests</p>
              )}
            </ActivityColumn>
          </div>
        )}
      </div>
    </section>
  );
}
