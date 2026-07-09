"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, MagnifyingGlass, Pill, UploadSimple, X, Warning, PencilSimple, Trash } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { BulkProductImport } from "@/shared/components/BulkProductImport";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { useMyVendorProducts, useUpdateVendorProduct, useDeleteVendorProduct, useUploadImage } from "@/lib/hooks/useApi";
import { toast } from "sonner";

export default function MyProductsPage() {
  const { data: products = [], isLoading } = useMyVendorProducts();
  const [search, setSearch] = useState("");

  // Edit & Delete States
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  const updateProductMutation = useUpdateVendorProduct();
  const deleteProductMutation = useDeleteVendorProduct();
  const uploadImageMutation = useUploadImage();

  // Bulk Import State
  const [showImportModal, setShowImportModal] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        (product.category || "").toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleUploadEditImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingEditImage(true);
    try {
      const res = await uploadImageMutation.mutateAsync(file);
      setEditImageUrl(res.url);
      toast.success("Product image uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload product image");
    } finally {
      setUploadingEditImage(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const formData = new FormData(e.target);
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        name: formData.get("name"),
        formula: formData.get("formula"),
        price: parseFloat(formData.get("price")),
        stock: parseInt(formData.get("stock")),
        category: formData.get("category"),
        description: formData.get("description"),
        image_url: editImageUrl || "",
      });
      toast.success("Product updated successfully!");
      closeEditModal();
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProductMutation.mutateAsync(deletingProduct.id);
      toast.success("Product deleted successfully!");
      setDeletingProduct(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  if (isLoading) {
    return <div className="text-sm text-neutral-500">Loading your products...</div>;
  }

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditImageUrl(product.image_url || "");
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditImageUrl("");
  };

  const renderReviewStatus = (status) => {
    const normalized = (status || "pending_review").toLowerCase();
    if (normalized === "approved") {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#0F9D58]/10 text-[#0F9D58] border border-[#0F9D58]/20">Approved</span>;
    }
    if (normalized === "rejected") {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">Rejected</span>;
    }
    return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20">Pending Review</span>;
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">My Products</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Manage your pharmacy inventory, review status, and listing readiness.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowImportModal(true)} 
            variant="secondary"
            className="h-[44px] border border-neutral-300 shadow-sm flex items-center gap-2"
          >
            <UploadSimple size={16} weight="bold" /> Bulk Import
          </Button>
          <Link href={partnerRoutes.vendor.productsNew}>
            <Button className="h-[44px] shadow-sm flex items-center gap-2">
              <Plus size={16} weight="bold" /> Add New Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="w-full sm:w-[320px]">
            <Input
              placeholder="Search your products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<MagnifyingGlass size={16} />}
              className="h-[40px] text-[13px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-neutral-500">
                    No products listed yet. Add your first product to start selling.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[8px] bg-neutral-100 flex items-center justify-center text-brand-primary border border-neutral-200 overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Pill size={20} weight="fill" />
                          )}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-ink-900">{product.name}</div>
                          <div className="text-[12px] text-neutral-500">{product.formula || "Medicine"}</div>
                          {product.review_note ? (
                            <div className="text-[12px] text-red-600 mt-1">Admin note: {product.review_note}</div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] font-medium text-neutral-600">{product.category || "General"}</td>
                    <td className="p-4 text-[14px] font-bold text-ink-900">PKR {Number(product.price).toLocaleString()}</td>
                    <td className="p-4 text-[13px] font-bold text-neutral-700">{product.stock} units</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        {renderReviewStatus(product.approval_status)}
                        <span className={`text-xs font-semibold ${product.stock <= 10 ? "text-[#D97706]" : "text-neutral-500"}`}>
                          {product.stock <= 10 ? "Low stock" : "Inventory healthy"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-brand-primary transition-colors"
                          title="Edit Product"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-neutral-200 text-[13px] font-medium text-neutral-500 bg-neutral-50">
          Showing {filtered.length} of {products.length} products in your store
        </div>
      </div>

      {showImportModal && (
        <BulkProductImport
          variant="modal"
          onSuccess={() => setShowImportModal(false)}
          onCancel={() => setShowImportModal(false)}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <form onSubmit={handleEditSubmit} className="bg-white w-full max-w-lg rounded-[16px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50 shrink-0">
              <div>
                <h2 className="text-[18px] font-extrabold text-ink-headline">Edit Product</h2>
                <p className="text-[12px] text-neutral-500 mt-0.5">Modify the details of your pharmacy product.</p>
              </div>
              <button 
                type="button"
                onClick={closeEditModal} 
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-white">
              <Input label="Product Name" name="name" defaultValue={editingProduct.name} required />
              <Input label="Generic Formula" name="formula" defaultValue={editingProduct.formula || ""} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price (PKR)" name="price" type="number" step="0.01" defaultValue={editingProduct.price} required />
                <Input label="Stock (Units)" name="stock" type="number" defaultValue={editingProduct.stock} required />
              </div>
              <Input label="Category" name="category" defaultValue={editingProduct.category || ""} required />
              
              {/* Product Image */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-neutral-700">Product Image</label>
                {editImageUrl ? (
                  <div className="flex items-center gap-4 p-4 border border-neutral-200 rounded-[12px] bg-neutral-50">
                    <img src={editImageUrl} alt="Product" className="w-16 h-16 rounded-[8px] object-cover border border-neutral-200" />
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-neutral-600 truncate max-w-[250px]">{editImageUrl.split('/').pop()}</div>
                      <button
                        type="button"
                        onClick={() => setEditImageUrl("")}
                        className="text-[12px] text-red-500 hover:text-red-700 font-bold mt-1"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative border border-dashed border-neutral-300 hover:border-neutral-400 transition-colors rounded-[12px] p-6 flex flex-col items-center justify-center bg-neutral-50/50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadEditImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingEditImage}
                    />
                    <div className="text-center space-y-1">
                      <p className="text-[13px] font-semibold text-neutral-600">
                        {uploadingEditImage ? "Uploading image..." : "Upload Product Image"}
                      </p>
                      <p className="text-[11px] text-neutral-400">JPG, PNG, WEBP up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-bold text-neutral-700">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingProduct.description || ""}
                  rows={3}
                  className="w-full px-3 py-2 text-[14px] border border-neutral-200 rounded-[8px] bg-white outline-none focus:border-brand-primary transition-colors resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50 shrink-0">
              <Button 
                type="button"
                variant="secondary"
                onClick={closeEditModal}
                className="h-[40px]"
                disabled={updateProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-[40px] shadow-sm"
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[16px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <Warning size={32} weight="fill" />
              <div>
                <h3 className="text-[18px] font-extrabold text-ink-headline">Delete Product</h3>
                <p className="text-[12px] text-neutral-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-[14px] text-neutral-600">
              Are you sure you want to delete <strong className="text-ink-900">{deletingProduct.name}</strong> from your inventory? It will be permanently removed from PharmaHub.
            </p>

            <div className="flex justify-end gap-3">
              <Button 
                variant="secondary"
                onClick={() => setDeletingProduct(null)}
                className="h-[40px]"
                disabled={deleteProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="h-[40px] bg-red-600 hover:bg-red-700 text-white shadow-sm"
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? "Deleting..." : "Delete Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
