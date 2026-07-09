"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useUpdateProfile, useChangePassword } from "@/lib/hooks/useApi";

export function ProfileSettingsForm({ profile, profileData }) {
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const formHydrated = useRef(false);

  useEffect(() => {
    if (!profile) return;
    if (formHydrated.current) return;
    setName(profile.name || "");
    setPhone(profile.phone || "");
    setDob(profileData.dob || "");
    setBloodGroup(profileData.bloodGroup || "");
    formHydrated.current = true;
  }, [profile, profileData.dob, profileData.bloodGroup]);

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        profile_data: {
          ...profileData,
          dob,
          bloodGroup,
        },
      });
      formHydrated.current = false;
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error.message || "Could not save profile");
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.message || "Could not update password");
    }
  };

  return (
    <>
      <form onSubmit={saveSettings} className="space-y-6 max-w-[480px]">
        <Input
          label="Full Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input label="Email" type="email" value={profile?.email || ""} disabled />
        <Input
          label="Phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label="Date of Birth"
          name="dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <div>
          <label className="text-[13px] font-semibold mb-1.5 block">Blood Group</label>
          <select
            name="bloodGroup"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full h-[44px] px-4 border border-[var(--color-neutral-200)] rounded-[var(--radius-md)] text-[14px] outline-none focus:border-[var(--color-brand-primary)]"
          >
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="h-[44px]" isLoading={updateProfile.isPending}>
          Save Changes
        </Button>
      </form>

      <form
        onSubmit={savePassword}
        className="space-y-4 max-w-[480px] pt-8 mt-8 border-t border-[var(--color-neutral-200)]"
      >
        <h3 className="text-[15px] font-bold">Security</h3>
        <Input
          label="Current Password"
          name="current_password"
          type="password"
          placeholder="••••••••"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          label="New Password"
          name="new_password"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm New Password"
          name="confirm_password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="secondary"
          className="h-[44px]"
          isLoading={changePassword.isPending}
        >
          Update Password
        </Button>
      </form>
    </>
  );
}
