"use client";

import { useState } from "react";
import { Buildings, PencilSimple, Trash } from "@phosphor-icons/react";
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

export function HospitalScheduleManager() {
  const { data: profile } = useDoctorPortalProfile();
  const { data: hospitals = [], isLoading: hospitalsLoading } = useDoctorPortalHospitals();
  const { data: locations = [], isLoading: locationsLoading } = useDoctorPortalPracticeLocations();
  const createLocation = useCreateDoctorPracticeLocation();
  const updateLocation = useUpdateDoctorPracticeLocation();
  const deleteLocation = useDeleteDoctorPracticeLocation();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const resetForm = () => {
    setForm({ ...emptyForm, fee: profile?.fee ? String(profile.fee) : "" });
    setEditingId(null);
  };

  const startEdit = (location) => {
    setEditingId(location.id);
    setForm({
      hospital_id: location.hospital_id || "",
      fee: location.fee ? String(location.fee) : "",
      days: location.days || [],
      slots: location.schedule?.find((entry) => entry.slots?.length)?.slots?.[0] || DEFAULT_SLOT,
    });
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

    const payload = {
      hospital_id: form.hospital_id,
      fee: form.fee || profile?.fee,
      days: form.days,
      slots: [form.slots || DEFAULT_SLOT],
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
    if (!confirm("Remove this hospital from your schedule?")) return;
    try {
      await deleteLocation.mutateAsync(locationId);
      if (editingId === locationId) resetForm();
      toast.success("Location removed");
    } catch (error) {
      toast.error(error.message || "Could not remove location");
    }
  };

  const isSaving = createLocation.isPending || updateLocation.isPending;

  if (locationsLoading || hospitalsLoading) {
    return <p className="text-sm text-neutral-500">Loading hospital schedules...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-[12px] bg-brand-light/60 border border-brand-primary/15 text-[13px] text-neutral-600">
        Add each hospital where you see patients in person. Pick the days you work there — for example,
        Monday at Cheema Heart and Tuesday at National Hospital. Patients will only see slots on those days
        for that hospital.
      </div>

      <div>
        <h2 className="text-[16px] font-bold text-ink-headline mb-3 flex items-center gap-2">
          <Buildings size={18} className="text-brand-primary" />
          Your hospital locations
        </h2>

        {locations.length === 0 ? (
          <p className="text-sm text-neutral-500 p-5 rounded-[12px] border border-dashed border-neutral-200">
            No hospital locations yet. Add your first one below.
          </p>
        ) : (
          <div className="space-y-3">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`p-4 rounded-[14px] border bg-white ${
                  editingId === location.id
                    ? "border-brand-primary shadow-sm"
                    : "border-neutral-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink-headline">{location.title}</p>
                    {location.address && (
                      <p className="text-xs text-neutral-500 mt-0.5">{location.address}</p>
                    )}
                    <p className="text-xs font-semibold text-brand-primary mt-2">
                      {location.days?.join(" ") || "No days set"}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">{location.availability}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-ink-headline">
                      PKR {(location.fee || 0).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => startEdit(location)}
                        className="p-1.5 rounded-md text-neutral-500 hover:text-brand-primary hover:bg-brand-light"
                        title="Edit"
                      >
                        <PencilSimple size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(location.id)}
                        className="p-1.5 rounded-md text-status-danger hover:bg-status-danger/10"
                        title="Remove"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-[16px] border border-brand-primary/20 bg-brand-light/30 space-y-4"
      >
        <h3 className="text-[15px] font-bold text-ink-headline">
          {editingId ? "Edit hospital schedule" : "Add hospital location"}
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Hospital</label>
            <select
              required
              value={form.hospital_id}
              onChange={(e) => setForm({ ...form, hospital_id: e.target.value })}
              disabled={Boolean(editingId)}
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm bg-white outline-none focus:border-brand-primary disabled:bg-neutral-50"
            >
              <option value="">Select hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                  {hospital.city ? ` (${hospital.city})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Fee at this hospital (PKR)</label>
            <Input
              type="number"
              value={form.fee}
              onChange={(e) => setForm({ ...form, fee: e.target.value })}
              placeholder={profile?.fee ? String(profile.fee) : "2500"}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-2">Days you work here</label>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  form.days.includes(day)
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-brand-primary/40"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Hours (time range)</label>
          <Input
            value={form.slots}
            onChange={(e) => setForm({ ...form, slots: e.target.value })}
            placeholder="09:00 AM - 01:00 PM"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Add hospital schedule"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
