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
          className="mb-2 block text-[14px] font-semibold text-[#102A43]"
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
            "h-[52px] w-full rounded-[14px] border bg-white px-4 text-[15px] text-[#102A43] outline-none transition-colors duration-200",
            "placeholder:text-[#8AA0B2]",
            "border-[#D9E5EC] hover:border-[#B7CBD6]",
            "focus:border-[#17618E] focus:ring-4 focus:ring-[#16A9E0]/15",
            leftIcon && "pl-11",
            error && "border-[#D92D20] focus:border-[#D92D20] focus:ring-[#D92D20]/10",
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
