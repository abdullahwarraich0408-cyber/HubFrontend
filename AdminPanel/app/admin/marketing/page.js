"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Megaphone,
  Plus,
  Tag,
  Trash,
  Percent,
  Clock,
  CalendarBlank,
  Sparkle,
  CreditCard,
  Storefront,
  Users,
  ShieldCheck,
  X,
  Check,
  Eye,
  MagnifyingGlass,
  Copy,
  CaretLeft,
  CaretRight,
  Info,
  Gift,
  Handshake,
  CurrencyDollar,
  Lightning,
  WarningCircle,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { api } from "@/lib/api/index";

export default function AdminMarketingPage() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewOffer, setViewOffer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalStep, setModalStep] = useState(1);
  const [copiedCode, setCopiedCode] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State for Offer Creation Wizard
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    type: "PERCENTAGE_DISCOUNT",
    discount_type: "PERCENTAGE",
    percentage_value: "15",
    fixed_amount: "",
    promo_code: "",
    minimum_order_amount: "1500",
    maximum_discount_amount: "1000",
    funding_source: "MEDZOOS",
    new_users_only: false,
    stackable: false,
    start_at: new Date().toISOString().split("T")[0],
    end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    terms_and_conditions: "Valid on eligible orders on Medzoos platform.",
  });

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/offers/admin/all");
      const list = res?.offers || res?.data?.offers || (Array.isArray(res) ? res : []);
      setOffers(list);
    } catch {
      toast.error("Failed to load marketing offers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      await api.patch(`/offers/admin/${id}/status`, { status: newStatus });
      toast.success(`Campaign status marked as ${newStatus}`);
      if (viewOffer && viewOffer.id === id) {
        setViewOffer((prev) => ({ ...prev, status: newStatus }));
      }
      fetchOffers();
    } catch {
      toast.error("Failed to update campaign status");
    }
  };

  const confirmDeleteOffer = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/offers/admin/${deleteTarget.id}`);
      toast.success(`"${deleteTarget.title}" deleted successfully!`);
      if (viewOffer?.id === deleteTarget.id) setViewOffer(null);
      setDeleteTarget(null);
      fetchOffers();
    } catch {
      toast.error("Failed to delete offer");
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.end_at) {
        toast.error("Title and expiration date are required");
        return;
      }

      await api.post("/offers/admin/create", {
        ...formData,
        percentage_value: formData.percentage_value ? parseFloat(formData.percentage_value) : null,
        fixed_amount: formData.fixed_amount ? parseFloat(formData.fixed_amount) : null,
        minimum_order_amount: formData.minimum_order_amount ? parseFloat(formData.minimum_order_amount) : 0,
        maximum_discount_amount: formData.maximum_discount_amount ? parseFloat(formData.maximum_discount_amount) : null,
      });

      toast.success("Offer campaign created successfully!");
      setShowCreateModal(false);
      setModalStep(1);
      setFormData({
        title: "",
        short_description: "",
        description: "",
        type: "PERCENTAGE_DISCOUNT",
        discount_type: "PERCENTAGE",
        percentage_value: "15",
        fixed_amount: "",
        promo_code: "",
        minimum_order_amount: "1500",
        maximum_discount_amount: "1000",
        funding_source: "MEDZOOS",
        new_users_only: false,
        stackable: false,
        start_at: new Date().toISOString().split("T")[0],
        end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        terms_and_conditions: "Valid on eligible orders on Medzoos platform.",
      });
      fetchOffers();
    } catch (err) {
      toast.error(err.message || "Failed to create offer");
    }
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Helper to format discount value properly without "null"
  const formatDiscount = (offer) => {
    if (offer.discount_type === "FREE_DELIVERY" || offer.type === "FREE_DELIVERY") {
      return "Free Delivery";
    }
    if (offer.discount_type === "PERCENTAGE" || offer.percentage_value || offer.discount_percentage) {
      return `${offer.percentage_value || offer.discount_percentage || 15}% OFF`;
    }
    if (offer.fixed_amount || offer.discount_amount || offer.amount) {
      return `PKR ${Number(offer.fixed_amount || offer.discount_amount || offer.amount).toLocaleString()} OFF`;
    }
    return "Special Discount";
  };

  // KPI Metrics
  const kpis = useMemo(() => {
    const total = offers.length;
    const active = offers.filter((o) => o.status === "ACTIVE").length;
    const totalRedemptions = offers.reduce(
      (sum, o) => sum + (o._count?.redemptions || o.used_count || 0),
      0
    );
    const bankOffers = offers.filter(
      (o) => o.type === "BANK_OFFER" || o.type === "WALLET_OFFER"
    ).length;
    return { total, active, totalRedemptions, bankOffers };
  }, [offers]);

  // Filtered Offers
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const matchesSearch =
        !search.trim() ||
        (o.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (o.promo_code || "").toLowerCase().includes(search.toLowerCase()) ||
        (o.short_description || "").toLowerCase().includes(search.toLowerCase());

      const status = (o.status || "ACTIVE").toUpperCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "ACTIVE" && status === "ACTIVE") ||
        (statusFilter === "PAUSED" && status === "PAUSED");

      const matchesType = typeFilter === "all" || o.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [offers, search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const currentOffers = filteredOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#082B3F] tracking-tight flex items-center gap-2.5">
            Marketing & Promotions Engine
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Configure discount codes, cashback promotions, bank card deals, and partner campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#082B3F] hover:bg-[#0FA7E3] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus size={16} weight="bold" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center shrink-0">
            <Tag size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.active}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Gift size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Redemptions</p>
            <p className="text-xl font-extrabold text-emerald-600">{kpis.totalRedemptions}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CreditCard size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bank & Wallets</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.bankOffers}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkle size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Campaigns</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{kpis.total}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-[320px]">
              <MagnifyingGlass
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search campaigns, promo codes..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
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

            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "all"
                    ? "bg-[#082B3F] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setStatusFilter("ACTIVE"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "ACTIVE"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => { setStatusFilter("PAUSED"); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "PAUSED"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-amber-700"
                }`}
              >
                Paused
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOffers}
              className="text-xs font-bold text-[#0FA7E3] hover:underline"
            >
              Refresh
            </button>
            <span className="text-xs font-semibold text-slate-400">
              Showing <span className="font-bold text-[#082B3F]">{filteredOffers.length}</span> offers
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Campaign Promotion</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Promo Code</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400 font-medium">
                    Loading promotional campaigns...
                  </td>
                </tr>
              ) : currentOffers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400 font-medium">
                    No marketing campaigns found. Create your first promotion above!
                  </td>
                </tr>
              ) : (
                currentOffers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setViewOffer(offer)}
                  >
                    {/* Title & Description */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0FA7E3] to-[#082B3F] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                          <Tag size={18} weight="bold" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-[#082B3F] block truncate group-hover:text-[#0FA7E3] transition-colors">
                            {offer.title}
                          </span>
                          {offer.short_description && (
                            <span className="text-[11px] text-slate-400 truncate block max-w-xs">
                              {offer.short_description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Promotion Type */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                        {(offer.type || "DISCOUNT").replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Discount Value */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-extrabold text-xs text-[#082B3F]">
                        {formatDiscount(offer)}
                      </span>
                    </td>

                    {/* Promo Code */}
                    <td className="py-3.5 px-4">
                      {offer.promo_code ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-xs text-[#082B3F]">
                          <span>{offer.promo_code}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyPromoCode(offer.promo_code);
                            }}
                            className="text-slate-400 hover:text-slate-700"
                            title="Copy Promo Code"
                          >
                            {copiedCode === offer.promo_code ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic font-medium">Automatic</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(offer.id, offer.status);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                          offer.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100"
                        }`}
                        title="Click to Pause/Activate"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            offer.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                          }`}
                        />
                        <span>{offer.status || "ACTIVE"}</span>
                      </button>
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 font-medium">
                      {offer.end_at
                        ? new Date(offer.end_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No Expiry"}
                    </td>

                    {/* Actions: [ 👁️ ] [ 🗑️ ] */}
                    <td className="py-3.5 px-5 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Eye Details Button */}
                        <button
                          onClick={() => setViewOffer(offer)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white transition-all shadow-sm border border-slate-200"
                          title="View Offer Details"
                        >
                          <Eye size={16} weight="bold" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteTarget(offer)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                          title="Delete Campaign"
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <CaretLeft size={14} weight="bold" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === p
                      ? "bg-[#082B3F] text-white"
                      : "text-slate-600 hover:bg-white border border-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <CaretRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complete Campaign Details Modal */}
      {viewOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0FA7E3] to-[#082B3F] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                    <Tag size={28} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-[#082B3F] truncate">
                      {viewOffer.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                      <span>{viewOffer.promo_code ? `CODE: ${viewOffer.promo_code}` : "Automatic Offer"}</span>
                      <span>·</span>
                      <span className="text-slate-400">ID: {viewOffer.id}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewOffer(null)}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/50 transition-colors"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discount Value</p>
                  <p className="text-base font-extrabold text-[#082B3F] mt-1">{formatDiscount(viewOffer)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Campaign Status</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold ${
                        viewOffer.status === "ACTIVE" ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {viewOffer.status || "ACTIVE"}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Funding Sponsor</p>
                  <p className="text-sm font-extrabold text-[#082B3F] mt-1">{viewOffer.funding_source || "MEDZOOS"}</p>
                </div>
              </div>

              {/* Offer Rules & Limits */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider">Redemption Rules & Conditions</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Minimum Order</span>
                    <span className="font-extrabold text-[#082B3F] mt-0.5 block">
                      PKR {Number(viewOffer.minimum_order_amount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Max Discount Cap</span>
                    <span className="font-extrabold text-[#082B3F] mt-0.5 block">
                      {viewOffer.maximum_discount_amount
                        ? `PKR ${Number(viewOffer.maximum_discount_amount).toLocaleString()}`
                        : "No Cap"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {viewOffer.new_users_only && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#082B3F] text-[11px] font-bold border border-blue-100">
                      👤 First-Time Users Only
                    </span>
                  )}
                  {viewOffer.stackable ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                      ⚡ Stackable with Other Deals
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold">
                      🔒 Single Coupon Use
                    </span>
                  )}
                </div>
              </div>

              {viewOffer.terms_and_conditions && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2">
                  <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider">Terms & Policy</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{viewOffer.terms_and_conditions}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setDeleteTarget(viewOffer)}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <Trash size={15} weight="bold" />
                <span>Delete Campaign</span>
              </button>

              <button
                type="button"
                onClick={() => setViewOffer(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Step Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082B3F]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#082B3F] text-white flex items-center justify-center font-bold text-xs">
                  <Tag size={16} weight="bold" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#082B3F]">Create Promotion Campaign</h3>
                  <p className="text-xs text-slate-400 font-medium">Step {modalStep} of 4</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-6 flex flex-col gap-4">
              {modalStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15% Off All Diabetes Care Products"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                      Offer Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F] bg-white"
                    >
                      <option value="PERCENTAGE_DISCOUNT">Percentage Discount</option>
                      <option value="FIXED_DISCOUNT">Fixed PKR Discount</option>
                      <option value="FREE_DELIVERY">Free Delivery Promotion</option>
                      <option value="PROMO_CODE">Promo Code Offer</option>
                      <option value="BANK_OFFER">Bank Card Offer (Visa / Mastercard)</option>
                      <option value="WALLET_OFFER">Mobile Wallet (Easypaisa / JazzCash)</option>
                      <option value="CONSULTATION_OFFER">Doctor Consultation Offer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                      Short Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Save 15% on glucose meters and test strips."
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F]"
                    />
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                        Discount Mode
                      </label>
                      <select
                        value={formData.discount_type}
                        onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F] bg-white"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Cash (PKR)</option>
                        <option value="FREE_DELIVERY">Free Delivery</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                        Discount Value *
                      </label>
                      <input
                        type="number"
                        placeholder={formData.discount_type === "PERCENTAGE" ? "15" : "500"}
                        value={formData.discount_type === "PERCENTAGE" ? formData.percentage_value : formData.fixed_amount}
                        onChange={(e) =>
                          formData.discount_type === "PERCENTAGE"
                            ? setFormData({ ...formData, percentage_value: e.target.value })
                            : setFormData({ ...formData, fixed_amount: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-[#082B3F] outline-none focus:border-[#082B3F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                      Coupon Promo Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MEDZOOS500"
                      value={formData.promo_code}
                      onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase outline-none focus:border-[#082B3F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                        Min. Order (PKR)
                      </label>
                      <input
                        type="number"
                        value={formData.minimum_order_amount}
                        onChange={(e) => setFormData({ ...formData, minimum_order_amount: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                        Max Cap (PKR)
                      </label>
                      <input
                        type="number"
                        value={formData.maximum_discount_amount}
                        onChange={(e) => setFormData({ ...formData, maximum_discount_amount: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {modalStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                      Funding Sponsor
                    </label>
                    <select
                      value={formData.funding_source}
                      onChange={(e) => setFormData({ ...formData, funding_source: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F] bg-white"
                    >
                      <option value="MEDZOOS">Medzoos Platform</option>
                      <option value="PHARMACY">Pharmacy Vendor</option>
                      <option value="LAB">Lab Partner</option>
                      <option value="BANK">Bank / Wallet Partner</option>
                    </select>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.new_users_only}
                        onChange={(e) => setFormData({ ...formData, new_users_only: e.target.checked })}
                        className="w-4 h-4 rounded text-[#082B3F] focus:ring-[#082B3F]"
                      />
                      <span className="text-xs font-bold text-[#082B3F]">First-Time Users Only</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.stackable}
                        onChange={(e) => setFormData({ ...formData, stackable: e.target.checked })}
                        className="w-4 h-4 rounded text-[#082B3F] focus:ring-[#082B3F]"
                      />
                      <span className="text-xs font-bold text-[#082B3F]">Allow Stacking With Other Offers</span>
                    </label>
                  </div>
                </div>
              )}

              {modalStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.start_at}
                        onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                        Expiry Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.end_at}
                        onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#082B3F] uppercase tracking-wider mb-1.5">
                      Terms & Conditions
                    </label>
                    <textarea
                      rows={3}
                      value={formData.terms_and_conditions}
                      onChange={(e) => setFormData({ ...formData, terms_and_conditions: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#082B3F] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Wizard Footer Controls */}
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                {modalStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setModalStep(modalStep - 1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {modalStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setModalStep(modalStep + 1)}
                    className="px-5 py-2.5 rounded-xl bg-[#082B3F] hover:bg-[#0FA7E3] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Publish Campaign
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Campaign Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
              <Trash size={28} weight="bold" />
            </div>

            <h3 className="text-lg font-bold text-[#082B3F]">
              Delete Promotion Offer?
            </h3>

            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              Are you sure you want to permanently remove <strong className="text-[#082B3F]">{deleteTarget.title}</strong>? This promo code will become immediately invalid for all patients.
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
                onClick={confirmDeleteOffer}
                className="flex-1 h-11 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
