"use client";

import { useState, useEffect } from "react";
import {
  useUserProfile,
  useUpdateProfile,
  useChangePassword,
  useAdminSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from "@/lib/hooks/useApi";
import {
  User,
  EnvelopeSimple,
  Phone,
  MapPin,
  LockKey,
  Eye,
  EyeSlash,
  Bell,
  ShieldCheck,
  CheckCircle,
  CircleNotch,
  Sparkle,
  Info,
  ArrowsClockwise,
  FloppyDisk,
  Key,
  Buildings,
  Desktop,
  DeviceMobile,
  Trash,
  SignOut,
  Clock,
  Globe,
  Broadcast,
} from "@phosphor-icons/react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { data: profile, isLoading, refetch } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const {
    data: sessions = [],
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useAdminSessions();
  const revokeSessionMutation = useRevokeSession();
  const revokeOtherSessionsMutation = useRevokeOtherSessions();

  // Profile Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressPostal, setAddressPostal] = useState("");

  // Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState({
    vendorAlerts: true,
    dailySummary: true,
    securityAlerts: true,
    prescriptionAlerts: true,
  });

  // Password Management State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Sync state when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");

      // Handle addresses (object, string, or array)
      if (profile.addresses) {
        if (typeof profile.addresses === "object" && !Array.isArray(profile.addresses)) {
          setAddressStreet(profile.addresses.street || profile.addresses.line1 || "");
          setAddressCity(profile.addresses.city || "");
          setAddressPostal(profile.addresses.postal_code || profile.addresses.postalCode || "");
        } else if (Array.isArray(profile.addresses) && profile.addresses.length > 0) {
          const primary = profile.addresses[0];
          setAddressStreet(primary.street || primary.line1 || "");
          setAddressCity(primary.city || "");
          setAddressPostal(primary.postal_code || primary.postalCode || "");
        } else if (typeof profile.addresses === "string") {
          setAddressStreet(profile.addresses);
        }
      }

      if (profile.notification_preferences) {
        setNotificationPrefs({
          vendorAlerts: profile.notification_preferences.vendorAlerts ?? true,
          dailySummary: profile.notification_preferences.dailySummary ?? true,
          securityAlerts: profile.notification_preferences.securityAlerts ?? true,
          prescriptionAlerts: profile.notification_preferences.prescriptionAlerts ?? true,
        });
      }
    }
  }, [profile]);

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        addresses: {
          street: addressStreet.trim(),
          city: addressCity.trim(),
          postal_code: addressPostal.trim(),
        },
        notification_preferences: notificationPrefs,
      });

      toast.success("Admin profile updated successfully!");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update admin profile";
      toast.error(errorMsg);
    }
  };

  // Handle Notification Preferences Toggle
  const handleTogglePref = (key) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveNotifications = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        notification_preferences: notificationPrefs,
      });
      toast.success("Notification preferences updated!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update notification preferences");
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success("Admin password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update password";
      toast.error(errorMsg);
    }
  };

  // Handle Session Revocation
  const handleRevokeSession = async (sessionId) => {
    try {
      await revokeSessionMutation.mutateAsync(sessionId);
      toast.success("Login session terminated successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to terminate session");
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    if (
      !window.confirm(
        "Are you sure you want to log out all other active sessions across other devices?"
      )
    ) {
      return;
    }

    try {
      await revokeOtherSessionsMutation.mutateAsync();
      toast.success("All other sessions terminated successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to revoke other sessions");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-lg w-1/3 mb-2" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-8" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-4xl pb-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[26px] font-heading font-extrabold text-[#082B3F] tracking-tight">
              System Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0FA7E3]/10 text-[#0FA7E3] border border-[#0FA7E3]/20">
              Master Admin
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Configure administrative profile credentials, security protocols, and platform alert preferences.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all self-start sm:self-auto"
        >
          <ArrowsClockwise size={15} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Profile & Contact Information Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
        <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#17618E] flex items-center justify-center font-bold">
              <User size={22} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#082B3F]">Admin Profile & Contact</h2>
              <p className="text-xs text-slate-400">Update executive identity and contact credentials</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
            <ShieldCheck size={14} weight="bold" />
            Verified Admin
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Super Admin"
                  required
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#17618E]/20 focus:border-[#17618E] transition-all"
                />
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@medzoos.com"
                  required
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#17618E]/20 focus:border-[#17618E] transition-all"
                />
                <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">This email is used for admin login and system alerts.</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#17618E]/20 focus:border-[#17618E] transition-all"
                />
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                City / Region
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                  placeholder="e.g. Islamabad"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#17618E]/20 focus:border-[#17618E] transition-all"
                />
                <Buildings size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Street Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Office / Physical Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={addressStreet}
                  onChange={(e) => setAddressStreet(e.target.value)}
                  placeholder="e.g. Medzoos HQ, Suite 402, Blue Area"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#17618E]/20 focus:border-[#17618E] transition-all"
                />
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info size={15} /> All profile changes take effect immediately across all sessions.
          </span>
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#17618E] hover:bg-[#082B3F] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
          >
            {updateProfileMutation.isPending ? (
              <>
                <CircleNotch size={15} className="animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <FloppyDisk size={16} weight="bold" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security & Change Password Card */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
        <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <LockKey size={22} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#082B3F]">Security & Authentication</h2>
              <p className="text-xs text-slate-400">Change your administrative login password</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            256-bit Encrypted
          </span>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#17618E]/20 focus:border-[#17618E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showCurrentPass ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#17618E]/20 focus:border-[#17618E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showNewPass ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#17618E]/20 focus:border-[#17618E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showConfirmPass ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Key size={15} /> Must contain at least 8 characters.
          </span>
          <button
            type="submit"
            disabled={changePasswordMutation.isPending || !currentPassword || !newPassword}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
          >
            {changePasswordMutation.isPending ? (
              <>
                <CircleNotch size={15} className="animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <Key size={16} weight="bold" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Active Login Sessions & Security Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
        <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Broadcast size={22} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#082B3F]">Active Login Sessions & Devices</h2>
              <p className="text-xs text-slate-400">
                Manage connected devices and active authorization tokens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => refetchSessions()}
              disabled={isLoadingSessions}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-all"
              title="Refresh sessions"
            >
              <ArrowsClockwise size={16} className={isLoadingSessions ? "animate-spin" : ""} />
            </button>

            {sessions.length > 1 && (
              <button
                type="button"
                onClick={handleRevokeAllOtherSessions}
                disabled={revokeOtherSessionsMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all disabled:opacity-50"
              >
                {revokeOtherSessionsMutation.isPending ? (
                  <CircleNotch size={14} className="animate-spin" />
                ) : (
                  <SignOut size={14} />
                )}
                <span>Log Out Other Devices</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-6 divide-y divide-slate-100">
          {isLoadingSessions ? (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
              <CircleNotch size={24} className="animate-spin text-[#17618E]" />
              <p className="text-xs font-medium">Loading active sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No other active device sessions found.
            </div>
          ) : (
            sessions.map((sess) => {
              const isMobile = sess.platform === "ios" || sess.platform === "android";
              const formattedDate = sess.createdAt
                ? new Date(sess.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Active now";

              return (
                <div
                  key={sess.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        sess.isCurrent
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isMobile ? (
                        <DeviceMobile size={20} weight="duotone" />
                      ) : (
                        <Desktop size={20} weight="duotone" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-800">
                          {sess.deviceId && sess.deviceId !== "unknown"
                            ? sess.deviceId.length > 40
                              ? sess.deviceId.slice(0, 40) + "..."
                              : sess.deviceId
                            : isMobile
                            ? "Mobile Application"
                            : "Web Management Console"}
                        </p>

                        {sess.isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle size={12} weight="bold" />
                            This Browser
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={13} /> Logged in: {formattedDate}
                        </span>
                        <span className="capitalize">
                          Platform: {sess.platform || "web"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(sess.id)}
                      disabled={revokeSessionMutation.isPending}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all text-xs font-bold flex items-center gap-1.5"
                      title="Terminate session"
                    >
                      {revokeSessionMutation.isPending &&
                      revokeSessionMutation.variables === sess.id ? (
                        <CircleNotch size={15} className="animate-spin text-rose-500" />
                      ) : (
                        <Trash size={16} />
                      )}
                      <span className="hidden sm:inline">Revoke</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Info size={15} /> Terminating a session will invalidate its token and require re-login on that device.
          </span>
          <span className="font-semibold text-slate-500">
            {sessions.length} Active {sessions.length === 1 ? "Session" : "Sessions"}
          </span>
        </div>
      </div>

      {/* Platform Notifications Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
        <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Bell size={22} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#082B3F]">Platform Notification Alerts</h2>
              <p className="text-xs text-slate-400">Control automated executive updates and system triggers</p>
            </div>
          </div>
        </div>

        <div className="p-6 divide-y divide-slate-100">
          {/* Vendor Alerts */}
          <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-800">Partner & Vendor Registrations</p>
              <p className="text-xs text-slate-400 mt-0.5">Receive immediate notification when a new pharmacy, doctor, or lab applies for verification.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationPrefs.vendorAlerts}
                onChange={() => handleTogglePref("vendorAlerts")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17618E]"></div>
            </label>
          </div>

          {/* Daily Summary */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-800">Daily Revenue & Order Summary</p>
              <p className="text-xs text-slate-400 mt-0.5">Automated morning digest detailing total transactions, order count, and gross volume.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationPrefs.dailySummary}
                onChange={() => handleTogglePref("dailySummary")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17618E]"></div>
            </label>
          </div>

          {/* Security Alerts */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-800">Security & Authentication Alerts</p>
              <p className="text-xs text-slate-400 mt-0.5">High-priority alerts for unusual login activity, password resets, and permission changes.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationPrefs.securityAlerts}
                onChange={() => handleTogglePref("securityAlerts")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17618E]"></div>
            </label>
          </div>

          {/* Prescription Alerts */}
          <div className="py-3.5 last:pb-0 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-800">Prescription Verification Queue Escalations</p>
              <p className="text-xs text-slate-400 mt-0.5">Alerts when prescription orders remain pending review beyond standard SLA thresholds.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationPrefs.prescriptionAlerts}
                onChange={() => handleTogglePref("prescriptionAlerts")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#17618E]"></div>
            </label>
          </div>
        </div>

        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSaveNotifications}
            disabled={updateProfileMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#17618E] hover:bg-[#082B3F] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
          >
            {updateProfileMutation.isPending ? (
              <>
                <CircleNotch size={15} className="animate-spin" />
                <span>Saving Preferences...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} weight="bold" />
                <span>Save Alert Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
