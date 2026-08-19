"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FileArrowUp } from "@phosphor-icons/react";
import { PrescriptionUploadZone } from "@/features/home/components/PrescriptionUploadZone";

export function PrescriptionModal({ isOpen, onClose, initialFile }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#073B4C]/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[24px] border border-[#0B6E99]/15 bg-white shadow-[0_24px_60px_rgba(7,59,76,0.22)] my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prescription-modal-title"
          >
            {/* Modal Header */}
            <div className="relative border-b border-[#102A43]/08 bg-[#F1F7FA] px-6 py-5 md:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8F4F8] text-[#0B6E99]">
                  <FileArrowUp size={24} weight="duotone" />
                </div>
                <div>
                  <h2
                    id="prescription-modal-title"
                    className="text-[18px] font-bold text-[#102A43] md:text-[20px]"
                  >
                    Upload Prescription
                  </h2>
                  <p className="text-[13px] text-[#627D98]">
                    Send your prescription securely to nearby partner pharmacies
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#102A43]/10 bg-white text-[#627D98] transition-colors hover:bg-[#EAF7F5] hover:text-[#0B6E99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6E99]"
                aria-label="Close modal"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
              <PrescriptionUploadZone
                initialFile={initialFile}
                onSuccess={onClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
