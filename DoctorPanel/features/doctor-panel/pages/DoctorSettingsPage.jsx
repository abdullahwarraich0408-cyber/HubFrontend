"use client";

import { useState } from "react";
import { User, Stethoscope, Bell, Lock, CheckCircle } from "@phosphor-icons/react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { cn } from "@/utils/cn";
import { useDoctorProfile } from "../hooks/useDoctorProfile";
import { useUpdateDoctorPortalProfile } from "@/lib/hooks/usePartnerPortal";
import { doctorPortalApi } from "@/lib/api/index";
import { toast } from "sonner";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "professional", label: "Professional", icon: Stethoscope },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
];

export function DoctorSettingsPage() {
  const { profile, initials } = useDoctorProfile();
  const updateProfileMutation = useUpdateDoctorPortalProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

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
                <div className="w-16 h-16 rounded-full bg-brand-light text-brand-primary flex items-center justify-center text-[22px] font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-ink-headline">{profile.name}</p>
                  <p className="text-[13px] text-neutral-500">{profile.specialty}</p>
                </div>
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
                description="Receive news and platform updates from PharmaHub"
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
