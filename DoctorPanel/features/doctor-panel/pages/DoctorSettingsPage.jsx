"use client";

import { useRef, useState } from "react";
import { User, Stethoscope, Bell, Lock, CheckCircle, Camera } from "@phosphor-icons/react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { cn } from "@/utils/cn";
import { useDoctorProfile } from "../hooks/useDoctorProfile";
import { useUpdateDoctorPortalProfile } from "@/lib/hooks/usePartnerPortal";
import { doctorPortalApi, uploadApi } from "@/lib/api/index";
import { toast } from "sonner";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "professional", label: "Professional", icon: Stethoscope },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
];

function resolvePhotoUrl(photo) {
  const value = photo != null ? String(photo).trim() : "";
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return value;
  }
  if (value.startsWith("/")) {
    const origin =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.BACKEND_URL ||
      "http://127.0.0.1:5000";
    return `${String(origin).replace(/\/$/, "")}${value}`;
  }
  return value;
}

export function DoctorSettingsPage() {
  const { profile, initials } = useDoctorProfile();
  const updateProfileMutation = useUpdateDoctorPortalProfile();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const saveProfile = async (updates) => {
    try {
      await updateProfileMutation.mutateAsync({ ...profile, ...updates });
      showSaved();
    } catch (err) {
      toast.error(err.message || "Failed to save changes");
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a JPG or PNG image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const uploaded = await uploadApi.uploadImage(file);
      const url = uploaded?.url || uploaded?.data?.url;
      if (!url) throw new Error("Upload did not return an image URL");
      await saveProfile({ photo: url, photo_url: url });
      toast.success("Profile photo updated for patients");
    } catch (err) {
      toast.error(err.message || "Could not upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    saveProfile({
      name: data.get("name"),
      phone: data.get("phone"),
      bio: data.get("bio"),
    });
  };

  const handleProfessionalSave = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    saveProfile({
      specialty: data.get("specialty"),
      hospital: data.get("hospital"),
      experience: data.get("experience"),
      consultationFee: data.get("consultationFee"),
      languages: data.get("languages"),
    });
  };

  const handleNotificationToggle = (key) => {
    const next = {
      ...profile.notifications,
      [key]: !profile.notifications[key],
    };
    saveProfile({ notifications: next });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const current = data.get("current");
    const newPass = data.get("new");
    const confirm = data.get("confirm");

    if (!current || !newPass || !confirm) return;
    if (newPass !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPass.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      await doctorPortalApi.updatePassword(current, newPass);
      e.target.reset();
      showSaved();
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    }
  };

  const photoUrl = resolvePhotoUrl(profile.photo);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[960px]">
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Account Settings</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Manage your doctor profile and preferences.</p>
      </div>

      {saved && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-status-success/10 border border-status-success/30 rounded-[12px] text-status-success text-[14px] font-semibold">
          <CheckCircle size={18} weight="fill" />
          Changes saved successfully!
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[220px] shrink-0">
          <nav className="bg-white rounded-[16px] border border-neutral-200 p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-3 rounded-[10px] text-[14px] font-semibold whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "bg-brand-light text-brand-primary"
                    : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                <tab.icon size={18} weight={activeTab === tab.id ? "fill" : "regular"} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white rounded-[16px] border border-neutral-200 shadow-sm p-6 md:p-8">
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <SectionHeader title="Profile Information" description="Update your personal details visible to patients." />

              <div className="flex items-center gap-4 pb-6 border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="relative group w-20 h-20 rounded-full overflow-hidden bg-brand-light text-brand-primary flex items-center justify-center text-[22px] font-bold shrink-0"
                >
                  {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={22} className="text-white" weight="fill" />
                  </span>
                </button>
                <div className="min-w-0">
                  <p className="text-[16px] font-bold text-ink-headline">{profile.name}</p>
                  <p className="text-[13px] text-neutral-500">{profile.specialty}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="mt-2 text-[13px] font-semibold text-brand-primary hover:underline disabled:opacity-60"
                  >
                    {uploadingPhoto ? "Uploading..." : "Change profile photo"}
                  </button>
                  <p className="text-[12px] text-neutral-400 mt-1">
                    Shown on patient website and app
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              <Input label="Full Name" name="name" defaultValue={profile.name} required />
              <Input label="Email Address" name="email" type="email" defaultValue={profile.email} disabled />
              <Input label="Phone Number" name="phone" defaultValue={profile.phone} required />
              <div>
                <label className="text-[13px] font-semibold text-ink-900 mb-1.5 block">Bio</label>
                <textarea
                  name="bio"
                  defaultValue={profile.bio}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-100 border-[1.5px] border-neutral-300 rounded-md text-[14px] outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 resize-none"
                />
              </div>
              <Button type="submit">Save Profile</Button>
            </form>
          )}

          {activeTab === "professional" && (
            <form onSubmit={handleProfessionalSave} className="space-y-6">
              <SectionHeader title="Professional Details" description="Manage your specialty, hospital, and consultation fees." />
              <Input label="Specialty" name="specialty" defaultValue={profile.specialty} required />
              <Input label="Hospital / Clinic" name="hospital" defaultValue={profile.hospital} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Years of Experience" name="experience" type="number" defaultValue={profile.experience} required />
                <Input label="Consultation Fee (PKR)" name="consultationFee" type="number" defaultValue={profile.consultationFee} required />
              </div>
              <Input label="Languages" name="languages" defaultValue={profile.languages} placeholder="English, Urdu" />
              <Button type="submit">Save Professional Info</Button>
            </form>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <SectionHeader title="Notification Preferences" description="Choose how you want to receive updates." />
              <NotificationToggle
                label="Email Notifications"
                description="Receive appointment confirmations and updates via email"
                checked={profile.notifications.email}
                onChange={() => handleNotificationToggle("email")}
              />
              <NotificationToggle
                label="SMS Alerts"
                description="Get text messages for urgent appointment changes"
                checked={profile.notifications.sms}
                onChange={() => handleNotificationToggle("sms")}
              />
              <NotificationToggle
                label="Appointment Reminders"
                description="Remind me 30 minutes before each consultation"
                checked={profile.notifications.reminders}
                onChange={() => handleNotificationToggle("reminders")}
              />
              <NotificationToggle
                label="Marketing Updates"
                description="Receive news and platform updates from Medzoos"
                checked={profile.notifications.marketing}
                onChange={() => handleNotificationToggle("marketing")}
              />
            </div>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <SectionHeader title="Change Password" description="Update your password to keep your account secure." />
              <Input label="Current Password" name="current" type="password" required />
              <Input label="New Password" name="new" type="password" required />
              <Input label="Confirm New Password" name="confirm" type="password" required />
              <Button type="submit">Update Password</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-2">
      <h2 className="text-[20px] font-heading font-bold text-ink-headline">{title}</h2>
      <p className="text-[13px] text-neutral-500 mt-1">{description}</p>
    </div>
  );
}

function NotificationToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-[12px] border border-neutral-200 hover:bg-neutral-50 transition-colors">
      <div>
        <p className="text-[14px] font-bold text-ink-headline">{label}</p>
        <p className="text-[13px] text-neutral-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors shrink-0",
          checked ? "bg-brand-primary" : "bg-neutral-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}
