"use client";

import { useEffect, useState } from "react";
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
import { ProfileSettingsForm } from "../components/ProfileSettingsForm";
import { Input } from "@/shared/components/Input";
import { Badge } from "@/shared/components/Badge";
import { ProfileModal } from "../components/ProfileModal";
import {
  NOTIFICATION_PREF_LABELS,
  formatMemberSince,
  formatDobDisplay,
  createId,
} from "../lib/profileData";
import { useDynamicProfile } from "../lib/useDynamicProfile";
import {
  useUpdateProfileData,
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useCreateFamily,
  useAddFamilyMember,
  useUpdateFamilyMember,
  useDeleteFamilyMember,
} from "@/lib/hooks/useApi";
import { useAuth } from "@/lib/auth/AuthProvider";
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

const EMPTY_FAMILY = { full_name: "", relationship: "Spouse", blood_group: "B+", gender: "" };
const EMPTY_ADDRESS = { name: "Home", street: "", city: "", country: "Pakistan", postal_code: "", is_default: false };
const EMPTY_RECORD = { type: "Lab Report", title: "", date: "", lab: "" };
const EMPTY_PAYMENT = { type: "card", label: "", expiry: "", isDefault: false };

export function ProfilePage() {
  const router = useRouter();
  const { openSignIn } = useAuthModal();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const {
    profile,
    profileData,
    familyMembers,
    medicalRecords,
    dashboardStats,
    familyAlerts,
    familyHealthScore,
    prescriptionOrders,
    uploadedPrescriptions,
    isLoading,
    hasVault,
  } = useDynamicProfile({ enabled: isAuthenticated });

  const { data: addresses = [] } = useAddresses({ enabled: isAuthenticated });

  const updateProfileData = useUpdateProfileData();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const createFamily = useCreateFamily();
  const addFamilyMember = useAddFamilyMember();
  const updateFamilyMember = useUpdateFamilyMember();
  const deleteFamilyMember = useDeleteFamilyMember();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) openSignIn({ redirect: "/profile" });
  }, [authLoading, isAuthenticated, openSignIn]);

  const persistProfileData = async (nextData) => {
    await updateProfileData.mutateAsync(nextData);
  };

  const openModal = (type, item = null) => {
    setModal({ type, item });
    if (type === "family") {
      setForm(
        item
          ? {
              full_name: item.name,
              relationship: item.relation,
              blood_group: item.bloodGroup || "B+",
              gender: item.gender || "",
            }
          : EMPTY_FAMILY
      );
    }
    if (type === "address") setForm(item || EMPTY_ADDRESS);
    if (type === "record") setForm(item || EMPTY_RECORD);
    if (type === "payment") setForm(item || EMPTY_PAYMENT);
  };

  const closeModal = () => {
    setModal(null);
    setForm({});
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const saveFamilyMember = async () => {
    if (!form.full_name?.trim() || !form.relationship?.trim()) {
      toast.error("Name and relationship are required");
      return;
    }
    try {
      if (!hasVault) {
        await createFamily.mutateAsync({ name: `${profile?.name || "My"} Family` });
      }
      const payload = {
        full_name: form.full_name.trim(),
        relationship: form.relationship.trim(),
        blood_group: form.blood_group || undefined,
        gender: form.gender || undefined,
      };
      if (modal.item?.id) {
        await updateFamilyMember.mutateAsync({ memberId: modal.item.id, ...payload });
        toast.success("Family member updated");
      } else {
        await addFamilyMember.mutateAsync(payload);
        toast.success("Family member added");
      }
      closeModal();
    } catch (error) {
      toast.error(error.message || "Could not save family member");
    }
  };

  const removeFamilyMember = async (id) => {
    try {
      await deleteFamilyMember.mutateAsync(id);
      toast.success("Family member removed");
    } catch (error) {
      toast.error(error.message || "Could not remove family member");
    }
  };

  const setupFamilyVault = async () => {
    try {
      await createFamily.mutateAsync({ name: `${profile?.name || "My"} Family` });
      toast.success("Family health vault created");
    } catch (error) {
      toast.error(error.message || "Could not create family");
    }
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
    if (String(id).startsWith("lab-")) {
      toast.error("Lab reports are managed from your lab bookings");
      return;
    }
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

  if (authLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading profile...</div>;
  }

  if (!isAuthenticated) {
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
              <div className="flex gap-2">
                <Link href="/family-health">
                  <Button className="h-[40px] text-[13px]" variant="secondary">Open Vault</Button>
                </Link>
                <Button
                  className="h-[40px] text-[13px]"
                  leftIcon={<Plus size={16} />}
                  onClick={() => openModal("family")}
                  isLoading={createFamily.isPending}
                >
                  Add Member
                </Button>
              </div>
            </div>
            {!hasVault ? (
              <div className="p-6 border border-[var(--color-neutral-200)] rounded-[16px] text-center">
                <p className="text-[14px] text-[var(--color-neutral-600)] mb-4">
                  Create your family health vault to manage members, medicines, labs, and AI monitoring.
                </p>
                <Button onClick={setupFamilyVault} isLoading={createFamily.isPending}>Create Family Vault</Button>
              </div>
            ) : familyMembers.length === 0 ? (
              <p className="text-[14px] text-[var(--color-neutral-500)]">No family members yet. Add one to get started.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {familyMembers.map((member) => (
                  <div key={member.id} className="p-5 border border-[var(--color-neutral-200)] rounded-[16px]">
                    <div className="flex items-start justify-between mb-3">
                      <Link href={`/family-health/members/${member.id}`} className="w-12 h-12 rounded-full bg-[var(--color-brand-light)] flex items-center justify-center hover:ring-2 hover:ring-[var(--color-brand-primary)]/20">
                        <User size={24} className="text-[var(--color-brand-primary)]" weight="fill" />
                      </Link>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => openModal("family", member)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-brand-primary)]">
                          <PencilSimple size={16} />
                        </button>
                        <button type="button" onClick={() => removeFamilyMember(member.id)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)]">
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    <Link href={`/family-health/members/${member.id}`} className="block hover:text-[var(--color-brand-primary)]">
                      <h3 className="text-[16px] font-bold">{member.name}</h3>
                    </Link>
                    <p className="text-[13px] text-[var(--color-neutral-500)]">{member.relation}</p>
                    {member.healthScore != null && (
                      <p className="text-[12px] font-semibold text-[var(--color-brand-primary)] mt-2">Health Score: {member.healthScore}</p>
                    )}
                    {member.bloodGroup && <p className="text-[12px] text-[var(--color-neutral-600)] mt-1">Blood Group: {member.bloodGroup}</p>}
                    {member.statusLines?.[0] && (
                      <p className="text-[12px] text-[var(--color-neutral-500)] mt-2">{member.statusLines[0]}</p>
                    )}
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
            {medicalRecords.length === 0 ? (
              <p className="text-[14px] text-[var(--color-neutral-500)]">No medical records yet. Lab reports appear here automatically after booking.</p>
            ) : (
              <div className="space-y-3">
                {medicalRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between gap-4 p-4 border border-[var(--color-neutral-200)] rounded-[14px]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-[10px] bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0">
                        <FolderOpen size={20} className="text-[var(--color-brand-primary)]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-bold truncate">{record.title}</p>
                          {record.source === "lab" && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--color-brand-mist)] text-[var(--color-brand-primary)]">Live</span>
                          )}
                        </div>
                        <p className="text-[12px] text-[var(--color-neutral-500)]">{record.type} · {record.lab} · {record.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {record.fileUrl && (
                        <a href={record.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-brand-primary)]">
                          <DownloadSimple size={16} />
                        </a>
                      )}
                      {record.source === "manual" && (
                        <>
                          <button type="button" onClick={() => openModal("record", record)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-brand-primary)]">
                            <PencilSimple size={16} />
                          </button>
                          <button type="button" onClick={() => deleteRecord(record.id)} className="p-2 text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)]">
                            <Trash size={16} />
                          </button>
                        </>
                      )}
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
            <ProfileSettingsForm profile={profile} profileData={profileData} />
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
                { label: "Family Health Vault", href: "/family-health", icon: Users },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-[var(--color-neutral-200)] rounded-[14px]">
                <p className="text-[12px] text-[var(--color-neutral-400)] uppercase font-semibold mb-1">Blood Group</p>
                <p className="text-[20px] font-bold">{profileData.bloodGroup || profile?.profile_data?.bloodGroup || "—"}</p>
              </div>
              <div className="p-4 border border-[var(--color-neutral-200)] rounded-[14px]">
                <p className="text-[12px] text-[var(--color-neutral-400)] uppercase font-semibold mb-1">Member Since</p>
                <p className="text-[20px] font-bold">{formatMemberSince(profile?.created_at)}</p>
              </div>
              {familyHealthScore != null && (
                <div className="p-4 border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-mist)] rounded-[14px]">
                  <p className="text-[12px] text-[var(--color-brand-primary)] uppercase font-semibold mb-1">Family Health Score</p>
                  <p className="text-[20px] font-bold text-[var(--color-brand-primary)]">{familyHealthScore}</p>
                </div>
              )}
            </div>
            {familyAlerts.length > 0 && (
              <>
                <h3 className="text-[15px] font-bold mb-3">Family Alerts</h3>
                <div className="space-y-2 mb-6">
                  {familyAlerts.map((alert, i) => (
                    <div key={i} className="p-3 rounded-[12px] bg-amber-50 border border-amber-200 text-[13px] text-amber-900">
                      <strong>{alert.member}:</strong> {alert.message}
                    </div>
                  ))}
                </div>
              </>
            )}
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
            <Button onClick={saveFamilyMember} isLoading={addFamilyMember.isPending || updateFamilyMember.isPending || createFamily.isPending}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" value={form.full_name || ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Input label="Relationship" value={form.relationship || ""} onChange={(e) => setForm({ ...form, relationship: e.target.value })} placeholder="Spouse, Son, Father..." />
          <div>
            <label className="text-[13px] font-semibold mb-1.5 block">Blood Group</label>
            <select value={form.blood_group || "B+"} onChange={(e) => setForm({ ...form, blood_group: e.target.value })} className="w-full h-[44px] px-4 border border-[var(--color-neutral-200)] rounded-[var(--radius-md)]">
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
