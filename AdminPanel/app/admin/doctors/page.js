"use client";

import { useState } from "react";
import {
  useAdminDoctors,
  useCreateDoctor,
  useUpdateDoctorStatus,
  useDeleteDoctor,
  useImpersonate,
  useAdminDoctorAppointments,
  useAdminHospitals,
  useAdminDoctorPracticeLocations,
  useCreateDoctorPracticeLocation,
  useUpdateDoctorPracticeLocation,
  useDeleteDoctorPracticeLocation,
} from "@/lib/hooks/useApi";
import { toast } from "sonner";
import {
  Users, CheckCircle, XCircle, Trash, SignIn, CaretLeft, CaretRight, MagnifyingGlass, Plus, X, Buildings, CalendarBlank, PencilSimple
} from "@phosphor-icons/react";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEFAULT_SLOT = "09:00 AM - 01:00 PM";

const emptyLocationForm = {
  hospital_id: "",
  fee: "",
  days: [],
  slots: DEFAULT_SLOT,
};
export default function AdminDoctorsPage() {
  const { data: doctors = [], isLoading } = useAdminDoctors();
  const { data: hospitals = [] } = useAdminHospitals();
  const createDoctorMutation = useCreateDoctor();
  const updateStatusMutation = useUpdateDoctorStatus();
  const deleteDoctorMutation = useDeleteDoctor();
  const impersonateMutation = useImpersonate();
  const createLocationMutation = useCreateDoctorPracticeLocation();
  const updateLocationMutation = useUpdateDoctorPracticeLocation();
  const deleteLocationMutation = useDeleteDoctorPracticeLocation();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [scheduleDoctor, setScheduleDoctor] = useState(null);
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [locationForm, setLocationForm] = useState(emptyLocationForm);
  const { data: doctorAppointmentsData } = useAdminDoctorAppointments(selectedDoctor?.id, {
    enabled: Boolean(selectedDoctor?.id),
  });
  const { data: practiceLocations = [], isLoading: locationsLoading } = useAdminDoctorPracticeLocations(
    scheduleDoctor?.id,
    { enabled: Boolean(scheduleDoctor?.id) }
  );  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    experience_years: "",
    fee: "",
    hospital_id: "",
  });

  const filteredDoctors = doctors.filter(d => 
    (d.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const currentDoctors = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await createDoctorMutation.mutateAsync({
        ...formData,
        hospital_id: formData.hospital_id || null,
      });
      toast.success("Doctor added successfully!");
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", specialty: "", experience_years: "", fee: "", hospital_id: "" });
    } catch (err) {
      toast.error(err.message || "Failed to add doctor");
    }
  };

  const handleUpdateStatus = async (id, is_active) => {
    try {
      await updateStatusMutation.mutateAsync({ id, is_active, note: "Updated by Admin" });
      toast.success(`Doctor marked as ${is_active ? 'Active' : 'Inactive'}`);
    } catch (e) {
      toast.error(e.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this doctor?")) return;
    try {
      await deleteDoctorMutation.mutateAsync(id);
      toast.success("Doctor deleted successfully!");
    } catch (e) {
      toast.error(e.message || "Failed to delete doctor");
    }
  };

  const handleImpersonate = async (doctor) => {
    try {
      const res = await impersonateMutation.mutateAsync({ entity_id: doctor.id, role: 'doctor' });
      const { setPartnerSession } = await import("@/lib/partnerAuth");
      setPartnerSession({
        tokens: res.tokens || res.data?.tokens,
        role: res.role || res.data?.role || 'doctor',
        partner: res.profile || res.data?.profile || res.partner,
      });
      toast.success(`Logged in as ${doctor.name}`);
      const { partnerRoutes } = await import("@/lib/constants/partnerRoutes");
      window.open(partnerRoutes.doctor.dashboard, '_blank');
    } catch (e) {
      toast.error(e.message || "Failed to impersonate");
    }
  };

  const toggleDay = (day) => {
    setLocationForm((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const openScheduleModal = (doctor) => {
    setScheduleDoctor(doctor);
    setEditingLocationId(null);
    setLocationForm({
      ...emptyLocationForm,
      fee: doctor.fee ? String(doctor.fee) : "",
    });
  };

  const startEditLocation = (location) => {
    setEditingLocationId(location.id);
    setLocationForm({
      hospital_id: location.hospital_id || "",
      fee: location.fee ? String(location.fee) : "",
      days: location.days || [],
      slots: location.schedule?.find((entry) => entry.slots?.length)?.slots?.[0] || DEFAULT_SLOT,
    });
  };

  const resetLocationForm = () => {
    setEditingLocationId(null);
    setLocationForm({
      ...emptyLocationForm,
      fee: scheduleDoctor?.fee ? String(scheduleDoctor.fee) : "",
    });
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!scheduleDoctor) return;
    if (!locationForm.hospital_id) {
      toast.error("Please select a hospital");
      return;
    }
    if (!locationForm.days.length) {
      toast.error("Select at least one day");
      return;
    }

    const payload = {
      hospital_id: locationForm.hospital_id,
      fee: locationForm.fee || scheduleDoctor.fee,
      days: locationForm.days,
      slots: [locationForm.slots || DEFAULT_SLOT],
    };

    try {
      if (editingLocationId) {
        await updateLocationMutation.mutateAsync({
          doctorId: scheduleDoctor.id,
          locationId: editingLocationId,
          data: payload,
        });
        toast.success("Hospital schedule updated");
      } else {
        await createLocationMutation.mutateAsync({
          doctorId: scheduleDoctor.id,
          data: payload,
        });
        toast.success("Hospital schedule added");
      }
      resetLocationForm();
    } catch (err) {
      toast.error(err.message || "Failed to save location");
    }
  };

  const closeScheduleModal = () => {
    setScheduleDoctor(null);
    setEditingLocationId(null);
    setLocationForm(emptyLocationForm);
  };

  const handleDeleteLocation = async (locationId) => {
    if (!scheduleDoctor || !confirm("Remove this hospital from the doctor's schedule?")) return;
    try {
      await deleteLocationMutation.mutateAsync({ doctorId: scheduleDoctor.id, locationId });
      if (editingLocationId === locationId) resetLocationForm();
      toast.success("Location removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove location");
    }
  };
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#0C1A2E] tracking-tight mb-2">
            Telehealth Management
          </h1>
          <p className="text-[#0C1A2E]/60 text-sm font-medium">
            Approve, monitor, and manage doctors on the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B6E72] hover:bg-[#084F52] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} weight="bold" /> 
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#0C1A2E]/10 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#0C1A2E]/10 bg-[#F6F8FA]/50">
          <div className="relative w-full sm:w-[320px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C1A2E]/40" />
            <input 
              type="text"
              placeholder="Search doctors..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full h-[40px] pl-10 pr-4 rounded-lg border border-[#0C1A2E]/10 bg-white text-sm outline-none focus:border-[#0B6E72]"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F8FA] border-b border-[#0C1A2E]/10 text-xs font-bold text-[#0C1A2E]/60 uppercase">
                <th className="p-4 pl-6">Doctor Details</th>
                <th className="p-4">Specialty & Experience</th>
                <th className="p-4">Hospital</th>
                <th className="p-4">Consultation Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0C1A2E]/5">
              {isLoading ? (
                <tr><td colSpan="6" className="p-8 text-center text-[#0C1A2E]/40">Loading...</td></tr>
              ) : currentDoctors.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-[#0C1A2E]/40">No doctors found.</td></tr>
              ) : (
                currentDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-[#E6F4F5]/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="text-sm font-bold text-[#0C1A2E]">{doctor.name}</div>
                      <div className="text-xs text-[#0C1A2E]/50">{doctor.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-semibold">{doctor.specialty}</div>
                      <div className="text-xs text-[#0C1A2E]/50">{doctor.experience_years} Years Experience</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-[#0C1A2E]">{doctor.hospital || "Independent Practice"}</div>
                    </td>
                    <td className="p-4 text-sm font-medium">${doctor.fee?.toFixed(2) || '0.00'}</td>
                    <td className="p-4">
                      {doctor.is_active ? (
                         <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/20">Active</span>
                      ) : (
                         <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openScheduleModal(doctor)}
                          className="px-3 py-1.5 flex items-center gap-1 text-xs font-semibold rounded bg-white border border-[#0B6E72]/30 text-[#0B6E72] hover:bg-[#E6F4F5]"
                        >
                          <CalendarBlank size={14} /> Hospitals
                        </button>
                        <button
                          onClick={() => setSelectedDoctor(doctor)}                          className="px-3 py-1.5 text-xs font-semibold rounded bg-white border border-[#0C1A2E]/10 hover:bg-[#F6F8FA]"
                        >
                          View Appointments
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(doctor.id, !doctor.is_active)}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-white border border-[#0C1A2E]/10 hover:bg-[#F6F8FA]"
                        >
                          {doctor.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleImpersonate(doctor)}
                          disabled={impersonateMutation.isPending}
                          className="px-3 py-1.5 flex items-center gap-1 text-xs font-bold rounded bg-[#0B6E72] text-white hover:bg-[#084F52]"
                          title="Magic Login"
                        >
                          <SignIn size={14} /> Log In As
                        </button>
                        <button 
                          onClick={() => handleDelete(doctor.id)}
                          className="p-1.5 text-[#DC2626]/60 hover:text-[#DC2626]"
                        >
                          <Trash size={18} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A2E]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#0C1A2E]/10 bg-[#F6F8FA]">
              <h2 className="text-xl font-bold text-[#0C1A2E] font-[var(--font-dm-serif-display)]">Add New Doctor</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#0C1A2E]/40 hover:text-[#0C1A2E] transition-colors">
                <X size={20} weight="bold" />
              </button>
            </div>
            
            <form onSubmit={handleAddDoctor} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Doctor Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" placeholder="Dr. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Email Login</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" placeholder="doctor@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Default Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Specialty</label>
                <input required type="text" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" placeholder="e.g. Cardiologist" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Experience (Years)</label>
                  <input required type="number" value={formData.experience_years} onChange={e => setFormData({...formData, experience_years: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Consultation Fee</label>
                  <input required type="number" step="0.01" value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Hospital</label>
                <select
                  value={formData.hospital_id}
                  onChange={(e) => setFormData({ ...formData, hospital_id: e.target.value })}
                  className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm bg-white"
                >
                  <option value="">Independent Practice (no hospital)</option>
                  {hospitals.filter((h) => h.is_active).map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0C1A2E] hover:bg-[#F6F8FA] transition-colors">Cancel</button>
                <button type="submit" disabled={createDoctorMutation.isPending} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#0B6E72] text-white hover:bg-[#084F52] disabled:opacity-50 transition-colors">
                  {createDoctorMutation.isPending ? "Adding..." : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {scheduleDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A2E]/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between p-6 border-b border-[#0C1A2E]/10 bg-[#F6F8FA] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#0C1A2E] font-[var(--font-dm-serif-display)]">
                  Hospital Schedule — {scheduleDoctor.name}
                </h2>
                <p className="text-sm text-[#0C1A2E]/60 mt-1">
                  Set which days this doctor works at each hospital (e.g. Monday at Hospital A, Tuesday at Hospital B).
                </p>
              </div>
              <button onClick={closeScheduleModal} className="text-[#0C1A2E]/40 hover:text-[#0C1A2E]">
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#0C1A2E] mb-3 flex items-center gap-2">
                  <Buildings size={16} /> Current locations
                </h3>
                {locationsLoading ? (
                  <p className="text-sm text-[#0C1A2E]/50">Loading...</p>
                ) : practiceLocations.length === 0 ? (
                  <p className="text-sm text-[#0C1A2E]/50 p-4 rounded-lg border border-dashed border-[#0C1A2E]/15">
                    No hospitals added yet. Add the first location below.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {practiceLocations.map((location) => (
                      <div
                        key={location.id}
                        className={`flex items-start justify-between gap-3 p-4 rounded-xl border bg-white ${
                          editingLocationId === location.id
                            ? "border-[#0B6E72] shadow-sm"
                            : "border-[#0C1A2E]/10"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[#0C1A2E]">{location.title}</p>
                          {location.address && (
                            <p className="text-xs text-[#0C1A2E]/50 mt-0.5">{location.address}</p>
                          )}
                          <p className="text-xs font-semibold text-[#0B6E72] mt-2">
                            {location.days?.join(" ") || "No days set"}
                          </p>
                          <p className="text-xs text-[#0C1A2E]/60 mt-1">{location.availability}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[#0C1A2E]">PKR {(location.fee || 0).toLocaleString()}</p>
                          <div className="flex items-center justify-end gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => startEditLocation(location)}
                              className="p-1.5 rounded-md text-[#0C1A2E]/50 hover:text-[#0B6E72] hover:bg-[#E6F4F5]"
                              title="Edit"
                            >
                              <PencilSimple size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLocation(location.id)}
                              className="text-xs font-semibold text-[#DC2626] hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveLocation} className="p-5 rounded-xl border border-[#0B6E72]/20 bg-[#E6F4F5]/30 space-y-4">
                <h3 className="text-sm font-bold text-[#0C1A2E]">
                  {editingLocationId ? "Edit hospital schedule" : "Add hospital location"}
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0C1A2E] mb-1.5">Hospital</label>
                    <select
                      required
                      value={locationForm.hospital_id}
                      onChange={(e) => setLocationForm({ ...locationForm, hospital_id: e.target.value })}
                      disabled={Boolean(editingLocationId)}
                      className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 text-sm bg-white outline-none focus:border-[#0B6E72] disabled:bg-[#F6F8FA]"
                    >
                      <option value="">Select hospital</option>
                      {hospitals.filter((h) => h.is_active).map((hospital) => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0C1A2E] mb-1.5">Fee at this hospital (PKR)</label>
                    <input
                      type="number"
                      value={locationForm.fee}
                      onChange={(e) => setLocationForm({ ...locationForm, fee: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 text-sm outline-none focus:border-[#0B6E72]"
                      placeholder={scheduleDoctor.fee ? String(scheduleDoctor.fee) : "2500"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1A2E] mb-2">Days at this hospital</label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          locationForm.days.includes(day)
                            ? "bg-[#0B6E72] text-white border-[#0B6E72]"
                            : "bg-white text-[#0C1A2E]/70 border-[#0C1A2E]/15 hover:border-[#0B6E72]/40"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1A2E] mb-1.5">Hours (time range)</label>
                  <input
                    type="text"
                    value={locationForm.slots}
                    onChange={(e) => setLocationForm({ ...locationForm, slots: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 text-sm outline-none focus:border-[#0B6E72]"
                    placeholder="09:00 AM - 01:00 PM"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={createLocationMutation.isPending || updateLocationMutation.isPending}
                    className="flex-1 min-w-[180px] h-11 rounded-lg bg-[#0B6E72] text-white text-sm font-semibold hover:bg-[#084F52] disabled:opacity-50"
                  >
                    {createLocationMutation.isPending || updateLocationMutation.isPending
                      ? "Saving..."
                      : editingLocationId
                        ? "Save changes"
                        : "Add hospital schedule"}
                  </button>
                  {editingLocationId && (
                    <button
                      type="button"
                      onClick={resetLocationForm}
                      className="h-11 px-4 rounded-lg text-sm font-semibold border border-[#0C1A2E]/15 hover:bg-white"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedDoctor && (        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A2E]/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#0C1A2E]/10">
              <div>
                <h2 className="text-xl font-bold text-[#0C1A2E]">{selectedDoctor.name} Appointments</h2>
                <p className="text-sm text-[#0C1A2E]/60">
                  Revenue: PKR {(doctorAppointmentsData?.summary?.revenue || 0).toLocaleString()} ·
                  Completed: {doctorAppointmentsData?.summary?.completed || 0} ·
                  Pending: {doctorAppointmentsData?.summary?.pending || 0}
                </p>
              </div>
              <button onClick={() => setSelectedDoctor(null)} className="text-[#0C1A2E]/40 hover:text-[#0C1A2E]">
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-6 space-y-3">
              {(doctorAppointmentsData?.appointments || []).length === 0 ? (
                <p className="text-sm text-[#0C1A2E]/50">No appointments found for this doctor.</p>
              ) : (
                doctorAppointmentsData.appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-[#0C1A2E]/10 rounded-lg p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#0C1A2E]">{appointment.customer?.name || "Patient"}</p>
                        <p className="text-xs text-[#0C1A2E]/50">
                          {new Date(appointment.appointment_date).toLocaleString()} · {appointment.slot}
                        </p>
                      </div>
                      <span className="text-xs font-bold uppercase">{appointment.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
