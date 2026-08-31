"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, MagnifyingGlass, Pill, UploadSimple, DotsThree } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { BulkProductImport } from "@/shared/components/BulkProductImport";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { PageHeader } from "@/shared/components/PageHeader";
import { Pagination } from "@/shared/components/Pagination";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import {
  useMyVendorProducts,
  useDeleteVendorProduct,
  useDuplicateProduct,
  useSetProductListing,
  useUpdateStock,
} from "@/lib/hooks/useApi";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { formatPkr } from "@/lib/format";
import { toast } from "sonner";

export default function MyProductsRoute() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <MyProductsPage />
    </Suspense>
  );
}

function MyProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 20);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebouncedValue(search);
  const approval = searchParams.get("approval") || "";
  const listing = searchParams.get("listing") || "";
  const sort = searchParams.get("sort") || "newest";

  const params = useMemo(
    () => ({
      page,
      pageSize,
      search: debouncedSearch,
      approval_status: approval,
      listing_status: listing,
      sort,
    }),
    [page, pageSize, debouncedSearch, approval, listing, sort]
  );

  const { data, isLoading } = useMyVendorProducts(params);
  const products = data?.products || [];
  const total = data?.total || 0;
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [stockProduct, setStockProduct] = useState(null);
  const [stockValue, setStockValue] = useState("");
  const [menuId, setMenuId] = useState(null);

  const deleteProduct = useDeleteVendorProduct();
  const duplicateProduct = useDuplicateProduct();
  const setListing = useSetProductListing();
  const updateStock = useUpdateStock();

  const setQuery = (updates) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value == null || value === "") next.delete(key);
      else next.set(key, String(value));
    });
    router.push(`${partnerRoutes.vendor.products}?${next.toString()}`);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="My Products"
        description="Manage your pharmacy inventory, review status, and listing readiness."
        actions={
          <>
            <Button onClick={() => setShowImportModal(true)} variant="secondary" className="h-[44px]">
              <UploadSimple size={16} weight="bold" className="mr-2" /> Bulk Import
            </Button>
            <Link href={partnerRoutes.vendor.productsNew}>
              <Button className="h-[44px]">
                <Plus size={16} weight="bold" className="mr-2" /> Add New Product
              </Button>
            </Link>
          </>
        }
      />

      <div className="bg-white rounded-[16px] border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col lg:flex-row gap-3">
          <div className="w-full sm:w-[320px]">
            <Input
              placeholder="Search your products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setQuery({ search: e.target.value, page: 1 });
              }}
              leftIcon={<MagnifyingGlass size={16} />}
            />
          </div>
          <select className="h-[46px] rounded-lg border border-neutral-200 px-3 text-sm" value={approval} onChange={(e) => setQuery({ approval: e.target.value, page: 1 })} aria-label="Approval status">
            <option value="">All approval</option>
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="changes_requested">Changes Requested</option>
          </select>
          <select className="h-[46px] rounded-lg border border-neutral-200 px-3 text-sm" value={listing} onChange={(e) => setQuery({ listing: e.target.value, page: 1 })} aria-label="Listing status">
            <option value="">All listing</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select className="h-[46px] rounded-lg border border-neutral-200 px-3 text-sm" value={sort} onChange={(e) => setQuery({ sort: e.target.value })} aria-label="Sort products">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
            <option value="stock-asc">Stock Low-High</option>
            <option value="stock-desc">Stock High-Low</option>
          </select>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm text-neutral-500">
                      {search || approval || listing
                        ? "No products found matching the selected filter."
                        : "No products listed yet. Add your first product to start selling."}
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50/50 h-[62px]">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[8px] bg-neutral-100 flex items-center justify-center text-brand-primary overflow-hidden">
                            {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : <Pill size={20} weight="fill" />}
                          </div>
                          <div>
                            <Link href={partnerRoutes.vendor.product(product.id)} className="text-[14px] font-bold text-ink-900 hover:underline">
                              {product.name}
                            </Link>
                            <div className="text-[12px] text-neutral-500">{product.generic_name || product.formula || "Medicine"}</div>
                            {product.review_note ? <div className="text-[12px] text-red-600 mt-1">Reason: {product.review_note}</div> : null}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[13px]">{product.category || "General"}</td>
                      <td className="p-4 font-bold">{formatPkr(product.retail_price ?? product.price)}</td>
                      <td className="p-4">{product.inventory?.available_quantity ?? product.stock} units</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={product.approval_status} kind="approval" />
                          <StatusBadge
                            status={
                              product.listing_status === "ARCHIVED" || product.listing_status === "INACTIVE"
                                ? product.listing_status
                                : (product.inventory?.available_quantity ?? product.stock) <= 0
                                  ? "OUT_OF_STOCK"
                                  : product.listing_status || "ACTIVE"
                            }
                            kind="listing"
                          />
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right relative">
                        <button type="button" className="p-1.5 rounded-md hover:bg-neutral-100" aria-label="Product actions" onClick={() => setMenuId(menuId === product.id ? null : product.id)}>
                          <DotsThree size={20} weight="bold" />
                        </button>
                        {menuId === product.id ? (
                          <div className="absolute right-6 top-12 z-20 w-48 bg-white border border-neutral-200 rounded-[12px] shadow-xl text-left py-1">
                            <MenuItem href={partnerRoutes.vendor.product(product.id)}>View</MenuItem>
                            <MenuItem href={partnerRoutes.vendor.productEdit(product.id)}>Edit</MenuItem>
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => duplicateProduct.mutateAsync(product.id).then(() => toast.success("Product duplicated.")).catch((err) => toast.error(err.message))}>Duplicate</button>
                            {String(product.listing_status).toUpperCase() !== "ACTIVE" ? (
                              <button className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setListing.mutateAsync({ id: product.id, listing_status: "ACTIVE" }).then(() => toast.success("Product activated."))}>Activate</button>
                            ) : (
                              <button className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setListing.mutateAsync({ id: product.id, listing_status: "INACTIVE" }).then(() => toast.success("Product deactivated."))}>Deactivate</button>
                            )}
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => { setStockProduct(product); setStockValue(String(product.inventory?.available_quantity ?? product.stock ?? 0)); setMenuId(null); }}>Update Stock</button>
                            <MenuItem href={partnerRoutes.vendor.inventory}>View Inventory</MenuItem>
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setListing.mutateAsync({ id: product.id, listing_status: "ARCHIVED" }).then(() => toast.success("Product archived."))}>Archive</button>
                            <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => { setDeleting(product); setMenuId(null); }}>Delete</button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={(next) => setQuery({ page: next })}
          onPageSizeChange={(next) => setQuery({ pageSize: next, page: 1 })}
        />
      </div>

      {showImportModal && <BulkProductImport variant="modal" onSuccess={() => setShowImportModal(false)} onCancel={() => setShowImportModal(false)} />}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this product?"
        description="It will be removed from your catalog. This is a soft delete and can be recovered by support if needed."
        confirmLabel="Delete"
        destructive
        loading={deleteProduct.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          try {
            await deleteProduct.mutateAsync(deleting.id);
            toast.success("Product deleted successfully.");
            setDeleting(null);
          } catch (error) {
            toast.error(error.message || "Unable to delete product.");
          }
        }}
      />

      {stockProduct ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            className="bg-white rounded-[16px] p-6 w-full max-w-md space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                await updateStock.mutateAsync({ id: stockProduct.id, stock: Number(stockValue), reason: "Manual stock update" });
                toast.success("Stock updated successfully.");
                setStockProduct(null);
              } catch (error) {
                toast.error(error.message || "Unable to update inventory.");
              }
            }}
          >
            <h2 className="font-heading text-lg font-bold">Update Stock</h2>
            <Input label="Available quantity" type="number" min="0" value={stockValue} onChange={(e) => setStockValue(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setStockProduct(null)}>Cancel</Button>
              <Button type="submit" isLoading={updateStock.isPending}>Save</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({ href, children }) {
  return (
    <Link href={href} className="block px-3 py-2 text-sm hover:bg-neutral-50">
      {children}
    </Link>
  );
}
