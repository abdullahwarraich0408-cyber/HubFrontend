"use client";

import { Buildings, VideoCamera } from "@phosphor-icons/react";

const CONSULT_TABS = [
  { id: "in_person", label: "In-Person", icon: Buildings },
  { id: "online", label: "Online", icon: VideoCamera },
];

export function ConsultTypeTabs({
  value,
  onChange,
  onlineCount = 0,
  disableOnline = false,
  className = "",
}) {
  return (
    <div className={`bg-white rounded-[16px] border border-[var(--color-neutral-200)] overflow-hidden ${className}`}>
      <div className="flex border-b border-[var(--color-neutral-200)]">
        {CONSULT_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = value === tab.id;
          const isDisabled = tab.id === "online" && disableOnline;

          return (
            <button
              key={tab.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-[13px] font-semibold border-b-2 transition-colors ${
                isActive
                  ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] bg-[var(--color-brand-mist)]/40"
                  : "border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-ink-headline)] hover:bg-[var(--color-surface-subtle)]"
              } ${isDisabled ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-[var(--color-neutral-500)]" : ""}`}
            >
              <Icon size={18} weight={isActive ? "fill" : "regular"} />
              {tab.label}
              {tab.id === "online" && onlineCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#d97706] text-[10px] font-bold">
                  {onlineCount} online
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
