"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CaretDown, CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";
import {
  AUTH_COUNTRIES,
  DEFAULT_AUTH_COUNTRY,
} from "@/features/auth/lib/phoneCountries";

export function PhoneInput({
  country = DEFAULT_AUTH_COUNTRY,
  onCountryChange,
  value,
  onChange,
  error,
  disabled,
  hint = "A verification code will be sent to this number.",
  actionLabel = "Verify",
  actionLoading = false,
  actionDisabled = false,
  showAction = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const inputId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="w-full">
      <label htmlFor={inputId} className="mb-2 block text-[13px] font-medium text-[#3D4F4E]">
        Mobile number
      </label>
      <div
        className={cn(
          "flex h-[52px] items-center overflow-hidden rounded-xl border bg-white transition-all duration-200",
          "border-[#D5E0DE] hover:border-[#B7C9C6]",
          "focus-within:border-[#087F8C] focus-within:ring-4 focus-within:ring-[#087F8C]/12",
          error && "border-[#D92D20] focus-within:border-[#D92D20] focus-within:ring-[#D92D20]/10"
        )}
      >
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country, ${country.name} ${country.dial}`}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-full min-w-[102px] shrink-0 items-center justify-center gap-1.5 border-r border-[#D5E0DE] px-3 text-[14px] font-semibold text-[#1A2B2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#087F8C]"
        >
          <span aria-hidden="true">{country.flag}</span>
          <span>{country.dial}</span>
          <CaretDown size={12} className={cn("text-[#6B7C7B] transition-transform", open && "rotate-180")} />
        </button>
        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          enterKeyHint="send"
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/[^\d\s]/g, ""))}
          placeholder={country.placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
          className="min-w-0 flex-1 bg-transparent px-3 text-[15px] text-[#1A2B2A] outline-none placeholder:text-[#9AADAB]"
        />
        {showAction ? (
          <button
            type="submit"
            disabled={disabled || actionDisabled || actionLoading}
            className="mr-1.5 inline-flex h-9 min-w-[76px] items-center justify-center rounded-lg bg-[#087F8C] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#075E5B] disabled:opacity-50"
          >
            {actionLoading ? <CircleNotch size={14} className="animate-spin" /> : actionLabel}
          </button>
        ) : null}
      </div>
      {open ? (
        <ul
          role="listbox"
          aria-label="Select country"
          className="mt-2 overflow-hidden rounded-xl border border-[#D5E0DE] bg-white py-1 shadow-[0_12px_32px_rgba(23,37,37,0.08)]"
        >
          {AUTH_COUNTRIES.map((item) => (
            <li key={item.code}>
              <button
                type="button"
                role="option"
                aria-selected={item.code === country.code}
                onClick={() => {
                  onCountryChange(item);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-[14px] text-[#1A2B2A] hover:bg-[#F3F8F7]",
                  item.code === country.code && "bg-[#EAF8F7] font-semibold"
                )}
              >
                <span aria-hidden="true">{item.flag}</span>
                <span className="flex-1">{item.name}</span>
                <span className="text-[#6B7C7B]">{item.dial}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-[13px] text-[#D92D20]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-[12px] leading-5 text-[#7A8F8D]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
