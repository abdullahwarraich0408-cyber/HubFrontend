"use client";

import { useMemo, useState } from "react";
import { Button } from "@/shared/components/Button";
import { useBookFollowUp, useFollowUpAvailableSlots } from "@/lib/hooks/useApi";
import { toast } from "sonner";

export function BookFollowUpModal({ followUp, onClose }) {
  const slotsQuery = useFollowUpAvailableSlots(followUp?.id, {
    enabled: Boolean(followUp?.id),
  });
  const bookMut = useBookFollowUp();
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [mode, setMode] = useState(
    followUp?.preferred_mode === "in_clinic" ? "in_clinic" : "online",
  );

  const slotGroups = useMemo(() => {
    const data = slotsQuery.data || {};
    const groups = [];
    if ((data.recommended_date_slots || []).length) {
      groups.push({
        date: data.recommended_date,
        label: `Recommended · ${data.recommended_date}`,
        slots: data.recommended_date_slots,
      });
    }
    (data.nearby_dates || []).forEach((day) => {
      groups.push({
        date: day.date,
        label: day.date,
        slots: day.slots || [],
      });
    });
    return groups;
  }, [slotsQuery.data]);

  const handleBook = async () => {
    if (!selectedSlotId) {
      toast.error("Please select a slot");
      return;
    }
    try {
      const result = await bookMut.mutateAsync({
        id: followUp.id,
        slot_id: selectedSlotId,
        mode,
        payment_method: mode === "online" ? "stripe" : "pay_at_clinic",
      });
      toast.success("Follow-up booked");
      onClose?.(result);
    } catch (error) {
      toast.error(error.message || "Could not book follow-up");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-[18px] font-bold mb-1">Book follow-up</h3>
        <p className="text-[13px] text-neutral-500 mb-4">
          {followUp?.doctor?.name ? `Dr. ${followUp.doctor.name}` : "Your doctor"} · around{" "}
          {followUp?.recommended_date}
        </p>

        <div className="mb-4">
          <p className="text-[12px] font-semibold text-neutral-600 mb-2">Consultation mode</p>
          <div className="flex gap-2">
            {["online", "in_clinic"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-3 py-2 rounded-lg text-[13px] font-semibold border ${
                  mode === m
                    ? "border-brand-primary bg-brand-light text-brand-primary"
                    : "border-neutral-200 text-neutral-600"
                }`}
              >
                {m === "online" ? "Online" : "In-clinic"}
              </button>
            ))}
          </div>
        </div>

        {slotsQuery.isLoading ? (
          <p className="text-[13px] text-neutral-500 py-6 text-center">Loading available slots…</p>
        ) : slotGroups.length === 0 ? (
          <p className="text-[13px] text-neutral-500 py-6 text-center">
            No slots available in the booking window. Please try again later.
          </p>
        ) : (
          <div className="space-y-4 mb-4">
            {slotGroups.map((group) => (
              <div key={group.date}>
                <p className="text-[12px] font-bold text-neutral-700 mb-2">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.slots.map((slot) => (
                    <button
                      key={slot.slot_id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.slot_id)}
                      className={`px-3 py-1.5 rounded-md text-[12px] font-semibold border ${
                        selectedSlotId === slot.slot_id
                          ? "border-brand-primary bg-brand-primary text-white"
                          : "border-neutral-200 hover:border-brand-primary"
                      }`}
                    >
                      {slot.slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <Button variant="secondary" className="flex-1" onClick={() => onClose?.()}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={bookMut.isPending || !selectedSlotId}
            onClick={handleBook}
          >
            {bookMut.isPending ? "Booking…" : "Confirm booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}
