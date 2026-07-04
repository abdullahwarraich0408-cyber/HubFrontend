"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BuildingOffice, FileArrowUp, CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { useCreateVendor, useUploadPublicDocument, useVendorOnboardingStatus } from "@/lib/hooks/useApi";
import { toast } from "sonner";

const REQUIRED_DOCS = [
  { key: "trade_license_url", label: "Trade License" },
  { key: "pharmacist_certificate_url", label: "Pharmacist Certificate" },
  { key: "tax_certificate_url", label: "Tax Certificate / NTN" },
  { key: "bank_document_url", label: "Bank Proof" },
];

export default function PartnerWithUsPage() {
  const createVendor = useCreateVendor();
  const uploadPublicDocument = useUploadPublicDocument();
  const [applicationId, setApplicationId] = useState("");
  const { data: onboardingStatus } = useVendorOnboardingStatus(applicationId, {
    refetchInterval: applicationId ? 15000 : false,
  });

  const [form, setForm] = useState({
    business_name: "",
    email: "",
    password: "",
    license_number: "",
    ntn: "",
    address: "",
    city: "",
    service_radius_km: 10,
    bank_account_title: "",
    bank_account_number: "",
    bank_name: "",
  });
  const [documents, setDocuments] = useState({});
  const [uploadingKey, setUploadingKey] = useState("");

  const uploadedCount = useMemo(
    () => REQUIRED_DOCS.filter((doc) => Boolean(documents[doc.key])).length,
    [documents]
  );

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missing = REQUIRED_DOCS.filter((doc) => !documents[doc.key]);
    if (missing.length > 0) {
      toast.error("Please upload all required documents before submitting");
      return;
    }

    try {
      const data = await createVendor.mutateAsync({
        ...form,
        service_radius_km: Number(form.service_radius_km) || 10,
        ...documents,
      });

      const createdVendor = data.vendor || data;
      setApplicationId(createdVendor.id);
      toast.success("Application submitted successfully");
    } catch (error) {
      toast.error(error.message || "Unable to submit pharmacy application");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] py-8 md:py-12">
      <div className="w-full max-w-[1120px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-6">
          <section className="bg-white rounded-[20px] border border-neutral-200 p-6 md:p-8 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary shrink-0">
                <BuildingOffice size={24} weight="fill" />
              </div>
              <div>
                <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">
                  Register Your Pharmacy
                </h1>
                <p className="text-[14px] text-neutral-500 mt-1">
                  Submit your pharmacy profile, compliance documents, and payout details for admin review.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Business Name" value={form.business_name} onChange={(e) => handleChange("business_name", e.target.value)} required />
                <Input label="Business Email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required />
                <Input label="Password" type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} required />
                <Input label="Drug License Number" value={form.license_number} onChange={(e) => handleChange("license_number", e.target.value)} required />
                <Input label="NTN / Tax Number" value={form.ntn} onChange={(e) => handleChange("ntn", e.target.value)} />
                <Input label="Service Radius (km)" type="number" value={form.service_radius_km} onChange={(e) => handleChange("service_radius_km", e.target.value)} />
                <Input label="City" value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
                <Input label="Address" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
                <Input label="Bank Account Title" value={form.bank_account_title} onChange={(e) => handleChange("bank_account_title", e.target.value)} />
                <Input label="Bank Name" value={form.bank_name} onChange={(e) => handleChange("bank_name", e.target.value)} />
                <Input label="Bank Account Number" value={form.bank_account_number} onChange={(e) => handleChange("bank_account_number", e.target.value)} className="md:col-span-2" />
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[18px] font-bold text-ink-headline">Compliance Documents</h2>
                    <p className="text-[13px] text-neutral-500">Upload the required documents for admin verification.</p>
                  </div>
                  <div className="text-[13px] font-semibold text-brand-primary">
                    {uploadedCount}/{REQUIRED_DOCS.length} uploaded
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {REQUIRED_DOCS.map((doc) => (
                    <label
                      key={doc.key}
                      className="relative block rounded-[16px] border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 hover:border-brand-primary transition-colors"
                    >
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleUpload(doc.key, e.target.files?.[0])}
                        disabled={uploadingKey === doc.key}
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-brand-primary shrink-0">
                          <FileArrowUp size={20} weight="bold" />
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-ink-headline">{doc.label}</div>
                          <div className="text-[12px] text-neutral-500">
                            {documents[doc.key]
                              ? "Uploaded and ready for review"
                              : uploadingKey === doc.key
                                ? "Uploading..."
                                : "PDF, JPG or PNG"}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" isLoading={createVendor.isPending} className="w-full md:w-auto">
                Submit Pharmacy Application
              </Button>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-[20px] border border-neutral-200 p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={22} className="text-brand-primary" weight="fill" />
                <h2 className="text-[18px] font-bold text-ink-headline">Approval Flow</h2>
              </div>
              <ol className="space-y-3 text-[14px] text-neutral-600">
                <li>1. Submit pharmacy profile and mandatory documents.</li>
                <li>2. Admin reviews your compliance and bank details.</li>
                <li>3. Rejected documents can be resubmitted after feedback.</li>
                <li>4. Once approved, your pharmacy appears publicly and can log into the Vendor Panel.</li>
              </ol>
              <div className="mt-6 text-[13px] text-neutral-500">
                Already approved?{" "}
                <Link
                  href={`${process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:3001"}/vendor`}
                  className="text-brand-primary font-semibold hover:underline"
                >
                  Go to vendor login
                </Link>
              </div>
            </div>

            {applicationId && onboardingStatus && (
              <div className="bg-white rounded-[20px] border border-neutral-200 p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={22} className="text-status-success" weight="fill" />
                  <h2 className="text-[18px] font-bold text-ink-headline">Application Status</h2>
                </div>
                <div className="space-y-2 text-[14px] text-neutral-700">
                  <div><span className="font-semibold">Application ID:</span> {onboardingStatus.application_id}</div>
                  <div><span className="font-semibold">Status:</span> {onboardingStatus.status}</div>
                  <div><span className="font-semibold">Login enabled:</span> {onboardingStatus.can_login ? "Yes" : "No"}</div>
                </div>
                <div className="mt-4 space-y-2">
                  {(onboardingStatus.documents || []).map((document) => (
                    <div key={document.id} className="rounded-[12px] border border-neutral-200 px-3 py-2 text-[13px]">
                      <div className="font-semibold text-ink-headline">{document.type.replaceAll("_", " ")}</div>
                      <div className="text-neutral-500">Status: {document.status}</div>
                      {document.rejection_reason ? (
                        <div className="text-status-danger mt-1">{document.rejection_reason}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
