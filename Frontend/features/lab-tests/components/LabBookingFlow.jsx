"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Check,
  MapPin,
  Clock,
  Flask,
  LockKey,
  House,
  Buildings,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { TIME_SLOTS } from "../data/mockLabTests";
import { useLabTestTimeSlots, useBookLabTest } from "@/lib/hooks/useApi";
import { openSignInModal } from "@/lib/authModalEvents";

const STEPS = [
  { id: 1, label: "Test", icon: Flask },
  { id: 2, label: "Details", icon: MapPin },
  { id: 3, label: "Slot", icon: Clock },
  { id: 4, label: "Done", icon: Check },
];

export function LabBookingFlow({ test }) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { data: apiTimeSlots = [] } = useLabTestTimeSlots();
  const bookLabTest = useBookLabTest();
  const timeSlots = apiTimeSlots.length > 0 ? apiTimeSlots : TIME_SLOTS;
  const [step, setStep] = useState(1);
  const [collectionType, setCollectionType] = useState(test.homeCollection ? "HOME" : "VISIT_LAB");
  const [patient, setPatient] = useState({ name: user?.name || "", gender: "", age: "", phone: user?.phone || "" });
  const [address, setAddress] = useState({ line: "", city: "Karachi", phone: user?.phone || "" });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().slice(0, 10));
  const [prescriptionUrl, setPrescriptionUrl] = useState("");

  const next = () => setStep((s) => Math.min(4, s + 1));
  const detailsValid = patient.name.trim() && patient.phone.trim() && (collectionType === "VISIT_LAB" || address.line.trim());

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book a lab test");
      openSignInModal({ redirect: `/lab-tests/${test.id}` });
      return;
    }

    try {
      await bookLabTest.mutateAsync({
        lab_test_id: test.id,
        patient_name: patient.name,
        patient_gender: patient.gender,
        patient_age: patient.age ? Number(patient.age) : undefined,
        collection_type: collectionType,
        time_slot: selectedSlot,
        payment_method: "cod",
        collection_date: new Date(collectionDate).toISOString(),
        collection_address: collectionType === "HOME" ? { ...address, phone: patient.phone } : undefined,
        prescription_url: prescriptionUrl || undefined,
      });
      toast.success("Lab test booked successfully");
      next();
    } catch (error) {
      toast.error(error.message || "Could not book lab test");
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8 overflow-x-auto pb-2 gap-0">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex items-center shrink-0">
              <div className="flex flex-col items-center w-[72px]">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${done ? "bg-brand-primary border-brand-primary text-white" : active ? "border-brand-primary text-brand-primary bg-brand-mist" : "border-neutral-200 text-neutral-400"}`}>
                  {done ? <Check size={16} weight="bold" /> : <Icon size={16} weight={active ? "fill" : "regular"} />}
                </div>
                <span className={`text-[10px] font-semibold mt-1 ${active ? "text-brand-primary" : "text-neutral-400"}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-6 h-0.5 mb-4 ${step > s.id ? "bg-brand-primary" : "bg-neutral-200"}`} />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div>
          <div className="p-5 bg-brand-mist rounded-[12px] border mb-4">
            <p className="text-[16px] font-bold mb-1">{test.name}</p>
            <p className="text-[13px] text-neutral-500">{test.lab} · {test.testsIncluded} tests</p>
            {test.fastingRequired && <p className="text-[12px] text-amber-700 mt-2">⚠ Fasting required before this test</p>}
            {test.preparation && <p className="text-[12px] text-neutral-600 mt-2">{test.preparation}</p>}
            <p className="text-[20px] font-bold text-brand-primary mt-3">PKR {test.price.toLocaleString()}</p>
          </div>
          <Button className="w-full h-[48px]" onClick={next}>Continue</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Input placeholder="Patient name" value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Gender" value={patient.gender} onChange={(e) => setPatient({ ...patient, gender: e.target.value })} />
            <Input placeholder="Age" type="number" value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} />
          </div>
          <Input placeholder="Phone" value={patient.phone} onChange={(e) => setPatient({ ...patient, phone: e.target.value })} />
          <div className="flex gap-2">
            {test.homeCollection && (
              <button onClick={() => setCollectionType("HOME")} className={`flex-1 py-3 rounded-[12px] border flex items-center justify-center gap-2 text-[13px] font-semibold ${collectionType === "HOME" ? "border-brand-primary bg-brand-mist" : "border-neutral-200"}`}>
                <House size={16} /> Home Collection
              </button>
            )}
            <button onClick={() => setCollectionType("VISIT_LAB")} className={`flex-1 py-3 rounded-[12px] border flex items-center justify-center gap-2 text-[13px] font-semibold ${collectionType === "VISIT_LAB" ? "border-brand-primary bg-brand-mist" : "border-neutral-200"}`}>
              <Buildings size={16} /> Visit Lab
            </button>
          </div>
          {collectionType === "HOME" && (
            <>
              <textarea value={address.line} onChange={(e) => setAddress({ ...address, line: e.target.value })} placeholder="Street address" rows={3} className="w-full px-4 py-3 border rounded-[12px]" />
              <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" />
            </>
          )}
          <Input placeholder="Prescription URL (optional)" value={prescriptionUrl} onChange={(e) => setPrescriptionUrl(e.target.value)} />
          <Button className="w-full h-[48px]" disabled={!detailsValid} onClick={next}>Continue to Slot</Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <Input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} className="mb-4" />
          <div className="grid grid-cols-2 gap-3 mb-4">
            {timeSlots.map((slot) => (
              <button key={slot} onClick={() => setSelectedSlot(slot)} className={`py-3 rounded-[12px] border text-[13px] font-semibold ${selectedSlot === slot ? "border-brand-primary bg-brand-mist text-brand-primary" : "border-neutral-200"}`}>
                {slot}
              </button>
            ))}
          </div>
          <div className="p-4 bg-surface-subtle rounded-[12px] mb-4 space-y-1 text-[13px] text-neutral-600">
            <div className="flex justify-between"><span>{test.name}</span><span className="font-bold">PKR {test.price.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Collection</span><span>{collectionType === "HOME" ? "Home" : "Lab visit"}</span></div>
            <div className="flex justify-between"><span>Patient</span><span>{patient.name}</span></div>
          </div>
          <p className="text-[12px] text-neutral-500 mb-4 flex items-center gap-1.5">
            <LockKey size={14} /> Pay on collection — no online payment required for now.
          </p>
          <Button className="w-full h-[48px]" disabled={!selectedSlot || bookLabTest.isPending} onClick={handleConfirmBooking}>
            {bookLabTest.isPending ? "Confirming..." : "Confirm Booking"}
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-status-success-bg flex items-center justify-center mx-auto mb-4">
            <Check size={32} weight="bold" className="text-status-success" />
          </div>
          <h3 className="text-[20px] font-bold mb-2">Booking Confirmed</h3>
          <p className="text-neutral-500 mb-6">Track your order status in Orders. Report will appear in Reports when ready.</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => router.push("/orders")}>View Orders</Button>
            <Button className="flex-1" onClick={() => router.push("/account/reports")}>My Reports</Button>
          </div>
        </div>
      )}
    </div>
  );
}
