"use client";

import { useState } from "react";
import {
  useAdminHospitals,
  useCreateHospital,
  useUpdateHospital,
  useUpdateHospitalStatus,
  useDeleteHospital,
} from "@/lib/hooks/useApi";
import { toast } from "sonner";
import { Buildings, MagnifyingGlass, Plus, X, PencilSimple, Trash } from "@phosphor-icons/react";

const emptyForm = {
  name: "",
  logo: "",
  cover_image: "",
  description: "",
  address: "",
  city: "",
  phone: "",
  email: "",
};

export default function AdminHospitalsPage() {
  const { data: hospitals = [], isLoading } = useAdminHospitals();
  const createMutation = useCreateHospital();
  const updateMutation = useUpdateHospital();
  const statusMutation = useUpdateHospitalStatus();
  const deleteMutation = useDeleteHospital();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = hospitals.filter(
    (h) =>
      (h.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (h.city || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (hospital) => {
    setEditingId(hospital.id);
    setFormData({
      name: hospital.name || "",
      logo: hospital.logo || "",
      cover_image: hospital.cover_image || "",
      description: hospital.description || "",
      address: hospital.address || "",
      city: hospital.city || "",
      phone: hospital.phone || "",
      email: hospital.email || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
        toast.success("Hospital updated successfully!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Hospital created successfully!");
      }
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to save hospital");
    }
  };

  const handleToggleStatus = async (hospital) => {
    try {
      await statusMutation.mutateAsync({ id: hospital.id, is_active: !hospital.is_active });
      toast.success(`Hospital ${hospital.is_active ? "deactivated" : "activated"}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (hospital) => {
    if (!confirm(`Delete "${hospital.name}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(hospital.id);
      toast.success("Hospital deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete hospital");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#0C1A2E] tracking-tight mb-2">
            Hospitals Management
          </h1>
          <p className="text-[#0C1A2E]/60 text-sm font-medium">
            Create and manage hospitals. Assign doctors to hospitals from the Doctors page.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0B6E72] hover:bg-[#084F52] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={18} weight="bold" />
          <span>Add Hospital</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#0C1A2E]/10 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#0C1A2E]/10 bg-[#F6F8FA]/50">
          <div className="relative w-full sm:w-[320px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C1A2E]/40" />
            <input
              type="text"
              placeholder="Search hospitals..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-[40px] pl-10 pr-4 rounded-lg border border-[#0C1A2E]/10 bg-white text-sm outline-none focus:border-[#0B6E72]"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F8FA] border-b border-[#0C1A2E]/10 text-xs font-bold text-[#0C1A2E]/60 uppercase">
                <th className="p-4 pl-6">Hospital</th>
                <th className="p-4">Location</th>
                <th className="p-4">Doctors</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0C1A2E]/5">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#0C1A2E]/40">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#0C1A2E]/40">
                    No hospitals found.
                  </td>
                </tr>
              ) : (
                currentItems.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-[#E6F4F5]/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#E6F4F5] flex items-center justify-center text-[#0B6E72]">
                          <Buildings size={20} weight="duotone" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#0C1A2E]">{hospital.name}</div>
                          <div className="text-xs text-[#0C1A2E]/50">{hospital.email || hospital.phone || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{hospital.city || "—"}</div>
                      <div className="text-xs text-[#0C1A2E]/50 max-w-[200px] truncate">{hospital.address || ""}</div>
                    </td>
                    <td className="p-4 text-sm font-semibold">{hospital._count?.doctors ?? 0}</td>
                    <td className="p-4">
                      {hospital.is_active ? (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/20">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(hospital)}
                          className="p-1.5 text-[#0C1A2E]/60 hover:text-[#0B6E72]"
                          title="Edit"
                        >
                          <PencilSimple size={18} weight="bold" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(hospital)}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-white border border-[#0C1A2E]/10 hover:bg-[#F6F8FA]"
                        >
                          {hospital.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(hospital)}
                          className="p-1.5 text-[#DC2626]/60 hover:text-[#DC2626]"
                          title="Delete"
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A2E]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#0C1A2E]/10 bg-[#F6F8FA] sticky top-0">
              <h2 className="text-xl font-bold text-[#0C1A2E] font-[var(--font-dm-serif-display)]">
                {editingId ? "Edit Hospital" : "Add New Hospital"}
              </h2>
              <button onClick={closeModal} className="text-[#0C1A2E]/40 hover:text-[#0C1A2E] transition-colors">
                <X size={20} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Hospital Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm"
                  placeholder="Cheema Heart Complex"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm"
                    placeholder="Lahore"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm"
                    placeholder="+92 42 1234567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm"
                  placeholder="info@hospital.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm resize-none"
                  placeholder="Brief description of the hospital"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Banner URL</label>
                  <input
                    type="url"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0C1A2E] hover:bg-[#F6F8FA] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#0B6E72] text-white hover:bg-[#084F52] disabled:opacity-50 transition-colors"
                >
                  {isSaving ? "Saving..." : editingId ? "Save Changes" : "Create Hospital"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
