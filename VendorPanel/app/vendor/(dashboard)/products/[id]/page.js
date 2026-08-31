"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/shared/components/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { useMyVendorProduct, useSetProductListing } from "@/lib/hooks/useApi";
import { formatPkr, formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useMyVendorProduct(id);
  const setListing = useSetProductListing();

  if (isLoading) return <TableSkeleton rows={4} />;
  if (!product) {
    return <p className="text-sm text-neutral-500">This product is unavailable.</p>;
  }

  return (
    <div className="max-w-[960px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[28px] font-extrabold">{product.name}</h1>
          <p className="text-sm text-neutral-500 mt-1">{product.generic_name || product.formula || "Medicine"}</p>
        </div>
        <div className="flex gap-2">
          <Link href={partnerRoutes.vendor.productEdit(product.id)}><Button>Edit Product</Button></Link>
          <Link href={partnerRoutes.vendor.inventory}><Button variant="secondary">Update Stock</Button></Link>
          <Button
            variant="secondary"
            onClick={() =>
              setListing.mutateAsync({ id: product.id, listing_status: String(product.listing_status).toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE" })
                .then(() => toast.success("Product listing updated."))
                .catch((error) => toast.error(error.message))
            }
          >
            {String(product.listing_status).toUpperCase() === "ACTIVE" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>

      {(product.approval_status === "rejected" || product.approval_status === "changes_requested") && product.review_note ? (
        <div className="rounded-[14px] border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <p className="font-bold">{product.approval_status === "rejected" ? "Rejected" : "Changes Requested"}</p>
          <p className="text-sm mt-1">Reason: {product.review_note}</p>
          <Link href={partnerRoutes.vendor.productEdit(product.id)} className="text-sm font-semibold underline mt-2 inline-block">Edit and Resubmit</Link>
        </div>
      ) : null}

      <div className="bg-white rounded-[16px] border border-neutral-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full rounded-[12px] object-cover aspect-square" /> : <div className="aspect-square bg-neutral-100 rounded-[12px]" />}
        </div>
        <dl className="md:col-span-2 grid grid-cols-2 gap-4 text-sm">
          <Field label="Brand / Manufacturer" value={[product.brand_name, product.manufacturer].filter(Boolean).join(" · ") || "—"} />
          <Field label="Category" value={product.category || "—"} />
          <Field label="Dosage form" value={product.dosage_form || "—"} />
          <Field label="Strength" value={product.strength || "—"} />
          <Field label="Pack size" value={product.pack_size || "—"} />
          <Field label="Retail price" value={formatPkr(product.retail_price ?? product.price)} />
          <Field label="Sale price" value={product.sale_price != null ? formatPkr(product.sale_price) : "—"} />
          <Field label="Available stock" value={product.inventory?.available_quantity ?? product.stock} />
          <Field label="Prescription required" value={product.prescription_required ? "Yes" : "No"} />
          <Field label="Controlled medicine" value={product.controlled_medicine ? "Yes (DRAP Monitored)" : "No"} />
          <div><p className="text-xs uppercase text-neutral-500 font-bold mb-1">Approval</p><StatusBadge status={product.approval_status} kind="approval" /></div>
          <div><p className="text-xs uppercase text-neutral-500 font-bold mb-1">Listing</p><StatusBadge status={product.listing_status} kind="listing" /></div>
        </dl>
      </div>

      <section className="bg-white rounded-[16px] border border-neutral-200 p-6 space-y-3">
        <h2 className="font-heading text-lg font-bold">Description</h2>
        <p className="text-sm text-neutral-600 whitespace-pre-wrap">{product.description || "No description provided."}</p>
        <p className="text-sm"><strong>Instructions:</strong> {product.usage_instructions || "—"}</p>
        <p className="text-sm"><strong>Warnings:</strong> {product.warnings || "—"}</p>
      </section>

      {product.audit_logs?.length ? (
        <section className="bg-white rounded-[16px] border border-neutral-200 p-6">
          <h2 className="font-heading text-lg font-bold mb-3">Audit history</h2>
          <div className="space-y-2 text-sm">
            {product.audit_logs.map((entry) => (
              <p key={entry.id}>{formatDate(entry.created_at, true)} · {entry.action}</p>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase text-neutral-500 font-bold mb-1">{label}</p>
      <p className="font-semibold text-ink-headline">{value}</p>
    </div>
  );
}
