"use client";

import { Funnel } from "@phosphor-icons/react";

const DELIVERY_OPTIONS = [
  { id: "under20", label: "Under 20 min" },
  { id: "20-30", label: "20–30 min" },
  { id: "30plus", label: "30+ min" },
];

const DISTANCE_OPTIONS = [
  { id: "under3", label: "Under 3 km" },
  { id: "3-5", label: "3–5 km" },
  { id: "5plus", label: "5+ km" },
];

const RATING_OPTIONS = [
  { id: "4.5", label: "4.5+ stars" },
  { id: "4.0", label: "4.0+ stars" },
];

const SERVICE_OPTIONS = [
  { id: "medicines", label: "Medicines", icon: "💊" },
  { id: "doctors", label: "Doctor Consultation", icon: "🩺" },
  { id: "labTests", label: "Lab Tests", icon: "🧪" },
];

function FilterGroup({ title, children }) {
  return (
    <div className="mb-5">
      <h4 className="text-[12px] font-bold uppercase tracking-wide text-[var(--color-neutral-500)] mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxItem({ id, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(id)}
        className="w-4 h-4 rounded border-[var(--color-neutral-300)] text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
      />
      <span className="text-[13px] text-[var(--color-neutral-700)] group-hover:text-[var(--color-brand-primary)] transition-colors">
        {label}
      </span>
    </label>
  );
}

export function PharmacySidebarFilters({ filters, onChange, onReset }) {
  const toggleArray = (key, id) => {
    const current = filters[key] || [];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    onChange({ ...filters, [key]: next });
  };

  const toggleBool = (key) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <aside className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-5 h-fit sticky top-[140px]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Funnel size={18} className="text-[var(--color-brand-primary)]" weight="fill" />
          <h3 className="text-[15px] font-bold text-[var(--color-ink-headline)]">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-[12px] font-semibold text-[var(--color-brand-primary)] hover:underline"
        >
          Reset
        </button>
      </div>

      <FilterGroup title="Delivery Time">
        {DELIVERY_OPTIONS.map((opt) => (
          <CheckboxItem
            key={opt.id}
            id={opt.id}
            label={opt.label}
            checked={filters.deliveryTimes?.includes(opt.id)}
            onChange={(id) => toggleArray("deliveryTimes", id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Distance">
        {DISTANCE_OPTIONS.map((opt) => (
          <CheckboxItem
            key={opt.id}
            id={opt.id}
            label={opt.label}
            checked={filters.distances?.includes(opt.id)}
            onChange={(id) => toggleArray("distances", id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Rating">
        {RATING_OPTIONS.map((opt) => (
          <CheckboxItem
            key={opt.id}
            id={opt.id}
            label={opt.label}
            checked={filters.ratings?.includes(opt.id)}
            onChange={(id) => toggleArray("ratings", id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <CheckboxItem
          id="openNow"
          label="Open Now"
          checked={filters.openNow}
          onChange={() => toggleBool("openNow")}
        />
        <CheckboxItem
          id="prescriptionRequired"
          label="Prescription Required"
          checked={filters.prescriptionRequired}
          onChange={() => toggleBool("prescriptionRequired")}
        />
      </FilterGroup>

      <FilterGroup title="Services">
        {SERVICE_OPTIONS.map((opt) => (
          <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.services?.includes(opt.id)}
              onChange={() => toggleArray("services", opt.id)}
              className="w-4 h-4 rounded border-[var(--color-neutral-300)] text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]"
            />
            <span className="text-[13px] text-[var(--color-neutral-700)] group-hover:text-[var(--color-brand-primary)] transition-colors">
              {opt.icon} {opt.label}
            </span>
          </label>
        ))}
      </FilterGroup>
    </aside>
  );
}
