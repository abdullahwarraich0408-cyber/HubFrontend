"use client";

import { X, User, Phone, Envelope, Drop } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";

export function PatientDetailModal({ patient, onClose }) {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-[20px] border border-neutral-200 shadow-xl w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold text-lg">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-ink-headline">{patient.name}</h3>
              <p className="text-[13px] text-neutral-500">{patient.age} years old</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-neutral-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <InfoRow icon={User} label="Condition" value={patient.condition} />
            <InfoRow icon={CalendarLabel} label="Last Visit" value={patient.lastVisit} />
            {patient.phone && <InfoRow icon={Phone} label="Phone" value={patient.phone} />}
            {patient.email && <InfoRow icon={Envelope} label="Email" value={patient.email} />}
            {patient.bloodGroup && <InfoRow icon={Drop} label="Blood Group" value={patient.bloodGroup} />}
          </div>
        </div>

        <div className="p-6 border-t border-neutral-200">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function CalendarLabel(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" {...props}>
      <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V96H208V208Z" />
    </svg>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-[10px] border border-neutral-200">
      <Icon size={18} className="text-brand-primary shrink-0" />
      <div>
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{label}</p>
        <p className="text-[14px] font-medium text-neutral-700">{value}</p>
      </div>
    </div>
  );
}
