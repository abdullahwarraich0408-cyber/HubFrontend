"use client";

import { cn } from "@/utils/cn";

export function AuthInput({
  id,
  label,
  error,
  leftIcon,
  className,
  inputClassName,
  type = "text",
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 block text-[13px] font-medium text-[#3D4F4E]"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#7A99AD]">
            {leftIcon}
          </span>
        ) : null}
        <input
          id={inputId}
          type={type}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "h-[52px] w-full rounded-xl border bg-white px-4 text-[15px] text-[#1A2B2A] outline-none transition-all duration-200",
            "placeholder:text-[#9AADAB]",
            "border-[#D5E0DE] hover:border-[#B7C9C6]",
            "focus:border-[#087F8C] focus:ring-4 focus:ring-[#087F8C]/12",
            leftIcon && "pl-11",
            error && "border-[#D92D20] bg-white focus:border-[#D92D20] focus:ring-[#D92D20]/10",
            inputClassName
          )}
          {...props}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-[13px] text-[#D92D20]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
