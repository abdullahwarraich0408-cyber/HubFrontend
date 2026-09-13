"use client";

import { formatAppointmentStatusLabel } from "@/lib/appointmentJourney";

const STATE_CLASS = {
  completed: "bg-teal-600 border-teal-600 text-white",
  current: "bg-white border-teal-600 text-teal-700 ring-2 ring-teal-100",
  upcoming: "bg-white border-slate-200 text-slate-400",
  terminated: "bg-rose-600 border-rose-600 text-white",
};

const LINE_CLASS = {
  completed: "bg-teal-500",
  current: "bg-slate-200",
  upcoming: "bg-slate-200",
  terminated: "bg-rose-400",
};

export function AppointmentTimeline({ steps = [], status, compact = false }) {
  if (!steps.length) return null;
  const terminal = status === "cancelled" || status === "no_show";

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {terminal ? (
        <p className="text-[12px] font-semibold text-rose-700">
          {formatAppointmentStatusLabel(status)} — this visit timeline has ended.
        </p>
      ) : null}
      <ol className="space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`w-6 h-6 rounded-full border-2 text-[10px] font-bold flex items-center justify-center shrink-0 ${STATE_CLASS[step.state] || STATE_CLASS.upcoming}`}
                >
                  {step.state === "completed" || step.state === "terminated" ? "✓" : index + 1}
                </span>
                {!isLast ? (
                  <span className={`w-0.5 flex-1 min-h-[18px] ${LINE_CLASS[step.state] || LINE_CLASS.upcoming}`} />
                ) : null}
              </div>
              <div className={`pb-3 ${compact ? "pt-0.5" : "pt-0.5"}`}>
                <p
                  className={`text-[13px] leading-snug ${
                    step.state === "current"
                      ? "font-bold text-teal-800"
                      : step.state === "completed"
                        ? "font-medium text-slate-700"
                        : step.state === "terminated"
                          ? "font-semibold text-rose-700"
                          : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
