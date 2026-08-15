"use client";

import { VideoCamera, Buildings, CalendarBlank } from "@phosphor-icons/react";

const FOCUS_OPTIONS = [
  { id: "all", label: "All", specialty: "" },
  { id: "diabetes", label: "Diabetes", specialty: "diabetes" },
  { id: "psychologist", label: "Mental health", specialty: "psychologist" },
];

const MEET_OPTIONS = [
  { id: "any", label: "Any", consult: "", icon: null },
  { id: "online", label: "Online", consult: "online", icon: VideoCamera },
  { id: "in_person", label: "In clinic", consult: "in_person", icon: Buildings },
];

const segmentClass = (active) =>
  `shrink-0 inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2.5 text-[13px] font-bold transition-colors ${
    active
      ? "bg-[#0B6E99] text-white"
      : "text-[#334E68] hover:bg-[#E8F4F8]"
  }`;

export function DoctorFilterBar({
  specialty = "",
  consult = "",
  availableToday = false,
  onSpecialtyChange,
  onConsultChange,
  onAvailableTodayChange,
}) {
  return (
    <div className="mb-7 flex flex-col gap-3">
      {/* Specialty — same segmented control as Pharmacies */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex max-w-full overflow-x-auto rounded-[14px] bg-white/80 p-1 shadow-[0_4px_20px_rgba(11,110,153,0.06)] scrollbar-hide">
          {FOCUS_OPTIONS.map((item) => {
            const active =
              item.specialty === specialty || (!specialty && item.id === "all");
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSpecialtyChange(item.specialty)}
                className={segmentClass(active)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meet type + today — matching segmented style */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex max-w-full overflow-x-auto rounded-[14px] bg-white/80 p-1 shadow-[0_4px_20px_rgba(11,110,153,0.06)] scrollbar-hide">
          {MEET_OPTIONS.map((item) => {
            const Icon = item.icon;
            const active =
              (item.consult === "" && !consult) || consult === item.consult;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onConsultChange(item.consult)}
                className={segmentClass(active)}
              >
                {Icon ? <Icon size={14} weight="bold" /> : null}
                {item.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onAvailableTodayChange(!availableToday)}
          className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-[10px] px-3.5 py-2.5 text-[13px] font-bold transition-colors sm:self-auto ${
            availableToday
              ? "bg-[#0B6E99] text-white"
              : "bg-white/80 text-[#334E68] shadow-[0_4px_20px_rgba(11,110,153,0.06)] hover:bg-[#E8F4F8]"
          }`}
        >
          <CalendarBlank size={14} weight="bold" />
          Today only
        </button>
      </div>
    </div>
  );
}
