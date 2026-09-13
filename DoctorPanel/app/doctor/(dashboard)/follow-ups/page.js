"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Bell, XCircle, ExternalLink } from "lucide-react";
import {
  useDoctorFollowUps,
  useRemindDoctorFollowUp,
  useCancelDoctorFollowUp,
} from "@/lib/hooks/usePartnerPortal";
import { toast } from "sonner";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "overdue", label: "Overdue" },
  { id: "booked", label: "Booked" },
];

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DoctorFollowUpsPage() {
  const [tab, setTab] = useState("upcoming");
  const { data: followUps = [], isLoading, refetch } = useDoctorFollowUps({ status: tab });
  const remindMut = useRemindDoctorFollowUp();
  const cancelMut = useCancelDoctorFollowUp();

  const countsHint = useMemo(() => {
    if (isLoading) return "Loading…";
    return `${followUps.length} ${tab}`;
  }, [followUps.length, isLoading, tab]);

  const handleRemind = async (id) => {
    try {
      await remindMut.mutateAsync(id);
      toast.success("Reminder sent to patient");
      refetch();
    } catch (error) {
      toast.error(error.message || "Could not send reminder");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("End this follow-up recommendation?")) return;
    try {
      await cancelMut.mutateAsync(id);
      toast.success("Follow-up cancelled");
      refetch();
    } catch (error) {
      toast.error(error.message || "Could not cancel");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Follow-ups
        </h1>
        <p className="text-xs text-slate-600 mt-1 font-medium">
          Care recommendations — not appointments until the patient books.{" "}
          <span className="text-teal-700 font-semibold">{countsHint}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              tab === t.id
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-slate-500 text-xs">Loading follow-ups…</div>
        ) : followUps.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CalendarClock size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-900">No {tab} follow-ups</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Recommend a follow-up when completing a visit to see it here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {followUps.map((fu) => (
              <div
                key={fu.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900">
                      {fu.patient?.name || "Patient"}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                      {fu.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-1">
                    Recommended {formatDate(fu.recommended_date)}
                    {fu.booking_window?.from && fu.booking_window?.to
                      ? ` · Window ${formatDate(fu.booking_window.from)} – ${formatDate(fu.booking_window.to)}`
                      : ""}
                  </p>
                  {(fu.reason || fu.notes) && (
                    <p className="text-[12px] text-slate-600 mt-1 line-clamp-2">
                      {fu.reason || fu.notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {fu.booked_appointment_id ? (
                    <a
                      href={`/doctor/appointments?focus=${fu.booked_appointment_id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white"
                    >
                      <ExternalLink size={12} />
                      Open appointment
                    </a>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRemind(fu.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-teal-700 hover:bg-teal-50"
                      >
                        <Bell size={12} />
                        Remind
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(fu.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-rose-600 hover:bg-rose-50"
                      >
                        <XCircle size={12} />
                        End
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
