"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  SquaresFour,
  Users,
  MapPinLine,
  FileText,
  FolderOpen,
  CreditCard,
  Bell,
  Gear,
  SignOut,
  Plus,
  DownloadSimple,
  ArrowsClockwise,
  PencilSimple,
  Trash,
  Package,
  Stethoscope,
  Flask,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Badge } from "@/shared/components/Badge";
import { ProfileModal } from "../components/ProfileModal";
import {
  mergeProfileData,
  NOTIFICATION_PREF_LABELS,
  formatMemberSince,
  formatDobDisplay,
  createId,
} from "../lib/profileData";
import {
  useUserProfile,
  useUpdateProfile,
  useUpdateProfileData,
  useChangePassword,
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  usePrescriptions,
  usePrescriptionOrders,
  useAllOrders,
} from "@/lib/hooks/useApi";
import { api } from "@/lib/api/client";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: SquaresFour },
  { id: "family", label: "Family Members", icon: Users },
  { id: "addresses", label: "Saved Addresses", icon: MapPinLine },
  { id: "prescriptions", label: "Prescriptions", icon: FileText },
  { id: "records", label: "Medical Records", icon: FolderOpen },
  { id: "payments", label: "Payment Methods", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Gear },
];

const EMPTY_FAMILY = { name: "", relation: "", age: "", bloodGroup: "B+" };
const EMPTY_ADDRESS = { name: "Home", street: "", city: "", country: "Pakistan", postal_code: "", is_default: false };
const EMPTY_RECORD = { type: "Lab Report", title: "", date: "", lab: "" };
const EMPTY_PAYMENT = { type: "card", label: "", expiry: "", isDefault: false };

export function ProfilePage() {
  const router = useRouter();
  const { openSignIn } = useAuthModal();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const hasToken = typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

  const { data: profile, isLoading } = useUserProfile({ enabled: hasToken });
  const { data: addresses = [] } = useAddresses({ enabled: hasToken });
  const { data: uploadedPrescriptions = [] } = usePrescriptions({ enabled: hasToken });
  const { data: prescriptionOrders = [] } = usePrescriptionOrders({ enabled: hasToken });
  const { data: allOrders = [] } = useAllOrders({ enabled: hasToken });

  const updateProfile = useUpdateProfile();
  const updateProfileData = useUpdateProfileData();
  const changePassword = useChangePassword();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const profileData = useMemo(() => mergeProfileData(profile?.profile_data), [profile?.profile_data]);

  const dashboardStats = useMemo(() => {
    const activeOrders = allOrders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
    const upcomingAppts = allOrders.filter(
      (o) => o.type === "doctor" && !["completed", "cancelled", "delivered"].includes(o.rawStatus || o.status)
    ).length;
    const activeRx = prescriptionOrders.filter(
      (o) => !["delivered", "cancelled", "no_vendor"].includes(o.status)
    ).length;
    return [
      { label: "Active Orders", value: String(activeOrders), href: "/orders" },
      { label: "Upcoming Appointments", value: String(upcomingAppts), href: "/orders" },
      { label: "Active Prescriptions", value: String(activeRx), href: null, section: "prescriptions" },
      { label: "Family Members", value: String(profileData.familyMembers.length), href: null, section: "family" },
    ];
  }, [allOrders, prescriptionOrders, profileData.familyMembers.length]);

  useEffect(() => {
    if (!hasToken) openSignIn({ redirect: "/profile" });
  }, [hasToken, openSignIn]);

  const persistProfileData = async (nextData) => {
    await updateProfileData.mutateAsync(nextData);
  };

  const openModal = (type, item = null) => {
    setModal({ type, item });
    if (type === "family") setForm(item || EMPTY_FAMILY);
    if (type === "address") setForm(item || EMPTY_ADDRESS);
    if (type === "record") setForm(item || EMPTY_RECORD);
    if (type === "payment") setForm(item || EMPTY_PAYMENT);
  };

  const closeModal = () => {
    setModal(null);
    setForm({});
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // continue logout locally
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/");
  };

  const saveFamilyMember = async () => {
    if (!form.name?.trim() || !form.relation?.trim()) {
      toast.error("Name and relation are required");
      return;
    }
    const members = [...profileData.familyMembers];
    const payload = {
      id: modal.item?.id || createId(),
      name: form.name.trim(),
      relation: form.relation.trim(),
      age: form.age ? Number(form.age) : "",
      bloodGroup: form.bloodGroup || "",
    };
    if (modal.item) {
      const idx = members.findIndex((m) => m.id === modal.item.id);
      if (idx >= 0) members[idx] = payload;
    } else {
      members.push(payload);
    }
    await persistProfileData({ ...profileData, familyMembers: members });
    toast.success(modal.item ? "Family member updated" : "Family member added");
    closeModal();
  };

  const deleteFamilyMember = async (id) => {
    await persistProfileData({
      ...profileData,
      familyMembers: profileData.familyMembers.filter((m) => m.id !== id),
    });
    toast.success("Family member removed");
  };

  const saveAddress = async () => {
    if (!form.street?.trim() || !form.city?.trim()) {
      toast.error("Street and city are required");
      return;
    }
    const payload = {
      name: form.name || "Home",
      street: form.street.trim(),
      city: form.city.trim(),
      country: form.country?.trim() || "Pakistan",
      postal_code: form.postal_code?.trim() || "00000",
      is_default: Boolean(form.is_default),
    };
    if (modal.item?.id) {
      await updateAddress.mutateAsync({ id: modal.item.id, ...payload });
      toast.success("Address updated");
    } else {
      await createAddress.mutateAsync(payload);
      toast.success("Address added");
    }
    closeModal();
  };

  const saveRecord = async () => {
    if (!form.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    const records = [...profileData.medicalRecords];
    const payload = {
      id: modal.item?.id || createId(),
      type: form.type || "Lab Report",
      title: form.title.trim(),
      date: form.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lab: form.lab?.trim() || "PharmaHub",
    };
    if (modal.item) {
      const idx = records.findIndex((r) => r.id === modal.item.id);
      if (idx >= 0) records[idx] = payload;
    } else {
      records.unshift(payload);
    }
    await persistProfileData({ ...profileData, medicalRecords: records });
    toast.success(modal.item ? "Record updated" : "Record added");
    closeModal();
  };

  const deleteRecord = async (id) => {
    await persistProfileData({
      ...profileData,
      medicalRecords: profileData.medicalRecords.filter((r) => r.id !== id),
    });
    toast.success("Record removed");
  };

  const savePayment = async () => {
    if (!form.label?.trim()) {
      toast.error("Label is required");
      return;
    }
    let methods = [...profileData.paymentMethods];
    const payload = {
      id: modal.item?.id || createId(),
      type: form.type || "card",
      label: form.label.trim(),
      expiry: form.expiry || null,
      isDefault: Boolean(form.isDefault),
    };
    if (payload.isDefault) {
      methods = methods.map((m) => ({ ...m, isDefault: false }));
    }
    if (modal.item) {
      const idx = methods.findIndex((m) => m.id === modal.item.id);
      if (idx >= 0) methods[idx] = payload;
    } else {
      methods.push(payload);
    }
    if (methods.length === 1) methods[0].isDefault = true;
    await persistProfileData({ ...profileData, paymentMethods: methods });
    toast.success(modal.item ? "Payment method updated" : "Payment method added");
    closeModal();
  };

  const deletePayment = async (id) => {
    await persistProfileData({
      ...profileData,
      paymentMethods: profileData.paymentMethods.filter((m) => m.id !== id),
    });
    toast.success("Payment method removed");
  };

  const toggleNotif = async (id) => {
    const notificationPrefs = {
      ...profileData.notificationPrefs,
      [id]: !profileData.notificationPrefs[id],
    };
    await persistProfileData({ ...profileData, notificationPrefs });
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await updateProfile.mutateAsync({
      name: fd.get("name"),
      phone: fd.get("phone"),
      profile_data: {
        ...profileData,
        dob: fd.get("dob"),
        bloodGroup: fd.get("bloodGroup"),
      },
    });
    toast.success("Profile saved");
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const current = fd.get("current_password");
    const next = fd.get("new_password");
    const confirm = fd.get("confirm_password");
    if (next !== confirm) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword.mutateAsync({ current_password: current, new_password: next });
      toast.success("Password updated");
      e.target.reset();
    } catch (error) {
      toast.error(error.message || "Could not update password");
    }
  };

  if (!hasToken) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[var(--color-neutral-500)]">
        Sign in to manage your profile
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading profile...</div>;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "family":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-bold">Family Members</h2>
              <Button className="h-[40px] text-[13px]" leftIcon={<Plus size={16} />} onClick={() => openModal("family")}>
                Add Member
              </Button>
            </div>
            {profileData.familyMembers.length === 0 ? (
              <p className="text-[14px] text-[var(--color-neutral-500)]">No family members yet. Add one to manage their health info.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileData.familyMembers.map((member) => (
                  <div key={member.id} className="p-5 border border-[var(--color-neutral-200)] rounded-[16px]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-brand-light)] flex items-center justify-center">
                        <User size={24} className="text-[var(--color-brand-primary)]" weight="fill" />
                      </div>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => openModal("family", member)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-brand-primary)]">
                          <PencilSimple size={16} />
                        </button>
                        <button type="button" onClick={() => deleteFamilyMember(member.id)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)]">
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-[16px] font-bold">{member.name}</h3>
                    <p className="text-[13px] text-[var(--color-neutral-500)]">{member.relation}{member.age ? ` · ${member.age} years` : ""}</p>
                    {member.bloodGroup && <p className="text-[12px] text-[var(--color-brand-primary)] font-semibold mt-2">Blood Group: {member.bloodGroup}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "addresses":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-bold">Saved Addresses</h2>
              <Button className="h-[40px] text-[13px]" leftIcon={<Plus size={16} />} onClick={() => openModal("address")}>
                Add Address
              </Button>
            </div>
            {addresses.length === 0 ? (
              <p className="text-[14px] text-[var(--color-neutral-500)]">No saved addresses yet.</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-5 border border-[var(--color-neutral-200)] rounded-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-[10px] bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0">
                        <MapPinLine size={20} className="text-[var(--color-brand-primary)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[15px] font-bold">{addr.name}</h3>
                          {addr.is_default && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[var(--color-brand-primary)] text-white rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-[13px] text-[var(--color-neutral-600)]">{addr.street}</p>
                        <p className="text-[12px] text-[var(--color-neutral-500)]">{addr.city}, {addr.country} · {addr.postal_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button type="button" onClick={() => openModal("address", addr)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-brand-primary)]">
                        <PencilSimple size={16} />
                      </button>
                      <button type="button" onClick={() => deleteAddress.mutate(addr.id)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)]">
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "prescriptions":
        return (
          <div>
            <h2 className="text-[22px] font-bold mb-6">Prescriptions</h2>
            <div className="space-y-4">
              {prescriptionOrders.map((order) => (
                <div key={order.id} className="p-5 border border-[var(--color-neutral-200)] rounded-[16px]">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[13px] font-bold">{order.shortId}</span>
                        <Badge status={order.status} />
                      </div>
                      <p className="text-[12px] text-[var(--color-neutral-500)]">{order.createdAtLabel}</p>
                      <p className="text-[13px] text-[var(--color-neutral-600)] mt-1">
                        {order.assignedVendor?.name || order.currentVendor?.name || "Finding pharmacy..."}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {order.fileUrl && (
                        <a href={order.fileUrl} target="_blank" rel="noreferrer">
                          <Button variant="secondary" className="h-[36px] text-[12px]" leftIcon={<DownloadSimple size={14} />}>Download</Button>
                        </a>
                      )}
                      <Link href={`/prescription/${order.id}`}>
                        <Button className="h-[36px] text-[12px]" leftIcon={<ArrowsClockwise size={14} />}>Track</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {uploadedPrescriptions.map((rx) => (
                <div key={rx.id} className="p-5 border border-[var(--color-neutral-200)] rounded-[16px] flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[13px] font-bold">Uploaded prescription</p>
                    <p className="text-[12px] text-[var(--color-neutral-500)]">{new Date(rx.created_at).toLocaleDateString()}</p>
                  </div>
                  {rx.file_url && (
                    <a href={rx.file_url} target="_blank" rel="noreferrer">
                      <Button variant="secondary" className="h-[36px] text-[12px]" leftIcon={<DownloadSimple size={14} />}>Download</Button>
                    </a>
                  )}
                </div>
              ))}
              {prescriptionOrders.length === 0 && uploadedPrescriptions.length === 0 && (
                <p className="text-[14px] text-[var(--color-neutral-500)]">No prescriptions yet. Upload one from the homepage.</p>
              )}
            </div>
          </div>
        );

      case "records":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-bold">Medical Records</h2>
              <Button className="h-[40px] text-[13px]" leftIcon={<Plus size={16} />} onClick={() => openModal("record")}>
                Add Record
              </Button>
            </div>
            {profileData.medicalRecords.length === 0 ? (
              <p className="text-[14px] text-[var(--color-neutral-500)]">No medical records saved yet.</p>
            ) : (
              <div className="space-y-3">
                {profileData.medicalRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between gap-4 p-4 border border-[var(--color-neutral-200)] rounded-[14px]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-[10px] bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0">
                        <FolderOpen size={20} className="text-[var(--color-brand-primary)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold truncate">{record.title}</p>
                        <p className="text-[12px] text-[var(--color-neutral-500)]">{record.type} · {record.lab} · {record.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button type="button" onClick={() => openModal("record", record)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-brand-primary)]">
                        <PencilSimple size={16} />
                      </button>
                      <button type="button" onClick={() => deleteRecord(record.id)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)]">
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "payments":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-bold">Payment Methods</h2>
              <Button className="h-[40px] text-[13px]" leftIcon={<Plus size={16} />} onClick={() => openModal("payment")}>
                Add Method
              </Button>
            </div>
            {profileData.paymentMethods.length === 0 ? (
              <p className="text-[14px] text-[var(--color-neutral-500)]">No payment methods saved yet.</p>
            ) : (
              <div className="space-y-3">
                {profileData.paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-[var(--color-neutral-200)] rounded-[14px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[10px] bg-[var(--color-surface-subtle)] flex items-center justify-center">
                        <CreditCard size={20} className="text-[var(--color-brand-primary)]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold">{method.label}</p>
                        {method.expiry && <p className="text-[12px] text-[var(--color-neutral-500)]">Expires {method.expiry}</p>}
                      </div>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[var(--color-brand-mist)] text-[var(--color-brand-primary)] rounded-full">Default</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openModal("payment", method)} className="text-[12px] font-semibold text-[var(--color-neutral-500)] hover:text-[var(--color-brand-primary)] px-2">
                        Edit
                      </button>
                      <button type="button" onClick={() => deletePayment(method.id)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)]">
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "notifications":
        return (
          <div>
            <h2 className="text-[22px] font-bold mb-6">Notifications</h2>
            <h3 className="text-[14px] font-bold mb-4">Preferences</h3>
            <div className="space-y-3 mb-8">
              {NOTIFICATION_PREF_LABELS.map((pref) => (
                <div key={pref.id} className="flex items-center justify-between p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                  <div>
                    <p className="text-[14px] font-semibold">{pref.label}</p>
                    <p className="text-[12px] text-[var(--color-neutral-500)]">{pref.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotif(pref.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${profileData.notificationPrefs[pref.id] ? "bg-[var(--color-brand-primary)]" : "bg-[var(--color-neutral-300)]"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${profileData.notificationPrefs[pref.id] ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
            {(profileData.recentNotifications || []).length > 0 && (
              <>
                <h3 className="text-[14px] font-bold mb-4">Recent</h3>
                <div className="space-y-2">
                  {profileData.recentNotifications.map((n) => (
                    <div key={n.id} className={`p-4 rounded-[12px] border ${n.read ? "border-[var(--color-neutral-200)] bg-white" : "border-[var(--color-brand-light)] bg-[var(--color-brand-mist)]"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[14px] font-bold">{n.title}</p>
                          <p className="text-[13px] text-[var(--color-neutral-600)] mt-0.5">{n.message}</p>
                        </div>
                        <span className="text-[11px] text-[var(--color-neutral-400)] shrink-0">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );

      case "settings":
        return (
          <div>
            <h2 className="text-[22px] font-bold mb-6">Settings</h2>
            <form onSubmit={saveSettings} className="space-y-6 max-w-[480px]">
              <Input label="Full Name" name="name" defaultValue={profile?.name || ""} key={`name-${profile?.name}`} />
              <Input label="Email" type="email" defaultValue={profile?.email || ""} disabled />
              <Input label="Phone" name="phone" defaultValue={profile?.phone || ""} key={`phone-${profile?.phone}`} />
              <Input label="Date of Birth" name="dob" type="date" defaultValue={profileData.dob || ""} key={`dob-${profileData.dob}`} />
              <div>
                <label className="text-[13px] font-semibold mb-1.5 block">Blood Group</label>
                <select name="bloodGroup" defaultValue={profileData.bloodGroup || ""} className="w-full h-[44px] px-4 border border-[var(--color-neutral-200)] rounded-[var(--radius-md)] text-[14px] outline-none focus:border-[var(--color-brand-primary)]">
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="h-[44px]" isLoading={updateProfile.isPending}>Save Changes</Button>
            </form>
            <form onSubmit={savePassword} className="space-y-4 max-w-[480px] pt-8 mt-8 border-t border-[var(--color-neutral-200)]">
              <h3 className="text-[15px] font-bold">Security</h3>
              <Input label="Current Password" name="current_password" type="password" placeholder="••••••••" required />
              <Input label="New Password" name="new_password" type="password" placeholder="••••••••" required />
              <Input label="Confirm New Password" name="confirm_password" type="password" placeholder="••••••••" required />
              <Button type="submit" variant="secondary" className="h-[44px]" isLoading={changePassword.isPending}>Update Password</Button>
            </form>
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-[22px] font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="p-4 bg-[var(--color-surface-subtle)] rounded-[14px] border border-[var(--color-neutral-200)]">
                  <p className="text-[28px] font-bold text-[var(--color-brand-primary)]">{stat.value}</p>
                  <p className="text-[12px] font-semibold text-[var(--color-neutral-600)] mt-1">{stat.label}</p>
                  {stat.href && <Link href={stat.href} className="text-[11px] font-semibold text-[var(--color-brand-primary)] hover:underline mt-2 inline-block">View →</Link>}
                  {stat.section && (
                    <button type="button" onClick={() => setActiveSection(stat.section)} className="text-[11px] font-semibold text-[var(--color-brand-primary)] hover:underline mt-2 inline-block">
                      View →
                    </button>
                  )}
                </div>
              ))}
            </div>
            <h3 className="text-[15px] font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                { label: "Order Medicines", href: "/browse", icon: Package },
                { label: "Book Doctor", href: "/doctors", icon: Stethoscope },
                { label: "Book Lab Test", href: "/lab-tests", icon: Flask },
              ].map((action) => (
                <Link key={action.label} href={action.href} className="flex items-center gap-3 p-4 border border-[var(--color-neutral-200)] rounded-[14px] hover:border-[var(--color-brand-primary)]/30 transition-colors">
                  <div className="w-10 h-10 rounded-[10px] icon-box-light flex items-center justify-center shrink-0">
                    <action.icon size={20} className="text-[var(--color-brand-primary)]" weight="duotone" />
                  </div>
                  <span className="text-[14px] font-semibold">{action.label}</span>
                </Link>
              ))}
            </div>
            <h3 className="text-[15px] font-bold mb-4">Health Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-[var(--color-neutral-200)] rounded-[14px]">
                <p className="text-[12px] text-[var(--color-neutral-400)] uppercase font-semibold mb-1">Blood Group</p>
                <p className="text-[20px] font-bold">{profileData.bloodGroup || "—"}</p>
              </div>
              <div className="p-4 border border-[var(--color-neutral-200)] rounded-[14px]">
                <p className="text-[12px] text-[var(--color-neutral-400)] uppercase font-semibold mb-1">Member Since</p>
                <p className="text-[20px] font-bold">{formatMemberSince(profile?.created_at)}</p>
              </div>
            </div>
            {profileData.dob && (
              <p className="text-[13px] text-[var(--color-neutral-500)] mt-4">Date of birth: {formatDobDisplay(profileData.dob)}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)] py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px] flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] overflow-hidden sticky top-[120px]">
            <div className="p-6 border-b border-[var(--color-neutral-200)] text-center">
              <div className="w-20 h-20 rounded-full icon-box-light flex items-center justify-center mx-auto mb-3">
                <User size={36} weight="fill" className="text-[var(--color-brand-primary)]" />
              </div>
              <h2 className="text-[17px] font-bold">{profile?.name || "Customer"}</h2>
              <p className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">{profile?.email}</p>
              <button type="button" onClick={() => setActiveSection("settings")} className="text-[12px] font-semibold text-[var(--color-brand-primary)] mt-2 hover:underline">
                Edit profile
              </button>
            </div>
            <nav className="p-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[13px] font-semibold transition-all ${
                      activeSection === item.id ? "bg-[var(--color-brand-primary)] text-white" : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)]"
                    }`}
                  >
                    <Icon size={18} weight={activeSection === item.id ? "fill" : "regular"} />
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-2 mt-2 border-t border-[var(--color-neutral-100)]">
                <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[13px] font-bold text-[var(--color-status-danger)] hover:bg-[var(--color-status-danger)]/10">
                  <SignOut size={18} weight="bold" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0 bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>

      <ProfileModal
        open={modal?.type === "family"}
        title={modal?.item ? "Edit Family Member" : "Add Family Member"}
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={saveFamilyMember} isLoading={updateProfileData.isPending}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Relation" value={form.relation || ""} onChange={(e) => setForm({ ...form, relation: e.target.value })} placeholder="Spouse, Son, etc." />
          <Input label="Age" type="number" value={form.age || ""} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          <div>
            <label className="text-[13px] font-semibold mb-1.5 block">Blood Group</label>
            <select value={form.bloodGroup || "B+"} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="w-full h-[44px] px-4 border border-[var(--color-neutral-200)] rounded-[var(--radius-md)]">
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
        </div>
      </ProfileModal>

      <ProfileModal
        open={modal?.type === "address"}
        title={modal?.item ? "Edit Address" : "Add Address"}
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={saveAddress} isLoading={createAddress.isPending || updateAddress.isPending}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Label" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Home, Office..." />
          <Input label="Street Address" value={form.street || ""} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          <Input label="City" value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <Input label="Postal Code" value={form.postal_code || ""} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
          <Input label="Country" value={form.country || ""} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={Boolean(form.is_default)} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
            Set as default address
          </label>
        </div>
      </ProfileModal>

      <ProfileModal
        open={modal?.type === "record"}
        title={modal?.item ? "Edit Medical Record" : "Add Medical Record"}
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={saveRecord} isLoading={updateProfileData.isPending}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Type" value={form.type || ""} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Lab Report, Consultation..." />
          <Input label="Provider / Lab" value={form.lab || ""} onChange={(e) => setForm({ ...form, lab: e.target.value })} />
          <Input label="Date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Jun 09, 2026" />
        </div>
      </ProfileModal>

      <ProfileModal
        open={modal?.type === "payment"}
        title={modal?.item ? "Edit Payment Method" : "Add Payment Method"}
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={savePayment} isLoading={updateProfileData.isPending}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-semibold mb-1.5 block">Type</label>
            <select value={form.type || "card"} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-[44px] px-4 border border-[var(--color-neutral-200)] rounded-[var(--radius-md)]">
              <option value="card">Card</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
          <Input label="Label" value={form.label || ""} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Visa ending 4242, JazzCash..." />
          <Input label="Expiry (optional)" value={form.expiry || ""} onChange={(e) => setForm({ ...form, expiry: e.target.value })} placeholder="12/28" />
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={Boolean(form.isDefault)} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            Set as default payment method
          </label>
        </div>
      </ProfileModal>
    </div>
  );
}
