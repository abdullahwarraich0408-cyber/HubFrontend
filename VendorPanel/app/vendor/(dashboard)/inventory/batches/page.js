"use client";

import { useState } from "react";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useVendorBatches, useAddBatch, useMyVendorProducts, useExpiringBatches } from "@/lib/hooks/useApi";
import { formatDate, formatPkr } from "@/lib/format";
import { toast } from "sonner";

export default function BatchesPage() {
  const { data: batches = [], isLoading } = useVendorBatches();
  const { data: expiring = [] } = useExpiringBatches();
  const { data: productData } = useMyVendorProducts({ pageSize: 100 });
  const addBatch = useAddBatch();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch Management"
        description="Track manufacturing dates, expiry, and FEFO-ready quantities."
        actions={<Button onClick={() => setOpen(true)}>Add batch</Button>}
      />

      {expiring.length > 0 ? (
        <div className="rounded-[14px] border border-amber-200 bg-amber-50 p-4 text-amber-900 text-sm">
          {expiring.length} batch{expiring.length === 1 ? "" : "es"} expiring soon or expired. Expired stock cannot be sold.
        </div>
      ) : null}

      <div className="bg-white rounded-[16px] border border-neutral-200 overflow-hidden">
        {isLoading ? <TableSkeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-[12px] font-bold text-neutral-500 uppercase">
                  <th className="p-4 pl-6">Batch</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Mfg</th>
                  <th className="p-4">Expiry</th>
                  <th className="p-4">Available</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {batches.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-sm text-neutral-500">No inventory records yet.</td></tr>
                ) : batches.map((batch) => (
                  <tr key={batch.id} className="h-[62px]">
                    <td className="p-4 pl-6 font-semibold">{batch.batch_number}</td>
                    <td className="p-4">{batch.product?.name}</td>
                    <td className="p-4">{formatDate(batch.manufacturing_date)}</td>
                    <td className="p-4">{formatDate(batch.expiry_date)}</td>
                    <td className="p-4">{batch.quantity_available}</td>
                    <td className="p-4">{batch.supplier_name || "—"}</td>
                    <td className="p-4"><StatusBadge status={batch.expiry_class || (batch.sellable ? "Healthy" : "Expired")} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form className="bg-white rounded-[16px] p-6 w-full max-w-lg space-y-4" onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.target);
            try {
              await addBatch.mutateAsync({
                product_id: form.get("product_id"),
                batch_number: form.get("batch_number"),
                manufacturing_date: form.get("manufacturing_date") || undefined,
                expiry_date: form.get("expiry_date"),
                purchase_price: form.get("purchase_price") ? Number(form.get("purchase_price")) : undefined,
                quantity_received: Number(form.get("quantity_received")),
                supplier_name: form.get("supplier_name") || undefined,
              });
              toast.success("Batch added.");
              setOpen(false);
            } catch (error) {
              toast.error(error.message || "Unable to add batch.");
            }
          }}>
            <h2 className="font-heading text-lg font-bold">Add batch</h2>
            <label className="text-[13px] font-semibold block">Product
              <select name="product_id" required className="mt-1.5 w-full h-[46px] rounded-lg border border-neutral-300 px-3">
                {(productData?.products || []).map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </label>
            <Input name="batch_number" label="Batch number" required />
            <div className="grid grid-cols-2 gap-3">
              <Input name="manufacturing_date" label="Manufacturing date" type="date" />
              <Input name="expiry_date" label="Expiry date" type="date" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input name="quantity_received" label="Quantity received" type="number" min="1" required />
              <Input name="purchase_price" label={`Purchase price (${formatPkr(0).slice(0, 3)})`} type="number" min="0" step="0.01" />
            </div>
            <Input name="supplier_name" label="Supplier" />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={addBatch.isPending}>Save batch</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
