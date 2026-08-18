"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PrescriptionModal } from "../components/PrescriptionModal";

export const OPEN_PRESCRIPTION_MODAL_EVENT = "open-prescription-modal";

const PrescriptionModalContext = createContext(null);

export function PrescriptionModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialFile, setInitialFile] = useState(null);

  const openPrescriptionModal = useCallback((file = null) => {
    if (file && file instanceof File) {
      setInitialFile(file);
    } else {
      setInitialFile(null);
    }
    setIsOpen(true);
  }, []);

  const closePrescriptionModal = useCallback(() => {
    setIsOpen(false);
    setInitialFile(null);
  }, []);

  useEffect(() => {
    const handleOpenEvent = (e) => {
      openPrescriptionModal(e.detail?.file || null);
    };

    window.addEventListener(OPEN_PRESCRIPTION_MODAL_EVENT, handleOpenEvent);
    return () => {
      window.removeEventListener(OPEN_PRESCRIPTION_MODAL_EVENT, handleOpenEvent);
    };
  }, [openPrescriptionModal]);

  return (
    <PrescriptionModalContext.Provider
      value={{
        isOpen,
        openPrescriptionModal,
        closePrescriptionModal,
      }}
    >
      {children}
      <PrescriptionModal
        isOpen={isOpen}
        initialFile={initialFile}
        onClose={closePrescriptionModal}
      />
    </PrescriptionModalContext.Provider>
  );
}

export function usePrescriptionModal() {
  const context = useContext(PrescriptionModalContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      isOpen: false,
      openPrescriptionModal: (file = null) => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(OPEN_PRESCRIPTION_MODAL_EVENT, { detail: { file } })
          );
        }
      },
      closePrescriptionModal: () => {},
    };
  }
  return context;
}

export function triggerPrescriptionModal(file = null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(OPEN_PRESCRIPTION_MODAL_EVENT, { detail: { file } })
    );
  }
}
