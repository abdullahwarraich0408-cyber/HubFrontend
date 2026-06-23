"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Check,
  CreditCard,
  LockKey,
  Clock,
  Buildings,
  VideoCamera,
  ArrowLeft,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { DoctorSlotPicker } from "./DoctorSlotPicker";
import { BookingAuthModal } from "./BookingAuthModal";
import { BookConsultModal } from "./BookConsultModal";
import { buildDoctorConsultOptions } from "../utils/consultOptions";
import { useBookDoctorAppointment } from "@/lib/hooks/useApi";
import { openSignInModal } from "@/lib/authModalEvents";

function formatBookingDate(dateStr) {
  if (!dateStr) return dateStr;
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortSlot(dateStr, slot) {
  if (!dateStr || !slot) return "";
  const date = new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
  });
  return `${date}, ${slot}`;
}

function buildAppointmentIso(selectedDate, selectedSlot) {
  const match = String(selectedSlot).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return new Date(`${selectedDate}T09:00:00`).toISOString();

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const date = new Date(`${selectedDate}T00:00:00`);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function buildBookQuery(doctorId, option, hospitalContext, tab = "book") {
  const params = new URLSearchParams({ tab, consult: option.type });
  if (option.practiceLocationId) {
    params.set("practice_location_id", option.practiceLocationId);
  }
  if (option.hospitalId || hospitalContext) {
    params.set("hospital", option.hospitalId || hospitalContext);
  }
  return `/doctors/${doctorId}?${params.toString()}`;
}

const buildSlotParams = (option) => {
  if (!option || option.type === "online") return { consult: "online" };
  return {
    consult: "in_person",
    hospital_id: option.hospitalId || undefined,
    practice_location_id: option.practiceLocationId || undefined,
  };
};

export function AppointmentFlow({
  doctor,
  initialDate,
  initialSlot,
  initialConsultType = null,
  hospitalContext = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const practiceLocationParam = searchParams.get("practice_location_id");
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const bookAppointment = useBookDoctorAppointment();

  const allOptions = useMemo(
    () => buildDoctorConsultOptions(doctor, { hospitalContext }),
    [doctor, hospitalContext]
  );

  const defaultOption =
    allOptions.find((option) => option.practiceLocationId === practiceLocationParam) ||
    allOptions.find((option) => option.type === initialConsultType) ||
    allOptions[0] ||
    null;

  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [step, setStep] = useState(() => (searchParams.get("step") === "2" ? 2 : 1));
  const [selectedSlot, setSelectedSlot] = useState(initialSlot || null);
  const [selectedDate, setSelectedDate] = useState(
    initialDate || new Date().toISOString().slice(0, 10)
  );
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [purpose, setPurpose] = useState("consultation");
  const [patientName, setPatientName] = useState(user?.name || "");
  const [patientPhone, setPatientPhone] = useState(user?.phone || "");
  const [bookedAppointment, setBookedAppointment] = useState(null);

  const consultType = selectedOption?.type;
  const appointmentDateIso = useMemo(
    () => buildAppointmentIso(selectedDate, selectedSlot),
    [selectedDate, selectedSlot]
  );

  const hasCustomerSession = () => {
    const customerToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return isAuthenticated && customerToken && customerToken !== "cookie-auth-active";
  };

  const handleSlotContinue = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!hasCustomerSession()) {
      setShowAuthModal(true);
      return;
    }
    await submitBooking();
  };

  const submitBooking = async () => {
    if (!consultType || !selectedOption) {
      toast.error("Please select a consultation type");
      return;
    }

    try {
      const appointment = await bookAppointment.mutateAsync({
        doctor_id: doctor.id,
        slot: selectedSlot,
        payment_method: paymentMethod,
        appointment_date: appointmentDateIso,
        reason: purpose === "consultation" ? "Normal Consultation" : "Surgery / Procedure Visit",
        preferred_consultation_mode: consultType,
        hospital_id: selectedOption.hospitalId || undefined,
        practice_location_id: selectedOption.practiceLocationId || undefined,
      });
      setBookedAppointment(appointment.appointment || appointment);
      toast.success("Appointment booked successfully");
      setStep(3);
    } catch (error) {
      toast.error(error.message || "Could not book appointment");
    }
  };

  const handleAuthContinue = (phone) => {
    setPatientPhone(phone);
    setShowAuthModal(false);
    const redirect = buildBookQuery(doctor.id, selectedOption, hospitalContext);
    openSignInModal({
      redirect: `${redirect}&step=2&phone=${encodeURIComponent(phone)}`,
    });
  };

  if (!selectedOption) {
    return (
      <p className="text-[14px] text-[var(--color-neutral-500)]">
        No consultation options available for this doctor.
      </p>
    );
  }

  return (
    <div>
      {step < 3 && (
        <div className="flex items-start gap-4 p-4 md:p-5 bg-white rounded-[16px] border border-[var(--color-neutral-200)] mb-6">
          <div className="relative w-16 h-16 rounded-[14px] overflow-hidden shrink-0 border border-[var(--color-neutral-100)]">
            <Image src={doctor.photo} alt={doctor.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-[var(--color-ink-headline)]">{doctor.name}</h3>
            <p className="text-[12px] text-[var(--color-brand-primary)] font-semibold">{doctor.specialty}</p>
            <div className="flex items-center gap-2 mt-1.5 text-[12px] text-[var(--color-neutral-600)]">
              {consultType === "online" ? (
                <VideoCamera size={14} className="text-[var(--color-brand-primary)]" weight="fill" />
              ) : (
                <Buildings size={14} className="text-[var(--color-brand-primary)]" weight="fill" />
              )}
              <span className="font-medium">{selectedOption.title}</span>
              <button
                type="button"
                onClick={() => setShowOptionModal(true)}
                className="text-[var(--color-brand-primary)] font-semibold hover:underline ml-1"
              >
                Change
              </button>
            </div>
            <p className="text-[13px] font-bold text-[var(--color-ink-headline)] mt-2">
              Fee: PKR {selectedOption.fee.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <DoctorSlotPicker
            doctorId={doctor.id}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onDateChange={setSelectedDate}
            onSlotChange={setSelectedSlot}
            variant="oladoc"
            slotParams={buildSlotParams(selectedOption)}
          />

          <div className="mt-6 p-4 rounded-[12px] bg-[var(--color-brand-mist)]/40 border border-[var(--color-brand-light)] text-[12px] text-[var(--color-neutral-600)]">
            95% patients feel satisfied after booking on PharmaHub. It takes only 30 sec to book an appointment.
          </div>

          <Button
            className="w-full h-[48px] mt-6"
            disabled={!selectedSlot}
            onClick={handleSlotContinue}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-brand-primary)] mb-4 hover:underline"
            >
              <ArrowLeft size={14} />
              Change date & time
            </button>

            <div className="mb-5">
              <p className="text-[13px] font-bold text-[var(--color-ink-headline)] mb-3">Appointment for</p>
              <div className="flex gap-2">
                {["myself", "other"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2.5 rounded-[10px] border text-[13px] font-semibold ${
                      type === "myself"
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-mist)] text-[var(--color-brand-primary)]"
                        : "border-[var(--color-neutral-200)] text-[var(--color-neutral-600)]"
                    }`}
                  >
                    {type === "myself" ? "Myself" : "+ Someone else"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="text-[13px] font-semibold mb-1.5 block">Patient name</label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold mb-1.5 block">Phone number</label>
                <Input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="03XX XXXXXXX"
                />
                <p className="text-[11px] text-[var(--color-neutral-400)] mt-1">
                  You will be contacted through this number.
                </p>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[13px] font-bold mb-3">Purpose of appointment</p>
              <div className="space-y-2">
                {[
                  { id: "consultation", label: "Normal Consultation" },
                  { id: "procedure", label: "Surgery / Procedure Visit" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-[10px] border cursor-pointer ${
                      purpose === item.id
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-mist)]/40"
                        : "border-[var(--color-neutral-200)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="purpose"
                      checked={purpose === item.id}
                      onChange={() => setPurpose(item.id)}
                      className="accent-[var(--color-brand-primary)]"
                    />
                    <span className="text-[13px] font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[13px] font-bold mb-3 flex items-center gap-2">
                <CreditCard size={16} />
                Select payment method
              </p>
              <div className="space-y-2">
                {[
                  { id: "card", label: "Online Payment", note: `PKR ${selectedOption.fee.toLocaleString()}` },
                  { id: "cod", label: consultType === "in_person" ? "Pay cash at clinic" : "Pay after consultation", note: `PKR ${selectedOption.fee.toLocaleString()}` },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 text-left ${
                      paymentMethod === method.id
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-mist)]"
                        : "border-[var(--color-neutral-200)]"
                    }`}
                  >
                    <span className="text-[14px] font-semibold">{method.label}</span>
                    <span className="text-[14px] font-bold">{method.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[var(--color-neutral-500)]">
              <LockKey size={14} />
              Secure payment · pending until doctor confirms
            </div>
          </div>

          <div className="lg:sticky lg:top-[100px] h-fit">
            <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--color-neutral-100)]">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image src={doctor.photo} alt={doctor.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[14px] font-bold">{doctor.name}</p>
                  <p className="text-[11px] text-[var(--color-neutral-500)]">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-2 text-[12px] mb-4">
                <p className="text-[var(--color-neutral-600)]">
                  <span className="font-semibold text-[var(--color-ink-headline)]">Location: </span>
                  {selectedOption.title}
                </p>
                <p className="font-bold text-[var(--color-ink-headline)]">
                  PKR {selectedOption.fee.toLocaleString()}
                </p>
                <p className="flex items-center gap-2 text-[var(--color-neutral-600)]">
                  <Clock size={14} className="text-[var(--color-brand-primary)]" />
                  {formatShortSlot(selectedDate, selectedSlot)}
                </p>
              </div>

              <Button
                className="w-full h-[48px]"
                disabled={bookAppointment.isPending || !patientName.trim()}
                onClick={handleConfirmBooking}
              >
                {bookAppointment.isPending ? "Processing..." : "Confirm booking"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-[var(--color-status-success-bg)] flex items-center justify-center mx-auto mb-4">
            <Check size={32} weight="bold" className="text-[var(--color-status-success)]" />
          </div>
          <h3 className="text-[20px] font-bold text-[var(--color-ink-headline)] mb-1">Appointment Booked</h3>
          <p className="text-[14px] text-[var(--color-neutral-500)] mb-2">
            Your {consultType === "online" ? "online" : "in-clinic"} appointment with {doctor.name} is pending confirmation.
          </p>
          <p className="text-[13px] text-[var(--color-neutral-500)] mb-6">
            {formatBookingDate(selectedDate)} · {selectedSlot}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account/appointments">
              <Button className="w-full sm:w-auto">View My Appointments</Button>
            </Link>
            <Link href={`/doctors/${doctor.id}?consult=${consultType}`}>
              <Button variant="secondary" className="w-full sm:w-auto">Back to Doctor Profile</Button>
            </Link>
          </div>
        </div>
      )}

      <BookConsultModal
        doctor={doctor}
        options={allOptions}
        open={showOptionModal}
        onClose={() => setShowOptionModal(false)}
        onSelect={setSelectedOption}
      />

      <BookingAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        doctor={doctor}
        consultOption={selectedOption}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        onContinue={handleAuthContinue}
      />
    </div>
  );
}

export { buildBookQuery };
