"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { useVendorProfile, useUpdateVendorProfile, useUploadDocument } from "@/lib/hooks/useApi";
import { toast } from "sonner";

export default function VendorSettingsPage() {
  const { data: profile } = useVendorProfile();
  const updateProfile = useUpdateVendorProfile();
  const uploadDoc = useUploadDocument();
  const [saved, setSaved] = useState(false);

  const [tradeLicenseUrl, setTradeLicenseUrl] = useState("");
  const [pharmacistCertificateUrl, setPharmacistCertificateUrl] = useState("");

  const [uploadingTradeLicense, setUploadingTradeLicense] = useState(false);
  const [uploadingPharmacistCert, setUploadingPharmacistCert] = useState(false);

  useEffect(() => {
    if (profile) {
      setTradeLicenseUrl(profile.trade_license_url || "");
      setPharmacistCertificateUrl(profile.pharmacist_certificate_url || "");
    }
  }, [profile]);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUploadTradeLicense = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingTradeLicense(true);
    try {
      const res = await uploadDoc.mutateAsync(file);
      setTradeLicenseUrl(res.url);
      toast.success("Trade license uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload trade license");
    } finally {
      setUploadingTradeLicense(false);
    }
  };

  const handleUploadPharmacistCert = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPharmacistCert(true);
    try {
      const res = await uploadDoc.mutateAsync(file);
      setPharmacistCertificateUrl(res.url);
      toast.success("Pharmacist certificate uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload pharmacist certificate");
    } finally {
      setUploadingPharmacistCert(false);
    }
  };

  const handleSubmit = async (e) => {
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
        license_number: data.get("license_number"),
        trade_license_url: tradeLicenseUrl,
        pharmacist_certificate_url: pharmacistCertificateUrl,
      };

      if (password) {
        payload.password = password;
      }

      await updateProfile.mutateAsync(payload);
      showSaved();
      
      // Clear password fields
      if (e.target.password) e.target.password.value = "";
      if (e.target.confirm_password) e.target.confirm_password.value = "";
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[720px]">
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Account Settings</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Manage your vendor profile for this pharmacy only.</p>
      </div>

      {saved && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-status-success/10 border border-status-success/30 rounded-[12px] text-status-success text-[14px] font-semibold">
          <CheckCircle size={18} weight="fill" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-[16px] border border-neutral-200 shadow-sm p-6 md:p-8 space-y-6">
        <Input label="Business Name" name="business_name" defaultValue={profile?.business_name || ""} required />
        <Input label="Email" name="email" type="email" defaultValue={profile?.email || ""} disabled />
        <Input label="License Number" name="license_number" defaultValue={profile?.license_number || ""} required />
        <Input label="Account Status" name="status" defaultValue={profile?.status || "approved"} disabled />

        {/* Verification Documents */}
        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <h3 className="text-[16px] font-bold text-ink-headline">Verification Documents</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trade License */}
            <div className="space-y-2">
              <label className="block text-[14px] font-semibold text-ink-headline">Trade License</label>
              {tradeLicenseUrl ? (
                <div className="p-3 bg-neutral-50 rounded-[12px] border border-neutral-200 flex items-center justify-between">
                  <a 
                    href={tradeLicenseUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[13px] text-blue-600 hover:underline truncate max-w-[200px]"
                  >
                    View Current Trade License
                  </a>
                  <button 
                    type="button" 
                    onClick={() => setTradeLicenseUrl("")} 
                    className="text-[12px] text-red-500 hover:text-red-700 font-semibold"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-neutral-300 hover:border-neutral-400 transition-colors rounded-[12px] p-4 flex flex-col items-center justify-center bg-neutral-50/50">
                  <input 
                    type="file" 
                    accept=".pdf,image/*" 
                    onChange={handleUploadTradeLicense}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    disabled={uploadingTradeLicense}
                  />
                  <div className="text-center space-y-1">
                    <p className="text-[13px] font-semibold text-neutral-600">
                      {uploadingTradeLicense ? "Uploading..." : "Upload Trade License"}
                    </p>
                    <p className="text-[11px] text-neutral-400">PDF, JPG, PNG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pharmacist Certificate */}
            <div className="space-y-2">
              <label className="block text-[14px] font-semibold text-ink-headline">Pharmacist Certificate</label>
              {pharmacistCertificateUrl ? (
                <div className="p-3 bg-neutral-50 rounded-[12px] border border-neutral-200 flex items-center justify-between">
                  <a 
                    href={pharmacistCertificateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[13px] text-blue-600 hover:underline truncate max-w-[200px]"
                  >
                    View Current Certificate
                  </a>
                  <button 
                    type="button" 
                    onClick={() => setPharmacistCertificateUrl("")} 
                    className="text-[12px] text-red-500 hover:text-red-700 font-semibold"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-neutral-300 hover:border-neutral-400 transition-colors rounded-[12px] p-4 flex flex-col items-center justify-center bg-neutral-50/50">
                  <input 
                    type="file" 
                    accept=".pdf,image/*" 
                    onChange={handleUploadPharmacistCert}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    disabled={uploadingPharmacistCert}
                  />
                  <div className="text-center space-y-1">
                    <p className="text-[13px] font-semibold text-neutral-600">
                      {uploadingPharmacistCert ? "Uploading..." : "Upload Certificate"}
                    </p>
                    <p className="text-[11px] text-neutral-400">PDF, JPG, PNG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security / Change Password */}
        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <div>
            <h3 className="text-[16px] font-bold text-ink-headline">Security</h3>
            <p className="text-[12px] text-neutral-500 mt-0.5">Change your account password. Leave blank to keep current password.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="New Password" 
              name="password" 
              type="password" 
              placeholder="Min. 8 characters"
            />
            <Input 
              label="Confirm New Password" 
              name="confirm_password" 
              type="password" 
              placeholder="Confirm password"
            />
          </div>
        </div>

        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
