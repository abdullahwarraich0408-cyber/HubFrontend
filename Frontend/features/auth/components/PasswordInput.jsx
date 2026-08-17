"use client";

import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";

export function PasswordInput({
  id,
  label,
  error,
  leftIcon,
  className,
  autoComplete = "current-password",
  ...props
}) {
  const [visible, setVisible] = useState(false);
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
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "h-[52px] w-full rounded-[14px] border bg-white pr-12 text-[15px] text-[#102A43] outline-none transition-colors duration-200",
            "placeholder:text-[#8AA0B2]",
            "border-[#D9E5EC] hover:border-[#B7CBD6]",
            "focus:border-[#17618E] focus:ring-4 focus:ring-[#16A9E0]/15",
            leftIcon ? "pl-11" : "pl-4",
            error && "border-[#D92D20] focus:border-[#D92D20] focus:ring-[#D92D20]/10"
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-1.5 flex w-11 items-center justify-center rounded-[10px] text-[#627D98] transition-colors hover:text-[#102A43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A9E0]"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeSlash size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-[13px] text-[#D92D20]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
