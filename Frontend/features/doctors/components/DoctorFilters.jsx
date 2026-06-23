"use client";

import { X } from "@phosphor-icons/react";
import { FILTER_OPTIONS } from "../data/mockDoctors";

function FilterGroup({ title, children }) {
  return (
    <div className="border-b border-[var(--color-neutral-200)] py-4 last:border-b-0">
      <h3 className="text-[12px] font-bold text-[var(--color-ink-headline)] uppercase tracking-wide mb-2.5">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[var(--color-neutral-300)] text-[var(--color-brand-primary)]"
      />
      <span className="text-[13px] text-[var(--color-neutral-600)] group-hover:text-[var(--color-brand-primary)]">{label}</span>
    </label>
  );
}

export function DoctorFilters({ filters, onChange, onClear, horizontal = false, category = "online" }) {
  const toggle = (key, value) => {
    const current = filters[key] ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const toggleBool = (key) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  const activeCount =
    (filters.specialties?.length ?? 0) +
    (filters.languages?.length ?? 0) +
    (filters.experience?.length ?? 0) +
    (filters.online ? 1 : 0) +
    (filters.availableToday ? 1 : 0);

  const content = (
    <>
      <FilterGroup title="Specialty">
        {FILTER_OPTIONS.specialties.map((s) => (
          <CheckboxItem key={s} label={s} checked={filters.specialties?.includes(s)} onChange={() => toggle("specialties", s)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        {category !== "online" && (
          <CheckboxItem label="Online now" checked={filters.online} onChange={() => toggleBool("online")} />
        )}
        <CheckboxItem label="Available today" checked={filters.availableToday} onChange={() => toggleBool("availableToday")} />
      </FilterGroup>

      <FilterGroup title="Experience">
        {FILTER_OPTIONS.experience.map((exp) => (
          <CheckboxItem key={exp} label={exp} checked={filters.experience?.includes(exp)} onChange={() => toggle("experience", exp)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Language">
        {FILTER_OPTIONS.languages.map((lang) => (
          <CheckboxItem key={lang} label={lang} checked={filters.languages?.includes(lang)} onChange={() => toggle("languages", lang)} />
        ))}
      </FilterGroup>
    </>
  );

  if (horizontal) {
    return (
      <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-4 mb-5">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.specialties.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => toggle("specialties", s)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                filters.specialties?.includes(s)
                  ? "bg-[var(--color-brand-primary)] text-white"
                  : "bg-[var(--color-surface-subtle)] text-[var(--color-neutral-600)] border border-[var(--color-neutral-200)] hover:border-[var(--color-brand-primary)]"
              }`}
            >
              {s}
            </button>
          ))}
          {category !== "online" && (
          <button
            onClick={() => toggleBool("online")}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold ${
              filters.online ? "bg-[var(--color-brand-primary)] text-white" : "bg-[var(--color-surface-subtle)] text-[var(--color-neutral-600)] border border-[var(--color-neutral-200)]"
            }`}
          >
            Online
          </button>
          )}
          <button
            onClick={() => toggleBool("availableToday")}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold ${
              filters.availableToday ? "bg-[var(--color-brand-primary)] text-white" : "bg-[var(--color-surface-subtle)] text-[var(--color-neutral-600)] border border-[var(--color-neutral-200)]"
            }`}
          >
            Available today
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="bg-white rounded-[16px] border border-[var(--color-neutral-200)]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-neutral-200)]">
        <h2 className="text-[15px] font-bold text-[var(--color-ink-headline)]">Filters</h2>
        {activeCount > 0 && (
          <button onClick={onClear} className="flex items-center gap-1 text-[12px] font-semibold text-[var(--color-brand-primary)]">
            <X size={14} /> Clear
          </button>
        )}
      </div>
      <div className="px-5 max-h-[calc(100vh-220px)] overflow-y-auto">{content}</div>
    </aside>
  );
}
