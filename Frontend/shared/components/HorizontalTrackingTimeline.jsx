"use client";

import { Check } from "@phosphor-icons/react";

export function HorizontalTrackingTimeline({ steps = [], className = "" }) {
  if (!steps.length) return null;

  return (
    <div className={`overflow-x-auto scrollbar-hide ${className}`}>
      <div className="flex items-start min-w-max px-1 pb-1">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const connectorDone = step.done && steps[i + 1]?.done;

          return (
            <div key={step.step} className="flex items-start">
              <div className="flex flex-col items-center w-[88px] sm:w-[100px] shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${
                    step.done
                      ? "bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white"
                      : "border-[var(--color-neutral-200)] text-[var(--color-neutral-300)] bg-white"
                  }`}
                >
                  {step.done ? (
                    <Check size={14} weight="bold" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-300)]" />
                  )}
                </div>
                <p
                  className={`mt-2 text-[11px] sm:text-[12px] font-bold text-center leading-tight px-1 ${
                    step.done ? "text-[var(--color-ink-headline)]" : "text-[var(--color-neutral-400)]"
                  }`}
                >
                  {step.step}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[var(--color-neutral-500)] text-center mt-0.5 px-1 leading-snug">
                  {step.time}
                </p>
              </div>

              {!isLast && (
                <div className="flex items-center h-8 px-0.5 sm:px-1 shrink-0">
                  <div
                    className={`h-0.5 w-6 sm:w-10 ${
                      connectorDone || step.done
                        ? "bg-[var(--color-brand-primary)]"
                        : "bg-[var(--color-neutral-200)]"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
