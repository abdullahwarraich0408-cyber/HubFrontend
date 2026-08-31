"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { PageHeader } from "@/shared/components/PageHeader";
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
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { toast } from "sonner";

const TABS = ["Pharmacy Profile", "Business Details", "Operating Hours", "Delivery", "Bank & Payout", "Compliance", "Notifications", "Security"];
const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function buildDefaultHours() {
  return DAY_LABELS.map((label, index) => ({
    day_of_week: index,
    label,
    open_time: "09:00",
    close_time: "23:00",
    is_closed: index === 0,
  }));
}

export default function AccountSettingsPage() {
  const { data: profile } = useVendorProfile();
  const { data: availability } = useVendorAvailability();
  const { data: operatingHours = [] } = useVendorOperatingHours();
  const { data: serviceAreas = [] } = useVendorServiceAreas();
  const updateProfile = useUpdateVendorProfile();
  const updateAvailability = useUpdateVendorAvailability();
  const updateOperatingHours = useUpdateVendorOperatingHours();
  const updateServiceAreas = useUpdateVendorServiceAreas();
  const uploadDoc = useUploadDocument();
  const [tab, setTab] = useState(TABS[0]);
  const [hours, setHours] = useState([]);
  const [documents, setDocuments] = useState({});
  const [serviceAreasText, setServiceAreasText] = useState(null);
  const [uploadingKey, setUploadingKey] = useState("");

  const derivedHours = useMemo(() => {
    const map = new Map(operatingHours.map((entry) => [Number(entry.day_of_week), entry]));
    return buildDefaultHours().map((entry) => ({ ...entry, ...(map.get(entry.day_of_week) || {}) }));
  }, [operatingHours]);
  const effectiveHours = hours.length ? hours : derivedHours;
  const derivedDocuments = useMemo(() => {
    const docsByType = Object.fromEntries((profile?.documents || []).map((doc) => [doc.type, doc.file_url]));
    return {
      trade_license_url: profile?.trade_license_url || docsByType.trade_license || "",
      pharmacist_certificate_url: profile?.pharmacist_certificate_url || docsByType.pharmacist_certificate || "",
      tax_certificate_url: docsByType.tax_certificate || "",
      bank_document_url: docsByType.bank_details || "",
    };
  }, [profile]);
  const effectiveDocuments = { ...derivedDocuments, ...documents };

  const saveProfile = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    try {
      await updateProfile.mutateAsync(Object.fromEntries(data.entries()));
      toast.success("Settings saved successfully.");
    } catch (error) {
      toast.error(error.message || "Unable to save settings.");
    }
  };

  const handleUpload = async (key, file) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const res = await uploadDoc.mutateAsync(file);
      setDocuments((prev) => ({ ...prev, [key]: res.url }));
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setUploadingKey("");
    }
  };

  return (
    <div className="max-w-[1080px]">
      <PageHeader title="Account Settings" description="Pharmacy profile, hours, delivery, payouts, and compliance." />
      <div className="flex gap-2 overflow-x-auto mb-6">
        {TABS.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`h-10 px-3 rounded-lg text-sm font-semibold whitespace-nowrap border ${tab === item ? "bg-brand-primary text-white border-brand-primary" : "bg-white"}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === "Pharmacy Profile" && (
        <form key={`profile-${profile?.id}`} onSubmit={saveProfile} className="bg-white rounded-[16px] border p-6 grid md:grid-cols-2 gap-4">
          <Input label="Pharmacy Name" name="business_name" defaultValue={profile?.business_name || ""} required />
          <Input label="Email" name="email" type="email" defaultValue={profile?.email || ""} />
          <Input label="Phone" name="phone" defaultValue={profile?.phone || ""} />
          <Input label="WhatsApp" name="whatsapp" defaultValue={profile?.whatsapp || ""} />
          <Input label="Address" name="address" defaultValue={profile?.address || ""} />
          <Input label="City" name="city" defaultValue={profile?.city || ""} />
          <Input label="Province" name="province" defaultValue={profile?.province || ""} />
          <Input label="Postal Code" name="postal_code" defaultValue={profile?.postal_code || ""} />
          <Input label="Latitude" name="latitude" defaultValue={profile?.latitude || ""} />
          <Input label="Longitude" name="longitude" defaultValue={profile?.longitude || ""} />
          <div className="md:col-span-2"><Button type="submit" isLoading={updateProfile.isPending}>Save profile</Button></div>
        </form>
      )}

      {tab === "Business Details" && (
        <form onSubmit={saveProfile} className="bg-white rounded-[16px] border p-6 grid md:grid-cols-2 gap-4">
          <Input label="Legal Business Name" name="legal_business_name" defaultValue={profile?.legal_business_name || profile?.business_name || ""} />
          <Input label="Owner Name" name="owner_name" defaultValue={profile?.owner_name || ""} />
          <Input label="Business Type" name="business_type" defaultValue={profile?.business_type || "Pharmacy"} />
          <Input label="Tax / NTN Number" name="ntn" defaultValue={profile?.ntn || ""} />
          <Input label="License Number" name="license_number" defaultValue={profile?.license_number || ""} />
          <Input label="License Expiry" name="license_expiry" type="date" defaultValue={profile?.license_expiry ? String(profile.license_expiry).slice(0, 10) : ""} />
          <div className="md:col-span-2"><Button type="submit">Save business details</Button></div>
        </form>
      )}

      {tab === "Operating Hours" && (
        <section className="bg-white rounded-[16px] border p-6 space-y-4">
          <Button type="button" variant="secondary" onClick={() => {
            const monday = effectiveHours.find((entry) => entry.day_of_week === 1);
            setHours(effectiveHours.map((entry) => entry.day_of_week === 0 ? entry : { ...entry, open_time: monday.open_time, close_time: monday.close_time, is_closed: monday.is_closed }));
          }}>Copy Monday to all days</Button>
          {effectiveHours.map((entry, index) => (
            <div key={entry.day_of_week} className="grid grid-cols-[140px,1fr,1fr,120px] gap-3 items-center">
              <div className="font-semibold">{entry.label}</div>
              <Input type="time" value={entry.open_time || ""} disabled={entry.is_closed} onChange={(e) => setHours(effectiveHours.map((item, itemIndex) => itemIndex === index ? { ...item, open_time: e.target.value } : item))} />
              <Input type="time" value={entry.close_time || ""} disabled={entry.is_closed} onChange={(e) => setHours(effectiveHours.map((item, itemIndex) => itemIndex === index ? { ...item, close_time: e.target.value } : item))} />
              <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={Boolean(entry.is_closed)} onChange={(e) => setHours(effectiveHours.map((item, itemIndex) => itemIndex === index ? { ...item, is_closed: e.target.checked } : item))} /> Closed</label>
            </div>
          ))}
          <Button type="button" onClick={() => updateOperatingHours.mutateAsync(effectiveHours.map(({ label, ...entry }) => entry)).then(() => toast.success("Settings saved successfully.")).catch((error) => toast.error(error.message))}>Save operating hours</Button>
        </section>
      )}

      {tab === "Delivery" && (
        <form
          className="bg-white rounded-[16px] border p-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            try {
              await updateAvailability.mutateAsync({
                is_open: data.get("availability") !== "closed",
                holiday_mode_enabled: data.get("availability") === "vacation",
                delivery_enabled: data.get("delivery_enabled") === "on",
                pickup_enabled: data.get("pickup_enabled") === "on",
                service_radius_km: Number(data.get("service_radius_km")) || 10,
                min_order_amount: Number(data.get("min_order_amount")) || 0,
                preparation_time_minutes: Number(data.get("preparation_time_minutes")) || 30,
                holiday_ends_at: data.get("holiday_ends_at") || null,
              });
              await updateServiceAreas.mutateAsync(
                (serviceAreasText ?? serviceAreas.map((area) => area.name).join("\n"))
                  .split("\n")
                  .map((name) => name.trim())
                  .filter(Boolean)
                  .map((name, index) => ({ name, sort_order: index }))
              );
              toast.success("Settings saved successfully.");
            } catch (error) {
              toast.error(error.message);
            }
          }}
        >
          <label className="text-sm font-semibold">Pharmacy availability
            <select name="availability" defaultValue={availability?.holiday_mode_enabled ? "vacation" : availability?.is_open === false ? "closed" : "open"} className="mt-1.5 w-full h-[46px] border rounded-lg px-3">
              <option value="open">Open</option>
              <option value="closed">Temporarily Closed</option>
              <option value="vacation">Vacation Mode</option>
            </select>
          </label>
          <Input name="holiday_ends_at" type="datetime-local" label="Scheduled reopening" defaultValue={availability?.holiday_ends_at ? new Date(availability.holiday_ends_at).toISOString().slice(0, 16) : ""} />
          <label className="flex gap-2 text-sm font-semibold"><input type="checkbox" name="delivery_enabled" defaultChecked={profile?.delivery_enabled !== false} /> Delivery enabled</label>
          <label className="flex gap-2 text-sm font-semibold"><input type="checkbox" name="pickup_enabled" defaultChecked={profile?.pickup_enabled} /> Pickup enabled</label>
          <Input name="service_radius_km" type="number" label="Delivery radius (km)" defaultValue={profile?.service_radius_km || 10} />
          <Input name="min_order_amount" type="number" label="Minimum order (PKR)" defaultValue={profile?.min_order_amount || 0} />
          <Input name="preparation_time_minutes" type="number" label="Preparation time (minutes)" defaultValue={profile?.preparation_time_minutes || 30} />
          <label className="text-sm font-semibold">Service areas (one per line)
            <textarea className="mt-1.5 w-full min-h-[100px] border rounded-lg p-3" value={serviceAreasText ?? serviceAreas.map((area) => area.name).join("\n")} onChange={(e) => setServiceAreasText(e.target.value)} />
          </label>
          <Button type="submit">Save delivery settings</Button>
        </form>
      )}

      {tab === "Bank & Payout" && (
        <form onSubmit={saveProfile} className="bg-white rounded-[16px] border p-6 grid md:grid-cols-2 gap-4">
          <Input label="Account Title" name="bank_account_title" defaultValue={profile?.bank_account_title || ""} />
          <Input label="Bank" name="bank_name" defaultValue={profile?.bank_name || ""} />
          <Input label="IBAN" name="iban" defaultValue={profile?.iban_masked || profile?.iban || ""} />
          <Input label="Account Number" name="bank_account_number" defaultValue={profile?.bank_account_number_masked || profile?.bank_account_number || ""} />
          <Input label="Payout Schedule" name="payout_schedule" defaultValue={profile?.payout_schedule || "weekly"} />
          <div className="md:col-span-2 text-sm text-neutral-500">Sensitive numbers are masked after saving.</div>
          <div className="md:col-span-2"><Button type="submit">Save payout details</Button></div>
        </form>
      )}

      {tab === "Compliance" && (
        <div className="bg-white rounded-[16px] border p-6 grid md:grid-cols-2 gap-4">
          {[
            ["trade_license_url", "Pharmacy License", "trade_license"],
            ["pharmacist_certificate_url", "Pharmacist License", "pharmacist_certificate"],
            ["tax_certificate_url", "Tax Certificate", "tax_certificate"],
            ["bank_document_url", "Owner CNIC / identity", "bank_details"],
          ].map(([key, label, type]) => (
            <div key={key} className="rounded-[14px] border p-4">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">{label}</p>
                <span className="text-xs uppercase">{(profile?.documents || []).find((doc) => doc.type === type)?.status || "NOT_SUBMITTED"}</span>
              </div>
              {effectiveDocuments[key] ? (
                <a
                  className="text-sm font-semibold text-brand-primary hover:underline inline-flex items-center gap-1"
                  href={effectiveDocuments[key].startsWith("http") ? effectiveDocuments[key] : effectiveDocuments[key].startsWith("/") ? effectiveDocuments[key] : `/${effectiveDocuments[key]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View file ↗
                </a>
              ) : null}
              <label className="mt-3 block text-sm font-semibold text-brand-primary cursor-pointer">
                {uploadingKey === key ? "Uploading..." : "Upload"}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleUpload(key, e.target.files?.[0])} />
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === "Notifications" && (
        <form
          className="bg-white rounded-[16px] border p-6 space-y-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const prefs = {
              in_app: event.target.in_app.checked,
              email: event.target.email.checked,
              orders: event.target.orders.checked,
              prescriptions: event.target.prescriptions.checked,
              stock: event.target.stock.checked,
              payouts: event.target.payouts.checked,
            };
            try {
              await updateProfile.mutateAsync({ notification_preferences: prefs });
              toast.success("Settings saved successfully.");
            } catch (error) {
              toast.error(error.message);
            }
          }}
        >
          {[["in_app", "In App"], ["email", "Email"], ["orders", "New Order"], ["prescriptions", "New Prescription"], ["stock", "Low Stock / Expiry"], ["payouts", "Payout Processed"]].map(([name, label]) => (
            <label key={name} className="flex gap-2 text-sm font-semibold">
              <input type="checkbox" name={name} defaultChecked={profile?.notification_preferences?.[name] !== false} /> {label}
            </label>
          ))}
          <p className="text-xs text-neutral-500">SMS, WhatsApp, and push channels are shown only when the Medzoos platform enables them.</p>
          <Button type="submit">Save notification preferences</Button>
        </form>
      )}

      {tab === "Security" && (
        <div className="bg-white rounded-[16px] border p-6">
          <p className="text-sm text-neutral-600 mb-4">Password, sessions, and login activity are managed on the security page.</p>
          <Link href={partnerRoutes.vendor.security}><Button>Open account security</Button></Link>
        </div>
      )}
    </div>
  );
}
