"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Pill,
  Flask,
  Syringe,
  Heartbeat,
  Stethoscope,
  Calendar,
  Warning,
  FileText,
  UploadSimple,
  Trash,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Badge } from "@/shared/components/Badge";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";
import {
  useFamilyMember,
  useUpdateFamilyMember,
  useAddMemberMedicine,
  useAddMemberLabReport,
  useAddMemberVaccination,
  useAddMemberVital,
  useAddMemberDoctor,
  useAddMemberAppointment,
  useAddMemberPrescription,
  useDeleteMemberPrescription,
  useUploadDocument,
} from "@/lib/hooks/useApi";
import { familyVaultApi } from "@/lib/api/index";
import {
  MEMBER_TABS,
  MEDICAL_CONDITIONS,
  FAMILY_HISTORY_CONDITIONS,
  LAB_CATEGORIES,
  VITAL_TYPES,
  DEFAULT_MEDICAL_PROFILE,
  relationshipEmoji,
  scoreColor,
  formatDate,
} from "../lib/constants";

export function MemberDetailPage() {
  const params = useParams();
  const memberId = params?.id;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openSignIn } = useAuthModal();
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [emergency, setEmergency] = useState(null);

  const { data: member, isLoading, refetch } = useFamilyMember(memberId, { enabled: isAuthenticated && Boolean(memberId) });
  const updateMember = useUpdateFamilyMember();
  const addMedicine = useAddMemberMedicine();
  const addLabReport = useAddMemberLabReport();
  const addVaccination = useAddMemberVaccination();
  const addVital = useAddMemberVital();
  const addDoctor = useAddMemberDoctor();
  const addAppointment = useAddMemberAppointment();
  const addPrescription = useAddMemberPrescription();
  const deletePrescription = useDeleteMemberPrescription();
  const uploadDocument = useUploadDocument();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) openSignIn({ redirect: `/family-health/members/${memberId}` });
  }, [authLoading, isAuthenticated, openSignIn, memberId]);

  useEffect(() => {
    if (tab === "emergency" && memberId && isAuthenticated) {
      familyVaultApi.getEmergencyProfile(memberId).then(setEmergency).catch(() => {});
    }
  }, [tab, memberId, isAuthenticated]);

  if (authLoading || isLoading) {
    return <div className="max-w-[1280px] mx-auto px-4 py-12 text-center text-[var(--color-neutral-500)]">Loading member profile...</div>;
  }

  if (!member) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-12 text-center">
        <p className="mb-4">Member not found.</p>
        <Link href="/family-health"><Button variant="secondary">Back to Family Health</Button></Link>
      </div>
    );
  }

  const medical = member.medical_profile || DEFAULT_MEDICAL_PROFILE;

  const saveMedicalProfile = async (updates) => {
    try {
      await updateMember.mutateAsync({ memberId, medical_profile: { ...medical, ...updates } });
      toast.success("Medical profile updated");
      refetch();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === "medicine") {
        await addMedicine.mutateAsync({ memberId, ...form });
        toast.success("Medicine added");
      } else if (modal === "lab") {
        await addLabReport.mutateAsync({ memberId, ...form });
        toast.success("Lab report added");
      } else if (modal === "vaccination") {
        await addVaccination.mutateAsync({ memberId, ...form });
        toast.success("Vaccination recorded");
      } else if (modal === "vital") {
        await addVital.mutateAsync({ memberId, ...form });
        toast.success("Vital recorded");
      } else if (modal === "doctor") {
        await addDoctor.mutateAsync({ memberId, ...form });
        toast.success("Doctor added");
      } else if (modal === "appointment") {
        await addAppointment.mutateAsync({ memberId, ...form });
        toast.success("Appointment recorded");
      }
      setModal(null);
      setForm({});
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to save");
    }
  };

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploaded = await uploadDocument.mutateAsync(file);
      const fileUrl = uploaded.url || uploaded.fileUrl || uploaded.path;
      await addPrescription.mutateAsync({
        memberId,
        file_url: fileUrl,
        file_type: file.type.includes("pdf") ? "pdf" : "photo",
      });
      toast.success("Prescription uploaded");
      refetch();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    }
  };

  const handleDeletePrescription = async (prescriptionId) => {
    if (!window.confirm("Delete this prescription? Medicines already saved to the profile will remain unless you remove them separately.")) {
      return;
    }
    try {
      await deletePrescription.mutateAsync({ memberId, prescriptionId });
      toast.success("Prescription removed");
      refetch();
    } catch (err) {
      toast.error(err.message || "Could not delete prescription");
    }
  };

  const toggleCondition = async (name) => {
    const conditions = [...(medical.conditions || [])];
    const idx = conditions.findIndex((c) => c.name === name);
    if (idx >= 0) conditions.splice(idx, 1);
    else conditions.push({ name, diagnosisDate: "" });
    await saveMedicalProfile({ conditions });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[80px] py-8">
      <Link href="/family-health" className="inline-flex items-center gap-2 text-[14px] text-[var(--color-neutral-600)] hover:text-[var(--color-brand-primary)] mb-6">
        <ArrowLeft size={16} /> Back to Family Health
      </Link>

      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
        <span className="text-5xl">{relationshipEmoji(member.relationship)}</span>
        <div className="flex-1">
          <h1 className="text-[28px] font-bold">{member.full_name}</h1>
          <p className="text-[var(--color-neutral-500)]">{member.relationship} · {member.blood_group || "Blood group not set"} · DOB {formatDate(member.date_of_birth)}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-3 py-1 rounded-full text-[13px] font-semibold ${scoreColor(member.health_score)}`}>Health Score: {member.health_score ?? "—"}</span>
            {member.access_role && <Badge variant="secondary">{member.access_role.replace(/_/g, " ")}</Badge>}
          </div>
        </div>
        <label className="inline-flex items-center justify-center gap-2 h-[44px] px-[20px] text-[14px] font-semibold rounded-[var(--radius-md)] border-[1.5px] border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-mist)] cursor-pointer transition-all">
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={handlePrescriptionUpload} />
          <UploadSimple size={18} /> Upload Prescription
        </label>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {MEMBER_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
              tab === t.id ? "bg-[var(--color-brand-primary)] text-white" : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          <StatCard icon={Pill} label="Active Medicines" value={member.medicines?.length || 0} />
          <StatCard icon={Flask} label="Lab Reports" value={member.lab_reports?.length || 0} />
          <StatCard icon={Syringe} label="Vaccinations" value={member.vaccinations?.length || 0} />
          <StatCard icon={Stethoscope} label="Doctors" value={member.doctors?.length || 0} />
          <StatCard icon={Calendar} label="Appointments" value={member.appointments?.length || 0} />
          <StatCard icon={Heartbeat} label="Vital Readings" value={member.vitals?.length || 0} />
        </div>
      )}

      {tab === "medical" && (
        <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-6 space-y-6">
          <section>
            <h3 className="font-semibold mb-3">Medical Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {MEDICAL_CONDITIONS.map((c) => {
                const active = medical.conditions?.some((x) => x.name === c);
                return (
                  <button key={c} type="button" onClick={() => toggleCondition(c)} className={`px-3 py-1.5 rounded-full text-[13px] border ${active ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]" : "border-[var(--color-neutral-200)]"}`}>
                    {c}
                  </button>
                );
              })}
            </div>
          </section>
          <section>
            <h3 className="font-semibold mb-3">Family History</h3>
            <div className="flex flex-wrap gap-2">
              {FAMILY_HISTORY_CONDITIONS.map((c) => {
                const active = medical.familyHistory?.some((x) => x.condition === c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const familyHistory = [...(medical.familyHistory || [])];
                      const idx = familyHistory.findIndex((x) => x.condition === c);
                      if (idx >= 0) familyHistory.splice(idx, 1);
                      else familyHistory.push({ condition: c });
                      saveMedicalProfile({ familyHistory });
                    }}
                    className={`px-3 py-1.5 rounded-full text-[13px] border ${active ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]" : "border-[var(--color-neutral-200)]"}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </section>
          <section>
            <h3 className="font-semibold mb-3">Lifestyle</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {["smoking", "alcohol", "exercise", "diet", "sleep", "occupation"].map((field) => (
                <Input
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={medical.lifestyle?.[field] || ""}
                  onChange={(e) => saveMedicalProfile({ lifestyle: { ...medical.lifestyle, [field]: e.target.value } })}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "timeline" && (
        <RecordList
          title="Health Timeline"
          empty="No timeline events yet."
          items={(member.timeline || []).map((e) => ({
            id: e.id,
            title: e.title,
            subtitle: `${e.event_type.replace(/_/g, " ")} · ${formatDate(e.event_date)}`,
            description: e.description,
          }))}
        />
      )}

      {tab === "medicines" && (
        <RecordList
          title="Medicines"
          action={<Button size="sm" onClick={() => { setModal("medicine"); setForm({ name: "", dose: "", morning: true, afternoon: false, night: true }); }}><Plus size={16} /> Add</Button>}
          empty="No medicines tracked."
          items={(member.medicines || []).map((m) => ({
            id: m.id,
            title: m.name,
            subtitle: `${m.dose || ""} · ${[m.morning && "Morning", m.afternoon && "Afternoon", m.night && "Night"].filter(Boolean).join(", ")}`,
            description: [m.purpose ? `For: ${m.purpose}` : null, m.instructions].filter(Boolean).join(" · "),
          }))}
        />
      )}

      {tab === "prescriptions" && (
        <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold">Prescriptions</h2>
            <label className="inline-flex items-center justify-center gap-2 h-[36px] px-4 text-[13px] font-semibold rounded-[var(--radius-md)] border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-mist)] cursor-pointer">
              <input type="file" accept="image/*,.pdf" className="hidden" onChange={handlePrescriptionUpload} />
              <UploadSimple size={16} /> Upload
            </label>
          </div>
          {(member.prescriptions || []).length === 0 ? (
            <p className="text-[14px] text-[var(--color-neutral-500)]">No prescriptions uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {(member.prescriptions || []).map((rx) => (
                <div key={rx.id} className="p-4 rounded-[10px] bg-[var(--color-neutral-50)] flex gap-4 justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{rx.file_type === "pdf" ? "PDF prescription" : "Prescription photo"}</p>
                    <p className="text-[13px] text-[var(--color-neutral-500)]">{formatDate(rx.uploaded_at)}</p>
                    {rx.ocr_data?.diagnosis && <p className="text-[13px] mt-1 font-medium text-[var(--color-brand-dark)]">Diagnosis: {rx.ocr_data.diagnosis}</p>}
                    {rx.ocr_data?.note && <p className="text-[13px] mt-1 text-[var(--color-neutral-600)]">{rx.ocr_data.note}</p>}
                    {(rx.ocr_data?.medicines || []).length > 0 && (
                      <ul className="mt-2 space-y-1 text-[13px] text-[var(--color-neutral-700)]">
                        {rx.ocr_data.medicines.map((med, i) => (
                          <li key={`${med.name}-${i}`}>
                            • {med.name}{med.dose ? ` (${med.dose})` : ""}
                            {med.purpose ? ` — For: ${med.purpose}` : ""}
                            {med.frequency?.length ? ` · ${med.frequency.join(", ")}` : ""}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePrescription(rx.id)}
                    className="shrink-0 p-2 text-rose-600 hover:bg-rose-50 rounded-[8px]"
                    aria-label="Delete prescription"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "labs" && (
        <RecordList
          title="Lab Reports"
          action={<Button size="sm" onClick={() => { setModal("lab"); setForm({ category: "cbc", title: "", report_date: new Date().toISOString().slice(0, 10) }); }}><Plus size={16} /> Add</Button>}
          empty="No lab reports uploaded."
          items={(member.lab_reports || []).map((r) => ({
            id: r.id,
            title: r.title,
            subtitle: `${r.category.toUpperCase()} · ${formatDate(r.report_date)}`,
            description: r.ai_summary,
          }))}
        />
      )}

      {tab === "vaccinations" && (
        <RecordList
          title="Vaccination Record"
          action={<Button size="sm" onClick={() => { setModal("vaccination"); setForm({ vaccine_name: "", vaccinated_at: new Date().toISOString().slice(0, 10) }); }}><Plus size={16} /> Add</Button>}
          empty="No vaccinations recorded."
          items={(member.vaccinations || []).map((v) => ({
            id: v.id,
            title: v.vaccine_name,
            subtitle: `Dose ${v.dose || "—"} · ${formatDate(v.vaccinated_at)}`,
            description: v.next_due ? `Next due: ${formatDate(v.next_due)}` : null,
          }))}
        />
      )}

      {tab === "vitals" && (
        <RecordList
          title="Vitals"
          action={<Button size="sm" onClick={() => { setModal("vital"); setForm({ vital_type: "blood_pressure", value: "", recorded_at: new Date().toISOString().slice(0, 10) }); }}><Plus size={16} /> Add</Button>}
          empty="No vitals recorded."
          items={(member.vitals || []).map((v) => ({
            id: v.id,
            title: `${v.vital_type.replace(/_/g, " ")}: ${v.value}${v.unit ? ` ${v.unit}` : ""}`,
            subtitle: formatDate(v.recorded_at),
          }))}
        />
      )}

      {tab === "doctors" && (
        <RecordList
          title="Doctors"
          action={<Button size="sm" onClick={() => { setModal("doctor"); setForm({ name: "", specialty: "", is_primary: false }); }}><Plus size={16} /> Add</Button>}
          empty="No doctors added."
          items={(member.doctors || []).map((d) => ({
            id: d.id,
            title: d.name,
            subtitle: [d.specialty, d.hospital].filter(Boolean).join(" · "),
            description: d.next_appointment ? `Next: ${formatDate(d.next_appointment)}` : null,
          }))}
        />
      )}

      {tab === "appointments" && (
        <RecordList
          title="Appointment History"
          action={<Button size="sm" onClick={() => { setModal("appointment"); setForm({ doctor_name: "", appointment_date: new Date().toISOString().slice(0, 10) }); }}><Plus size={16} /> Add</Button>}
          empty="No appointments recorded."
          items={(member.appointments || []).map((a) => ({
            id: a.id,
            title: a.doctor_name,
            subtitle: `${a.specialty || "General"} · ${formatDate(a.appointment_date)}`,
            description: a.diagnosis || a.reason,
          }))}
        />
      )}

      {tab === "emergency" && (
        <div className="rounded-[16px] border border-rose-200 bg-rose-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Warning size={24} className="text-rose-600" />
            <h2 className="text-[20px] font-bold text-rose-900">Emergency Profile</h2>
          </div>
          <dl className="grid md:grid-cols-2 gap-4 text-[14px]">
            <div><dt className="text-[var(--color-neutral-500)]">Blood Group</dt><dd className="font-bold text-lg">{emergency?.member?.blood_group || member.blood_group || "—"}</dd></div>
            <div><dt className="text-[var(--color-neutral-500)]">Emergency Contact</dt><dd className="font-medium">{emergency?.emergency_profile?.emergencyContact || "—"}</dd></div>
            <div className="md:col-span-2"><dt className="text-[var(--color-neutral-500)]">Allergies</dt><dd>{(emergency?.emergency_profile?.allergies || []).join(", ") || "None recorded"}</dd></div>
            <div className="md:col-span-2"><dt className="text-[var(--color-neutral-500)]">Current Medicines</dt><dd>{(emergency?.current_medicines || []).map((m) => m.name).join(", ") || "None"}</dd></div>
            <div className="md:col-span-2"><dt className="text-[var(--color-neutral-500)]">Conditions</dt><dd>{(emergency?.conditions || []).map((c) => c.name || c).join(", ") || "None recorded"}</dd></div>
          </dl>
          {emergency?.qr_data && (
            <div className="mt-6 p-4 bg-white rounded-[12px] border border-rose-100">
              <p className="text-[13px] font-medium mb-2 flex items-center gap-2"><FileText size={16} /> Emergency QR Data</p>
              <pre className="text-[11px] overflow-x-auto text-[var(--color-neutral-600)] whitespace-pre-wrap">{emergency.qr_data}</pre>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-md p-6">
            <h2 className="text-[18px] font-bold mb-4 capitalize">Add {modal}</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {modal === "medicine" && (
                <>
                  <Input label="Medicine Name" required value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input label="Dose" value={form.dose || ""} onChange={(e) => setForm({ ...form, dose: e.target.value })} />
                  <div className="flex gap-4 text-[14px]">
                    {["morning", "afternoon", "night"].map((t) => (
                      <label key={t} className="flex items-center gap-2 capitalize">
                        <input type="checkbox" checked={Boolean(form[t])} onChange={(e) => setForm({ ...form, [t]: e.target.checked })} />
                        {t}
                      </label>
                    ))}
                  </div>
                  <Input label="Instructions" value={form.instructions || ""} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
                </>
              )}
              {modal === "lab" && (
                <>
                  <label className="block text-[13px] font-medium">Category
                    <select className="mt-1 w-full rounded-[10px] border px-3 py-2" value={form.category || "cbc"} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {LAB_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </label>
                  <Input label="Title" required value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Input label="Report Date" type="date" required value={form.report_date || ""} onChange={(e) => setForm({ ...form, report_date: e.target.value })} />
                </>
              )}
              {modal === "vaccination" && (
                <>
                  <Input label="Vaccine Name" required value={form.vaccine_name || ""} onChange={(e) => setForm({ ...form, vaccine_name: e.target.value })} />
                  <Input label="Dose" value={form.dose || ""} onChange={(e) => setForm({ ...form, dose: e.target.value })} />
                  <Input label="Date" type="date" required value={form.vaccinated_at || ""} onChange={(e) => setForm({ ...form, vaccinated_at: e.target.value })} />
                  <Input label="Next Due" type="date" value={form.next_due || ""} onChange={(e) => setForm({ ...form, next_due: e.target.value })} />
                </>
              )}
              {modal === "vital" && (
                <>
                  <label className="block text-[13px] font-medium">Type
                    <select className="mt-1 w-full rounded-[10px] border px-3 py-2" value={form.vital_type || "blood_pressure"} onChange={(e) => setForm({ ...form, vital_type: e.target.value })}>
                      {VITAL_TYPES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                    </select>
                  </label>
                  <Input label="Value" required value={form.value || ""} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="e.g. 120/80" />
                  <Input label="Date" type="date" required value={form.recorded_at || ""} onChange={(e) => setForm({ ...form, recorded_at: e.target.value })} />
                </>
              )}
              {modal === "doctor" && (
                <>
                  <Input label="Doctor Name" required value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input label="Specialty" value={form.specialty || ""} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
                  <Input label="Hospital" value={form.hospital || ""} onChange={(e) => setForm({ ...form, hospital: e.target.value })} />
                </>
              )}
              {modal === "appointment" && (
                <>
                  <Input label="Doctor Name" required value={form.doctor_name || ""} onChange={(e) => setForm({ ...form, doctor_name: e.target.value })} />
                  <Input label="Specialty" value={form.specialty || ""} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
                  <Input label="Date" type="date" required value={form.appointment_date || ""} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} />
                  <Input label="Reason" value={form.reason || ""} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                </>
              )}
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">Save</Button>
                <Button type="button" variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center">
        <Icon size={20} className="text-[var(--color-brand-primary)]" />
      </div>
      <div>
        <p className="text-[13px] text-[var(--color-neutral-500)]">{label}</p>
        <p className="text-[22px] font-bold">{value}</p>
      </div>
    </div>
  );
}

function RecordList({ title, action, empty, items }) {
  return (
    <div className="rounded-[16px] border border-[var(--color-neutral-200)] bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-bold">{title}</h2>
        {action}
      </div>
      {items.length === 0 ? (
        <p className="text-[14px] text-[var(--color-neutral-500)]">{empty}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="p-4 rounded-[10px] bg-[var(--color-neutral-50)]">
              <p className="font-medium">{item.title}</p>
              {item.subtitle && <p className="text-[13px] text-[var(--color-neutral-500)]">{item.subtitle}</p>}
              {item.description && <p className="text-[14px] mt-1 text-[var(--color-neutral-700)]">{item.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
