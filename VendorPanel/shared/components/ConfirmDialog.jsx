"use client";

import { Button } from "@/shared/components/Button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div role="dialog" aria-modal="true" className="bg-white w-full max-w-md rounded-[16px] shadow-xl p-6">
        <h2 className="text-lg font-heading font-bold text-ink-headline">{title}</h2>
        {description ? <p className="text-sm text-neutral-500 mt-2">{description}</p> : null}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={destructive ? "danger" : "primary"} onClick={onConfirm} isLoading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
