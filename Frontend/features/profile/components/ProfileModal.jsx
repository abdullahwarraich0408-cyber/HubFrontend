"use client";

export function ProfileModal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[480px] bg-white rounded-[20px] border border-[var(--color-neutral-200)] shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-neutral-200)]">
          <h3 className="text-[18px] font-bold text-[var(--color-ink-headline)]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] font-semibold text-[var(--color-neutral-500)] hover:text-[var(--color-brand-primary)]"
          >
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="p-5 pt-0 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
