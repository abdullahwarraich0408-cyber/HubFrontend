"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FloppyDisk } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAdminContent, useUpdateSiteSettings } from "@/lib/hooks/useApi";

const FIELDS = [
  { key: "tagline", label: "App tagline" },
  { key: "landing_eyebrow", label: "Website landing eyebrow" },
  { key: "landing_headline", label: "Website landing headline" },
  { key: "landing_subhead", label: "Website landing subhead" },
  { key: "landing_cta_primary", label: "Landing primary button" },
  { key: "landing_cta_secondary", label: "Landing secondary button" },
  { key: "contact_phone", label: "Phone" },
  { key: "contact_email", label: "Email" },
  { key: "contact_address", label: "Address" },
  { key: "play_store_url", label: "Play Store URL" },
  { key: "app_store_url", label: "App Store URL" },
];

export default function SiteDetailsPage() {
  const { data, isLoading } = useAdminContent();
  const updateSettings = useUpdateSiteSettings();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (data?.settings) setForm(data.settings);
  }, [data]);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      await updateSettings.mutateAsync(form);
      toast.success("Site details saved");
    } catch (err) {
      toast.error(err.message || "Failed to save");
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[720px]">
      <Link href="/admin/content" className="inline-flex items-center gap-1 text-[13px] text-[#17618E] font-semibold mb-4">
        <ArrowLeft size={14} /> Content hub
      </Link>
      <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">
        Site details
      </h1>
      <p className="text-[14px] text-neutral-500 mt-1 mb-6">
        Contact details, landing copy, and store links used on the website and user app.
      </p>

      {isLoading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-[16px] border border-neutral-200 p-6 flex flex-col gap-4"
        >
          {FIELDS.map((field) => (
            <label key={field.key} className="text-[12px] font-semibold text-ink-headline">
              {field.label}
              {field.key === "landing_subhead" || field.key === "contact_address" ? (
                <textarea
                  className="mt-1 w-full min-h-[72px] px-3 py-2 rounded-lg border border-neutral-200 text-[13px] font-medium"
                  value={form[field.key] || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
              ) : (
                <input
                  className="mt-1 h-10 w-full px-3 rounded-lg border border-neutral-200 text-[13px] font-medium"
                  value={form[field.key] || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
              )}
            </label>
          ))}
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#17618E] text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <FloppyDisk size={16} />
            {updateSettings.isPending ? "Saving..." : "Save site details"}
          </button>
        </form>
      )}
    </div>
  );
}
