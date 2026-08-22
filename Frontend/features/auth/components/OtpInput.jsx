"use client";

import { useRef } from "react";
import { cn } from "@/utils/cn";

const LENGTH = 6;

export function OtpInput({ value, onChange, error, disabled }) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, LENGTH).split("");
  while (digits.length < LENGTH) digits.push("");
  const refs = useRef([]);

  const setDigit = (index, next) => {
    const nextDigits = [...digits];
    nextDigits[index] = next;
    onChange(nextDigits.join(""));
  };

  const handleChange = (index, raw) => {
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, LENGTH);
      onChange(pasted);
      const focusAt = Math.min(pasted.length, LENGTH - 1);
      refs.current[focusAt]?.focus();
      return;
    }
    setDigit(index, cleaned);
    if (cleaned && index < LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      setDigit(index - 1, "");
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    onChange(pasted);
    refs.current[Math.min(pasted.length, LENGTH) - 1]?.focus();
  };

  return (
    <div>
      <div className="flex justify-between gap-2" role="group" aria-label="Verification code">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${LENGTH}`}
            className={cn(
              "h-12 w-11 rounded-[12px] border text-center text-[18px] font-semibold text-[#102A43] outline-none transition-colors duration-200 sm:h-[54px] sm:w-12",
              "border-[#D9E5EC] bg-white",
            "focus:border-[#17618E] focus:ring-4 focus:ring-[#17618E]/12",
            error && "border-[#D92D20]"
            )}
          />
        ))}
      </div>
      {error ? <p className="mt-2 text-[13px] text-[#D92D20]">{error}</p> : null}
    </div>
  );
}
