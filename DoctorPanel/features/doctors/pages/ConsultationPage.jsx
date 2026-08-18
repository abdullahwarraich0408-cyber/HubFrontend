"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Video,
  CheckCircle2,
  ArrowLeft,
  FileText,
  User,
  MessageSquare,
  Stethoscope,
  Plus,
  Trash2,
  Printer,
  ShieldCheck,
  Clock,
  MapPin,
  AlertCircle,
  Sparkles,
  X
} from "lucide-react";
import { AppointmentChatPanel } from "@/features/telehealth/components/AppointmentChatPanel";
import { useDoctorConsultation } from "@/lib/hooks/useApi";
import { useAppointmentVideoAccess } from "@/lib/hooks/useTelehealth";
import {
  useCreateDoctorPrescription,
  useUpdateDoctorAppointmentStatus,
} from "@/lib/hooks/usePartnerPortal";
import { getPartnerData } from "@/lib/partnerAuth";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { toast } from "sonner";

const EMPTY_PRESCRIPTION_ITEM = { medicine: "", dosage: "", instructions: "", duration: "" };

export function ConsultationPage({ meetingId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment");
  const partner = typeof window !== "undefined" ? getPartnerData() : null;
  const currentUserId = partner?.id;
  const authMode = "partner";

  const { data: appointment, isLoading, refetch } = useDoctorConsultation(meetingId);
  const { data: videoData } = useAppointmentVideoAccess(appointmentId, {
    enabled: Boolean(appointmentId),
    auth: authMode,
  });
  const updateStatus = useUpdateDoctorAppointmentStatus();
  const createPrescription = useCreateDoctorPrescription();

  // Clinical Panel Tabs: 'patient' | 'notes' | 'prescription' | 'chat'
  const [activeTab, setActiveTab] = useState("notes");

  // Structured Notes State
  const [symptoms, setSymptoms] = useState("");
  const [observations, setObservations] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [followUp, setFollowUp] = useState("");

  // Prescription State
  const [items, setItems] = useState([EMPTY_PRESCRIPTION_ITEM]);
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);

  // Completion Dialog State
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    if (appointment?.consultationNotes) {
      setObservations(appointment.consultationNotes);
    }
  }, [appointment?.consultationNotes]);

  const canComplete = appointment?.status === "in_progress";
  const existingPrescriptionItems = appointment?.prescription?.items || [];
  const videoRoom = videoData?.videoRoom;
  const videoAccess = videoData?.videoAccess;

  const jitsiSrc = useMemo(() => {
    if (!videoRoom?.jitsi_room) return null;
    const displayName = encodeURIComponent(appointment?.doctorName || partner?.name || "Doctor");
    return `https://meet.jit.si/${videoRoom.jitsi_room}#config.prejoinPageEnabled=false&userInfo.displayName="${displayName}"`;
  }, [videoRoom?.jitsi_room, appointment?.doctorName, partner?.name]);

  const handleStartConsultation = async () => {
    if (!appointmentId) return;
    try {
      await updateStatus.mutateAsync({ id: appointmentId, status: "in_progress" });
      await refetch();
      toast.success("Consultation started");
    } catch (error) {
      toast.error(error.message || "Could not start consultation");
    }
  };

  const handleSavePrescription = async () => {
    if (!appointmentId) return;
    const validItems = items.filter((item) => item.medicine.trim());
    if (validItems.length === 0) {
      toast.error("Add at least one medicine to save prescription");
      return;
    }
    try {
      const compiledNotes = [
        symptoms && `Symptoms: ${symptoms}`,
        observations && `Observations: ${observations}`,
        diagnosis && `Diagnosis: ${diagnosis}`,
        treatmentPlan && `Treatment Plan: ${treatmentPlan}`,
        followUp && `Follow-up: ${followUp}`,
      ].filter(Boolean).join("\n\n");

      await createPrescription.mutateAsync({
        appointment_id: appointmentId,
        items: validItems,
        notes: compiledNotes,
      });
      setPrescriptionSaved(true);
      toast.success("Prescription saved successfully");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Could not save prescription");
    }
  };

  const handleConfirmComplete = async () => {
    if (!appointmentId) return;
    try {
      const compiledNotes = [
        symptoms && `Symptoms: ${symptoms}`,
        observations && `Observations: ${observations}`,
        diagnosis && `Diagnosis: ${diagnosis}`,
        treatmentPlan && `Treatment Plan: ${treatmentPlan}`,
        followUp && `Follow-up: ${followUp}`,
      ].filter(Boolean).join("\n\n");

      await updateStatus.mutateAsync({ id: appointmentId, status: "completed", notes: compiledNotes });
      toast.success("Consultation completed");
      setShowCompletionModal(false);
      router.push(partnerRoutes.doctor.appointments);
    } catch (error) {
      toast.error(error.message || "Could not complete consultation");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">
        Loading telehealth workspace...
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">
        Consultation room not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Telehealth Room Top Header */}
      <header className="h-14 border-b border-slate-800/80 px-4 flex items-center justify-between bg-slate-900/90 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft size={16} />
            <span>Leave Room</span>
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-tight">
              {appointment.patient}
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              ({appointment.date} • {appointment.slot || appointment.time})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
            {appointment.status?.replace("_", " ") || "In Consultation"}
          </span>

          {canComplete && (
            <button
              onClick={() => setShowCompletionModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              <span>End Consultation</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] overflow-hidden">
        {/* LEFT: Video Room (Largest Visual Area) */}
        <div className="bg-slate-950 p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl flex items-center justify-center">
            {jitsiSrc && videoAccess?.allowed !== false ? (
              <iframe
                title="Video consultation"
                src={jitsiSrc}
                allow="camera; microphone; fullscreen; display-capture"
                className="w-full h-full border-0"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
                <div className="w-14 h-14 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mb-3 border border-slate-700">
                  <Video size={28} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Video Room Ready</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {videoAccess?.reason || "Click start consultation to launch the HD video stream and admit patient."}
                </p>
                {appointment.status === "confirmed" && (
                  <button
                    onClick={handleStartConsultation}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Start Consultation & Admit Patient
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Tabbed Clinical Workspace Panel */}
        <div className="bg-slate-900 border-l border-slate-800/80 flex flex-col h-full overflow-hidden">
          {/* Clinical Tabs Bar */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 gap-1 shrink-0">
            {[
              { id: "patient", label: "Patient", icon: User },
              { id: "notes", label: "Notes", icon: FileText },
              { id: "prescription", label: "Prescription", icon: Stethoscope },
              { id: "chat", label: "Chat", icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isActive
                      ? "bg-slate-800 text-teal-400 border border-slate-700 shadow-2xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: PATIENT PROFILE TAB */}
          {activeTab === "patient" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold text-sm flex items-center justify-center shrink-0">
                  {appointment.patient.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{appointment.patient}</h4>
                  <p className="text-slate-400 text-[11px]">Phone: {appointment.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Medical Profile</h5>
                <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800 space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Visit Reason:</span>
                    <span className="text-slate-200 font-medium">{appointment.reason || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Consultation Mode:</span>
                    <span className="text-slate-200 font-medium">
                      {appointment.isOnline || appointment.type === "Video Call" ? "Video Call" : "In-Person Clinic Visit"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Payment Status:</span>
                    <span className="text-emerald-400 font-medium">{appointment.paymentStatus || "Paid"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: STRUCTURED CLINICAL NOTES TAB */}
          {activeTab === "notes" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Symptoms & Chief Complaints</label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Fever, persistent cough for 3 days..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Clinical Observations</label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="e.g. Blood pressure normal, throat inflammation..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Diagnosis</label>
                <textarea
                  rows={2}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Upper Respiratory Tract Infection..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Treatment Plan & Follow-up</label>
                <textarea
                  rows={2}
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="e.g. Rest, hydration, review after 5 days..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Tab 3: DIGITAL E-PRESCRIPTION BUILDER TAB */}
          {activeTab === "prescription" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white">E-Prescription Builder</span>
                {prescriptionSaved && (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Saved
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Medicine #{index + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Medicine Name (e.g. Paracetamol 500mg)"
                      value={item.medicine}
                      onChange={(e) => {
                        const next = [...items];
                        next[index].medicine = e.target.value;
                        setItems(next);
                      }}
                      className="w-full h-8 px-2.5 bg-slate-900 border border-slate-800 rounded text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 1-0-1)"
                        value={item.dosage}
                        onChange={(e) => {
                          const next = [...items];
                          next[index].dosage = e.target.value;
                          setItems(next);
                        }}
                        className="h-8 px-2.5 bg-slate-900 border border-slate-800 rounded text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 5 days)"
                        value={item.duration}
                        onChange={(e) => {
                          const next = [...items];
                          next[index].duration = e.target.value;
                          setItems(next);
                        }}
                        className="h-8 px-2.5 bg-slate-900 border border-slate-800 rounded text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setItems((prev) => [...prev, EMPTY_PRESCRIPTION_ITEM])}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Add Medicine
                </button>
                <button
                  type="button"
                  onClick={handleSavePrescription}
                  disabled={createPrescription.isPending}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors ml-auto disabled:opacity-60"
                >
                  {createPrescription.isPending ? "Saving..." : "Save Prescription"}
                </button>
              </div>

              {/* Printable Summary Card once saved */}
              {(prescriptionSaved || existingPrescriptionItems.length > 0) && (
                <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-xs">Digital Prescription Summary</span>
                    <Printer size={14} className="text-slate-400" />
                  </div>
                  <div className="text-[11px] space-y-1">
                    <p><strong className="text-slate-400">Doctor:</strong> {partner?.name || "Dr. Medzoos"}</p>
                    <p><strong className="text-slate-400">Patient:</strong> {appointment.patient}</p>
                    <p><strong className="text-slate-400">Medicines Count:</strong> {items.filter(i => i.medicine).length}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: LIVE CLINICAL CHAT PANEL */}
          {activeTab === "chat" && (
            <div className="flex-1 overflow-hidden p-2">
              <AppointmentChatPanel
                appointmentId={appointmentId}
                currentUserId={currentUserId}
                authMode={authMode}
                dark
              />
            </div>
          )}
        </div>
      </div>

      {/* COMPLETION CONFIRMATION CHECKLIST DIALOG */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle2 size={20} />
                <span>Complete Consultation?</span>
              </div>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Before finishing this consultation with <strong>{appointment.patient}</strong>, please confirm all clinical records have been documented:
            </p>

            <div className="space-y-2 bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs">
              <div className="flex items-center gap-2.5">
                <input type="checkbox" defaultChecked className="accent-teal-500 rounded" />
                <span>Clinical observations & diagnosis written</span>
              </div>
              <div className="flex items-center gap-2.5">
                <input type="checkbox" defaultChecked={prescriptionSaved} className="accent-teal-500 rounded" />
                <span>Digital e-prescription compiled & saved</span>
              </div>
              <div className="flex items-center gap-2.5">
                <input type="checkbox" defaultChecked className="accent-teal-500 rounded" />
                <span>Follow-up advice communicated</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Review Records
              </button>
              <button
                onClick={handleConfirmComplete}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                Confirm & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

