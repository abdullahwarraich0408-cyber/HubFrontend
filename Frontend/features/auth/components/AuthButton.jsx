"use client";

import { ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";

export function AuthButton({
  children,
  loading = false,
  loadingLabel,
  showArrow = true,
  className,
  disabled,
  type = "submit",
  ...props
}) {
  const busy = loading || disabled;

  return (
    <button
      type={type}
      disabled={busy}
      className={cn(
        "inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#087F8C] px-5 text-[15px] font-semibold text-white transition-all duration-200",
        "hover:bg-[#075E5B]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "motion-safe:active:scale-[0.99]",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <CircleNotch size={18} className="animate-spin motion-reduce:animate-none" />
          <span>{loadingLabel || children}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {showArrow ? <ArrowRight size={18} weight="bold" /> : null}
        </>
      )}
    </button>
  );
}
