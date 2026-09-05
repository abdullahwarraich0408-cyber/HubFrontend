"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Plus, MagnifyingGlass, Funnel, DotsThree, Storefront, ShieldCheck, X, 
  Copy, Eye, CheckCircle, XCircle, PencilSimple, DownloadSimple, 
  CaretLeft, CaretRight, ArrowsDownUp, CaretDown, FileText, Trash, MapPin, Spinner, Clock
} from "@phosphor-icons/react";
import { useAdminVendors, useAdminCreateVendor, useUpdateVendorStatus, useUpdateVendorCredentials, useDeleteVendor, useReviewVendorDocument, useUploadDocument } from "@/lib/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { inquiriesApi, uploadApi } from "@/lib/api/index";
import { detectDeliveryAddress, SUPPORTED_CITIES } from "@/lib/location";
import { toast } from "sonner";


const SAMPLE_PHARMACY_LOGOS = [
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1586015555751-63c252277d3f?auto=format&fit=crop&q=80&w=250",
];

function PharmacyAvatar({ vendor, size = "md", className = "" }) {
  const [hasError, setHasError] = useState(false);
  const initials = (vendor?.business_name || vendor?.name || "P").slice(0, 2).toUpperCase();
  const logo = vendor?.logo || vendor?.store_image || vendor?.cover_image;

  const resolvedUrl = useMemo(() => {
    if (!logo) {
      const charSum = (vendor?.business_name || vendor?.name || "pharmacy")
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return SAMPLE_PHARMACY_LOGOS[Math.abs(charSum) % SAMPLE_PHARMACY_LOGOS.length];
    }
    if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("data:")) {
      return logo;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const base = apiBase.replace(/\/api\/?$/, "");
    return logo.startsWith("/") ? `${base}${logo}` : `${base}/${logo}`;
  }, [logo, vendor?.business_name, vendor?.name]);

  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-xs",
    md: "w-10 h-10 rounded-xl text-xs",
    lg: "w-16 h-16 rounded-2xl text-lg",
  }[size] || "w-10 h-10 rounded-xl text-xs";

  if (!hasError && resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt={vendor?.business_name || "Pharmacy"}
        onError={() => setHasError(true)}
        className={`${sizeClasses} object-cover border border-slate-200/80 shadow-sm shrink-0 bg-slate-100 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-[#0FA7E3] to-[#082B3F] text-white flex items-center justify-center font-bold shrink-0 shadow-sm ${className}`}
    >
      {initials}
    </div>
  );
}

function extractedVendorDocs(vendor, inquiries = []) {
  if (!vendor) return [];
  const list = [];

  const addDoc = (type, url) => {
    if (!url || typeof url !== "string" || !url.trim()) return;
    const cleanUrl = url.trim();
    if (!list.some((d) => d.file_url === cleanUrl)) {
      list.push({
        id: `doc_${list.length + 1}`,
        type: type || "compliance_document",
        file_url: cleanUrl,
        status: "pending",
      });
    }
  };

  if (Array.isArray(vendor.documents) && vendor.documents.length > 0) {
    vendor.documents.forEach((d) => {
      if (d && (d.file_url || d.url)) {
        addDoc(d.type || "compliance_document", d.file_url || d.url);
      }
    });
  }

  if (vendor.trade_license_url) addDoc("trade_license", vendor.trade_license_url);
  if (vendor.pharmacist_certificate_url) addDoc("pharmacist_certificate", vendor.pharmacist_certificate_url);
  if (vendor.tax_certificate_url) addDoc("tax_certificate", vendor.tax_certificate_url);
  if (vendor.bank_document_url) addDoc("bank_document", vendor.bank_document_url);

  // Match from registration inquiries list
  if (Array.isArray(inquiries) && inquiries.length > 0) {
    const vEmail = (vendor.email || "").toLowerCase().trim();
    const vName = (vendor.business_name || vendor.name || "").toLowerCase().trim();

    let matchingInquiries = inquiries.filter((inq) => {
      const inqEmail = (inq.email || "").toLowerCase().trim();
      const inqMsg = (inq.message || "").toLowerCase();
      const inqSub = (inq.subject || "").toLowerCase();
      return (
        (vEmail && inqEmail === vEmail) ||
        (vEmail && inqMsg.includes(vEmail)) ||
        (vName && vName.length > 2 && (inqMsg.includes(vName) || inqSub.includes(vName)))
      );
    });

    if (matchingInquiries.length === 0) {
      matchingInquiries = inquiries.filter((inq) => 
        inq.metadata?.partner_type === "pharmacy" || 
        inq.metadata?.partner_type === "vendor" ||
        inq.subject?.toLowerCase().includes("pharmacy")
      );
    }

    matchingInquiries.forEach((inq) => {
      if (inq.metadata?.documents && typeof inq.metadata.documents === "object") {
        Object.entries(inq.metadata.documents).forEach(([key, val]) => {
          if (typeof val === "string" && (val.startsWith("http") || val.startsWith("/uploads") || val.startsWith("data:"))) {
            addDoc(key, val);
          }
        });
      }

      const regex = /(https?:\/\/[^\s\)\"\'>]+|\/uploads\/[^\s\)\"\'>]+)/g;
      let match;
      while ((match = regex.exec(inq.message || "")) !== null) {
        const url = match[0];
        let type = "attached_credential";
        if (url.includes("license") || inq.message?.includes("license")) type = "trade_license";
        else if (url.includes("pharmacist")) type = "pharmacist_certificate";
        else if (url.includes("tax")) type = "tax_certificate";
        else if (url.includes("bank")) type = "bank_document";
        addDoc(type, url);
      }
    });
  }

  // Fallback search across stringified vendor object
  const allText = [
    vendor.about || "",
    vendor.notes || "",
    JSON.stringify(vendor || {}),
  ].join("\n");

  const regex = /(https?:\/\/[^\s\)\"\'>]+|\/uploads\/[^\s\)\"\'>]+)/g;
  let match;
  while ((match = regex.exec(allText)) !== null) {
    const url = match[0];
    let type = "attached_credential";
    if (url.includes("license")) type = "trade_license";
    else if (url.includes("pharmacist")) type = "pharmacist_certificate";
    else if (url.includes("tax")) type = "tax_certificate";
    else if (url.includes("bank")) type = "bank_document";
    addDoc(type, url);
  }

  return list;
}

export default function AdminVendorsPage() {
  const { data: vendors = [], isLoading } = useAdminVendors();
  const [previewDoc, setPreviewDoc] = useState(null);
  const createVendorMutation = useAdminCreateVendor();
  const updateStatusMutation = useUpdateVendorStatus();
  const updateCredentialsMutation = useUpdateVendorCredentials();
  const deleteVendorMutation = useDeleteVendor();
  const reviewVendorDocumentMutation = useReviewVendorDocument();

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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const uploadDocumentMutation = useUploadDocument();
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const { data: inquiries = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const res = await inquiriesApi.list();
      return Array.isArray(res) ? res : res?.inquiries || [];
    },
  });

  const handleDirectDocUpload = async (file) => {
    if (!file || !viewVendor) return;
    setUploadingDoc(true);
    try {
      const res = await uploadDocumentMutation.mutateAsync(file);
      const fileUrl = res?.url || res?.data?.url || (typeof res === "string" ? res : "");
      
      setViewVendor((prev) => {
        if (!prev) return null;
        const currentDocs = Array.isArray(prev.documents) ? prev.documents : [];
        return {
          ...prev,
          documents: [
            ...currentDocs,
            { id: `doc_${Date.now()}`, type: "attached_credential", file_url: fileUrl, status: "pending" }
          ]
        };
      });
      toast.success("Document attached to pharmacy profile!");
    } catch (err) {
      toast.error(err?.message || "Failed to upload document");
    } finally {
      setUploadingDoc(false);
    }
  };
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
      result = result.filter((vendor) => {
        const status = (vendor.status || "pending").toLowerCase();
        if (statusFilter === "pending") {
          return ["pending", "pending_review"].includes(status);
        }
        return status === statusFilter.toLowerCase();
      });
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

    const cleanLicense = (formData.license_number || '').trim();
    if (cleanLicense && cleanLicense.toUpperCase() !== 'PENDING') {
      const duplicate = vendors.find(
        (v) => (v.license_number || '').trim().toLowerCase() === cleanLicense.toLowerCase()
      );
      if (duplicate) {
        toast.error(`License number '${cleanLicense}' is already registered to ${duplicate.business_name || duplicate.name || "another pharmacy"}.`);
        return;
      }
    }

    try {
      await createVendorMutation.mutateAsync({
        business_name: formData.business_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        license_number: cleanLicense,
        address: formData.address,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
        service_radius_km: formData.service_radius_km,
      });
      toast.success("Vendor created and moved to verification review.");
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

  const handleOpenEdit = (vendor) => {
    setViewVendor(vendor);
    setIsEditing(true);
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

    const cleanLicense = (editFormData.license_number || '').trim();
    if (cleanLicense && cleanLicense.toUpperCase() !== 'PENDING') {
      const duplicate = vendors.find(
        (v) => v.id !== viewVendor?.id && (v.license_number || '').trim().toLowerCase() === cleanLicense.toLowerCase()
      );
      if (duplicate) {
        toast.error(`License number '${cleanLicense}' is already registered to ${duplicate.business_name || duplicate.name || "another pharmacy"}.`);
        return;
      }
    }

    try {
      const submitData = { ...editFormData, license_number: cleanLicense };
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

  const confirmDeleteVendor = async () => {
    if (!deleteTarget) return;
    try {
      await deleteVendorMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.business_name || deleteTarget.name}" deleted successfully!`);
      if (viewVendor?.id === deleteTarget.id) setViewVendor(null);
      setSelectedVendors(prev => prev.filter(vId => vId !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete vendor");
    }
  };

  const handleDeleteVendor = (vendor) => {
    setDeleteTarget(vendor);
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
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Approved
          </span>
        );
      case "suspended":
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      case "pending_review":
      case "under review":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
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

  const totalVendorsCount = vendors.length;

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-300">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#082B3F] tracking-tight">
            Pharmacy & Vendor Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Review onboarding applications, licenses, commission rates, and partner store portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <DownloadSimple size={16} weight="bold" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#082B3F] hover:bg-[#0FA7E3] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={16} weight="bold" />
            <span>Add Pharmacy</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center shrink-0">
            <Storefront size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pharmacies</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{totalVendorsCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved & Active</p>
            <p className="text-xl font-extrabold text-emerald-600">
              {vendors.filter(v => v.status === "approved" || v.status === "active").length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
            <p className="text-xl font-extrabold text-amber-600">
              {vendors.filter(v => ["pending", "pending_review", "under review"].includes((v.status || "").toLowerCase())).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejected</p>
            <p className="text-xl font-extrabold text-rose-600">
              {vendors.filter(v => ["rejected", "suspended"].includes((v.status || "").toLowerCase())).length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-[320px]">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by pharmacy name, email, license..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full h-10 pl-10 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#082B3F] placeholder-slate-400 outline-none focus:border-[#082B3F] focus:ring-1 focus:ring-[#082B3F]/20 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {["all", "approved", "pending", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    statusFilter === st
                      ? "bg-[#082B3F] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st === "all" ? "All" : st}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-400 self-center">
            Showing <span className="font-bold text-[#082B3F]">{processedVendors.length}</span> pharmacies
          </div>
        </div>

        {/* Clean Basic Table */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 pl-5 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={selectedVendors.length === currentVendors.length && currentVendors.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-[#082B3F] focus:ring-[#082B3F] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Pharmacy Facility</th>
                <th className="py-3.5 px-4">License / Reg</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-[#082B3F]" onClick={() => { setSortField('date'); setSortOrder(sortOrder==='asc'?'desc':'asc')}}>
                  Date Applied
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400 font-medium">Loading pharmacies...</td>
                </tr>
              ) : currentVendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400 font-medium">No pharmacies found matching the criteria.</td>
                </tr>
              ) : (
                currentVendors.map((vendor, idx) => (
                  <tr
                    key={vendor.id || idx}
                    onClick={() => handleOpenReview(vendor)}
                    className={`cursor-pointer hover:bg-slate-50/70 transition-colors group ${selectedVendors.includes(vendor.id) ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="py-3.5 pl-5 pr-2" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={() => toggleSelection(vendor.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#082B3F] focus:ring-[#082B3F] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <PharmacyAvatar vendor={vendor} size="md" />
                        <div>
                          <div className="text-sm font-bold text-[#082B3F] flex items-center gap-1.5 group-hover:text-[#0FA7E3] transition-colors">
                            {vendor.business_name || vendor.name || "Unknown Pharmacy"}
                            {(vendor.status === 'approved' || vendor.status === 'active') && <ShieldCheck size={14} className="text-emerald-500" weight="fill" title="Verified" />}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                            ID: ...{vendor.id?.substring(vendor.id?.length - 8) || "N/A"}
                            <button onClick={(e) => { e.stopPropagation(); copyToClipboard(vendor.id); }} className="hover:text-slate-700" title="Copy full ID">
                              <Copy size={12} />
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {vendor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600 font-medium">
                      {vendor.license_number || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                      {vendor.created_at ? new Date(vendor.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(vendor.status)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Eye Review Button (Icon only) */}
                        <button 
                          onClick={() => handleOpenReview(vendor)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white transition-all shadow-sm border border-slate-200"
                          title="Review & Verify Pharmacy"
                        >
                          <Eye size={16} weight="bold" />
                        </button>

                        {/* Edit Button (Icon only) */}
                        <button 
                          onClick={() => handleOpenEdit(vendor)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white transition-all shadow-sm border border-slate-200"
                          title="Edit Pharmacy Credentials"
                        >
                          <PencilSimple size={16} weight="bold" />
                        </button>

                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteVendor(vendor)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                          title="Delete Pharmacy"
                        >
                          <Trash size={16} weight="bold" />
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
                    ? 'bg-[#17618E] text-white border border-[#17618E]' 
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
                  <button onClick={() => copyToClipboard(viewVendor.id)}><Copy size={14} className="hover:text-[#17618E]" /></button>
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
                    ? 'border-[#17618E] bg-[#17618E]/10 text-[#17618E]' 
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
                    {viewVendor.created_at ? new Date(viewVendor.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "—"}
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
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#17618E] focus:ring-1 focus:ring-[#17618E] text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0C1A2E]/60 mb-1">Contact Email</label>
                      <input 
                        required
                        type="email" 
                        value={editFormData.email}
                        onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#17618E] focus:ring-1 focus:ring-[#17618E] text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0C1A2E]/60 mb-1">License Number</label>
                      <input 
                        required
                        type="text" 
                        value={editFormData.license_number}
                        onChange={e => setEditFormData({...editFormData, license_number: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#17618E] focus:ring-1 focus:ring-[#17618E] text-sm font-[var(--font-jetbrains-mono)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0C1A2E]/60 mb-1">New Password (Leave blank to keep current)</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={editFormData.password}
                        onChange={e => setEditFormData({...editFormData, password: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#17618E] focus:ring-1 focus:ring-[#17618E] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0C1A2E]/60 mb-1">Commission Rate (%)</label>
                      <input 
                        type="number"
                        step="0.1" 
                        value={editFormData.commission_rate}
                        onChange={e => setEditFormData({...editFormData, commission_rate: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-[#0C1A2E]/10 outline-none focus:border-[#17618E] focus:ring-1 focus:ring-[#17618E] text-sm"
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
                <div className="flex items-center justify-between border-b border-[#0C1A2E]/10 pb-2 mb-4">
                  <h3 className="text-sm font-bold text-[#0C1A2E] uppercase tracking-wider">
                    Verification Documents ({extractedVendorDocs(viewVendor, inquiries).length})
                  </h3>
                  <label className="cursor-pointer text-xs font-bold text-[#17618E] hover:underline flex items-center gap-1 bg-[#DEEEF9] px-3 py-1 rounded-lg">
                    <Plus size={14} weight="bold" />
                    <span>{uploadingDoc ? "Uploading..." : "Attach Document"}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      className="hidden"
                      disabled={uploadingDoc}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectDocUpload(file);
                      }}
                    />
                  </label>
                </div>

                {extractedVendorDocs(viewVendor, inquiries).length > 0 ? (
                  <div className="space-y-3">
                    {extractedVendorDocs(viewVendor, inquiries).map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-3 rounded-lg border border-[#0C1A2E]/10 bg-white">
                        <div className="flex items-center gap-2">
                          <FileText size={20} className="text-[#17618E]" />
                          <div>
                            <div className="text-sm font-medium text-[#0C1A2E] capitalize">{document.type.replaceAll("_", " ")}</div>
                            <div className="text-xs text-[#0C1A2E]/50">Status: {document.status}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc({ title: document.type.replaceAll("_", " "), url: document.file_url })}
                            className="text-xs font-semibold text-[#17618E] hover:underline px-3 py-1.5 bg-[#DEEEF9] rounded"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await reviewVendorDocumentMutation.mutateAsync({
                                vendorId: viewVendor.id,
                                documentId: document.id,
                                data: { status: "verified", notes: internalNote },
                              });
                              toast.success("Document verified");
                            }}
                            className="text-xs font-semibold text-white px-3 py-1.5 bg-[#17618E] rounded"
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await reviewVendorDocumentMutation.mutateAsync({
                                vendorId: viewVendor.id,
                                documentId: document.id,
                                data: { status: "rejected", notes: internalNote || "Rejected by admin" },
                              });
                              toast.success("Document rejected");
                            }}
                            className="text-xs font-semibold text-white px-3 py-1.5 bg-[#DC2626] rounded"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
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
                  className="w-full h-24 p-3 rounded-lg border border-[#0C1A2E]/10 bg-white text-sm outline-none focus:border-[#17618E] focus:ring-1 focus:ring-[#17618E] resize-none"
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
                    className="flex-1 flex items-center justify-center h-11 rounded-lg bg-[#17618E] text-white font-semibold hover:bg-[#082B3F] disabled:opacity-50 transition-colors shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#082B3F] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Storefront size={20} weight="bold" className="text-[#0FA7E3]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#082B3F]">Onboard New Pharmacy</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Register pharmacy facility and access credentials</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/50 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>
            
            {/* Modal Scrollable Form */}
            <form onSubmit={handleAddVendor} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto p-5 md:p-6 space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                    Business / Pharmacy Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.business_name}
                    onChange={e => setFormData({...formData, business_name: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] focus:ring-1 focus:ring-[#082B3F]/20 text-xs font-semibold text-[#082B3F] transition-all bg-white"
                    placeholder="e.g. HealthPlus Pharmacy"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                    Admin Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] focus:ring-1 focus:ring-[#082B3F]/20 text-xs font-semibold text-[#082B3F] transition-all bg-white"
                    placeholder="vendor@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                    Pharmacy Drug License # <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.license_number}
                    onChange={e => setFormData({...formData, license_number: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] focus:ring-1 focus:ring-[#082B3F]/20 text-xs font-mono font-bold text-[#082B3F] transition-all bg-white"
                    placeholder="e.g. PHR-2026-XXXX"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#082B3F] uppercase tracking-wider">Pharmacy Location</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Specify facility address and delivery coverage radius.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={detectPharmacyLocation}
                      disabled={isDetectingLocation}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#17618E] hover:bg-slate-50 disabled:opacity-50 transition-all shadow-xs"
                    >
                      {isDetectingLocation ? <Spinner size={14} className="animate-spin" /> : <MapPin size={14} weight="bold" />}
                      <span>Auto detect</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#082B3F] text-xs font-medium text-[#082B3F]"
                      placeholder="e.g. DHA Phase 5, Commercial Zone"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">City <span className="text-rose-500">*</span></label>
                      <select
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#082B3F] text-xs font-bold text-[#082B3F]"
                      >
                        <option value="">Select city</option>
                        {SUPPORTED_CITIES.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Service Radius (km)</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.service_radius_km}
                        onChange={(e) => setFormData({ ...formData, service_radius_km: Number(e.target.value) || 10 })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#082B3F] text-xs font-bold text-[#082B3F]"
                      />
                    </div>
                  </div>

                  {formData.latitude != null && formData.longitude != null && (
                    <p className="text-[11px] text-slate-500 font-mono">
                      GPS coordinates: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                    Temporary Password <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    required
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 outline-none focus:border-[#082B3F] focus:ring-1 focus:ring-[#082B3F]/20 text-xs font-semibold text-[#082B3F] transition-all bg-white"
                    placeholder="Set temporary login password"
                  />
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createVendorMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#082B3F] hover:bg-[#0FA7E3] disabled:opacity-50 transition-all shadow-sm flex items-center gap-2"
                >
                  {createVendorMutation.isPending ? (
                    <>
                      <Spinner size={14} className="animate-spin" />
                      <span>Creating Pharmacy...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} weight="bold" />
                      <span>Create Pharmacy</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Vendor Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
              <Trash size={28} weight="bold" />
            </div>

            <h3 className="text-lg font-bold text-[#082B3F]">
              Delete Pharmacy Account?
            </h3>

            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#082B3F]">{deleteTarget.business_name || deleteTarget.name}</strong>? This action cannot be undone and will remove all their catalog and inventory records.
            </p>

            <div className="flex items-center gap-3 w-full mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-11 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteVendor}
                disabled={deleteVendorMutation.isPending}
                className="flex-1 h-11 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {deleteVendorMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#082B3F]/75 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#17618E] flex items-center justify-center font-bold">
                  <FileText size={20} weight="bold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#082B3F] capitalize">{previewDoc.title || "Document Preview"}</h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-md">{previewDoc.url}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <DownloadSimple size={16} weight="bold" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 bg-slate-900/5 p-4 overflow-auto flex items-center justify-center relative">
              {previewDoc.url?.toLowerCase().endsWith(".pdf") || previewDoc.url?.includes("pdf") ? (
                <iframe
                  src={previewDoc.url}
                  className="w-full h-full rounded-xl border border-slate-200 bg-white shadow-inner"
                  title={previewDoc.title}
                />
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-slate-200/50 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
