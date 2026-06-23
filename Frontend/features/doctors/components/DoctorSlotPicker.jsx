"use client";

import { Clock } from "@phosphor-icons/react";
import { Input } from "@/shared/components/Input";
import { useDoctorSlots } from "@/lib/hooks/useApi";

function formatBookingDate(dateStr) {
  if (!dateStr) return "";
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toLocalDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseSlotMinutes(slot) {
  const match = String(slot).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function sortSlots(slots) {
  return [...slots].sort((a, b) => parseSlotMinutes(a) - parseSlotMinutes(b));
}

function buildQuickDates(count = 7) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const value = toLocalDateValue(date);
    const dayLabel =
      i === 0
        ? "Today"
        : i === 1
          ? "Tomorrow"
          : date.toLocaleDateString("en-PK", { weekday: "short" });
    const label =
      i === 0
        ? "Today"
        : i === 1
          ? "Tomorrow"
          : date.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" });
    dates.push({ value, label, dayLabel, dayNum: date.getDate() });
  }

  return dates;
}

export function DoctorSlotPicker({
  doctorId,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
  showDateInput = true,
  variant = "default",
  slotParams = {},
}) {
  const quickDates = buildQuickDates(variant === "oladoc" ? 14 : 7);
  const { data: availability, isLoading, isFetching } = useDoctorSlots(doctorId, selectedDate, slotParams, {
    enabled: Boolean(doctorId && selectedDate),
  });
  const slots = availability?.slots || [];
  const booked = availability?.booked || [];
  const ranges = availability?.ranges || [];
  const bookedSet = new Set(booked);
  const allSlots = sortSlots([...new Set([...slots, ...booked])]);
  const hasAnySlots = allSlots.length > 0;

  return (
    <div>
      {showDateInput && (
        <>
          <label className="text-[13px] font-semibold text-[var(--color-ink-headline)] mb-2 block">
            Select date
          </label>
          {variant === "oladoc" ? (
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
              {quickDates.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onDateChange(item.value);
                    onSlotChange(null);
                  }}
                  className={`shrink-0 min-w-[72px] px-3 py-3 rounded-[12px] border text-center transition-all ${
                    selectedDate === item.value
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-mist)] text-[var(--color-brand-primary)]"
                      : "border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-600)] hover:border-[var(--color-brand-primary)]/40"
                  }`}
                >
                  <p className="text-[11px] font-semibold leading-tight">{item.dayLabel}</p>
                  <p className="text-[15px] font-bold leading-tight mt-0.5">{item.dayNum}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mb-4">
              {quickDates.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onDateChange(item.value);
                    onSlotChange(null);
                  }}
                  className={`px-3 py-2 rounded-full text-[12px] font-semibold border transition-all ${
                    selectedDate === item.value
                      ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]"
                      : "bg-white text-[var(--color-neutral-600)] border-[var(--color-neutral-200)] hover:border-[var(--color-brand-primary)]/40"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          {variant !== "oladoc" && (
            <Input
              type="date"
              value={selectedDate}
              min={toLocalDateValue(new Date())}
              onChange={(e) => {
                onDateChange(e.target.value);
                onSlotChange(null);
              }}
              className="mb-4 max-w-[240px]"
            />
          )}
        </>
      )}

      <p className="text-[14px] text-[var(--color-neutral-600)] mb-1">
        Available slots for{" "}
        <span className="font-semibold text-[var(--color-ink-headline)]">
          {formatBookingDate(selectedDate)}
        </span>
      </p>
      {ranges.length > 0 ? (
        <p className="text-[12px] text-[var(--color-neutral-500)] mb-2">
          Doctor&apos;s hours this day: {ranges.join(" · ")}
        </p>
      ) : (
        <p className="text-[12px] text-[var(--color-neutral-500)] mb-2">
          No consultation hours set for this day. Try another date.
        </p>
      )}
      <p className="text-[12px] text-[var(--color-neutral-400)] mb-4">
        {isFetching ? "Updating live availability..." : "Booked slots are locked for that date"}
      </p>

      {isLoading ? (
        <p className="text-[13px] text-[var(--color-neutral-500)]">Loading available slots...</p>
      ) : !availability?.worksThisDay && slotParams.hospital_id ? (
        <p className="text-[13px] text-[var(--color-neutral-500)]">
          Doctor is not available at this hospital on {availability?.day || "this day"}. Please pick another date.
        </p>
      ) : !hasAnySlots ? (
        <p className="text-[13px] text-[var(--color-neutral-500)]">
          No slots available for this date. Try another day.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allSlots.map((slot) => {
            const isBooked = bookedSet.has(slot);
            const isSelected = selectedSlot === slot;

            return (
              <button
                key={slot}
                type="button"
                disabled={isBooked}
                onClick={() => onSlotChange(slot)}
                className={`flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-[12px] border text-[14px] font-semibold transition-all ${
                  isBooked
                    ? "border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] text-[var(--color-neutral-400)] cursor-not-allowed opacity-70"
                    : isSelected
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-mist)] text-[var(--color-brand-primary)]"
                      : "border-[var(--color-neutral-200)] text-[var(--color-neutral-700)] hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-mist)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock
                    size={16}
                    className={isBooked ? "text-[var(--color-neutral-400)]" : "text-[var(--color-brand-primary)]"}
                    weight="fill"
                  />
                  {slot}
                </span>
                {isBooked && <span className="text-[10px] font-bold uppercase tracking-wide">Booked</span>}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-[12px] text-[var(--color-neutral-400)] mt-4">
        All times shown in Pakistan Standard Time (PKT)
      </p>
    </div>
  );
}
