"use client";

import { useMemo, useState } from "react";
import { useAdminProducts, useReviewAdminProduct, useCreateAdminProduct, useAdminVendors } from "@/lib/hooks/useApi";
import { CheckCircle, MagnifyingGlass, ShieldWarning, XCircle, Plus, X, Pill } from "@phosphor-icons/react";
import { toast } from "sonner";

const CATEGORIES = ["Pharmacy", "Wellness", "Personal Care", "Baby Care", "Medical Devices", "Supplements"];
const DOSAGE_FORMS = ["Tablet", "Capsule", "Syrup", "Injection", "Ointment", "Cream", "Drops", "Sachet", "Inhaler"];

const emptyForm = {
  name: "",
  generic_name: "",
  price: "",
  retail_price: "",
  stock: "100",
  category: "Pharmacy",
  dosage_form: "Tablet",
  strength: "",
  pack_size: "",
  prescription_required: false,
  controlled_medicine: false,
  description: "",
  vendor_id: "",
};

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useAdminProducts();
  const { data: vendors = [] } = useAdminVendors();
  const reviewProductMutation = useReviewAdminProduct();
  const createProductMutation = useCreateAdminProduct();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState(emptyForm);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.generic_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.vendor?.business_name || "").toLowerCase().includes(search.toLowerCase());
      const normalizedStatus = (product.approval_status || "pending_review").toLowerCase();
      
      let matchesFilter = true;
      if (statusFilter === "controlled") {
        matchesFilter = Boolean(product.controlled_medicine);
      } else if (statusFilter !== "all") {
        matchesFilter = normalizedStatus === statusFilter;
      }
      return matchesSearch && matchesFilter;
    });
  }, [products, search, statusFilter]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!addFormData.name.trim()) {
      toast.error("Medicine name is required");
      return;
    }
    if (!addFormData.price || Number(addFormData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        ...addFormData,
        price: Number(addFormData.price),
        retail_price: addFormData.retail_price ? Number(addFormData.retail_price) : Number(addFormData.price),
        stock: Number(addFormData.stock) || 0,
      });
      toast.success("Medicine added successfully and published to global catalog.");
      setShowAddModal(false);
      setAddFormData(emptyForm);
    } catch (error) {
      toast.error(error.message || "Failed to add medicine");
    }
  };

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
          ? (product.controlled_medicine
              ? "Controlled medicine approved and catalog listing activated."
              : "Product approved and now eligible for listing.")
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
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">All Medicines & Products</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Global catalog moderation, medicine creation, and inventory overview.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-[#17618E] hover:bg-[#104768] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all shrink-0"
        >
          <Plus size={18} weight="bold" />
          Add Medicine / Product
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-neutral-50">
          <div className="relative w-full sm:w-[320px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by product, generic name, or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[40px] pl-10 pr-4 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#17618E] focus:ring-1 focus:ring-[#17618E]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[40px] px-3 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#17618E] focus:ring-1 focus:ring-[#17618E]"
          >
            <option value="all">All statuses</option>
            <option value="pending_review">Pending review</option>
            <option value="controlled">Controlled medicines only</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Product Details</th>
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
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="text-sm font-bold text-ink-headline">{product.name}</div>
                          {product.generic_name || product.formula ? (
                            <div className="text-xs text-neutral-500">{product.generic_name || product.formula}</div>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {product.controlled_medicine ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                <ShieldWarning size={12} weight="bold" />
                                Controlled Medicine
                              </span>
                            ) : null}
                            {product.prescription_required ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                                Rx Required
                              </span>
                            ) : null}
                            {product.strength ? (
                              <span className="text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                                {product.strength}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono mt-1">ID: ...{product.id.substring(product.id.length - 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-700">
                      {product.vendor?.business_name || "Global / System"}
                    </td>
                    <td className="p-4 text-sm font-bold text-[#17618E]">
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
                          className="inline-flex items-center gap-1 rounded-md border border-[#0F9D58]/20 bg-[#0F9D58]/10 px-3 py-1.5 text-xs font-bold text-[#0F9D58] hover:bg-[#0F9D58]/20 disabled:opacity-60 transition-colors"
                        >
                          <CheckCircle size={14} weight="bold" />
                          Approve
                        </button>
                        <button
                          onClick={() => reviewProduct(product, "rejected")}
                          disabled={reviewProductMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-md border border-[#DC2626]/20 bg-[#DC2626]/10 px-3 py-1.5 text-xs font-bold text-[#DC2626] hover:bg-[#DC2626]/20 disabled:opacity-60 transition-colors"
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#17618E]/10 text-[#17618E] rounded-lg">
                  <Pill size={24} weight="bold" />
                </div>
                <h3 className="text-xl font-bold text-ink-headline">Add New Medicine / Product</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Medicine Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Panadol Extra"
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Generic Name / Formula</label>
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol + Caffeine"
                    value={addFormData.generic_name}
                    onChange={(e) => setAddFormData({ ...addFormData, generic_name: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="250"
                    value={addFormData.price}
                    onChange={(e) => setAddFormData({ ...addFormData, price: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Retail Price (PKR)</label>
                  <input
                    type="number"
                    placeholder="300"
                    value={addFormData.retail_price}
                    onChange={(e) => setAddFormData({ ...addFormData, retail_price: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="100"
                    value={addFormData.stock}
                    onChange={(e) => setAddFormData({ ...addFormData, stock: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Category</label>
                  <select
                    value={addFormData.category}
                    onChange={(e) => setAddFormData({ ...addFormData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Dosage Form</label>
                  <select
                    value={addFormData.dosage_form}
                    onChange={(e) => setAddFormData({ ...addFormData, dosage_form: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  >
                    {DOSAGE_FORMS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg"
                    value={addFormData.strength}
                    onChange={(e) => setAddFormData({ ...addFormData, strength: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Pack Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 10x10 Tablets"
                    value={addFormData.pack_size}
                    onChange={(e) => setAddFormData({ ...addFormData, pack_size: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  />
                </div>
              </div>

              {vendors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Assign Vendor (Optional)</label>
                  <select
                    value={addFormData.vendor_id}
                    onChange={(e) => setAddFormData({ ...addFormData, vendor_id: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-[#17618E]"
                  >
                    <option value="">Auto-assign to primary vendor</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.business_name || v.name || v.id}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={addFormData.prescription_required}
                    onChange={(e) => setAddFormData({ ...addFormData, prescription_required: e.target.checked })}
                    className="w-4 h-4 rounded text-[#17618E] focus:ring-[#17618E]"
                  />
                  Prescription Required (Rx)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={addFormData.controlled_medicine}
                    onChange={(e) => setAddFormData({ ...addFormData, controlled_medicine: e.target.checked })}
                    className="w-4 h-4 rounded text-[#17618E] focus:ring-[#17618E]"
                  />
                  Controlled Medicine
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProductMutation.isPending}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#17618E] hover:bg-[#104768] rounded-xl shadow-md disabled:opacity-50"
                >
                  {createProductMutation.isPending ? "Adding..." : "Add & Publish Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
