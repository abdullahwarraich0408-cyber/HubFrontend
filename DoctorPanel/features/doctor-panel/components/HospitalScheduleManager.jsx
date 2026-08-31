"use client";

import { useState } from "react";
import { Building2, Edit2, Trash2, Plus, X, Clock, MapPin, Check, Calendar } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import {
  useDoctorPortalHospitals,
  useDoctorPortalPracticeLocations,
  useCreateDoctorPracticeLocation,
  useUpdateDoctorPracticeLocation,
  useDeleteDoctorPracticeLocation,
  useDoctorPortalProfile,
} from "@/lib/hooks/usePartnerPortal";
import { toast } from "sonner";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEFAULT_SLOT = "09:00 AM - 01:00 PM";

const emptyForm = {
  hospital_id: "",
  fee: "",
  days: [],
  slots: DEFAULT_SLOT,
};

function parseTimePart(part) {
  if (!part) return null;
  const str = String(part).trim();
  const match12 = str.match(/^(0?[1-9]|1[0-2])(?::([0-5][0-9]))?\s*(AM|PM|am|pm)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2] ? parseInt(match12[2], 10) : 0;
    const meridiem = match12[3].toUpperCase();
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }
  const match24 = str.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }
  return null;
}

function formatMinutes(minutes) {
  const hrs24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const meridiem = hrs24 >= 12 ? "PM" : "AM";
  const hrs12 = hrs24 % 12 || 12;
  return `${String(hrs12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${meridiem}`;
}

export function validateAndFormatTimeSlot(rawSlot) {
  if (!rawSlot || typeof rawSlot !== "string") return null;
  const parts = rawSlot.replace(/[–—]/g, "-").split("-").map((p) => p.trim()).filter(Boolean);
  if (parts.length !== 2) return null;
  const start = parseTimePart(parts[0]);
  const end = parseTimePart(parts[1]);
  if (start == null || end == null || end <= start) return null;
  return `${formatMinutes(start)} - ${formatMinutes(end)}`;
}

export function HospitalScheduleManager() {
  const { data: profile } = useDoctorPortalProfile();
  const { data: hospitals = [], isLoading: hospitalsLoading } = useDoctorPortalHospitals();
  const { data: locations = [], isLoading: locationsLoading } = useDoctorPortalPracticeLocations();
  const createLocation = useCreateDoctorPracticeLocation();
  const updateLocation = useUpdateDoctorPracticeLocation();
  const deleteLocation = useDeleteDoctorPracticeLocation();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const resetForm = () => {
    setForm({ ...emptyForm, fee: profile?.fee ? String(profile.fee) : "" });
    setEditingId(null);
    setDrawerOpen(false);
  };

  const startEdit = (location) => {
    setEditingId(location.id);
    setForm({
      hospital_id: location.hospital_id || "",
      fee: location.fee ? String(location.fee) : "",
      days: location.days || [],
      slots: location.schedule?.find((entry) => entry.slots?.length)?.slots?.[0] || DEFAULT_SLOT,
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hospital_id) {
      toast.error("Please select a hospital");
      return;
    }
    if (!form.days.length) {
      toast.error("Select at least one day");
      return;
    }

    const slotInput = form.slots || DEFAULT_SLOT;
    const formattedSlot = validateAndFormatTimeSlot(slotInput);
    if (!formattedSlot) {
      toast.error("Invalid consultation hours format. Please use a valid format (e.g., 09:00 AM - 01:00 PM)");
      return;
    }

    const payload = {
      hospital_id: form.hospital_id,
      fee: form.fee || profile?.fee,
      days: form.days,
      slots: [formattedSlot],
    };

    try {
      if (editingId) {
        await updateLocation.mutateAsync({ locationId: editingId, data: payload });
        toast.success("Hospital schedule updated");
      } else {
        await createLocation.mutateAsync(payload);
        toast.success("Hospital schedule added");
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || "Could not save hospital schedule");
    }
  };

  const handleDelete = async (locationId) => {
    if (!confirm("Remove this hospital from your practice schedule?")) return;
    try {
      await deleteLocation.mutateAsync(locationId);
      if (editingId === locationId) resetForm();
      toast.success("Hospital location removed");
    } catch (error) {
      toast.error(error.message || "Could not remove location");
    }
  };

  const isSaving = createLocation.isPending || updateLocation.isPending;

  if (locationsLoading || hospitalsLoading) {
    return <p className="text-xs text-slate-500 py-6 text-center">Loading practice locations...</p>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-4 sm:p-5 rounded-xl border border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 size={15} />
            <span>Hospital Affiliations</span>
          </div>
          <h2 className="text-base font-bold text-white">In-Person Practice Locations</h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            Configure specific practice days, consultation fees (PKR), and clinic hours per hospital location.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setDrawerOpen(true);
          }}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <Plus size={16} />
          <span>Add Practice Location</span>
        </button>
      </div>

      {/* Clean Table/List View with Thin Dividers */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Active Practice Locations ({locations.length})
          </h3>
        </div>

        {locations.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Building2 size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-800">No hospital practice locations added yet</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
              Add your affiliated hospitals so patients can book physical in-person appointments on your active days.
            </p>
            <button
              onClick={() => {
                resetForm();
                setDrawerOpen(true);
              }}
              className="mt-4 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            >
              Add First Location
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {locations.map((location) => (
              <div
                key={location.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-teal-600 shrink-0" />
                    <h4 className="font-bold text-slate-900 text-sm truncate">{location.title}</h4>
                  </div>
                  {location.address && (
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <MapPin size={13} className="shrink-0" />
                      <span className="truncate">{location.address}</span>
                    </div>
                  )}

                  {/* Active Days Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {WEEKDAYS.map((day) => {
                      const isWorking = location.days?.includes(day);
                      return (
                        <span
                          key={day}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                            isWorking
                              ? "bg-teal-50 text-teal-700 border-teal-200/80"
                              : "bg-slate-50 text-slate-400 border-slate-200/60 opacity-60"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Consultation Fee
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      PKR {Number(location.fee || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{location.availability || DEFAULT_SLOT}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(location)}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Schedule"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Location"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOCATION ADD / EDIT SIDE DRAWER */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-end transition-all duration-300 animate-in fade-in"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col border-l border-slate-200/80 transform transition-all duration-300 animate-in slide-in-from-right overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 bg-[#0A0F1D] text-white border-b border-white/10 flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-36 h-36 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white tracking-tight">
                    {editingId ? "Edit Practice Location" : "Add Practice Location"}
                  </h3>
                  <span className="text-[11px] text-slate-400">Configure clinic hours and consultation fees</span>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all relative z-10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/40">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
                <label className="block text-xs font-bold text-slate-900">
                  Select Hospital / Medical Center *
                </label>
                <select
                  required
                  value={form.hospital_id}
                  onChange={(e) => setForm({ ...form, hospital_id: e.target.value })}
                  disabled={Boolean(editingId)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white disabled:opacity-60 font-medium transition-all"
                >
                  <option value="">Choose hospital from directory...</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} {hospital.city ? `(${hospital.city})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
                <label className="block text-xs font-bold text-slate-900">
                  Consultation Fee (PKR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                    PKR
                  </span>
                  <input
                    type="number"
                    required
                    value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: e.target.value })}
                    placeholder={profile?.fee ? String(profile.fee) : "2500"}
                    className="w-full h-11 pl-14 pr-3.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                <label className="block text-xs font-bold text-slate-900">
                  Working Practice Days *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {WEEKDAYS.map((day) => {
                    const isSelected = form.days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 scale-[1.02]"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
                <label className="block text-xs font-bold text-slate-900">
                  Practice Hours (Time Window)
                </label>
                <input
                  type="text"
                  value={form.slots}
                  onChange={(e) => setForm({ ...form, slots: e.target.value })}
                  placeholder="e.g. 09:00 AM - 01:00 PM"
                  className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white font-medium transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 disabled:opacity-60 active:scale-[0.99]"
                >
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Add Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

