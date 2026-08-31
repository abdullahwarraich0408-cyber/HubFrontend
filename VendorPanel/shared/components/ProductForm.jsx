"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { useCreateVendorProduct, useUpdateVendorProduct, useUploadImage, useVendorCatalog } from "@/lib/hooks/useApi";
import { DOSAGE_FORMS } from "@/lib/vendor/status";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

const EMPTY = {
  name: "",
  generic_name: "",
  brand_name: "",
  manufacturer: "",
  category: "Pain Relief",
  subcategory: "",
  dosage_form: "Tablet",
  strength: "",
  pack_size: "",
  price: "",
  sale_price: "",
  cost_price: "",
  stock: "0",
  low_stock_threshold: "10",
  sku: "",
  barcode: "",
  prescription_required: false,
  controlled_medicine: false,
  description: "",
  usage_instructions: "",
  warnings: "",
  side_effects: "",
  image_url: "",
};

function toFormState(product) {
  if (!product) return EMPTY;
  return {
    ...EMPTY,
    ...product,
    generic_name: product.generic_name || product.formula || "",
    price: product.retail_price ?? product.price ?? "",
    stock: product.stock ?? 0,
  };
}

export function ProductForm({ product, mode = "create" }) {
  const router = useRouter();
  const createProduct = useCreateVendorProduct();
  const updateProduct = useUpdateVendorProduct();
  const uploadImage = useUploadImage();
  const { data: catalog } = useVendorCatalog();
  const [form, setForm] = useState(() => toFormState(product));
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const categories = catalog?.categories || catalog?.catalog || [];
  const categoryNames = Array.isArray(categories)
    ? categories.map((item) => item.name || item)
    : [];
  const selectedCategory = Array.isArray(categories)
    ? categories.find((item) => (item.name || item) === form.category)
    : null;
  const subcategories = selectedCategory?.subcategories || selectedCategory?.children || [];

  const setField = (key, value) => {
    setDirty(true);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const payload = useMemo(
    () => ({
      name: form.name,
      formula: form.generic_name || undefined,
      generic_name: form.generic_name || undefined,
      brand_name: form.brand_name || undefined,
      manufacturer: form.manufacturer || undefined,
      category: form.category || undefined,
      subcategory: form.subcategory || undefined,
      dosage_form: form.dosage_form || undefined,
      strength: form.strength || undefined,
      pack_size: form.pack_size || undefined,
      price: Number(form.price),
      sale_price: form.sale_price === "" ? undefined : Number(form.sale_price),
      cost_price: form.cost_price === "" ? undefined : Number(form.cost_price),
      stock: Number(form.stock || 0),
      low_stock_threshold: Number(form.low_stock_threshold || 10),
      sku: form.sku || undefined,
      barcode: form.barcode || undefined,
      prescription_required: Boolean(form.prescription_required),
      controlled_medicine: Boolean(form.controlled_medicine),
      description: form.description || undefined,
      usage_instructions: form.usage_instructions || undefined,
      warnings: form.warnings || undefined,
      side_effects: form.side_effects || undefined,
      image_url: form.image_url || undefined,
    }),
    [form]
  );

  const onUpload = async (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      toast.error("Upload JPG, PNG, or WEBP only.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const res = await uploadImage.mutateAsync(file);
      setField("image_url", res.url || res.data?.url);
      toast.success("Product image uploaded successfully.");
    } catch (error) {
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (submit) => {
    if (!form.name || Number(form.price) < 0) {
      toast.error("Product name and a valid price are required.");
      return;
    }
    if (form.sale_price !== "" && Number(form.sale_price) > Number(form.price)) {
      toast.error("Sale price cannot exceed retail price.");
      return;
    }
    try {
      if (mode === "edit" && product?.id) {
        await updateProduct.mutateAsync({ id: product.id, ...payload, submit });
        toast.success(submit ? "Product submitted for review." : "Product updated successfully.");
      } else {
        await createProduct.mutateAsync({ ...payload, save_as_draft: !submit, submit });
        toast.success(submit ? "Product submitted for review." : "Product saved as draft.");
      }
      setDirty(false);
      router.push(partnerRoutes.vendor.products);
    } catch (error) {
      toast.error(error.message || "Unable to save product.");
    }
  };

  const busy = createProduct.isPending || updateProduct.isPending;

  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <section className="bg-white rounded-[16px] border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Product Name" value={form.name} onChange={(e) => setField("name", e.target.value)} required />
          <Input label="Generic Name / Formula" value={form.generic_name} onChange={(e) => setField("generic_name", e.target.value)} />
          <Input label="Brand" value={form.brand_name} onChange={(e) => setField("brand_name", e.target.value)} />
          <Input label="Manufacturer" value={form.manufacturer} onChange={(e) => setField("manufacturer", e.target.value)} />
          <label className="flex flex-col text-[13px] font-semibold text-ink-900">
            Category
            <select className="mt-1.5 h-[46px] rounded-lg border border-neutral-300 px-3 bg-neutral-100" value={form.category} onChange={(e) => setField("category", e.target.value)}>
              {(categoryNames.length ? categoryNames : ["Pain Relief", "Cold & Flu", "Antibiotics", "Vitamins & Supplements", "Other"]).map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          {subcategories.length ? (
            <label className="flex flex-col text-[13px] font-semibold text-ink-900">
              Subcategory
              <select className="mt-1.5 h-[46px] rounded-lg border border-neutral-300 px-3 bg-neutral-100" value={form.subcategory} onChange={(e) => setField("subcategory", e.target.value)}>
                <option value="">Select subcategory</option>
                {subcategories.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          ) : (
            <Input label="Subcategory" value={form.subcategory} onChange={(e) => setField("subcategory", e.target.value)} />
          )}
        </div>
      </section>

      <section className="bg-white rounded-[16px] border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Medicine Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-[13px] font-semibold text-ink-900">
            Dosage Form
            <select className="mt-1.5 h-[46px] rounded-lg border border-neutral-300 px-3 bg-neutral-100" value={form.dosage_form} onChange={(e) => setField("dosage_form", e.target.value)}>
              {DOSAGE_FORMS.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <Input label="Strength" value={form.strength} onChange={(e) => setField("strength", e.target.value)} placeholder="e.g. 500mg" />
          <Input label="Pack Size" value={form.pack_size} onChange={(e) => setField("pack_size", e.target.value)} placeholder="e.g. 10 tablets" />
          <div className="flex flex-col gap-2 mt-4 md:col-span-2">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-neutral-300 text-brand-primary focus:ring-brand-primary"
                  checked={form.prescription_required}
                  onChange={(e) => setField("prescription_required", e.target.checked)}
                />
                Prescription Required
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
                  checked={form.controlled_medicine}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setField("controlled_medicine", checked);
                    if (checked) {
                      setField("prescription_required", true);
                    }
                  }}
                />
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-900">
                  Controlled Medicine (Schedule / DRAP Monitored)
                </span>
              </label>
            </div>
            {form.controlled_medicine ? (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2 mt-1">
                <span className="font-bold shrink-0">ℹ️ Note:</span>
                <span>
                  Controlled medicines require administrative review before becoming live in the customer store. Submitting this product will notify platform administrators to review and approve the catalog entry.
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[16px] border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Retail Price (PKR)" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} />
          <Input label="Sale Price (PKR)" type="number" min="0" step="0.01" value={form.sale_price} onChange={(e) => setField("sale_price", e.target.value)} />
          <Input label="Cost Price (PKR)" type="number" min="0" step="0.01" value={form.cost_price} onChange={(e) => setField("cost_price", e.target.value)} />
        </div>
      </section>

      <section className="bg-white rounded-[16px] border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Initial Stock" type="number" min="0" value={form.stock} onChange={(e) => setField("stock", e.target.value)} />
          <Input label="Low Stock Alert At" type="number" min="0" value={form.low_stock_threshold} onChange={(e) => setField("low_stock_threshold", e.target.value)} />
          <Input label="SKU" value={form.sku} onChange={(e) => setField("sku", e.target.value)} />
          <Input label="Barcode" value={form.barcode} onChange={(e) => setField("barcode", e.target.value)} />
        </div>
      </section>

      <section className="bg-white rounded-[16px] border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Product Image</h2>
        <label
          className="block border-2 border-dashed border-neutral-300 rounded-[12px] p-8 text-center cursor-pointer"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            onUpload(event.dataTransfer.files?.[0]);
          }}
        >
          <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
          {form.image_url ? (
            <img src={form.image_url} alt="Product preview" className="w-28 h-28 object-cover rounded-lg mx-auto" />
          ) : (
            <p className="text-sm text-neutral-500">{uploading ? "Uploading..." : "Click or drag an image. JPG, PNG, WEBP. Max 5 MB."}</p>
          )}
        </label>
        {form.image_url ? (
          <button type="button" className="text-sm text-red-600" onClick={() => setField("image_url", "")}>
            Remove image
          </button>
        ) : null}
      </section>

      <section className="bg-white rounded-[16px] border border-neutral-200 p-6 space-y-4">
        <h2 className="font-heading text-lg font-bold">Description</h2>
        <label className="text-[13px] font-semibold">Description
          <textarea className="mt-1.5 w-full min-h-[90px] rounded-lg border border-neutral-300 p-3" value={form.description} onChange={(e) => setField("description", e.target.value)} />
        </label>
        <label className="text-[13px] font-semibold">Usage Instructions
          <textarea className="mt-1.5 w-full min-h-[70px] rounded-lg border border-neutral-300 p-3" value={form.usage_instructions} onChange={(e) => setField("usage_instructions", e.target.value)} />
        </label>
        <label className="text-[13px] font-semibold">Warnings
          <textarea className="mt-1.5 w-full min-h-[70px] rounded-lg border border-neutral-300 p-3" value={form.warnings} onChange={(e) => setField("warnings", e.target.value)} />
        </label>
        <label className="text-[13px] font-semibold">Side Effects
          <textarea className="mt-1.5 w-full min-h-[70px] rounded-lg border border-neutral-300 p-3" value={form.side_effects} onChange={(e) => setField("side_effects", e.target.value)} />
        </label>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" disabled={busy} onClick={() => save(false)}>
          Save Draft
        </Button>
        <Button type="button" disabled={busy} onClick={() => save(true)}>
          Submit for Review
        </Button>
      </div>
    </form>
  );
}
