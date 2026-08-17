"use client";

import { EmailSignInModal } from "./EmailSignInModal";

export function LoginModal({ open, onClose, redirectTo = "/", onSuccess, expired = false }) {
  if (!open) return null;

  return (
    <>
      {expired ? (
        <div className="fixed top-4 left-1/2 z-[140] -translate-x-1/2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 shadow">
          Your session expired. Please sign in again.
        </div>
      ) : null}
      <EmailSignInModal
        open={open}
        onClose={onClose}
        redirectTo={redirectTo}
        onSuccess={() => {
          onSuccess?.();
          if (redirectTo && typeof window !== "undefined") {
            window.location.href = redirectTo;
          }
        }}
      />
    </>
  );
}
