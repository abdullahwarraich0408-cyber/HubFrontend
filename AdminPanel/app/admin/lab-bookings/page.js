"use client";

import { Badge } from "@/shared/components/Badge";
import { useAdminLabBookings } from "@/lib/hooks/useApi";

export default function AdminLabBookingsPage() {
  const { data: bookings = [], isLoading } = useAdminLabBookings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline">Lab Bookings</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Monitor all lab test orders across the platform.</p>
      </div>

      <div className="bg-white rounded-[16px] border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 border-b text-[12px] font-bold text-neutral-500 uppercase">
              <th className="p-4 pl-6">Patient</th>
              <th className="p-4">Test</th>
              <th className="p-4">Lab</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={6} className="p-8 text-center text-neutral-500">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-neutral-500">No bookings found.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td className="p-4 pl-6">{b.patient_name || b.customer?.name}</td>
                  <td className="p-4">{b.lab_test?.name}</td>
                  <td className="p-4">{b.lab_test?.lab || b.lab_partner?.name}</td>
                  <td className="p-4 text-[13px]">{new Date(b.collection_date).toLocaleDateString()} · {b.time_slot}</td>
                  <td className="p-4">PKR {b.price?.toLocaleString()}</td>
                  <td className="p-4"><Badge status={b.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
