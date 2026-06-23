"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { useLabPortalProfile, useUpdateLabPortalProfile } from "@/lib/hooks/usePartnerPortal";

export default function LabSettingsPage() {
  const { data: profile } = useLabPortalProfile();
  const updateProfile = useUpdateLabPortalProfile();
  const [local, setLocal] = useState({
    name: "",
    phone: "",
    address: "",
    collectionAreas: "",
    operatingHours: "",
    homeCollection: true,
  });

  useEffect(() => {
    if (profile) {
      setLocal({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        collectionAreas: profile.collectionAreas || "",
        operatingHours: profile.operatingHours || "",
        homeCollection: profile.homeCollection ?? true,
      });
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(local);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-[28px] font-heading font-extrabold text-ink-headline mb-8">Settings</h1>
      <form onSubmit={handleSave} className="bg-white rounded-[16px] border p-6 space-y-4">
        <Input placeholder="Lab name" value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} />
        <Input placeholder="Phone" value={local.phone} onChange={(e) => setLocal({ ...local, phone: e.target.value })} />
        <Input placeholder="Address" value={local.address} onChange={(e) => setLocal({ ...local, address: e.target.value })} />
        <Input placeholder="Collection areas (cities)" value={local.collectionAreas} onChange={(e) => setLocal({ ...local, collectionAreas: e.target.value })} />
        <Input placeholder="Operating hours" value={local.operatingHours} onChange={(e) => setLocal({ ...local, operatingHours: e.target.value })} />
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={local.homeCollection} onChange={(e) => setLocal({ ...local, homeCollection: e.target.checked })} />
          Home collection available
        </label>
        <Button type="submit" disabled={updateProfile.isPending}>Save Changes</Button>
      </form>
    </div>
  );
}
