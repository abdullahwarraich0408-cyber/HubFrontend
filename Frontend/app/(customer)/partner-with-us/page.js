"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { 
  BuildingOffice, 
  Storefront, 
  Stethoscope, 
  Flask, 
  FileArrowUp, 
  CheckCircle, 
  ShieldCheck, 
  Sparkle, 
  ArrowRight, 
  PhoneCall, 
  Envelope,
  GraduationCap,
  IdentificationCard,
  MapPin,
  Clock
} from "@phosphor-icons/react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { useCreateVendor, useUploadPublicDocument, useVendorOnboardingStatus } from "@/lib/hooks/useApi";
import { inquiriesApi } from "@/lib/api/index";
import { toast } from "sonner";

const PARTNER_TYPES = [
  {
    id: "pharmacy",
    label: "Pharmacy / Retail Store",
    badge: "Pharmacy & OTC",
    icon: Storefront,
    description: "Sell authentic medicines and healthcare products to patients across your city.",
  },
  {
    id: "doctor",
    label: "Doctor / Telehealth Specialist",
    badge: "PMDC Registered",
    icon: Stethoscope,
    description: "Offer online video consultations, clinic appointments, and digital e-prescriptions.",
  },
  {
    id: "lab",
    label: "Diagnostic Laboratory",
    badge: "Lab & Diagnostics",
    icon: Flask,
    description: "Provide pathology tests, diagnostic packages, and at-home phlebotomy sample collections.",
  },
];

const PHARMACY_DOCS = [
  { key: "trade_license_url", label: "Drug Sale License" },
  { key: "pharmacist_certificate_url", label: "Registered Pharmacist Certificate (Category A)" },
  { key: "tax_certificate_url", label: "Tax Certificate / NTN" },
  { key: "bank_document_url", label: "Bank Account Proof / Cheque" },
];

const DOCTOR_DOCS = [
  { key: "pmdc_certificate_url", label: "PMDC / PMC Registration Certificate" },
  { key: "degree_certificate_url", label: "Medical Degree / Specialization (MBBS/FCPS)" },
  { key: "cnic_copy_url", label: "CNIC Copy (Front & Back)" },
  { key: "experience_proof_url", label: "Hospital / Clinic Affiliation Proof" },
];

const LAB_DOCS = [
  { key: "lab_license_url", label: "Healthcare Commission / Lab Registration" },
  { key: "accreditation_url", label: "Quality Accreditation (ISO / CAP / PHC)" },
  { key: "tax_certificate_url", label: "NTN / Tax Registration" },
  { key: "bank_document_url", label: "Bank Proof / Account Details" },
];

const SPECIALTY_OPTIONS = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Diabetologist / Endocrinologist",
  "Gynecologist / Obstetrician",
  "Pediatrician",
  "Psychologist / Mental Health",
  "Neurologist",
  "Gastroenterologist",
  "Orthopedic Surgeon",
  "Nutritionist / Dietitian",
  "Physiotherapist",
  "Dentist",
  "Urologist",
  "Other Specialist",
];

export default function PartnerWithUsPage() {
  const [partnerType, setPartnerType] = useState("pharmacy");
  const createVendor = useCreateVendor();
  const uploadPublicDocument = useUploadPublicDocument();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Application tracking state
  const [applicationId, setApplicationId] = useState("");
  const [submittedType, setSubmittedType] = useState("");
  const { data: onboardingStatus } = useVendorOnboardingStatus(applicationId, {
    refetchInterval: applicationId && submittedType === "pharmacy" ? 15000 : false,
  });

  // Pharmacy Form State
  const [pharmacyForm, setPharmacyForm] = useState({
    business_name: "",
    email: "",
    password: "",
    phone: "",
    license_number: "",
    ntn: "",
    address: "",
    city: "",
    service_radius_km: 10,
    bank_account_title: "",
    bank_account_number: "",
    bank_name: "",
  });

  // Doctor Form State
  const [doctorForm, setDoctorForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    pmdc_number: "",
    specialty: "General Physician",
    qualifications: "MBBS",
    experience_years: "5",
    consultation_fee: "1500",
    city: "",
    hospital_name: "",
    about: "",
  });

  // Lab Form State
  const [labForm, setLabForm] = useState({
    lab_name: "",
    contact_person: "",
    email: "",
    phone: "",
    license_number: "",
    city: "",
    address: "",
    offers_home_sampling: "yes",
    tests_summary: "Routine Blood, HbA1c, Lipid Profiles, Kidney/Liver Panels, Molecular Tests",
    bank_account_title: "",
    bank_account_number: "",
    bank_name: "",
  });

  const [documents, setDocuments] = useState({});
  const [uploadingKey, setUploadingKey] = useState("");

  const activeRequiredDocs = useMemo(() => {
    switch (partnerType) {
      case "doctor":
        return DOCTOR_DOCS;
      case "lab":
        return LAB_DOCS;
      default:
        return PHARMACY_DOCS;
    }
  }, [partnerType]);

  const uploadedCount = useMemo(
    () => activeRequiredDocs.filter((doc) => Boolean(documents[doc.key])).length,
    [activeRequiredDocs, documents]
  );

  const handleUpload = async (key, file) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const res = await uploadPublicDocument.mutateAsync(file);
      setDocuments((prev) => ({ ...prev, [key]: res.url }));
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploadingKey("");
    }
  };

  const handlePharmacySubmit = async (e) => {
    e.preventDefault();
    const missing = PHARMACY_DOCS.filter((doc) => !documents[doc.key]);
    if (missing.length > 0) {
      toast.error("Please upload all required pharmacy compliance documents");
      return;
    }

    try {
      const data = await createVendor.mutateAsync({
        ...pharmacyForm,
        service_radius_km: Number(pharmacyForm.service_radius_km) || 10,
        ...documents,
      });

      const createdVendor = data.vendor || data;
      setApplicationId(createdVendor.id);
      setSubmittedType("pharmacy");
      toast.success("Pharmacy application submitted successfully!");
    } catch (error) {
      toast.error(error.message || "Unable to submit pharmacy application");
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const nameParts = doctorForm.full_name.trim().split(" ");
      const firstName = nameParts[0] || "Dr.";
      const lastName = nameParts.slice(1).join(" ") || "Specialist";

      const subject = `[Doctor Registration Application] Dr. ${doctorForm.full_name} (${doctorForm.specialty})`;
      const message = `
DOCTOR ONBOARDING REGISTRATION:
- Full Name: ${doctorForm.full_name}
- Email: ${doctorForm.email}
- Phone: ${doctorForm.phone}
- PMDC / PMC Registration Number: ${doctorForm.pmdc_number}
- Primary Specialty: ${doctorForm.specialty}
- Qualifications / Degrees: ${doctorForm.qualifications}
- Experience: ${doctorForm.experience_years} Years
- Video Consultation Fee: PKR ${doctorForm.consultation_fee}
- Hospital / Clinic Affiliation: ${doctorForm.hospital_name || "Private Telehealth Practice"}
- City: ${doctorForm.city}
- Summary / Bio: ${doctorForm.about || "N/A"}

DOCUMENTS ATTACHED:
${Object.entries(documents).map(([k, v]) => `- ${k}: ${v}`).join("\n") || "No digital uploads attached"}
      `.trim();

      await inquiriesApi.submit({
        first_name: firstName,
        last_name: lastName,
        email: doctorForm.email,
        phone: doctorForm.phone,
        type: "partner",
        subject: subject,
        message: message,
      });

      const generatedId = `DOC-APP-${Date.now().toString().slice(-6)}`;
      setApplicationId(generatedId);
      setSubmittedType("doctor");
      toast.success("Doctor application submitted! Our medical verification team will review your credentials within 24 hours.");
    } catch (error) {
      toast.error(error.message || "Failed to submit doctor application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLabSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const subject = `[Diagnostic Lab Registration] ${labForm.lab_name} - ${labForm.city}`;
      const message = `
DIAGNOSTIC LABORATORY PARTNERSHIP APPLICATION:
- Laboratory Name: ${labForm.lab_name}
- Authorized Contact Person: ${labForm.contact_person}
- Email: ${labForm.email}
- Phone / Helpline: ${labForm.phone}
- Lab Accreditation / Registration: ${labForm.license_number}
- City: ${labForm.city}
- Address: ${labForm.address}
- Offers Home Sampling: ${labForm.offers_home_sampling}
- Tests & Diagnostics Summary: ${labForm.tests_summary}
- Bank Title: ${labForm.bank_account_title}
- Bank Name: ${labForm.bank_name}
- Bank Account / IBAN: ${labForm.bank_account_number}

DOCUMENTS ATTACHED:
${Object.entries(documents).map(([k, v]) => `- ${k}: ${v}`).join("\n") || "No digital uploads attached"}
      `.trim();

      await inquiriesApi.submit({
        first_name: labForm.contact_person || labForm.lab_name,
        last_name: "Lab Partner",
        email: labForm.email,
        phone: labForm.phone,
        type: "partner",
        subject: subject,
        message: message,
      });

      const generatedId = `LAB-APP-${Date.now().toString().slice(-6)}`;
      setApplicationId(generatedId);
      setSubmittedType("lab");
      toast.success("Laboratory application submitted! Our diagnostic team will contact you shortly for onboarding.");
    } catch (error) {
      toast.error(error.message || "Failed to submit laboratory application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] py-8 md:py-12">
      <div className="w-full max-w-[1140px] mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkle size={14} weight="fill" />
            Healthcare Provider Ecosystem
          </p>
          <h1 className="text-[30px] md:text-[36px] font-heading font-extrabold text-ink-headline tracking-tight">
            Partner with Medzoos
          </h1>
          <p className="text-[15px] text-neutral-600 mt-2">
            Join Pakistan&apos;s leading integrated digital healthcare marketplace. Connect with patients, expand your reach, and deliver verified care.
          </p>
        </div>

        {/* Partner Type Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {PARTNER_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = partnerType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setPartnerType(type.id);
                  setDocuments({});
                }}
                className={`flex flex-col text-left p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-white border-brand-primary shadow-[0_8px_30px_rgba(23,97,142,0.12)] ring-2 ring-brand-primary/20"
                    : "bg-white/70 border-neutral-200 hover:bg-white hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-brand-primary text-white" : "bg-neutral-100 text-neutral-600"
                  }`}>
                    <Icon size={22} weight={isSelected ? "fill" : "regular"} />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isSelected ? "bg-brand-light text-brand-primary" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    {type.badge}
                  </span>
                </div>
                <h3 className={`text-[16px] font-bold ${isSelected ? "text-ink-headline" : "text-neutral-700"}`}>
                  {type.label}
                </h3>
                <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr,0.85fr] gap-8">
          
          {/* Form Container */}
          <section className="bg-white rounded-[24px] border border-neutral-200 p-6 md:p-8 shadow-[var(--shadow-card)]">
            
            {/* Pharmacy Registration Form */}
            {partnerType === "pharmacy" && (
              <>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary shrink-0">
                    <Storefront size={26} weight="fill" />
                  </div>
                  <div>
                    <h2 className="text-[22px] font-heading font-extrabold text-ink-headline tracking-tight">
                      Register Your Pharmacy
                    </h2>
                    <p className="text-[13px] text-neutral-500 mt-0.5">
                      Submit drug license, store location, and pharmacist credentials for DRAP compliance.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePharmacySubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Pharmacy / Business Name" 
                      value={pharmacyForm.business_name} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, business_name: e.target.value }))} 
                      placeholder="e.g. Al-Shifa Pharmacy"
                      required 
                    />
                    <Input 
                      label="Business Email" 
                      type="email" 
                      value={pharmacyForm.email} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, email: e.target.value }))} 
                      placeholder="pharmacy@example.com"
                      required 
                    />
                    <Input 
                      label="Password for Vendor Portal" 
                      type="password" 
                      value={pharmacyForm.password} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, password: e.target.value }))} 
                      placeholder="••••••••"
                      required 
                    />
                    <Input 
                      label="Drug Sale License Number" 
                      value={pharmacyForm.license_number} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, license_number: e.target.value }))} 
                      placeholder="e.g. 05-A-12345-2024"
                      required 
                    />
                    <Input 
                      label="NTN / Tax Number" 
                      value={pharmacyForm.ntn} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, ntn: e.target.value }))} 
                      placeholder="e.g. 1234567-8"
                    />
                    <Input 
                      label="Service Radius (km)" 
                      type="number" 
                      value={pharmacyForm.service_radius_km} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, service_radius_km: e.target.value }))} 
                    />
                    <Input 
                      label="City" 
                      value={pharmacyForm.city} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, city: e.target.value }))} 
                      placeholder="e.g. Karachi"
                      required
                    />
                    <Input 
                      label="Physical Pharmacy Address" 
                      value={pharmacyForm.address} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, address: e.target.value }))} 
                      placeholder="Shop # 4, Main Commercial..."
                      required
                    />
                    <Input 
                      label="Bank Account Title" 
                      value={pharmacyForm.bank_account_title} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, bank_account_title: e.target.value }))} 
                      placeholder="Account Title"
                    />
                    <Input 
                      label="Bank Name" 
                      value={pharmacyForm.bank_name} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, bank_name: e.target.value }))} 
                      placeholder="e.g. Meezan Bank"
                    />
                    <Input 
                      label="Bank Account Number / IBAN" 
                      value={pharmacyForm.bank_account_number} 
                      onChange={(e) => setPharmacyForm(p => ({ ...p, bank_account_number: e.target.value }))} 
                      className="md:col-span-2" 
                      placeholder="PK00MEZN00000000000000"
                    />
                  </div>

                  {/* Document Uploads */}
                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[15px] font-bold text-ink-headline">Compliance Documents</h3>
                      <span className="text-[12px] font-bold text-brand-primary">{uploadedCount}/{PHARMACY_DOCS.length} Uploaded</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PHARMACY_DOCS.map((doc) => (
                        <label key={doc.key} className="relative block rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-3 hover:border-brand-primary cursor-pointer transition-colors">
                          <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleUpload(doc.key, e.target.files?.[0])} disabled={uploadingKey === doc.key} />
                          <div className="flex items-center gap-2.5">
                            <FileArrowUp size={18} className="text-brand-primary shrink-0" />
                            <div className="min-w-0">
                              <div className="text-[12px] font-semibold text-ink-headline truncate">{doc.label}</div>
                              <div className="text-[10px] text-neutral-500">{documents[doc.key] ? "✓ Uploaded" : uploadingKey === doc.key ? "Uploading..." : "PDF or JPG"}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" isLoading={createVendor.isPending} className="w-full h-11 text-[14px]">
                    Submit Pharmacy Application
                  </Button>
                </form>
              </>
            )}

            {/* Doctor Registration Form */}
            {partnerType === "doctor" && (
              <>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary shrink-0">
                    <Stethoscope size={26} weight="fill" />
                  </div>
                  <div>
                    <h2 className="text-[22px] font-heading font-extrabold text-ink-headline tracking-tight">
                      Join as a Doctor or Specialist
                    </h2>
                    <p className="text-[13px] text-neutral-500 mt-0.5">
                      Provide verified telehealth consultations, set your own availability and consultation fee.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleDoctorSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Doctor Full Name" 
                      value={doctorForm.full_name} 
                      onChange={(e) => setDoctorForm(p => ({ ...p, full_name: e.target.value }))} 
                      placeholder="e.g. Dr. Muhammad Farooq"
                      required 
                    />
                    <Input 
                      label="Email Address" 
                      type="email" 
                      value={doctorForm.email} 
                      onChange={(e) => setDoctorForm(p => ({ ...p, email: e.target.value }))} 
                      placeholder="doctor@example.com"
                      required 
                    />
                    <Input 
                      label="Phone / WhatsApp" 
                      type="tel" 
                      value={doctorForm.phone} 
                      onChange={(e) => setDoctorForm(p => ({ ...p, phone: e.target.value }))} 
                      placeholder="+92 300 1234567"
                      required 
                    />
                    <Input 
                      label="PMDC / PMC License Number" 
                      value={doctorForm.pmdc_number} 
                      onChange={(e) => setDoctorForm(p => ({ ...p, pmdc_number: e.target.value }))} 
                      placeholder="e.g. 12345-P"
                      required 
                    />
                    <div>
                      <label className="text-[12px] font-semibold text-ink-headline block mb-1.5">
                        Primary Specialty
                      </label>
                      <select
                        value={doctorForm.specialty}
                        onChange={(e) => setDoctorForm(p => ({ ...p, specialty: e.target.value }))}
                        className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                        required
                      >
                        {SPECIALTY_OPTIONS.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <Input 
                      label="Degrees / Qualifications" 
                      value={doctorForm.qualifications} 
                      onChange={(e) => setDoctorForm(p => ({ ...p, qualifications: e.target.value }))} 
                      placeholder="e.g. MBBS, FCPS (Cardiology)"
                      required 
                    />
                    <Input 
                      label="Years of Experience" 
                      type="number" 
                      value={doctorForm.experience_years} 
                      onChange={(e) => setDoctorForm(p => ({ ...p, experience_years: e.target.value }))} 
                      placeholder="e.g. 8"
                      required 
                    />
                    <Input 
                      label="Video Consultation Fee (PKR)" 
                      type="number" 
                      value={doctorForm.consultation_fee} 
                      onChange={(e) => setDoctorForm(p => ({ ...p, consultation_fee: e.target.value }))} 
                      placeholder="e.g. 2000"
                      required 
                    />
                    <Input 
                      label="City" 
                      value={doctorForm.city} 
                      onChange={(e) => setDoctorForm(p => ({ ...p, city: e.target.value }))} 
                      placeholder="e.g. Lahore"
                      required
                    />
                    <Input 
                      label="Hospital / Clinic Affiliation" 
                      value={doctorForm.hospital_name} 
                      onChange={(e) => setDoctorForm(p => ({ ...p, hospital_name: e.target.value }))} 
                      placeholder="e.g. Shaukat Khanum / Private Clinic"
                    />
                  </div>

                  {/* Document Uploads */}
                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[15px] font-bold text-ink-headline">Doctor Credentials</h3>
                      <span className="text-[12px] font-bold text-brand-primary">{uploadedCount}/{DOCTOR_DOCS.length} Uploaded</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {DOCTOR_DOCS.map((doc) => (
                        <label key={doc.key} className="relative block rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-3 hover:border-brand-primary cursor-pointer transition-colors">
                          <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleUpload(doc.key, e.target.files?.[0])} disabled={uploadingKey === doc.key} />
                          <div className="flex items-center gap-2.5">
                            <GraduationCap size={18} className="text-brand-primary shrink-0" />
                            <div className="min-w-0">
                              <div className="text-[12px] font-semibold text-ink-headline truncate">{doc.label}</div>
                              <div className="text-[10px] text-neutral-500">{documents[doc.key] ? "✓ Uploaded" : uploadingKey === doc.key ? "Uploading..." : "PDF or JPG"}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" isLoading={isSubmitting} className="w-full h-11 text-[14px]">
                    Submit Doctor Registration
                  </Button>
                </form>
              </>
            )}

            {/* Diagnostic Lab Registration Form */}
            {partnerType === "lab" && (
              <>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary shrink-0">
                    <Flask size={26} weight="fill" />
                  </div>
                  <div>
                    <h2 className="text-[22px] font-heading font-extrabold text-ink-headline tracking-tight">
                      Register Diagnostic Laboratory
                    </h2>
                    <p className="text-[13px] text-neutral-500 mt-0.5">
                      Publish diagnostic packages, tests, and receive home phlebotomy sample bookings.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleLabSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Laboratory / Diagnostic Center Name" 
                      value={labForm.lab_name} 
                      onChange={(e) => setLabForm(p => ({ ...p, lab_name: e.target.value }))} 
                      placeholder="e.g. Chughtai / Excel Diagnostics"
                      required 
                    />
                    <Input 
                      label="Authorized Focal Person" 
                      value={labForm.contact_person} 
                      onChange={(e) => setLabForm(p => ({ ...p, contact_person: e.target.value }))} 
                      placeholder="e.g. Dr. Tariq Mahmood (Lab Director)"
                      required 
                    />
                    <Input 
                      label="Official Email" 
                      type="email" 
                      value={labForm.email} 
                      onChange={(e) => setLabForm(p => ({ ...p, email: e.target.value }))} 
                      placeholder="lab@example.com"
                      required 
                    />
                    <Input 
                      label="Helpline / Contact Number" 
                      type="tel" 
                      value={labForm.phone} 
                      onChange={(e) => setLabForm(p => ({ ...p, phone: e.target.value }))} 
                      placeholder="+92 21 34567890"
                      required 
                    />
                    <Input 
                      label="Lab Registration / License Number" 
                      value={labForm.license_number} 
                      onChange={(e) => setLabForm(p => ({ ...p, license_number: e.target.value }))} 
                      placeholder="e.g. PHC-LAB-4567"
                      required 
                    />
                    <Input 
                      label="City" 
                      value={labForm.city} 
                      onChange={(e) => setLabForm(p => ({ ...p, city: e.target.value }))} 
                      placeholder="e.g. Islamabad"
                      required 
                    />
                    <Input 
                      label="Laboratory Main Address" 
                      value={labForm.address} 
                      onChange={(e) => setLabForm(p => ({ ...p, address: e.target.value }))} 
                      placeholder="Plot 12-C, Medical Complex..."
                      className="md:col-span-2"
                      required 
                    />
                    <div className="md:col-span-2">
                      <label className="text-[12px] font-semibold text-ink-headline block mb-1.5">
                        Home Sample Collection (Phlebotomy) Available?
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                          <input 
                            type="radio" 
                            name="home_sampling" 
                            value="yes" 
                            checked={labForm.offers_home_sampling === "yes"}
                            onChange={() => setLabForm(p => ({ ...p, offers_home_sampling: "yes" }))}
                          />
                          Yes, we provide at-home sample collection riders
                        </label>
                        <label className="flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                          <input 
                            type="radio" 
                            name="home_sampling" 
                            value="no" 
                            checked={labForm.offers_home_sampling === "no"}
                            onChange={() => setLabForm(p => ({ ...p, offers_home_sampling: "no" }))}
                          />
                          No, walk-in collection points only
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Document Uploads */}
                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[15px] font-bold text-ink-headline">Accreditations & Certificates</h3>
                      <span className="text-[12px] font-bold text-brand-primary">{uploadedCount}/{LAB_DOCS.length} Uploaded</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {LAB_DOCS.map((doc) => (
                        <label key={doc.key} className="relative block rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-3 hover:border-brand-primary cursor-pointer transition-colors">
                          <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleUpload(doc.key, e.target.files?.[0])} disabled={uploadingKey === doc.key} />
                          <div className="flex items-center gap-2.5">
                            <IdentificationCard size={18} className="text-brand-primary shrink-0" />
                            <div className="min-w-0">
                              <div className="text-[12px] font-semibold text-ink-headline truncate">{doc.label}</div>
                              <div className="text-[10px] text-neutral-500">{documents[doc.key] ? "✓ Uploaded" : uploadingKey === doc.key ? "Uploading..." : "PDF or JPG"}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" isLoading={isSubmitting} className="w-full h-11 text-[14px]">
                    Submit Laboratory Application
                  </Button>
                </form>
              </>
            )}

          </section>

          {/* Right Sidebar: Partner Portal Info & Status */}
          <aside className="space-y-6">
            
            {/* Submitted Application Tracker */}
            {applicationId && (
              <div className="bg-emerald-50 rounded-[24px] border border-emerald-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle size={24} className="text-emerald-600" weight="fill" />
                  <h3 className="text-[17px] font-bold text-emerald-950">Application Received</h3>
                </div>
                <p className="text-[13px] text-emerald-800 leading-relaxed">
                  Your registration application has been submitted to the Medzoos Verification Authority.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-white/80 border border-emerald-200 text-[13px] space-y-1">
                  <div><strong>Application Reference:</strong> <span className="font-mono text-emerald-700">{applicationId}</span></div>
                  <div><strong>Type:</strong> <span className="capitalize">{submittedType || partnerType}</span></div>
                  <div><strong>Review SLA:</strong> 12–24 Hours</div>
                </div>
              </div>
            )}

            {/* Provider Portals Links Card */}
            <div className="bg-white rounded-[24px] border border-neutral-200 p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={22} className="text-brand-primary" weight="fill" />
                <h3 className="text-[17px] font-bold text-ink-headline">Already a Partner?</h3>
              </div>
              <p className="text-[13px] text-neutral-500 mb-4">
                Access your dedicated partner management dashboard to fulfill orders, conduct consultations, or upload lab reports:
              </p>
              
              <div className="space-y-2.5">
                <a
                  href={`${process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:3001"}/vendor`}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle hover:bg-brand-mist border border-neutral-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Storefront size={18} className="text-brand-primary" weight="fill" />
                    <span className="text-[13px] font-bold text-ink-headline">Pharmacy / Vendor Portal</span>
                  </div>
                  <ArrowRight size={14} className="text-neutral-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href={`${process.env.NEXT_PUBLIC_DOCTOR_URL || "http://localhost:3003"}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle hover:bg-brand-mist border border-neutral-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Stethoscope size={18} className="text-brand-primary" weight="fill" />
                    <span className="text-[13px] font-bold text-ink-headline">Doctor & Specialist Portal</span>
                  </div>
                  <ArrowRight size={14} className="text-neutral-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href={`${process.env.NEXT_PUBLIC_LAB_URL || "http://localhost:3004"}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle hover:bg-brand-mist border border-neutral-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Flask size={18} className="text-brand-primary" weight="fill" />
                    <span className="text-[13px] font-bold text-ink-headline">Diagnostic Laboratory Portal</span>
                  </div>
                  <ArrowRight size={14} className="text-neutral-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Partner Benefits Card */}
            <div className="bg-gradient-to-br from-[#102A43] to-[#073B4C] rounded-[24px] p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 text-brand-highlight text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkle size={14} weight="fill" />
                Partner Verification Standards
              </div>
              <h4 className="text-[17px] font-bold text-white mb-2">
                Why Healthcare Providers Choose Medzoos
              </h4>
              <ul className="space-y-2 text-[12px] text-neutral-300">
                <li className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-[#2DD4BF] shrink-0 mt-0.5" weight="fill" />
                  <span><strong>Automated Settlements:</strong> Direct bank account payouts with itemized billing breakdowns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-[#2DD4BF] shrink-0 mt-0.5" weight="fill" />
                  <span><strong>Zero Technical Friction:</strong> Built-in video rooms, Rx verification engine, and phlebotomy routing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-[#2DD4BF] shrink-0 mt-0.5" weight="fill" />
                  <span><strong>Nationwide Patient Reach:</strong> Access thousands of patients across major urban hubs and districts.</span>
                </li>
              </ul>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <PhoneCall size={14} className="text-[#2DD4BF]" />
                  <span>+92 300 123 4567</span>
                </div>
                <a href="mailto:partners@medzoos.pk" className="text-[#2DD4BF] font-bold hover:underline">
                  partners@medzoos.pk
                </a>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
