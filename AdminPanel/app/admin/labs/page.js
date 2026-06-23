"use client";

import { useState } from "react";
import { useAdminLabs, useCreateLab, useUpdateLabStatus, useDeleteLab, useImpersonate } from "@/lib/hooks/useApi";
import { toast } from "sonner";
import { 
  Pill, CheckCircle, XCircle, Trash, SignIn, MagnifyingGlass, Plus, X
} from "@phosphor-icons/react";

export default function AdminLabsPage() {
  const { data: labs = [], isLoading } = useAdminLabs();
  const createLabMutation = useCreateLab();
  const updateStatusMutation = useUpdateLabStatus();
  const deleteLabMutation = useDeleteLab();
  const impersonateMutation = useImpersonate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    license_number: ""
  });

  const filteredLabs = labs.filter(l => 
    (l.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);
  const currentLabs = filteredLabs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddLab = async (e) => {
    e.preventDefault();
    try {
      await createLabMutation.mutateAsync(formData);
      toast.success("Lab partner added successfully!");
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", license_number: "" });
    } catch (err) {
      toast.error(err.message || "Failed to add lab partner");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status, note: "Status updated by Admin" });
      toast.success(`Lab marked as ${status}`);
    } catch (e) {
      toast.error(e.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this lab partner?")) return;
    try {
      await deleteLabMutation.mutateAsync(id);
      toast.success("Lab deleted successfully!");
    } catch (e) {
      toast.error(e.message || "Failed to delete lab");
    }
  };

  const handleImpersonate = async (lab) => {
    try {
      const res = await impersonateMutation.mutateAsync({ entity_id: lab.id, role: "lab" });
      const tokens = res?.tokens || res?.data?.tokens;
      const role = res?.role || res?.data?.role || "lab";
      const profile = res?.profile || res?.data?.profile;
      if (!tokens) throw new Error("Impersonation tokens missing");

      toast.success(`Logged in as ${lab.name}`);
      const labPanelUrl = process.env.NEXT_PUBLIC_LAB_PANEL_URL || "http://localhost:3004";
      const params = new URLSearchParams({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || "",
        role,
        partner: profile ? JSON.stringify(profile) : "",
      });
      window.open(`${labPanelUrl}/lab/dashboard?${params.toString()}`, "_blank");
    } catch (e) {
      toast.error(e.message || "Failed to impersonate");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#0C1A2E] tracking-tight mb-2">
            Lab Partners Management
          </h1>
          <p className="text-[#0C1A2E]/60 text-sm font-medium">
            Approve, monitor, and manage diagnostic partners on the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B6E72] hover:bg-[#084F52] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} weight="bold" /> 
            <span>Add Lab Partner</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#0C1A2E]/10 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#0C1A2E]/10 bg-[#F6F8FA]/50">
          <div className="relative w-full sm:w-[320px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C1A2E]/40" />
            <input 
              type="text"
              placeholder="Search labs..." 
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
                <th className="p-4 pl-6">Lab Details</th>
                <th className="p-4">License Number</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0C1A2E]/5">
              {isLoading ? (
                <tr><td colSpan="4" className="p-8 text-center text-[#0C1A2E]/40">Loading...</td></tr>
              ) : currentLabs.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-[#0C1A2E]/40">No labs found.</td></tr>
              ) : (
                currentLabs.map((lab) => (
                  <tr key={lab.id} className="hover:bg-[#E6F4F5]/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="text-sm font-bold text-[#0C1A2E]">{lab.name}</div>
                      <div className="text-xs text-[#0C1A2E]/50">{lab.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-mono font-bold bg-[#F6F8FA] inline-block px-2 py-1 rounded border border-[#0C1A2E]/10">
                        {lab.license_number || "Not provided"}
                      </div>
                    </td>
                    <td className="p-4">
                      {lab.status === 'approved' && <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/20">Approved</span>}
                      {lab.status === 'pending' && <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20">Pending</span>}
                      {lab.status === 'rejected' && <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">Rejected</span>}
                      {lab.status === 'suspended' && <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">Suspended</span>}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {lab.status !== 'approved' && (
                          <button 
                            onClick={() => handleUpdateStatus(lab.id, 'approved')}
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-[#0F9D58]/10 text-[#0F9D58] hover:bg-[#0F9D58]/20"
                          >
                            Approve
                          </button>
                        )}
                        {lab.status === 'approved' && (
                          <button 
                            onClick={() => handleUpdateStatus(lab.id, 'suspended')}
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20"
                          >
                            Suspend
                          </button>
                        )}
                        <button 
                          onClick={() => handleImpersonate(lab)}
                          disabled={impersonateMutation.isPending}
                          className="px-3 py-1.5 flex items-center gap-1 text-xs font-bold rounded bg-[#0B6E72] text-white hover:bg-[#084F52]"
                          title="Magic Login"
                        >
                          <SignIn size={14} /> Log In As
                        </button>
                        <button 
                          onClick={() => handleDelete(lab.id)}
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
              <h2 className="text-xl font-bold text-[#0C1A2E] font-[var(--font-dm-serif-display)]">Add New Lab Partner</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#0C1A2E]/40 hover:text-[#0C1A2E] transition-colors">
                <X size={20} weight="bold" />
              </button>
            </div>
            
            <form onSubmit={handleAddLab} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Lab Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" placeholder="e.g. City Diagnostics Lab" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Email Login</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" placeholder="lab@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Default Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">License Number</label>
                <input required type="text" value={formData.license_number} onChange={e => setFormData({...formData, license_number: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] text-sm" placeholder="e.g. LAB-12345" />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0C1A2E] hover:bg-[#F6F8FA] transition-colors">Cancel</button>
                <button type="submit" disabled={createLabMutation.isPending} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#0B6E72] text-white hover:bg-[#084F52] disabled:opacity-50 transition-colors">
                  {createLabMutation.isPending ? "Adding..." : "Add Lab Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
