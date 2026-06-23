"use client";

import { VideoCamera, Buildings, MapPin, CaretRight, Circle } from "@phosphor-icons/react";

export function ConsultOptionRow({ option, onClick, selected = false, compact = false }) {
  const isOnline = option.type === "online";
  const Icon = isOnline ? VideoCamera : Buildings;

  return (
    <button
      type="button"
      onClick={() => onClick?.(option)}
      className={`w-full text-left rounded-[12px] border transition-all ${
        selected
          ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-mist)]/50"
          : "border-[var(--color-neutral-200)] bg-white hover:border-[var(--color-brand-primary)]/50 hover:bg-[var(--color-surface-subtle)]"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${
            isOnline ? "bg-[var(--color-brand-mist)]" : "bg-[var(--color-surface-subtle)]"
          }`}
        >
          <Icon size={20} weight="fill" className="text-[var(--color-brand-primary)]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[var(--color-ink-headline)] truncate">{option.title}</p>
          {option.location && (
            <p className="text-[11px] text-[var(--color-neutral-500)] flex items-center gap-1 mt-0.5 truncate">
              <MapPin size={11} />
              {option.location}
            </p>
          )}
          {!option.location && option.subtitle && (
            <p className="text-[11px] text-[var(--color-neutral-500)] mt-0.5">{option.subtitle}</p>
          )}
          {option.days?.length > 0 && (
            <p className="text-[10px] text-[var(--color-neutral-400)] mt-1">
              {option.days.join(" ")}
            </p>
          )}
          <p className="text-[11px] font-semibold text-[var(--color-status-success)] flex items-center gap-1.5 mt-1.5">
            <Circle size={8} weight="fill" />
            {option.availability}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[14px] font-bold text-[var(--color-ink-headline)]">
            PKR {option.fee.toLocaleString()}
          </p>
          {onClick && <CaretRight size={16} className="text-[var(--color-neutral-400)] ml-auto mt-1" />}
        </div>
      </div>
    </button>
  );
}
