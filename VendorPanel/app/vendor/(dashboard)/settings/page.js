"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Clock, MapPin, ShieldCheck, Wallet } from "@phosphor-icons/react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import {
  useVendorProfile,
  useUpdateVendorProfile,
  useUploadDocument,
  useVendorAvailability,
  useUpdateVendorAvailability,
  useVendorOperatingHours,
  useUpdateVendorOperatingHours,
  useVendorServiceAreas,
  useUpdateVendorServiceAreas,
} from "@/lib/hooks/useApi";
import { toast } from "sonner";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function buildDefaultHours() {
  return DAY_LABELS.map((label, index) => ({
    day_of_week: index,
    label,
    open_time: "09:00",
    close_time: "21:00",
    is_closed: false,
  }));
}

export default function VendorSettingsPage() {
  const { data: profile } = useVendorProfile();
  const { data: availability } = useVendorAvailability();
  const { data: operatingHours = [] } = useVendorOperatingHours();
  const { data: serviceAreas = [] } = useVendorServiceAreas();
  const updateProfile = useUpdateVendorProfile();
  const updateAvailability = useUpdateVendorAvailability();
  const updateOperatingHours = useUpdateVendorOperatingHours();
  const updateServiceAreas = useUpdateVendorServiceAreas();
  const uploadDoc = useUploadDocument();

  const [saved, setSaved] = useState(false);
  const [documents, setDocuments] = useState({});
  const [hours, setHours] = useState([]);
  const [serviceAreasText, setServiceAreasText] = useState(null);
  const [uploadingKey, setUploadingKey] = useState("");

  const derivedDocuments = useMemo(() => {
    const docsByType = Object.fromEntries((profile?.documents || []).map((doc) => [doc.type, doc.file_url]));
    return {
      trade_license_url: profile?.trade_license_url || docsByType.trade_license || "",
      pharmacist_certificate_url: profile?.pharmacist_certificate_url || docsByType.pharmacist_certificate || "",
      tax_certificate_url: docsByType.tax_certificate || "",
      bank_document_url: docsByType.bank_details || "",
    };
  }, [profile]);

  const effectiveDocuments = useMemo(
    () => ({ ...derivedDocuments, ...documents }),
    [derivedDocuments, documents]
  );

  const derivedHours = useMemo(() => {
    const map = new Map(operatingHours.map((entry) => [Number(entry.day_of_week), entry]));
    return buildDefaultHours().map((entry) => ({
      ...entry,
      ...(map.get(entry.day_of_week) || {}),
    }));
  }, [operatingHours]);

  const effectiveHours = hours.length ? hours : derivedHours;
  const derivedServiceAreasText = useMemo(
    () => serviceAreas.map((area) => area.name).join("\n"),
    [serviceAreas]
  );
  const effectiveServiceAreasText = serviceAreasText ?? derivedServiceAreasText;

  const statusByType = useMemo(() => {
    const map = new Map();
    for (const document of profile?.documents || []) {
      map.set(document.type, document.status);
    }
    return map;
  }, [profile?.documents]);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUpload = async (key, file) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const res = await uploadDoc.mutateAsync(file);
      setDocuments((prev) => ({ ...prev, [key]: res.url }));
      toast.success("Document uploaded successfully");
    } catch (err) {
      toast.error(err.message || "Failed to upload document");
    } finally {
      setUploadingKey("");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const password = data.get("password");
    const confirmPassword = data.get("confirm_password");

    if (password && password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = {
        business_name: data.get("business_name"),
        email: data.get("email"),
        license_number: data.get("license_number"),
        ntn: data.get("ntn"),
        address: data.get("address"),
        city: data.get("city"),
        bank_account_title: data.get("bank_account_title"),
        bank_account_number: data.get("bank_account_number"),
        bank_name: data.get("bank_name"),
        ...effectiveDocuments,
      };
      if (password) payload.password = password;

      await updateProfile.mutateAsync(payload);
      showSaved();
      if (e.target.password) e.target.password.value = "";
      if (e.target.confirm_password) e.target.confirm_password.value = "";
    } catch (err) {
      toast.error(err.message || "Failed to save profile settings");
    }
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    try {
      await updateAvailability.mutateAsync({
        is_open: data.get("is_open") === "on",
        is_online: data.get("is_online") === "on",
        service_radius_km: Number(data.get("service_radius_km")) || 10,
        holiday_mode_enabled: data.get("holiday_mode_enabled") === "on",
        holiday_starts_at: data.get("holiday_starts_at") || null,
        holiday_ends_at: data.get("holiday_ends_at") || null,
        holiday_reason: data.get("holiday_reason") || "",
      });
      showSaved();
    } catch (err) {
      toast.error(err.message || "Failed to save availability");
    }
  };

  const handleHoursSubmit = async () => {
    try {
      await updateOperatingHours.mutateAsync(
        effectiveHours.map(({ label, ...entry }) => entry)
      );
      showSaved();
    } catch (err) {
      toast.error(err.message || "Failed to update operating hours");
    }
  };

  const handleServiceAreasSubmit = async () => {
    try {
      const areas = effectiveServiceAreasText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((name, index) => ({
          name,
          city: profile?.city || profile?.address || null,
          sort_order: index,
        }));

      await updateServiceAreas.mutateAsync(areas);
      showSaved();
    } catch (err) {
      toast.error(err.message || "Failed to update service areas");
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[1080px] space-y-6">
      <div>
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Account Settings</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Manage your pharmacy profile, compliance documents, availability, and payout details.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 bg-status-success/10 border border-status-success/30 rounded-[12px] text-status-success text-[14px] font-semibold">
          <CheckCircle size={18} weight="fill" />
          Changes saved successfully.
        </div>
      )}

      <form key={`profile-${profile?.id || "loading"}`} onSubmit={handleProfileSubmit} className="bg-white rounded-[16px] border border-neutral-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck size={22} className="text-brand-primary" weight="fill" />
          <div>
            <h2 className="text-[18px] font-bold text-ink-headline">Business & Compliance</h2>
            <p className="text-[13px] text-neutral-500">Keep your pharmacy profile and verification files up to date.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Business Name" name="business_name" defaultValue={profile?.business_name || ""} required />
          <Input label="Email" name="email" type="email" defaultValue={profile?.email || ""} />
          <Input label="License Number" name="license_number" defaultValue={profile?.license_number || ""} required />
          <Input label="NTN / Tax Number" name="ntn" defaultValue={profile?.ntn || ""} />
          <Input label="Address" name="address" defaultValue={profile?.address || ""} />
          <Input label="City" name="city" defaultValue={profile?.city || ""} />
          <Input label="Bank Account Title" name="bank_account_title" defaultValue={profile?.bank_account_title || ""} />
          <Input label="Bank Name" name="bank_name" defaultValue={profile?.bank_name || ""} />
          <Input label="Bank Account Number" name="bank_account_number" defaultValue={profile?.bank_account_number || ""} className="md:col-span-2" />
          <Input label="Account Status" name="status" defaultValue={profile?.status || "pending"} disabled />
        </div>

        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <h3 className="text-[16px] font-bold text-ink-headline">Verification Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["trade_license_url", "Trade License", "trade_license"],
              ["pharmacist_certificate_url", "Pharmacist Certificate", "pharmacist_certificate"],
              ["tax_certificate_url", "Tax Certificate", "tax_certificate"],
              ["bank_document_url", "Bank Proof", "bank_details"],
            ].map(([key, label, type]) => (
              <div key={key} className="rounded-[14px] border border-neutral-200 p-4 bg-neutral-50/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[14px] font-semibold text-ink-headline">{label}</div>
                  <span className="text-[12px] font-semibold capitalize text-neutral-500">
                    {statusByType.get(type) || "pending"}
                  </span>
                </div>
                    {effectiveDocuments[key] ? (
                  <div className="space-y-3">
                    <a href={effectiveDocuments[key]} target="_blank" rel="noreferrer" className="text-[13px] text-blue-600 hover:underline break-all">
                      View uploaded file
                    </a>
                    <label className="relative inline-flex text-[12px] font-semibold text-brand-primary cursor-pointer">
                      Replace
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleUpload(key, e.target.files?.[0])}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="relative flex items-center justify-center text-center rounded-[12px] border-2 border-dashed border-neutral-300 bg-white px-4 py-6 cursor-pointer hover:border-brand-primary transition-colors">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleUpload(key, e.target.files?.[0])}
                      disabled={uploadingKey === key}
                    />
                    <span className="text-[13px] text-neutral-600 font-semibold">
                      {uploadingKey === key ? "Uploading..." : `Upload ${label}`}
                    </span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <div>
            <h3 className="text-[16px] font-bold text-ink-headline">Security</h3>
            <p className="text-[12px] text-neutral-500 mt-0.5">Leave password fields blank if you do not want to change them.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="New Password" name="password" type="password" />
            <Input label="Confirm New Password" name="confirm_password" type="password" />
          </div>
        </div>

        <Button type="submit" isLoading={updateProfile.isPending}>
          Save Business Profile
        </Button>
      </form>

      <form key={`availability-${profile?.id || "loading"}`} onSubmit={handleAvailabilitySubmit} className="bg-white rounded-[16px] border border-neutral-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Clock size={22} className="text-brand-primary" weight="fill" />
          <div>
            <h2 className="text-[18px] font-bold text-ink-headline">Availability & Holiday Mode</h2>
            <p className="text-[13px] text-neutral-500">Control if your pharmacy can receive assignments and how far you deliver.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 rounded-[12px] border border-neutral-200 px-4 py-3">
            <input type="checkbox" name="is_open" defaultChecked={availability?.is_open ?? profile?.is_open ?? true} />
            <span className="text-[14px] font-semibold text-ink-headline">Store is open</span>
          </label>
          <label className="flex items-center gap-3 rounded-[12px] border border-neutral-200 px-4 py-3">
            <input type="checkbox" name="is_online" defaultChecked={availability?.is_online ?? profile?.is_online ?? true} />
            <span className="text-[14px] font-semibold text-ink-headline">Accept online orders</span>
          </label>
          <Input label="Service Radius (km)" name="service_radius_km" type="number" defaultValue={availability?.service_radius_km ?? profile?.service_radius_km ?? 10} />
          <label className="flex items-center gap-3 rounded-[12px] border border-neutral-200 px-4 py-3">
            <input type="checkbox" name="holiday_mode_enabled" defaultChecked={availability?.holiday_mode_enabled ?? false} />
            <span className="text-[14px] font-semibold text-ink-headline">Enable holiday mode</span>
          </label>
          <Input label="Holiday Start" name="holiday_starts_at" type="datetime-local" defaultValue={availability?.holiday_starts_at ? new Date(availability.holiday_starts_at).toISOString().slice(0, 16) : ""} />
          <Input label="Holiday End" name="holiday_ends_at" type="datetime-local" defaultValue={availability?.holiday_ends_at ? new Date(availability.holiday_ends_at).toISOString().slice(0, 16) : ""} />
          <Input label="Holiday Reason" name="holiday_reason" defaultValue={availability?.holiday_reason || ""} className="md:col-span-2" />
        </div>

        <Button type="submit" isLoading={updateAvailability.isPending}>
          Save Availability
        </Button>
      </form>

      <section className="bg-white rounded-[16px] border border-neutral-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <MapPin size={22} className="text-brand-primary" weight="fill" />
          <div>
            <h2 className="text-[18px] font-bold text-ink-headline">Operating Hours & Service Areas</h2>
            <p className="text-[13px] text-neutral-500">Use weekly hours and named service zones to improve assignment accuracy.</p>
          </div>
        </div>

        <div className="space-y-3">
          {effectiveHours.map((entry, index) => (
            <div key={entry.day_of_week} className="grid grid-cols-[140px,1fr,1fr,120px] gap-3 items-center">
              <div className="text-[14px] font-semibold text-ink-headline">{entry.label}</div>
              <Input type="time" value={entry.open_time || ""} onChange={(e) => setHours(effectiveHours.map((item, itemIndex) => itemIndex === index ? { ...item, open_time: e.target.value } : item))} disabled={entry.is_closed} />
              <Input type="time" value={entry.close_time || ""} onChange={(e) => setHours(effectiveHours.map((item, itemIndex) => itemIndex === index ? { ...item, close_time: e.target.value } : item))} disabled={entry.is_closed} />
              <label className="flex items-center gap-2 text-[13px] font-medium text-neutral-600">
                <input
                  type="checkbox"
                  checked={Boolean(entry.is_closed)}
                  onChange={(e) => setHours(effectiveHours.map((item, itemIndex) => itemIndex === index ? { ...item, is_closed: e.target.checked } : item))}
                />
                Closed
              </label>
            </div>
          ))}
        </div>

        <Button type="button" onClick={handleHoursSubmit} isLoading={updateOperatingHours.isPending}>
          Save Operating Hours
        </Button>

        <div className="pt-4 border-t border-neutral-200">
          <div className="mb-3">
            <h3 className="text-[16px] font-bold text-ink-headline">Named Service Areas</h3>
            <p className="text-[12px] text-neutral-500">Enter one locality per line, for example `DHA Phase 6` or `Gulberg`.</p>
          </div>
          <textarea
            value={effectiveServiceAreasText}
            onChange={(e) => setServiceAreasText(e.target.value)}
            rows={6}
            className="w-full rounded-[14px] border border-neutral-300 bg-neutral-50 px-4 py-3 text-[14px] outline-none focus:border-brand-primary"
          />
          <div className="mt-4">
            <Button type="button" onClick={handleServiceAreasSubmit} isLoading={updateServiceAreas.isPending}>
              Save Service Areas
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[16px] border border-neutral-200 shadow-sm p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Wallet size={22} className="text-brand-primary" weight="fill" />
          <div>
            <h2 className="text-[18px] font-bold text-ink-headline">Payout Readiness</h2>
            <p className="text-[13px] text-neutral-500">Settlements use your saved bank details and verified documents.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
          <div className="rounded-[14px] border border-neutral-200 p-4 bg-neutral-50">
            <div className="font-semibold text-ink-headline">Bank Account</div>
            <div className="text-neutral-500 mt-1">{profile?.bank_account_number ? "Configured" : "Missing"}</div>
          </div>
          <div className="rounded-[14px] border border-neutral-200 p-4 bg-neutral-50">
            <div className="font-semibold text-ink-headline">Tax Profile</div>
            <div className="text-neutral-500 mt-1">{profile?.ntn ? "Configured" : "Missing"}</div>
          </div>
          <div className="rounded-[14px] border border-neutral-200 p-4 bg-neutral-50">
            <div className="font-semibold text-ink-headline">Document Verification</div>
            <div className="text-neutral-500 mt-1">
              {(profile?.documents || []).filter((document) => document.status === "verified").length} verified
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
