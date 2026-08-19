"use client";

import { useEffect } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "./Button";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[16px] border border-[#D9DEE5] shadow-xl w-full max-w-md p-6 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDanger ? "bg-red-50 text-[#EF233C]" : "bg-teal-50 text-[#087F82]"
            }`}
          >
            {isDanger ? <AlertTriangle size={20} /> : <Info size={20} />}
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-[#07172E] leading-snug">
              {title}
            </h3>
            {description && (
              <p className="text-[14px] text-[#667085] mt-1.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 text-[13px] font-semibold text-[#667085] hover:text-[#07172E] hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 text-[13px] font-semibold text-white rounded-lg transition-all shadow-xs ${
              isDanger
                ? "bg-[#EF233C] hover:bg-[#d81d33] focus:ring-2 focus:ring-red-300"
                : "bg-[#087F82] hover:bg-[#076B6E] focus:ring-2 focus:ring-teal-300"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
