"use client";

import { Check, Circle } from "@phosphor-icons/react";

export function PasswordRequirements({ password }) {
  const longEnough = String(password || "").length >= 8;

  return (
    <div className="mt-1.5 flex items-center gap-1.5 text-[12px]">
      {longEnough ? (
        <Check size={14} weight="bold" className="text-[#15803D]" />
      ) : (
        <Circle size={10} className="text-[#9BB0C0]" />
      )}
      <span className={longEnough ? "font-medium text-[#15803D]" : "text-[#627D98]"}>
        At least 8 characters
      </span>
    </div>
  );
}
