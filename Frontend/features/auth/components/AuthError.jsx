"use client";

import { WarningCircle } from "@phosphor-icons/react";

export function AuthError({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-[14px] border border-[#F4C7C3] bg-[#FDF2F0] px-3.5 py-3 text-[14px] leading-5 text-[#9B1C1C]"
    >
      <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p>{message}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-[13px] font-semibold text-[#9B1C1C] underline underline-offset-2"
          >
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}
