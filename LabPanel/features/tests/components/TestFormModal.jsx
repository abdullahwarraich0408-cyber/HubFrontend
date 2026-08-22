"use client";

import { useState, useEffect } from "react";
import { X, TestTube, CheckCircle2 } from "lucide-react";
import {
  TEST_CATEGORIES,
  TURNAROUND_OPTIONS,
  SAMPLE_TYPES,
} from "@/lib/constants/lab";
import { testSchema } from "@/lib/validations/lab";
import { toast } from "sonner";

export function TestFormModal({
  test,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) {
  const isEditing = Boolean(test);

  const [form, setForm] = useState({
    name: "",
    category: "Hematology",
    description: "",
    price: "",
    discount_price: "",
    turnaround: "24 hours",
    sample_type: "Blood",
    preparation_instructions: "",
    fasting_required: false,
    home_collection_supported: true,
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (test) {
      setForm({
        name: test.name || "",
        category: test.category || "Hematology",
        description: test.description || "",
        price: test.price !== undefined ? String(test.price) : "",
        discount_price: test.discount_price ? String(test.discount_price) : "",
        turnaround: test.turnaround || "24 hours",
        sample_type: test.sample_type || "Blood",
        preparation_instructions: test.preparation_instructions || "",
        fasting_required: Boolean(test.fasting_required),
        home_collection_supported: test.home_collection_supported ?? true,
        status: test.status || "active",
      });
    } else {
      setForm({
        name: "",
        category: "Hematology",
        description: "",
        price: "",
        discount_price: "",
        turnaround: "24 hours",
        sample_type: "Blood",
        preparation_instructions: "",
        fasting_required: false,
        home_collection_supported: true,
        status: "active",
      });
    }
    setErrors({});
  }, [test, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsed = testSchema.safeParse({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      price: form.price === "" ? 0 : Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      turnaround: form.turnaround,
      sample_type: form.sample_type,
      preparation_instructions: form.preparation_instructions.trim(),
      fasting_required: form.fasting_required,
      home_collection_supported: form.home_collection_supported,
      status: form.status,
    });

    if (!parsed.success) {
      const fieldErrors = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix form validation errors.");
      return;
    }

    onSave(parsed.data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="bg-white rounded-[20px] border border-[#D9DEE5] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-7 py-5 border-b border-[#D9DEE5] flex items-center justify-between bg-neutral-50/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DEEEF9] text-[#17618E] flex items-center justify-center">
              <TestTube size={20} />
            </div>
            <div>
              <h2 className="text-[19px] font-bold text-[#082B3F]">
                {isEditing ? "Edit Diagnostic Test" : "Add New Diagnostic Test"}
              </h2>
              <p className="text-[12px] text-[#667085]">
                Configure catalog test details, pricing, and sample requirements
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#667085] hover:text-[#082B3F] p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-7 overflow-y-auto space-y-5 flex-1">
          {/* Test Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
                Test Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Complete Blood Count"
                className={`w-full h-[42px] px-3.5 text-[13px] border rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E] ${
                  errors.name ? "border-red-400 bg-red-50/30" : "border-[#D9DEE5]"
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] bg-white focus:outline-none focus:border-[#17618E]"
              >
                {TEST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Turnaround */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
                Price (PKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="1200"
                className={`w-full h-[42px] px-3.5 text-[13px] border rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E] ${
                  errors.price ? "border-red-400 bg-red-50/30" : "border-[#D9DEE5]"
                }`}
              />
              {errors.price && (
                <p className="text-[11px] text-red-500 mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
                Discount Price (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={form.discount_price}
                onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                placeholder="1000"
                className="w-full h-[42px] px-3.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
                Turnaround Time <span className="text-red-500">*</span>
              </label>
              <select
                value={form.turnaround}
                onChange={(e) => setForm({ ...form, turnaround: e.target.value })}
                className="w-full h-[42px] px-3 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] bg-white focus:outline-none focus:border-[#17618E]"
              >
                {TURNAROUND_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sample Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
                Sample Type
              </label>
              <select
                value={form.sample_type}
                onChange={(e) => setForm({ ...form, sample_type: e.target.value })}
                className="w-full h-[42px] px-3 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] bg-white focus:outline-none focus:border-[#17618E]"
              >
                {SAMPLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
                Catalog Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-[42px] px-3 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] bg-white focus:outline-none focus:border-[#17618E]"
              >
                <option value="active">Active (Available for booking)</option>
                <option value="inactive">Inactive (Hidden from catalog)</option>
              </select>
            </div>
          </div>

          {/* Toggles: Fasting & Home Collection */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row gap-6">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.home_collection_supported}
                onChange={(e) =>
                  setForm({ ...form, home_collection_supported: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#17618E] border-[#D9DEE5] focus:ring-[#17618E]"
              />
              <div>
                <span className="text-[13px] font-semibold text-[#082B3F] block">
                  Home Collection Supported
                </span>
                <span className="text-[11px] text-[#667085]">
                  Phlebotomist can collect sample at patient residence
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.fasting_required}
                onChange={(e) =>
                  setForm({ ...form, fasting_required: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#17618E] border-[#D9DEE5] focus:ring-[#17618E]"
              />
              <div>
                <span className="text-[13px] font-semibold text-[#082B3F] block">
                  Fasting Required
                </span>
                <span className="text-[11px] text-[#667085]">
                  Requires 8-12 hours overnight fasting
                </span>
              </div>
            </label>
          </div>

          {/* Description & Preparation Instructions */}
          <div>
            <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
              Description / Clinical Significance
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="e.g. Evaluates overall health and detects a wide range of blood disorders."
              className="w-full px-3.5 py-2 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
              Patient Preparation Instructions
            </label>
            <textarea
              value={form.preparation_instructions}
              onChange={(e) =>
                setForm({ ...form, preparation_instructions: e.target.value })
              }
              rows={2}
              placeholder="e.g. Avoid high-fat meals 12 hours prior to test. Early morning sample preferred."
              className="w-full px-3.5 py-2 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-[13px] font-semibold text-[#667085] hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#17618E] hover:bg-[#124362] rounded-lg transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>{isEditing ? "Save Test Changes" : "Create Test"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
