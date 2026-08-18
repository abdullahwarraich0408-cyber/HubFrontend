"use client";

import { X } from "@phosphor-icons/react";
import { mergeGuestCart } from "@/features/auth/lib/completeWebLogin";
import { AuthFlow } from "@/features/auth/components/AuthFlow";
import { AuthBrandMark } from "@/features/auth/components/AuthChrome";

export function EmailSignInModal({ open, onClose, onSuccess }) {
  if (!open) return null;

  const finish = async () => {
    await mergeGuestCart();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
    }
    onSuccess?.();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center sm:items-center sm:p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-[#172525]/50" onClick={onClose} />
      <div className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_24px_64px_rgba(8,63,70,0.16)] sm:max-w-[440px] sm:rounded-[24px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-[#6B7C7B] hover:bg-[#F7FBFA]"
          aria-label="Close sign in"
        >
          <X size={18} weight="bold" />
        </button>
        <div className="shrink-0 px-6 pt-6 pr-14">
          <AuthBrandMark />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
          <AuthFlow onAuthenticated={finish} />
        </div>
      </div>
    </div>
  );
}
