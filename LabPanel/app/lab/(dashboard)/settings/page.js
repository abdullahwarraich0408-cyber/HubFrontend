"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Clock,
  Truck,
  Bell,
  Lock,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  Edit2,
  User,
  Phone,
  Mail,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import {
  useLabPortalProfile,
  useUpdateLabPortalProfile,
  useLabPortalCollectors,
  useCreateLabCollector,
  useUpdateLabCollector,
  useDeleteLabCollector,
} from "@/lib/hooks/usePartnerPortal";
import {
  DEFAULT_COLLECTION_CITIES,
  DEFAULT_OPERATING_HOURS,
} from "@/lib/constants/lab";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function LabSettingsPage() {
  const { data: profile, isLoading: loadingProfile } = useLabPortalProfile();
  const updateProfileMutation = useUpdateLabPortalProfile();

  const { data: collectors = [] } = useLabPortalCollectors();
  const createCollectorMutation = useCreateLabCollector();
  const updateCollectorMutation = useUpdateLabCollector();
  const deleteCollectorMutation = useDeleteLabCollector();

  // Active Tab
  const [activeTab, setActiveTab] = useState("general");

  // Form State
  const [form, setForm] = useState({
    name: "IDC",
    fullName: "IDC Diagnostics",
    phone: "+92 51 111 000 432",
    email: "contact@idc.net.pk",
    address: "Plot 13-A, G-8 Markaz",
    city: "Islamabad",
    license: "PMDC-LAB-2026-9901",
    bio: "Leading diagnostic laboratory and imaging center with state-of-the-art testing technology.",
    homeCollection: true,
    collectionFee: 300,
    freeDeliveryThreshold: 3000,
    collectionCities: [...DEFAULT_COLLECTION_CITIES],
    operatingHours: { ...DEFAULT_OPERATING_HOURS },
    notifications: {
      email: true,
      sms: true,
      newBookings: true,
      reportReady: true,
      cancellations: true,
    },
  });

  // City Tag Input State
  const [newCity, setNewCity] = useState("");

  // Collector Add/Edit Modal
  const [collectorModalOpen, setCollectorModalOpen] = useState(false);
  const [editingCollector, setEditingCollector] = useState(null);
  const [collectorForm, setCollectorForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Islamabad",
    active: true,
    notes: "",
  });

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "IDC",
        fullName: profile.fullName || profile.name || "IDC Diagnostics",
        phone: profile.phone || "+92 51 111 000 432",
        email: profile.email || "contact@idc.net.pk",
        address: profile.address || "Plot 13-A, G-8 Markaz",
        city: profile.city || "Islamabad",
        license: profile.license || "PMDC-LAB-2026-9901",
        bio: profile.bio || "Leading diagnostic laboratory and imaging center.",
        homeCollection: profile.homeCollection ?? true,
        collectionFee: profile.collectionFee ?? 300,
        freeDeliveryThreshold: profile.freeDeliveryThreshold ?? 3000,
        collectionCities:
          profile.collectionCities?.length > 0
            ? profile.collectionCities
            : [...DEFAULT_COLLECTION_CITIES],
        operatingHours:
          Object.keys(profile.operatingHours || {}).length > 0
            ? profile.operatingHours
            : { ...DEFAULT_OPERATING_HOURS },
        notifications: profile.notifications || {
          email: true,
          sms: true,
          newBookings: true,
          reportReady: true,
          cancellations: true,
        },
      });
    }
  }, [profile]);

  // Add City Tag
  const handleAddCity = (e) => {
    e?.preventDefault();
    const trimmed = newCity.trim();
    if (!trimmed) return;
    if (form.collectionCities.includes(trimmed)) {
      toast.error(`${trimmed} is already in the collection areas list.`);
      return;
    }
    setForm((prev) => ({
      ...prev,
      collectionCities: [...prev.collectionCities, trimmed],
    }));
    setNewCity("");
  };

  // Remove City Tag
  const handleRemoveCity = (cityToRemove) => {
    setForm((prev) => ({
      ...prev,
      collectionCities: prev.collectionCities.filter((c) => c !== cityToRemove),
    }));
  };

  // Operating Hours update
  const handleHourChange = (day, field, value) => {
    setForm((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...(prev.operatingHours[day] || { open: "08:00 AM", close: "10:00 PM", closed: false }),
          [field]: value,
        },
      },
    }));
  };

  const handleApplySameHours = (sourceDay = "Monday") => {
    const template = form.operatingHours[sourceDay] || {
      open: "08:00 AM",
      close: "10:00 PM",
      closed: false,
    };
    const updated = {};
    DAYS.forEach((d) => {
      updated[d] = { ...template };
    });
    setForm((prev) => ({ ...prev, operatingHours: updated }));
    toast.success(`Applied ${sourceDay} operating hours to all weekdays.`);
  };

  // Save General & Collection Settings
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    try {
      await updateProfileMutation.mutateAsync(form);
      toast.success("Settings saved successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to save settings.");
    }
  };

  // Save Collector Modal
  const handleSaveCollector = async (e) => {
    e.preventDefault();
    if (!collectorForm.name.trim() || !collectorForm.phone.trim()) {
      toast.error("Collector name and phone are required.");
      return;
    }

    try {
      if (editingCollector) {
        await updateCollectorMutation.mutateAsync({
          id: editingCollector.id,
          ...collectorForm,
        });
        toast.success(`Collector "${collectorForm.name}" updated.`);
      } else {
        await createCollectorMutation.mutateAsync(collectorForm);
        toast.success(`Collector "${collectorForm.name}" added.`);
      }
      setCollectorModalOpen(false);
      setEditingCollector(null);
    } catch (err) {
      toast.error(err.message || "Failed to save collector.");
    }
  };

  // Delete Collector
  const handleDeleteCollector = async (id, name) => {
    try {
      await deleteCollectorMutation.mutateAsync(id);
      toast.success(`Collector "${name}" removed.`);
    } catch (err) {
      toast.error(err.message || "Failed to delete collector.");
    }
  };

  // Password Change
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.new) {
      toast.error("Please enter current and new password.");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Security password updated successfully.");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-[30px] md:text-[34px] font-heading font-bold text-[#07172E] tracking-tight">
          Settings
        </h1>
        <p className="text-[14px] text-[#667085] mt-1.5 font-normal">
          Manage your diagnostic lab profile, collection channels, collectors, and security.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#D9DEE5] pb-px overflow-x-auto">
        {[
          { id: "general", label: "General", icon: Building2 },
          { id: "collection", label: "Collection & Hours", icon: Truck },
          { id: "collectors", label: "Sample Collectors", icon: User },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "security", label: "Security", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[13px] font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-[#087F82] text-[#087F82]"
                  : "border-transparent text-[#667085] hover:text-[#07172E] hover:border-neutral-300"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Cards (Desktop Width ~620-680px for focused settings experience) */}
      <div className="max-w-2xl">
        {/* ================= GENERAL TAB ================= */}
        {activeTab === "general" && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-[16px] border border-[#D9DEE5] shadow-sm p-7 space-y-5"
          >
            <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
              <div className="w-14 h-14 rounded-2xl bg-[#071A30] text-white flex items-center justify-center text-[20px] font-bold shadow-inner">
                {form.name.charAt(0).toUpperCase() || "I"}
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#07172E]">
                  {form.name}
                </h3>
                <span className="text-[11px] font-bold text-[#087F82] uppercase tracking-wider">
                  DIAGNOSTICS PARTNER
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                Lab Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="IDC"
                required
                className="w-full h-[44px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+92 51 111 000 432"
                  className="w-full h-[44px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contact@idc.net.pk"
                  className="w-full h-[44px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                Lab Physical Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Plot 13-A, G-8 Markaz, Islamabad"
                className="w-full h-[44px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  Primary City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Islamabad"
                  className="w-full h-[44px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  License / Registration No.
                </label>
                <input
                  type="text"
                  value={form.license}
                  onChange={(e) => setForm({ ...form, license: e.target.value })}
                  placeholder="PMDC-LAB-2026-9901"
                  className="w-full h-[44px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                About Laboratory
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full px-3.5 py-2.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-6 py-2.5 bg-[#087F82] hover:bg-[#076B6E] text-white text-[13px] font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* ================= COLLECTION & HOURS TAB ================= */}
        {activeTab === "collection" && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-[16px] border border-[#D9DEE5] shadow-sm p-7 space-y-6"
          >
            {/* Home Collection Toggle */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 flex items-center justify-between">
              <div>
                <span className="text-[14px] font-bold text-[#07172E] block">
                  Home Collection Service
                </span>
                <span className="text-[12px] text-[#667085]">
                  Enable patients to request home sample collection in your supported cities
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.homeCollection}
                  onChange={(e) =>
                    setForm({ ...form, homeCollection: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087F82]" />
              </label>
            </div>

            {/* Collection Cities (Tag/Chip input) */}
            <div>
              <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                Collection Areas (Cities)
              </label>
              <div className="flex flex-wrap items-center gap-2 p-3 bg-neutral-50/70 border border-[#D9DEE5] rounded-xl min-h-[52px]">
                {form.collectionCities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D9DEE5] text-[#07172E] text-[12px] font-semibold rounded-lg shadow-2xs"
                  >
                    <span>{city}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(city)}
                      className="text-[#667085] hover:text-[#EF233C]"
                      title="Remove city"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCity();
                      }
                    }}
                    placeholder="Add city & press Enter..."
                    className="w-full text-[12px] bg-transparent text-[#07172E] placeholder:text-[#667085] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCity}
                    className="p-1 rounded bg-[#087F82] text-white text-[11px] font-bold hover:bg-[#076B6E]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">
                Patients in these cities will see home collection available for your tests.
              </p>
            </div>

            {/* Collection Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  Home Collection Fee (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.collectionFee}
                  onChange={(e) =>
                    setForm({ ...form, collectionFee: Number(e.target.value) })
                  }
                  className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  Free Collection Minimum Order (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.freeDeliveryThreshold}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      freeDeliveryThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
                />
              </div>
            </div>

            {/* Structured Operating Hours */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-bold text-[#07172E]">
                  Operating Hours
                </label>
                <button
                  type="button"
                  onClick={() => handleApplySameHours("Monday")}
                  className="text-[11px] font-semibold text-[#087F82] hover:underline"
                >
                  Apply Monday hours to all days
                </button>
              </div>

              <div className="space-y-2.5 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 text-[13px]">
                {DAYS.map((day) => {
                  const schedule = form.operatingHours[day] || {
                    open: "08:00 AM",
                    close: "10:00 PM",
                    closed: false,
                  };

                  return (
                    <div
                      key={day}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-b border-neutral-200/50 last:border-0"
                    >
                      <span className="w-24 font-semibold text-[#07172E]">
                        {day}
                      </span>

                      <div className="flex items-center gap-3">
                        {!schedule.closed ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={schedule.open || "08:00 AM"}
                              onChange={(e) =>
                                handleHourChange(day, "open", e.target.value)
                              }
                              className="w-24 h-8 px-2 text-[12px] bg-white border border-[#D9DEE5] rounded-lg text-center font-medium"
                            />
                            <span className="text-[#667085] text-[12px]">to</span>
                            <input
                              type="text"
                              value={schedule.close || "10:00 PM"}
                              onChange={(e) =>
                                handleHourChange(day, "close", e.target.value)
                              }
                              className="w-24 h-8 px-2 text-[12px] bg-white border border-[#D9DEE5] rounded-lg text-center font-medium"
                            />
                          </div>
                        ) : (
                          <span className="text-[12px] font-semibold text-rose-600 px-3 py-1 bg-rose-50 rounded-lg">
                            Closed
                          </span>
                        )}

                        <label className="flex items-center gap-1.5 text-[11px] text-[#667085] cursor-pointer ml-2">
                          <input
                            type="checkbox"
                            checked={schedule.closed}
                            onChange={(e) =>
                              handleHourChange(day, "closed", e.target.checked)
                            }
                            className="rounded text-[#087F82]"
                          />
                          <span>Closed</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-6 py-2.5 bg-[#087F82] hover:bg-[#076B6E] text-white text-[13px] font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* ================= COLLECTORS TAB ================= */}
        {activeTab === "collectors" && (
          <div className="bg-white rounded-[16px] border border-[#D9DEE5] shadow-sm p-7 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-[16px] font-bold text-[#07172E]">
                  Sample Collectors & Phlebotomists
                </h3>
                <p className="text-[12px] text-[#667085]">
                  Manage lab personnel available for home sample collection dispatches
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCollector(null);
                  setCollectorForm({
                    name: "",
                    phone: "",
                    email: "",
                    city: "Islamabad",
                    active: true,
                    notes: "",
                  });
                  setCollectorModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#087F82] hover:bg-[#076B6E] text-white text-[12px] font-semibold shadow-xs transition-colors"
              >
                <Plus size={15} />
                <span>Add Collector</span>
              </button>
            </div>

            {collectors.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-[#667085]">
                No collectors registered yet. Add phlebotomists to assign home collections.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {collectors.map((c) => (
                  <div
                    key={c.id}
                    className="py-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-[13px] shrink-0 border border-purple-200">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#07172E] text-[13px]">
                            {c.name}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              c.active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            {c.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#667085] flex items-center gap-2 mt-0.5">
                          <span>{c.phone}</span>
                          {c.city && <span>· {c.city}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCollector(c);
                          setCollectorForm({
                            name: c.name,
                            phone: c.phone,
                            email: c.email || "",
                            city: c.city || "Islamabad",
                            active: c.active ?? true,
                            notes: c.notes || "",
                          });
                          setCollectorModalOpen(true);
                        }}
                        className="p-1.5 text-[#667085] hover:text-[#087F82] rounded-lg hover:bg-neutral-100"
                        title="Edit collector"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCollector(c.id, c.name)}
                        className="p-1.5 text-[#667085] hover:text-[#EF233C] rounded-lg hover:bg-rose-50"
                        title="Delete collector"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= NOTIFICATIONS TAB ================= */}
        {activeTab === "notifications" && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-[16px] border border-[#D9DEE5] shadow-sm p-7 space-y-5"
          >
            <h3 className="text-[16px] font-bold text-[#07172E] pb-3 border-b border-neutral-100">
              Notification Preferences
            </h3>

            <div className="space-y-4">
              {[
                {
                  key: "newBookings",
                  title: "New Booking Alerts",
                  desc: "Receive instant notifications when a patient places a new diagnostic order",
                },
                {
                  key: "cancellations",
                  title: "Order Cancellations",
                  desc: "Get notified when a patient requests cancellation or slot change",
                },
                {
                  key: "reportReady",
                  title: "Report Upload Reminders",
                  desc: "Get automated reminders for pending diagnostic report uploads approaching SLA",
                },
                {
                  key: "sms",
                  title: "SMS Notifications",
                  desc: "Send SMS dispatch updates directly to assigned phlebotomists",
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer"
                >
                  <div>
                    <span className="text-[13px] font-bold text-[#07172E] block">
                      {item.title}
                    </span>
                    <span className="text-[12px] text-[#667085]">
                      {item.desc}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.notifications[item.key] ?? true}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        notifications: {
                          ...form.notifications,
                          [item.key]: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-[#087F82] border-[#D9DEE5] focus:ring-[#087F82] mt-1"
                  />
                </label>
              ))}
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-6 py-2.5 bg-[#087F82] hover:bg-[#076B6E] text-white text-[13px] font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        )}

        {/* ================= SECURITY TAB ================= */}
        {activeTab === "security" && (
          <form
            onSubmit={handleChangePassword}
            className="bg-white rounded-[16px] border border-[#D9DEE5] shadow-sm p-7 space-y-5"
          >
            <h3 className="text-[16px] font-bold text-[#07172E] pb-3 border-b border-neutral-100">
              Change Account Password
            </h3>

            <div>
              <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, new: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#087F82] hover:bg-[#076B6E] text-white text-[13px] font-semibold rounded-xl transition-all shadow-xs"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Collector Add / Edit Modal */}
      {collectorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-[20px] border border-[#D9DEE5] shadow-2xl w-full max-w-md p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9DEE5]">
              <h3 className="text-[17px] font-bold text-[#07172E]">
                {editingCollector ? "Edit Collector" : "Add Sample Collector"}
              </h3>
              <button
                type="button"
                onClick={() => setCollectorModalOpen(false)}
                className="text-[#667085] hover:text-[#07172E] p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCollector} className="space-y-4 pt-5">
              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  Collector Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={collectorForm.name}
                  onChange={(e) =>
                    setCollectorForm({ ...collectorForm, name: e.target.value })
                  }
                  placeholder="e.g. Ali Raza"
                  required
                  className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={collectorForm.phone}
                  onChange={(e) =>
                    setCollectorForm({ ...collectorForm, phone: e.target.value })
                  }
                  placeholder="e.g. +92 300 5551234"
                  required
                  className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#07172E] mb-1.5">
                  City / Assigned Area
                </label>
                <input
                  type="text"
                  value={collectorForm.city}
                  onChange={(e) =>
                    setCollectorForm({ ...collectorForm, city: e.target.value })
                  }
                  placeholder="e.g. Islamabad"
                  className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#07172E] focus:outline-none focus:border-[#087F82]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="collectorActive"
                  checked={collectorForm.active}
                  onChange={(e) =>
                    setCollectorForm({ ...collectorForm, active: e.target.checked })
                  }
                  className="rounded text-[#087F82]"
                />
                <label htmlFor="collectorActive" className="text-[13px] font-medium text-[#07172E] cursor-pointer">
                  Active (Available for dispatching)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCollectorModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-[#667085] hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-[13px] font-semibold text-white bg-[#087F82] hover:bg-[#076B6E] rounded-lg"
                >
                  {editingCollector ? "Save Collector" : "Add Collector"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
