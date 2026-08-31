"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminCustomers } from "@/lib/hooks/useApi";
import {
  Users,
  MagnifyingGlass,
  UserCircle,
  ShieldCheck,
  Package,
  Clock,
  ArrowsClockwise,
  DownloadSimple,
  Copy,
  Check,
  X,
  Eye,
  EnvelopeSimple,
  Phone,
  MapPin,
  CaretLeft,
  CaretRight,
  Sparkle,
  ArrowSquareOut,
  CalendarCheck,
} from "@phosphor-icons/react";
import { toast } from "sonner";

export default function AdminCustomersPage() {
  const queryClient = useQueryClient();
  const { data: customers = [], isLoading, refetch } = useAdminCustomers();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id || text);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ["admin-customers"] }),
      ]);
      toast.success("Customer list refreshed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh customer list");
    } finally {
      setIsRefreshing(false);
    }
  };

  // KPIs
  const kpis = useMemo(() => {
    const total = customers.length;
    const verified = customers.filter((c) => c.is_verified).length;
    const withOrders = customers.filter((c) => c.orders && c.orders.length > 0).length;
    const totalOrders = customers.reduce((sum, c) => sum + (c.orders?.length || 0), 0);
    return { total, verified, withOrders, totalOrders };
  }, [customers]);

  // Filtered list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q) ||
        (c.id || "").toLowerCase().includes(q);

      const matchesFilter =
        filterType === "all" ||
        (filterType === "verified" && c.is_verified) ||
        (filterType === "orders" && c.orders && c.orders.length > 0) ||
        (filterType === "members" && c.membership_status && c.membership_status !== "FREE");

      return matchesSearch && matchesFilter;
    });
  }, [customers, search, filterType]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const headers = ["User ID", "Name", "Email", "Phone", "Verified", "Membership", "Orders Count", "Joined Date"];
    const rows = filteredCustomers.map((c) => [
      `"${c.id || ""}"`,
      `"${c.name || ""}"`,
      `"${c.email || ""}"`,
      `"${c.phone || ""}"`,
      c.is_verified ? "Yes" : "No",
      `"${c.membership_status || "FREE"}"`,
      c.orders?.length || 0,
      new Date(c.created_at || Date.now()).toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medzoos_customers_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Customer list exported successfully!");
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#082B3F] tracking-tight flex items-center gap-3">
            <Users size={32} className="text-[#0FA7E3]" weight="fill" />
            Customer & Patient Directory
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Registered platform accounts, membership status, contact info, and patient order histories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-60 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowsClockwise
              size={16}
              weight="bold"
              className={isRefreshing ? "animate-spin text-[#0FA7E3]" : ""}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#082B3F] hover:bg-[#0FA7E3] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <DownloadSimple size={16} weight="bold" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center shrink-0">
            <Users size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registered</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{isLoading ? "..." : kpis.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Accounts</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{isLoading ? "..." : kpis.verified}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0FA7E3] flex items-center justify-center shrink-0">
            <Package size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Buyers</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{isLoading ? "..." : kpis.withOrders}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarCheck size={20} weight="bold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders Placed</p>
            <p className="text-xl font-extrabold text-[#082B3F]">{isLoading ? "..." : kpis.totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-[340px]">
              <MagnifyingGlass
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by name, email, phone, or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 pl-10 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#082B3F] placeholder-slate-400 outline-none focus:border-[#082B3F] focus:ring-1 focus:ring-[#082B3F]/20 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {[
                { id: "all", label: "All Customers" },
                { id: "verified", label: "Verified Only" },
                { id: "orders", label: "With Orders" },
                { id: "members", label: "Care+ Members" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFilterType(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterType === tab.id
                      ? "bg-[#082B3F] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-400 self-center">
            Showing <span className="font-bold text-[#082B3F]">{filteredCustomers.length}</span> customers
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Customer Profile</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Membership & Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400 font-medium text-xs">
                    Loading customer directory...
                  </td>
                </tr>
              ) : currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400 font-medium text-xs">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                currentCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Customer Profile */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100/60">
                          {customer.name?.charAt(0)?.toUpperCase() || <UserCircle size={22} />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#082B3F] block truncate">
                            {customer.name || "Anonymous Patient"}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <span>ID: ...{customer.id.slice(-8)}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(customer.id, `usr_${customer.id}`)}
                              className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-slate-200/50 transition-colors"
                              title="Copy Customer ID"
                            >
                              {copiedId === `usr_${customer.id}` ? (
                                <Check size={11} className="text-emerald-500" />
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5 truncate max-w-[200px]">
                          <EnvelopeSimple size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{customer.email || "No email"}</span>
                        </span>
                        {customer.phone && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <Phone size={13} className="text-slate-400 shrink-0" />
                            <span>{customer.phone}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Membership & Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {customer.membership_status && customer.membership_status !== "FREE" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200/70">
                            <Sparkle size={11} weight="fill" />
                            <span>{customer.membership_status}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                            Standard
                          </span>
                        )}

                        {customer.is_verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                            <ShieldCheck size={12} weight="fill" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock size={14} className="text-slate-400 shrink-0" />
                        <span>
                          {new Date(customer.created_at || Date.now()).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Orders */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#082B3F] text-xs font-bold border border-blue-100">
                          {customer.orders?.length || 0} orders
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(customer)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#082B3F] text-[#082B3F] hover:text-white text-xs font-bold transition-all shadow-sm border border-slate-200 cursor-pointer"
                      >
                        <Eye size={14} weight="bold" />
                        <span>Inspect Profile</span>
                      </button>
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

      {/* Customer Detail Inspector Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40 shrink-0 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#082B3F] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                  {selectedCustomer.name?.charAt(0)?.toUpperCase() || <UserCircle size={24} />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#082B3F]">
                    {selectedCustomer.name || "Customer Profile"}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 font-mono">
                      ID: {selectedCustomer.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedCustomer.id, "cust_modal_id")}
                      className="text-slate-400 hover:text-slate-700"
                      title="Copy Customer ID"
                    >
                      {copiedId === "cust_modal_id" ? (
                        <Check size={12} className="text-emerald-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/50 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              
              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                  <span className="text-xs font-bold text-[#082B3F] mt-0.5 block truncate">
                    {selectedCustomer.email || "—"}
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                  <span className="text-xs font-bold text-[#082B3F] mt-0.5 block">
                    {selectedCustomer.phone || "Not provided"}
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered On</span>
                  <span className="text-xs font-bold text-[#082B3F] mt-0.5 block">
                    {new Date(selectedCustomer.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status and Membership */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Status</span>
                    <span className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                      <ShieldCheck size={14} weight="fill" />
                      {selectedCustomer.is_verified ? "Verified Patient" : "Standard Account"}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Membership Tier</span>
                    <span className="text-xs font-bold text-[#082B3F] mt-0.5 flex items-center gap-1">
                      <Sparkle size={14} className="text-amber-500" weight="fill" />
                      {selectedCustomer.membership_status || "FREE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Orders History Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#082B3F] uppercase tracking-wider flex items-center gap-2">
                    <Package size={15} className="text-[#0FA7E3]" weight="bold" />
                    <span>Orders Placed ({selectedCustomer.orders?.length || 0})</span>
                  </h3>
                  <Link
                    href="/admin/orders"
                    className="text-xs font-bold text-[#0FA7E3] hover:underline flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ArrowSquareOut size={12} />
                  </Link>
                </div>

                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
                    {selectedCustomer.orders.map((order) => (
                      <div key={order.id} className="p-3 bg-white flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#082B3F]">Order #{order.id?.slice(-8)}</span>
                          {order.created_at && (
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {order.total_amount && (
                            <span className="font-bold text-slate-700">Rs. {Number(order.total_amount).toLocaleString()}</span>
                          )}
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-[#082B3F] border border-blue-100">
                            {order.status || "Placed"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                    No purchase or prescription orders placed yet.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#082B3F] text-white hover:bg-[#0FA7E3] transition-all shadow-sm"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

