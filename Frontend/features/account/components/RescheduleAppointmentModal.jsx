"use client";

import { useMemo, useState } from "react";
import { CalendarBlank, X } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { DoctorSlotPicker } from "@/features/doctors/components/DoctorSlotPicker";
import { useRescheduleDoctorAppointment } from "@/lib/hooks/useApi";
import { toast } from "sonner";

function toDateInputValue(isoOrDate) {
  if (!isoOrDate) return "";
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) {
    const raw = String(isoOrDate).slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : "";
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function RescheduleAppointmentModal({ appointment, onClose }) {
  const reschedule = useRescheduleDoctorAppointment();
  const initialDate = useMemo(
    () => toDateInputValue(appointment?.dateIso || appointment?.raw?.appointment_date),
    [appointment]
  );
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlot, setSelectedSlot] = useState("");

  if (!appointment) return null;

  const hospitalId =
    appointment.raw?.hospital_id ||
    appointment.raw?.practice_location?.hospital_id ||
    undefined;
  const practiceLocationId =
    appointment.raw?.practice_location_id ||
    appointment.raw?.practice_location?.id ||
    undefined;

  const slotParams = {};
  if (hospitalId) slotParams.hospital_id = hospitalId;
  if (practiceLocationId && practiceLocationId !== "legacy") {
    slotParams.practice_location_id = practiceLocationId;
  }

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error("Please select a new date and time slot");
      return;
    }
    try {
      await reschedule.mutateAsync({
        id: appointment.id,
        appointment_date: selectedDate,
        slot: selectedSlot,
      });
      toast.success("Appointment rescheduled");
      onClose?.();
    } catch (error) {
      toast.error(error.message || "Could not reschedule appointment");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[16px] max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[18px] font-bold text-ink-headline flex items-center gap-2">
              <CalendarBlank size={20} className="text-brand-primary" />
              Reschedule appointment
            </h3>
            <p className="text-[13px] text-neutral-500 mt-1">
              {appointment.doctorName} · currently {appointment.date} · {appointment.slot}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <DoctorSlotPicker
          doctorId={appointment.doctorId}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          onDateChange={(date) => {
            setSelectedDate(date);
            setSelectedSlot("");
          }}
          onSlotChange={setSelectedSlot}
          variant="oladoc"
          slotParams={slotParams}
        />

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={reschedule.isPending || !selectedDate || !selectedSlot}
            onClick={handleConfirm}
          >
            {reschedule.isPending ? "Saving…" : "Confirm new slot"}
          </Button>
        </div>
      </div>
    </div>
  );
}
