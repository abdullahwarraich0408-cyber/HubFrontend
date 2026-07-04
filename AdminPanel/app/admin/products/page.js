"use client";

import { useMemo, useState } from "react";
import { useAdminProducts, useReviewAdminProduct } from "@/lib/hooks/useApi";
import { CheckCircle, MagnifyingGlass, Pill, XCircle } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useAdminProducts();
  const reviewProductMutation = useReviewAdminProduct();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.vendor?.business_name || "").toLowerCase().includes(search.toLowerCase());
      const normalizedStatus = (product.approval_status || "pending_review").toLowerCase();
      const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const reviewProduct = async (product, approvalStatus) => {
    const note =
      approvalStatus === "rejected"
        ? window.prompt("Enter a reason for rejection", product.review_note || "")
        : "";

    if (approvalStatus === "rejected" && note === null) {
      return;
    }

    try {
      await reviewProductMutation.mutateAsync({
        id: product.id,
        approval_status: approvalStatus,
        note: (note || "").trim() || undefined,
      });
      toast.success(
        approvalStatus === "approved"
          ? "Product approved and now eligible for listing."
          : approvalStatus === "rejected"
            ? "Product rejected with feedback."
            : "Product moved back to review."
      );
    } catch (error) {
      toast.error(error.message || "Failed to update product review");
    }
  };

  const renderStatus = (status) => {
    const normalized = (status || "pending_review").toLowerCase();
    if (normalized === "approved") {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/20">
          Approved
        </span>
      );
    }
    if (normalized === "rejected") {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">
          Rejected
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20">
        Pending Review
      </span>
    );
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">All Products</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Global catalog moderation and overview.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-neutral-50">
          <div className="relative w-full sm:w-[320px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by product or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[40px] pl-10 pr-4 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[40px] px-3 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
          >
            <option value="all">All statuses</option>
            <option value="pending_review">Pending review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Product Name</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Category</th>
                <th className="p-4">Review Status</th>
                <th className="p-4">Review Note</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-neutral-400 font-medium">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-neutral-400 font-medium">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="text-sm font-bold text-ink-headline">{product.name}</div>
                      <div className="text-xs text-neutral-500 font-mono mt-0.5">ID: ...{product.id.substring(product.id.length - 8)}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-700">
                      {product.vendor?.business_name || "Unknown"}
                    </td>
                    <td className="p-4 text-sm font-bold text-[#0B6E72]">
                      PKR {product.price}
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-600">
                      {product.stock} units
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-600">
                      {product.category || "—"}
                    </td>
                    <td className="p-4">
                      {renderStatus(product.approval_status)}
                    </td>
                    <td className="p-4 text-sm text-neutral-600 max-w-[280px]">
                      <div className="line-clamp-2">{product.review_note || "—"}</div>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => reviewProduct(product, "approved")}
                          disabled={reviewProductMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-md border border-[#0F9D58]/20 bg-[#0F9D58]/10 px-3 py-1.5 text-xs font-bold text-[#0F9D58] disabled:opacity-60"
                        >
                          <CheckCircle size={14} weight="bold" />
                          Approve
                        </button>
                        <button
                          onClick={() => reviewProduct(product, "rejected")}
                          disabled={reviewProductMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-md border border-[#DC2626]/20 bg-[#DC2626]/10 px-3 py-1.5 text-xs font-bold text-[#DC2626] disabled:opacity-60"
                        >
                          <XCircle size={14} weight="bold" />
                          Reject
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
    </div>
  );
}
