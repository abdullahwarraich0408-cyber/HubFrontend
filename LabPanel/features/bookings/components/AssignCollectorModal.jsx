"use client";

import { useState, useEffect } from "react";
import { X, Truck, User, Phone, FileText } from "lucide-react";
import { useLabPortalCollectors } from "@/lib/hooks/usePartnerPortal";

export function AssignCollectorModal({
  booking,
  isOpen,
  onClose,
  onAssign,
  isLoading = false,
}) {
  const { data: collectors = [] } = useLabPortalCollectors();
  const [selectedCollectorId, setSelectedCollectorId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (booking) {
      if (booking.collector_id) {
        setSelectedCollectorId(booking.collector_id);
        setName(booking.collector_name || "");
        setPhone(booking.collector_phone || "");
      } else if (collectors.length > 0) {
        const firstActive = collectors.find((c) => c.active) || collectors[0];
        if (firstActive) {
          setSelectedCollectorId(firstActive.id);
          setName(firstActive.name);
          setPhone(firstActive.phone);
        }
      }
    }
  }, [booking, collectors]);

  const handleSelectCollector = (id) => {
    setSelectedCollectorId(id);
    const found = collectors.find((c) => c.id === id);
    if (found) {
      setName(found.name);
      setPhone(found.phone);
    } else {
      setName("");
      setPhone("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onAssign({
      bookingId: booking.id,
      collector_id: selectedCollectorId || undefined,
      collector_name: name.trim(),
      collector_phone: phone.trim(),
      note: note.trim() || undefined,
    });
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[20px] border border-[#D9DEE5] shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#D9DEE5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
              <Truck size={18} />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#082B3F]">
                Assign Collector
              </h3>
              <p className="text-[12px] text-[#667085]">
                {booking.booking_number} · {booking.patient_name || booking.patient}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#667085] hover:text-[#082B3F] p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-5">
          {/* Quick Select from Active Collectors */}
          {collectors.length > 0 && (
            <div>
              <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
                Select from Lab Collectors
              </label>
              <select
                value={selectedCollectorId}
                onChange={(e) => handleSelectCollector(e.target.value)}
                className="w-full h-[42px] px-3 text-[13px] bg-white border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E]"
              >
                <option value="">-- Custom / Manual Entry --</option>
                {collectors
                  .filter((c) => c.active)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.city || "City"}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
              Collector Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali Raza"
                required
                className="w-full h-[42px] pl-10 pr-3 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
              Collector Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +92 300 5551234"
                required
                className="w-full h-[42px] pl-10 pr-3 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
              Dispatch Instructions / Notes (Optional)
            </label>
            <div className="relative">
              <FileText
                size={16}
                className="absolute left-3.5 top-3 text-[#667085]"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g. Call patient 15 mins prior; bring fasting test kit"
                className="w-full pl-10 pr-3 py-2 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-[13px] font-semibold text-[#667085] hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim() || !phone.trim()}
              className="px-5 py-2.5 text-[13px] font-semibold text-white bg-[#17618E] hover:bg-[#124362] rounded-lg transition-all shadow-xs disabled:opacity-50"
            >
              {isLoading ? "Assigning..." : "Assign Collector"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
