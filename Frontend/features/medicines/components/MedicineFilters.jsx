"use client";

import { X } from "@phosphor-icons/react";
import { FILTER_OPTIONS } from "../data/mockMedicines";

function FilterGroup({ title, children }) {
  return (
    <div className="border-b border-[var(--color-neutral-200)] py-5 last:border-b-0">
      <h3 className="text-[13px] font-bold text-[var(--color-ink-headline)] uppercase tracking-wide mb-3">
        {title}
      </h3>
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
        className="w-4 h-4 rounded border-[var(--color-neutral-300)] text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]/20"
      />
      <span className="text-[13px] text-[var(--color-neutral-600)] group-hover:text-[var(--color-brand-primary)] transition-colors">
        {label}
      </span>
    </label>
  );
}

export function MedicineFilters({ filters, onChange, onClear, className = "" }) {
  const toggle = (key, value) => {
    const current = filters[key] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const setPrescription = (value) => {
    onChange({ ...filters, prescription: filters.prescription === value ? null : value });
  };

  const activeCount =
    (filters.categories?.length ?? 0) +
    (filters.brands?.length ?? 0) +
    (filters.generics?.length ?? 0) +
    (filters.deliveryTimes?.length ?? 0) +
    (filters.vendors?.length ?? 0) +
    (filters.priceRanges?.length ?? 0) +
    (filters.prescription !== null && filters.prescription !== undefined ? 1 : 0);

  return (
    <aside className={`bg-white rounded-[16px] border border-[var(--color-neutral-200)] ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-neutral-200)]">
        <div>
          <h2 className="text-[15px] font-bold text-[var(--color-ink-headline)]">Filters</h2>
          {activeCount > 0 && (
            <p className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">{activeCount} active</p>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[12px] font-semibold text-[var(--color-brand-primary)] hover:underline"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      <div className="px-5 max-h-[calc(100vh-220px)] overflow-y-auto">
        <FilterGroup title="Category">
          {FILTER_OPTIONS.categories.map((cat) => (
            <CheckboxItem
              key={cat}
              label={cat}
              checked={filters.categories?.includes(cat)}
              onChange={() => toggle("categories", cat)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Prescription Required">
          <CheckboxItem
            label="Rx Required"
            checked={filters.prescription === true}
            onChange={() => setPrescription(true)}
          />
          <CheckboxItem
            label="No Prescription (OTC)"
            checked={filters.prescription === false}
            onChange={() => setPrescription(false)}
          />
        </FilterGroup>

        <FilterGroup title="Brand">
          {FILTER_OPTIONS.brands.map((brand) => (
            <CheckboxItem
              key={brand}
              label={brand}
              checked={filters.brands?.includes(brand)}
              onChange={() => toggle("brands", brand)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Generic">
          {FILTER_OPTIONS.generics.map((generic) => (
            <CheckboxItem
              key={generic}
              label={generic}
              checked={filters.generics?.includes(generic)}
              onChange={() => toggle("generics", generic)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Price">
          {FILTER_OPTIONS.priceRanges.map((range) => (
            <CheckboxItem
              key={range.label}
              label={range.label}
              checked={filters.priceRanges?.includes(range.label)}
              onChange={() => toggle("priceRanges", range.label)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Delivery Time">
          {FILTER_OPTIONS.deliveryTimes.map((time) => (
            <CheckboxItem
              key={time}
              label={time}
              checked={filters.deliveryTimes?.includes(time)}
              onChange={() => toggle("deliveryTimes", time)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Vendor">
          {FILTER_OPTIONS.vendors.map((vendor) => (
            <CheckboxItem
              key={vendor}
              label={vendor}
              checked={filters.vendors?.includes(vendor)}
              onChange={() => toggle("vendors", vendor)}
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}
