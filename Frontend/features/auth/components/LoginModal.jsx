"use client";

import { useState } from "react";
import { OtpModal } from "./OtpModal";
import { SignInForm } from "./SignInForm";

export function LoginModal({ open, onClose, redirectTo = "/", onSuccess, expired = false }) {
  const [mode, setMode] = useState("otp");

  if (!open) return null;

  if (mode === "otp") {
    return (
      <OtpModal
        open={open}
        onClose={onClose}
        onSuccess={() => {
          onSuccess?.();
          if (redirectTo && typeof window !== "undefined") {
            window.location.href = redirectTo;
          }
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[960px] max-h-[92vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl">
        {expired && (
          <p className="mx-6 mt-5 text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-[10px] px-3 py-2">
            Your session expired. Please sign in again.
          </p>
        )}
        <SignInForm redirectTo={redirectTo} onSuccess={onSuccess ?? onClose} variant="modal" showBrandPanel />
        <button
          type="button"
          className="mx-6 mb-6 text-sm text-[var(--color-brand-primary)] font-semibold"
          onClick={() => setMode("otp")}
        >
          ← Back to phone OTP
        </button>
      </div>
    </div>
  );
}
