"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Plus, MagnifyingGlass, Funnel, DotsThree, Storefront, ShieldCheck, X, 
  Copy, Eye, CheckCircle, XCircle, PencilSimple, DownloadSimple, 
  CaretLeft, CaretRight, ArrowsDownUp, CaretDown, FileText, Trash, SignIn, MapPin, Spinner
} from "@phosphor-icons/react";
import { useAdminVendors, useAdminCreateVendor, useUpdateVendorStatus, useUpdateVendorCredentials, useDeleteVendor, useImpersonate } from "@/lib/hooks/useApi";
import { detectDeliveryAddress, SUPPORTED_CITIES } from "@/lib/location";
import { toast } from "sonner";

export default function AdminVendorsPage() {
  const { data: vendors = [], isLoading } = useAdminVendors();
  const createVendorMutation = useAdminCreateVendor();
  const updateStatusMutation = useUpdateVendorStatus();
  const updateCredentialsMutation = useUpdateVendorCredentials();
  const deleteVendorMutation = useDeleteVendor();
  const impersonateMutation = useImpersonate();

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("date"); // 'date' | 'name'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selection & Modals
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewVendor, setViewVendor] = useState(null);
  const [internalNote, setInternalNote] = useState("");
  
  // Edit Credentials State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    business_name: "",
    email: "",
    license_number: "",
    password: "",
    commission_rate: ""
  });

  const [formData, setFormData] = useState({
    business_name: "",
    email: "",
    password: "",
    license_number: "",
    address: "",
    city: "",
    latitude: null,
    longitude: null,
    service_radius_km: 10,
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const detectPharmacyLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    try {
      const detected = await detectDeliveryAddress();
      setFormData((prev) => ({
        ...prev,
        address: detected.street || prev.address,
        city: detected.city || prev.city,
        latitude: detected.latitude,
        longitude: detected.longitude,
      }));
      toast.success(`Pharmacy location detected: ${detected.city}`);
    } catch (err) {
      toast.error(err.message || "Could not detect pharmacy location. Select the city manually.");
    } finally {
      setIsDetectingLocation(false);
    }
  }, []);

  // Derived Data
  const processedVendors = useMemo(() => {
    let result = [...vendors];

    // Filter by search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(v => 
        (v.name || "").toLowerCase().includes(s) || 
        (v.email || "").toLowerCase().includes(s) ||
        (v.business_name || "").toLowerCase().includes(s)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(v => (v.status || "pending").toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      if (sortField === "name") {
        const nameA = (a.business_name || a.name || "").toLowerCase();
        const nameB = (b.business_name || b.name || "").toLowerCase();
        return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

    return result;
  }, [vendors, search, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(processedVendors.length / itemsPerPage);
  const currentVendors = processedVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddVendor = async (e) => {
    e.preventDefault();
    if (!formData.city && (formData.latitude == null || formData.longitude == null)) {
      toast.error("Add pharmacy city or use auto-detect location");
      return;
    }
    try {
      await createVendorMutation.mutateAsync({
        business_name: formData.business_name,
        email: formData.email,
        password: formData.password,
        license_number: formData.license_number,
        address: formData.address,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
        service_radius_km: formData.service_radius_km,
      });
      toast.success("Vendor successfully onboarded!");
      setShowAddModal(false);
      setFormData({
        business_name: "",
        email: "",
        password: "",
        license_number: "",
        address: "",
        city: "",
        latitude: null,
        longitude: null,
        service_radius_km: 10,
      });
    } catch (err) {
      toast.error(err.message || "Failed to add vendor");
    }
  };

  const handleOpenReview = (vendor) => {
    setViewVendor(vendor);
    setIsEditing(false);
    setEditFormData({
      business_name: vendor.business_name || vendor.name || "",
      email: vendor.email || "",
      license_number: vendor.license_number || "",
      password: "",
      commission_rate: vendor.commission_rate || "10.0",
      trade_license_url: vendor.trade_license_url || "",
      pharmacist_certificate_url: vendor.pharmacist_certificate_url || ""
    });
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...editFormData };
      if (!submitData.password) {
        delete submitData.password;
      }
      await updateCredentialsMutation.mutateAsync({ id: viewVendor.id, data: submitData });
      toast.success("Vendor credentials updated successfully!");
      setIsEditing(false);
      setViewVendor(null);
    } catch (err) {
      toast.error(err.message || "Failed to update credentials");
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this vendor? This action cannot be undone.")) return;
    try {
      await deleteVendorMutation.mutateAsync(id);
      toast.success("Vendor deleted successfully!");
      if (viewVendor?.id === id) setViewVendor(null);
      setSelectedVendors(prev => prev.filter(vId => vId !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete vendor");
    }
  };

  const handleImpersonate = async (vendor) => {
    try {
      const res = await impersonateMutation.mutateAsync({ entity_id: vendor.id, role: 'vendor' });
      localStorage.setItem('partner_session', JSON.stringify({
        tokens: res.data.tokens,
        role: res.data.role,
        partner: res.data.profile,
      }));
      toast.success(`Logged in as ${vendor.business_name || vendor.name}`);
      const { partnerRoutes } = await import("@/lib/constants/partnerRoutes");
      window.open(partnerRoutes.vendor.dashboard, '_blank');
    } catch (err) {
      toast.error(err.message || "Failed to impersonate");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const toggleSelection = (id) => {
    setSelectedVendors(prev => prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedVendors.length === currentVendors.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(currentVendors.map(v => v.id));
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Pharmacy Name", "Email", "License Number", "Status", "Date Applied"];
    const csvContent = [
      headers.join(","),
      ...processedVendors.map(v => [
        v.id,
        `"${v.business_name || v.name || ""}"`,
        v.email,
        v.license_number || "",
        v.status || "pending",
        new Date(v.created_at || Date.now()).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vendors_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("Exported successfully!");
  };

  const renderStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "approved":
      case "active":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#0F9D58]/10 text-[#0F9D58] capitalize border border-[#0F9D58]/20">Approved</span>;
      case "suspended":
      case "rejected":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#DC2626]/10 text-[#DC2626] capitalize border border-[#DC2626]/20">Rejected</span>;
      case "under review":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#2563EB]/10 text-[#2563EB] capitalize border border-[#2563EB]/20">Under Review</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#D97706]/10 text-[#D97706] capitalize border border-[#D97706]/20">Pending</span>;
    }
  };

  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleBulkAction = async (status) => {
    if (!confirm(`Are you sure you want to mark ${selectedVendors.length} vendors as ${status}?`)) return;
    
    try {
      await Promise.all(
        selectedVendors.map(id => updateStatusMutation.mutateAsync({ id, status, note: `Bulk ${status} by admin` }))
      );
      toast.success(`Successfully marked ${selectedVendors.length} vendors as ${status}`);
      setSelectedVendors([]);
      setShowBulkActions(false);
    } catch (e) {
      toast.error("Some updates failed. Please refresh and try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#0C1A2E] tracking-tight mb-2">
            Vendor Management
          </h1>
          <p className="text-[#0C1A2E]/60 text-sm font-medium">
            Approve, monitor, and manage marketplace pharmacies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#0C1A2E]/10 hover:bg-[#F6F8FA] text-[#0C1A2E] rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <DownloadSimple size={18} />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0B6E72] hover:bg-[#084F52] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} weight="bold" /> 
            <span>Onboard Vendor</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-[#0C1A2E]/10 shadow-sm flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-[#0C1A2E]/10 flex flex-col lg:flex-row gap-4 justify-between bg-[#F6F8FA]/50">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-[320px]">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C1A2E]/40" />
              <input 
                type="text"
                placeholder="Search by name or email..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full h-[40px] pl-10 pr-4 rounded-lg border border-[#0C1A2E]/10 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
              />
            </div>
            
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none h-[40px] pl-4 pr-10 rounded-lg border border-[#0C1A2E]/10 bg-white text-sm font-medium text-[#0C1A2E] outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <CaretDown size={14} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0C1A2E]/40 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedVendors.length > 0 && (
              <div className="relative">
                <button 
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center gap-2 h-[40px] px-4 rounded-lg bg-[#0C1A2E] text-white text-sm font-semibold hover:bg-[#0C1A2E]/90 transition-colors shadow-sm"
                >
                  <span>Bulk Action ({selectedVendors.length})</span>
                  <CaretDown size={14} weight="bold" className={`transition-transform ${showBulkActions ? 'rotate-180' : ''}`} />
                </button>
                {showBulkActions && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-neutral-200 shadow-xl rounded-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-150">
                    <button 
                      onClick={() => handleBulkAction('approved')}
                      disabled={updateStatusMutation.isPending}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#0F9D58] hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <CheckCircle size={16} weight="bold" /> Approve Selected
                    </button>
                    <button 
                      onClick={() => handleBulkAction('rejected')}
                      disabled={updateStatusMutation.isPending}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#DC2626] hover:bg-neutral-50 flex items-center gap-2 border-t border-neutral-100"
                    >
                      <XCircle size={16} weight="bold" /> Reject Selected
                    </button>
                    <button 
                      onClick={() => handleBulkAction('suspended')}
                      disabled={updateStatusMutation.isPending}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#D97706] hover:bg-neutral-50 flex items-center gap-2 border-t border-neutral-100"
                    >
                      <XCircle size={16} weight="bold" /> Suspend Selected
                    </button>
                  </div>
                )}
              </div>
            )}
            <button 
              onClick={() => {
                setSortField('date');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className="flex items-center gap-2 h-[40px] px-4 rounded-lg bg-white border border-[#0C1A2E]/10 text-sm font-semibold text-[#0C1A2E] hover:bg-[#F6F8FA] transition-colors"
            >
              <ArrowsDownUp size={16} /> 
              <span>Sort: {sortOrder === 'asc' ? 'Oldest' : 'Newest'}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F8FA] border-b border-[#0C1A2E]/10 text-xs font-bold text-[#0C1A2E]/60 uppercase tracking-wider">
                <th className="p-4 pl-6 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedVendors.length === currentVendors.length && currentVendors.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-[#0C1A2E]/20 text-[#0B6E72] focus:ring-[#0B6E72] cursor-pointer"
                  />
                </th>
                <th className="p-4 cursor-pointer hover:text-[#0C1A2E] transition-colors" onClick={() => { setSortField('name'); setSortOrder(sortOrder==='asc'?'desc':'asc')}}>
                  Pharmacy Details
                </th>
                <th className="p-4">License / Reg</th>
                <th className="p-4 cursor-pointer hover:text-[#0C1A2E] transition-colors" onClick={() => { setSortField('date'); setSortOrder(sortOrder==='asc'?'desc':'asc')}}>
                  Date Applied
                </th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0C1A2E]/5">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#0C1A2E]/40 font-medium">Loading vendors...</td>
                </tr>
              ) : currentVendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#0C1A2E]/40 font-medium">No vendors found.</td>
                </tr>
              ) : (
                currentVendors.map((vendor, idx) => (
                  <tr key={vendor.id || idx} onClick={() => handleOpenReview(vendor)} className={`cursor-pointer hover:bg-[#E6F4F5]/30 transition-colors group ${selectedVendors.includes(vendor.id) ? 'bg-[#E6F4F5]/20' : ''}`}>
                    <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => toggleSelection(vendor.id)}
                        className="w-4 h-4 rounded border-[#0C1A2E]/20 text-[#0B6E72] focus:ring-[#0B6E72] cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E6F4F5] text-[#0B6E72] flex items-center justify-center font-bold">
                          {vendor.business_name?.charAt(0) || vendor.name?.charAt(0) || "V"}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#0C1A2E] flex items-center gap-1.5">
                            {vendor.business_name || vendor.name || "Unknown Pharmacy"}
                            {(vendor.status === 'approved' || vendor.status === 'active') && <ShieldCheck size={14} className="text-[#0F9D58]" weight="fill" title="Verified" />}
                          </div>
                          <div className="text-xs text-[#0C1A2E]/50 font-[var(--font-jetbrains-mono)] mt-0.5 flex items-center gap-1">
                            ID: ...{vendor.id?.substring(vendor.id?.length - 8) || "N/A"}
                            <button onClick={() => copyToClipboard(vendor.id)} className="hover:text-[#0B6E72] transition-colors" title="Copy full ID">
                              <Copy size={12} />
                            </button>
                          </div>
                          <div className="text-xs text-[#0C1A2E]/50 mt-0.5">
                            {vendor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-[var(--font-jetbrains-mono)] text-[#0C1A2E]/80 font-medium">
                      {vendor.license_number || "—"}
                    </td>
                    <td className="p-4 text-sm text-[#0C1A2E]/70 font-medium">
                      {new Date(vendor.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4">
                      {renderStatusBadge(vendor.status)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleImpersonate(vendor); }}
                          disabled={impersonateMutation.isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B6E72] text-white text-sm font-semibold hover:bg-[#084F52] transition-colors shadow-sm"
                          title="Log In As Vendor"
                        >
                          <SignIn size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenReview(vendor); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#0C1A2E]/10 hover:bg-[#F6F8FA] text-sm font-semibold text-[#0C1A2E] transition-colors shadow-sm"
                        >
                          <Eye size={16} />
                          <span>Review</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteVendor(vendor.id); }}
                          disabled={deleteVendorMutation.isPending}
                          className="p-1.5 rounded-md hover:bg-[#DC2626]/10 text-[#DC2626]/60 hover:text-[#DC2626] transition-colors disabled:opacity-50"
                          title="Delete Vendor"
                        >
                          <Trash size={20} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#0C1A2E]/10 bg-white flex items-center justify-between">
            <span className="text-sm font-medium text-[#0C1A2E]/60">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedVendors.length)} of {processedVendors.length} vendors
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#0C1A2E]/10 text-[#0C1A2E] hover:bg-[#F6F8FA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-colors ${
                    currentPage === page 
                    ? 'bg-[#0B6E72] text-white border border-[#0B6E72]' 
                    : 'bg-white border border-[#0C1A2E]/10 text-[#0C1A2E] hover:bg-[#F6F8FA]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#0C1A2E]/10 text-[#0C1A2E] hover:bg-[#F6F8FA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document Verification / View Details Modal */}
      {viewVendor && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0C1A2E]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#0C1A2E]/10 bg-[#F6F8FA]">
              <div>
                <h2 className="text-xl font-bold text-[#0C1A2E] font-[var(--font-dm-serif-display)]">Application Details</h2>
                <p className="text-[#0C1A2E]/60 text-sm mt-1 flex items-center gap-2 font-[var(--font-jetbrains-mono)]">
                  ID: ...{viewVendor.id?.substring(viewVendor.id?.length - 8)} 
                  <button onClick={() => copyToClipboard(viewVendor.id)}><Copy size={14} className="hover:text-[#0B6E72]" /></button>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDeleteVendor(viewVendor.id)} 
                  disabled={deleteVendorMutation.isPending}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DC2626]/20 bg-[#DC2626]/5 text-[#DC2626] text-sm font-semibold hover:bg-[#DC2626]/10 transition-colors"
                  title="Delete Vendor"
                >
                  <Trash size={16} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                    isEditing 
                    ? 'border-[#0B6E72] bg-[#0B6E72]/10 text-[#0B6E72]' 
                    : 'border-[#0C1A2E]/10 hover:bg-[#0C1A2E]/5 text-[#0C1A2E]/60 hover:text-[#0C1A2E]'
                  }`}
                >
                  <PencilSimple size={16} />
                  <span className="hidden sm:inline">{isEditing ? 'Cancel Edit' : 'Edit Credentials'}</span>
                </button>
                <button onClick={() => setViewVendor(null)} className="text-[#0C1A2E]/40 hover:text-[#0C1A2E] p-2 bg-white rounded-full border border-[#0C1A2E]/10 transition-colors">
                  <X size={20} weight="bold" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              {/* Status Section */}
              <div className="flex items-center justify-between p-4 bg-[#F6F8FA] rounded-xl border border-[#0C1A2E]/5">
                <div>
                  <div className="text-xs font-bold text-[#0C1A2E]/50 uppercase tracking-wider mb-1">Current Status</div>
                  {renderStatusBadge(viewVendor.status)}
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#0C1A2E]/50 uppercase tracking-wider mb-1">Applied On</div>
                  <div className="text-sm font-semibold text-[#0C1A2E]">
                    {new Date(viewVendor.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Vendor Info / Edit Form */}
              <div>
                <h3 className="text-sm font-bold text-[#0C1A2E] uppercase tracking-wider border-b border-[#0C1A2E]/10 pb-2 mb-4">
                  {isEditing ? "Edit Credentials" : "Pharmacy Information"}
                </h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0C1A2E]/60 mb-1">Business Name</label>
                      <input 
                        required
                        type="text" 
                        value={editFormData.business_name}
                        onChange={e => setEditFormData({...editFormData, business_name: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0C1A2E]/60 mb-1">Contact Email</label>
                      <input 
                        required
                        type="email" 
                        value={editFormData.email}
                        onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0C1A2E]/60 mb-1">License Number</label>
                      <input 
                        required
                        type="text" 
                        value={editFormData.license_number}
                        onChange={e => setEditFormData({...editFormData, license_number: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm font-[var(--font-jetbrains-mono)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0C1A2E]/60 mb-1">New Password (Leave blank to keep current)</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={editFormData.password}
                        onChange={e => setEditFormData({...editFormData, password: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0C1A2E]/60 mb-1">Commission Rate (%)</label>
                      <input 
                        type="number"
                        step="0.1" 
                        value={editFormData.commission_rate}
                        onChange={e => setEditFormData({...editFormData, commission_rate: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-[#0C1A2E]/50 mb-1">Business Name</div>
                      <div className="text-base font-semibold text-[#0C1A2E]">{viewVendor.business_name || viewVendor.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#0C1A2E]/50 mb-1">Contact Email</div>
                      <div className="text-base font-medium text-[#0C1A2E]">{viewVendor.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#0C1A2E]/50 mb-1">License / Registration Number</div>
                      <div className="text-base font-[var(--font-jetbrains-mono)] font-bold text-[#0C1A2E] bg-[#F6F8FA] inline-block px-3 py-1.5 rounded border border-[#0C1A2E]/10">
                        {viewVendor.license_number || "Not provided"}
                      </div>
                    </div>
                    {viewVendor.commission_rate !== undefined && (
                      <div>
                        <div className="text-xs text-[#0C1A2E]/50 mb-1">Commission Rate</div>
                        <div className="text-base font-semibold text-[#0C1A2E]">{viewVendor.commission_rate}%</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-sm font-bold text-[#0C1A2E] uppercase tracking-wider border-b border-[#0C1A2E]/10 pb-2 mb-4">Verification Documents</h3>
                {(viewVendor.trade_license_url || viewVendor.pharmacist_certificate_url) ? (
                  <div className="space-y-3">
                    {viewVendor.trade_license_url && (
                      <div className="flex items-center justify-between p-3 rounded-lg border border-[#0C1A2E]/10 bg-white">
                        <div className="flex items-center gap-2">
                          <FileText size={20} className="text-[#0B6E72]" />
                          <span className="text-sm font-medium text-[#0C1A2E]">Trade License</span>
                        </div>
                        <a 
                          href={viewVendor.trade_license_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#0B6E72] hover:underline px-3 py-1.5 bg-[#E6F4F5] rounded"
                        >
                          View Document
                        </a>
                      </div>
                    )}
                    {viewVendor.pharmacist_certificate_url && (
                      <div className="flex items-center justify-between p-3 rounded-lg border border-[#0C1A2E]/10 bg-white">
                        <div className="flex items-center gap-2">
                          <FileText size={20} className="text-[#0B6E72]" />
                          <span className="text-sm font-medium text-[#0C1A2E]">Pharmacist Certificate</span>
                        </div>
                        <a 
                          href={viewVendor.pharmacist_certificate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#0B6E72] hover:underline px-3 py-1.5 bg-[#E6F4F5] rounded"
                        >
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-[#0C1A2E]/20 bg-[#F6F8FA]/50 flex flex-col items-center justify-center text-center gap-2">
                    <FileText size={32} className="text-[#0C1A2E]/20" />
                    <div className="text-sm font-semibold text-[#0C1A2E]">No documents uploaded yet</div>
                    <div className="text-xs text-[#0C1A2E]/50">The vendor needs to upload their Trade License and Pharmacist Certificate.</div>
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div>
                <h3 className="text-sm font-bold text-[#0C1A2E] uppercase tracking-wider border-b border-[#0C1A2E]/10 pb-2 mb-4">Internal Audit Notes</h3>
                <textarea 
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add a note about this application... (e.g. 'Called owner, awaiting clear license copy')"
                  className="w-full h-24 p-3 rounded-lg border border-[#0C1A2E]/10 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] resize-none"
                />
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[#0C1A2E]/10 bg-white flex gap-3">
              {isEditing ? (
                <>
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 flex items-center justify-center h-11 rounded-lg border border-[#0C1A2E]/10 text-[#0C1A2E] font-semibold hover:bg-[#F6F8FA] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleUpdateCredentials}
                    disabled={updateCredentialsMutation.isPending}
                    className="flex-1 flex items-center justify-center h-11 rounded-lg bg-[#0B6E72] text-white font-semibold hover:bg-[#084F52] disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {updateCredentialsMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={async () => {
                      try {
                        await updateStatusMutation.mutateAsync({ id: viewVendor.id, status: 'rejected', note: internalNote });
                        toast.success("Rejected application.");
                        setViewVendor(null);
                      } catch (e) {
                        toast.error(e.message || "Failed to reject vendor");
                      }
                    }}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg border border-[#DC2626]/20 bg-[#DC2626]/5 text-[#DC2626] font-semibold hover:bg-[#DC2626]/10 disabled:opacity-50 transition-colors"
                  >
                    <XCircle size={18} weight="bold" />
                    Reject
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        await updateStatusMutation.mutateAsync({ id: viewVendor.id, status: 'approved', note: internalNote });
                        toast.success("Pharmacy approved successfully!");
                        setViewVendor(null);
                      } catch (e) {
                        toast.error(e.message || "Failed to approve vendor");
                      }
                    }}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-[#0F9D58] text-white font-semibold hover:bg-[#0b854a] disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <CheckCircle size={18} weight="bold" />
                    Approve Vendor
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A2E]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#0C1A2E]/10 bg-[#F6F8FA]">
              <h2 className="text-xl font-bold text-[#0C1A2E] font-[var(--font-dm-serif-display)]">Onboard New Vendor</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#0C1A2E]/40 hover:text-[#0C1A2E] transition-colors">
                <X size={20} weight="bold" />
              </button>
            </div>
            
            <form onSubmit={handleAddVendor} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Business / Pharmacy Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.business_name}
                  onChange={e => setFormData({...formData, business_name: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm"
                  placeholder="e.g. HealthPlus Pharmacy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Admin Email</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm"
                  placeholder="vendor@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">License Number</label>
                <input 
                  required
                  type="text" 
                  value={formData.license_number}
                  onChange={e => setFormData({...formData, license_number: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm font-[var(--font-jetbrains-mono)]"
                  placeholder="e.g. PHR-2024-XXXX"
                />
              </div>

              <div className="rounded-lg border border-[#0C1A2E]/10 bg-[#F6F8FA] p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0C1A2E]">Pharmacy Location</p>
                    <p className="text-xs text-[#0C1A2E]/60">
                      Select the city manually. Auto detect is optional if you are at the pharmacy.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={detectPharmacyLocation}
                    disabled={isDetectingLocation}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6E72] hover:text-[#084F52] disabled:opacity-50"
                  >
                    {isDetectingLocation ? <Spinner size={14} className="animate-spin" /> : <MapPin size={14} />}
                    Auto detect
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm"
                    placeholder="e.g. DHA Phase 5, Street 12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">City</label>
                    <select
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm bg-white"
                    >
                      <option value="">Select city</option>
                      {SUPPORTED_CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Service Radius (km)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.service_radius_km}
                      onChange={(e) => setFormData({ ...formData, service_radius_km: Number(e.target.value) || 10 })}
                      className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm"
                    />
                  </div>
                </div>

                {formData.latitude != null && formData.longitude != null && (
                  <p className="text-[11px] text-[#0C1A2E]/60 font-[var(--font-jetbrains-mono)]">
                    GPS: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#0C1A2E] mb-1.5">Temporary Password</label>
                <input 
                  required
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72] text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-4 mt-2 border-t border-[#0C1A2E]/10 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-[#0C1A2E] hover:bg-[#F6F8FA] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createVendorMutation.isPending}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0B6E72] hover:bg-[#084F52] disabled:opacity-50 transition-colors shadow-sm"
                >
                  {createVendorMutation.isPending ? "Creating..." : "Create Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
