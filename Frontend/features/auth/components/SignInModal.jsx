"use client";

import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { SignInForm } from "@/features/auth/components/SignInForm";

export function SignInModal({ open, onClose, redirectTo = "/", expired = false }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close sign in"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[960px] max-h-[92vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl border border-[var(--color-neutral-200)] animate-in fade-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-[var(--color-neutral-500)] hover:text-[var(--color-ink-headline)] hover:bg-white shadow-sm border border-[var(--color-neutral-200)]"
          aria-label="Close"
        >
          <X size={18} weight="bold" />
        </button>

        {expired && (
          <div className="px-6 pt-5 pb-0">
            <p className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-[10px] px-3 py-2">
              Your session expired. Please sign in again to continue.
            </p>
          </div>
        )}

        <SignInForm
          redirectTo={redirectTo}
          onSuccess={onClose}
          variant="modal"
          showBrandPanel
        />
      </div>
    </div>
  );
}
