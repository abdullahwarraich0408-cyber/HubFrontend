"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/shared/components/PageHeader";
import { Pagination } from "@/shared/components/Pagination";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { useVendorInventory, useUpdateStock } from "@/lib/hooks/useApi";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function InventoryRoute() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <InventoryPage />
    </Suspense>
  );
}

function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 20);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debounced = useDebouncedValue(search);
  const { data, isLoading } = useVendorInventory({ page, pageSize, search: debounced });
  const updateStock = useUpdateStock();
  const [adjusting, setAdjusting] = useState(null);
  const [qty, setQty] = useState("");

  const items = data?.items || [];

  const setQuery = (updates) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, String(value));
    });
    router.push(`${partnerRoutes.vendor.inventory}?${next.toString()}`);
  };

  const statusTone = useMemo(() => ({ IN_STOCK: "IN_STOCK", LOW_STOCK: "LOW_STOCK", OUT_OF_STOCK: "OUT_OF_STOCK" }), []);

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Track available, reserved, and low-stock medicines for your pharmacy."
        actions={<Link href={partnerRoutes.vendor.batches}><Button variant="secondary">Batches & expiry</Button></Link>}
      />
      <div className="bg-white rounded-[16px] border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <Input placeholder="Search by product, SKU, or barcode" value={search} onChange={(e) => { setSearch(e.target.value); setQuery({ search: e.target.value, page: 1 }); }} />
        </div>
        {isLoading ? <TableSkeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-[12px] font-bold text-neutral-500 uppercase">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Available</th>
                  <th className="p-4">Reserved</th>
                  <th className="p-4">Low stock at</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last updated</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-sm text-neutral-500">No inventory records yet.</td></tr>
                ) : items.map((item) => (
                  <tr key={item.id} className="h-[62px]">
                    <td className="p-4 pl-6 font-semibold">{item.name}</td>
                    <td className="p-4">{item.sku || "—"}</td>
                    <td className="p-4">{item.available_quantity}</td>
                    <td className="p-4">{item.reserved_quantity}</td>
                    <td className="p-4">{item.low_stock_threshold}</td>
                    <td className="p-4"><StatusBadge status={statusTone[item.status] || item.status} /></td>
                    <td className="p-4">{formatDate(item.updated_at, true)}</td>
                    <td className="p-4 pr-6 text-right">
                      <Button size="sm" variant="secondary" onClick={() => { setAdjusting(item); setQty(String(item.available_quantity)); }}>Adjust</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageSize={pageSize} total={data?.total || 0} onPageChange={(next) => setQuery({ page: next, search: debounced })} onPageSizeChange={(next) => setQuery({ pageSize: next, page: 1 })} />
      </div>

      {adjusting ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form className="bg-white rounded-[16px] p-6 w-full max-w-md space-y-4" onSubmit={async (event) => {
            event.preventDefault();
            try {
              await updateStock.mutateAsync({ id: adjusting.id, stock: Number(qty), reason: "Manual inventory adjustment" });
              toast.success("Stock updated successfully.");
              setAdjusting(null);
            } catch (error) {
              toast.error(error.message || "Unable to update inventory.");
            }
          }}>
            <h2 className="font-heading text-lg font-bold">Adjust stock · {adjusting.name}</h2>
            <Input label="Available quantity" type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setAdjusting(null)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
