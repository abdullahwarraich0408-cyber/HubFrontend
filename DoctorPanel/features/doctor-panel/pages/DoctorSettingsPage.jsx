"use client";

import { useRef, useState } from "react";
import {
  User,
  Stethoscope,
  Bell,
  Lock,
  CheckCircle2,
  Camera,
  Eye,
  EyeOff,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Check,
  X,
  AlertCircle
} from "lucide-react";
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

export function resolvePhotoUrl(photo) {
  const value = photo != null ? String(photo).trim() : "";
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }
  const cleanPath = value.startsWith("/") ? value : `/${value}`;
  const origin =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    "http://127.0.0.1:5000";
  return `${String(origin).replace(/\/$/, "")}${cleanPath}`;
}

export function DoctorSettingsPage() {
  const { profile, initials } = useDoctorProfile();
  const updateProfileMutation = useUpdateDoctorPortalProfile();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");

  const isMinLength = newPasswordVal.length >= 8;
  const hasNumber = /\d/.test(newPasswordVal);
  const hasLetter = /[a-zA-Z]/.test(newPasswordVal);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(newPasswordVal);

  const criteriaPassed = [isMinLength, hasNumber, hasLetter, hasSpecial].filter(Boolean).length;
  const isStrong = isMinLength && hasNumber && hasLetter && hasSpecial;

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const saveProfile = async (updates) => {
    try {
      await updateProfileMutation.mutateAsync({ ...profile, ...updates });
      showSaved();
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to save changes");
      throw err;
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB.");
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewPhoto(localPreviewUrl);
    setUploadingPhoto(true);

    try {
      const uploaded = await uploadApi.uploadImage(file);
      const url =
        uploaded?.url ||
        uploaded?.data?.url ||
        (typeof uploaded === "string" ? uploaded : null);
      if (!url) throw new Error("Upload did not return an image URL");

      await updateProfileMutation.mutateAsync({
        ...profile,
        photo: url,
        photo_url: url,
      });
      showSaved();
      toast.success("Profile photo updated for patients");
    } catch (err) {
      setPreviewPhoto(null);
      toast.error(err.message || "Could not upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const bio = String(data.get("bio") || "").trim();

    if (!name || name.length < 2) {
      toast.error("Full Name must be at least 2 characters long.");
      return;
    }
    if (name.length > 50) {
      toast.error("Full Name cannot exceed 50 characters.");
      return;
    }
    if (!/^[a-zA-Z\s\.\-']+$/.test(name)) {
      toast.error("Full Name can only contain letters, spaces, dots, hyphens, and apostrophes.");
      return;
    }

    saveProfile({
      name,
      phone,
      bio,
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
    const newPass = newPasswordVal.trim();
    const confirm = confirmPasswordVal.trim();

    if (!current || !newPass || !confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPass !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (!isMinLength) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (!hasNumber) {
      toast.error("Password must contain at least one number (0-9).");
      return;
    }
    if (!hasLetter) {
      toast.error("Password must contain at least one letter.");
      return;
    }
    if (!hasSpecial) {
      toast.error("Password must contain at least one special character (!@#$%...).");
      return;
    }

    try {
      await doctorPortalApi.updatePassword(current, newPass);
      e.target.reset();
      setNewPasswordVal("");
      setConfirmPasswordVal("");
      showSaved();
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update password");
    }
  };

  const photoUrl = previewPhoto || resolvePhotoUrl(profile.photo || profile.photo_url);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Account & Professional Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your physician profile details, clinical preferences, and security.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-in fade-in duration-150">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Changes saved successfully!</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="lg:w-56 shrink-0">
          <nav className="bg-white rounded-xl border border-slate-200/80 p-1.5 flex lg:flex-col gap-1 overflow-x-auto shadow-2xs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150",
                    isActive
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  )}
                >
                  <Icon size={16} className={isActive ? "text-teal-400" : "text-slate-400"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Form Container */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5 md:p-6 text-xs">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-5">
              <SectionHeader title="Profile Information" description="Update your personal information visible to patients." />

              <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="relative group w-20 h-20 rounded-full overflow-hidden bg-teal-50 border-2 border-teal-200/80 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0 shadow-2xs"
                >
                  {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                  <span className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold">
                    <Camera size={18} className="mb-0.5" />
                    <span>Change</span>
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-slate-900 truncate max-w-[280px] sm:max-w-md">{profile.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[280px] sm:max-w-md">{profile.specialty}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="mt-1 text-xs font-semibold text-teal-700 hover:underline disabled:opacity-60"
                  >
                    {uploadingPhoto ? "Uploading..." : "Upload new photo"}
                  </button>
                  <p className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG or WebP up to 8 MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">Full Name</label>
                  <span className="text-[11px] text-slate-400 font-mono">Max 50 chars</span>
                </div>
                <input
                  type="text"
                  name="name"
                  defaultValue={profile.name}
                  required
                  maxLength={50}
                  placeholder="Dr. Full Name"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  defaultValue={profile.email}
                  disabled
                  className="w-full h-9 px-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-xs cursor-not-allowed opacity-75"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={profile.phone}
                  required
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physician Bio</label>
                <textarea
                  name="bio"
                  defaultValue={profile.bio}
                  rows={3}
                  placeholder="Share a short bio for patient bookings..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors disabled:opacity-60"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PROFESSIONAL */}
          {activeTab === "professional" && (
            <form onSubmit={handleProfessionalSave} className="space-y-5">
              <SectionHeader title="Professional Details" description="Manage your medical specialty, hospital affiliation, and consultation fees." />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medical Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  defaultValue={profile.specialty}
                  required
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Hospital / Clinic</label>
                <input
                  type="text"
                  name="hospital"
                  defaultValue={profile.hospital}
                  required
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    defaultValue={profile.experience}
                    required
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Default Fee (PKR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                      PKR
                    </span>
                    <input
                      type="number"
                      name="consultationFee"
                      defaultValue={profile.consultationFee}
                      required
                      className="w-full h-9 pl-12 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Spoken Languages</label>
                <input
                  type="text"
                  name="languages"
                  defaultValue={profile.languages}
                  placeholder="e.g. English, Urdu, Punjabi"
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors disabled:opacity-60"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Professional Details"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-5">
              <SectionHeader title="Notification Preferences" description="Choose how and when you receive appointment updates and platform alerts." />

              <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50">
                <NotificationRow
                  title="Email Notifications"
                  description="Receive appointment confirmations and schedule updates via email"
                  checked={profile.notifications?.email}
                  onChange={() => handleNotificationToggle("email")}
                />
                <NotificationRow
                  title="SMS Alerts"
                  description="Get text message alerts for urgent appointment status changes"
                  checked={profile.notifications?.sms}
                  onChange={() => handleNotificationToggle("sms")}
                />
                <NotificationRow
                  title="Appointment Reminders"
                  description="Remind me 30 minutes before each online consultation starts"
                  checked={profile.notifications?.reminders}
                  onChange={() => handleNotificationToggle("reminders")}
                />
                <NotificationRow
                  title="Platform Updates"
                  description="Receive news and system feature announcements from Medzoos"
                  checked={profile.notifications?.marketing}
                  onChange={() => handleNotificationToggle("marketing")}
                />
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <SectionHeader title="Change Password" description="Update your password to keep your physician account secure." />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    name="current"
                    required
                    className="w-full h-9 pl-3 pr-9 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    name="new"
                    value={newPasswordVal}
                    onChange={(e) => setNewPasswordVal(e.target.value)}
                    required
                    placeholder="Enter strong new password"
                    className="w-full h-9 pl-3 pr-9 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Real-time Strength Meter */}
                {newPasswordVal.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Password Strength:</span>
                      <span
                        className={cn(
                          "font-bold",
                          criteriaPassed <= 1 && "text-rose-600",
                          criteriaPassed === 2 && "text-amber-600",
                          criteriaPassed === 3 && "text-blue-600",
                          criteriaPassed === 4 && "text-emerald-600"
                        )}
                      >
                        {criteriaPassed <= 1 && "Weak"}
                        {criteriaPassed === 2 && "Fair"}
                        {criteriaPassed === 3 && "Good"}
                        {criteriaPassed === 4 && "Strong"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          criteriaPassed <= 1 && "w-1/4 bg-rose-500",
                          criteriaPassed === 2 && "w-2/4 bg-amber-500",
                          criteriaPassed === 3 && "w-3/4 bg-blue-500",
                          criteriaPassed === 4 && "w-full bg-emerald-500"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirm"
                    value={confirmPasswordVal}
                    onChange={(e) => setConfirmPasswordVal(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className="w-full h-9 pl-3 pr-9 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Interactive Checklist */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <p className="text-[11px] font-bold text-slate-700">Password Requirements:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {isMinLength ? (
                      <Check size={14} className="text-emerald-600 font-bold shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-[9px] text-slate-400" />
                    )}
                    <span className={isMinLength ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasNumber ? (
                      <Check size={14} className="text-emerald-600 font-bold shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-[9px] text-slate-400" />
                    )}
                    <span className={hasNumber ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      At least 1 number (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasLetter ? (
                      <Check size={14} className="text-emerald-600 font-bold shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-[9px] text-slate-400" />
                    )}
                    <span className={hasLetter ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      At least 1 letter (a-z, A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasSpecial ? (
                      <Check size={14} className="text-emerald-600 font-bold shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-[9px] text-slate-400" />
                    )}
                    <span className={hasSpecial ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      1 special character (!@#$...)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={!isStrong || newPasswordVal !== confirmPasswordVal}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="pb-3 border-b border-slate-100">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </div>
  );
}

function NotificationRow({ title, description, checked, onChange }) {
  return (
    <div className="p-4 flex items-center justify-between gap-4 hover:bg-white transition-colors">
      <div>
        <p className="font-bold text-slate-900 text-xs">{title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative w-10 h-5 rounded-full transition-colors shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/50",
          checked ? "bg-teal-700" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-2xs transition-transform duration-150",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

