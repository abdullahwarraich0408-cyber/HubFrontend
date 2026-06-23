"use client";

import { useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { useCreateVendorProduct, useUploadImage } from "@/lib/hooks/useApi";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();
  const createProduct = useCreateVendorProduct();
  const uploadImageMutation = useUploadImage();

  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadImageMutation.mutateAsync(file);
      setImageUrl(res.url);
      toast.success("Product image uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload product image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    try {
      await createProduct.mutateAsync({
        name: data.get("name"),
        formula: data.get("formula") || undefined,
        description: data.get("description") || undefined,
        price: Number(data.get("price")),
        stock: Number(data.get("stock")),
        category: data.get("category") || undefined,
        image_url: imageUrl || undefined,
      });
      toast.success("Product created");
      router.push(partnerRoutes.vendor.products);
    } catch (err) {
      toast.error(err.message || "Failed to create product");
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[800px]">
      <div className="mb-8">
        <Link href={partnerRoutes.vendor.products} className="inline-flex items-center text-[13px] font-semibold text-neutral-500 hover:text-black mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back to Products
        </Link>
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Add New Product</h1>
        <p className="text-[14px] text-neutral-500 mt-1">This product will be listed under your pharmacy only.</p>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Product Name" name="name" placeholder="e.g. Panadol Extra" required />
            <Input label="Generic Formula" name="formula" placeholder="e.g. Paracetamol" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Input label="Price (PKR)" name="price" type="number" min="1" required />
            <Input label="Stock Quantity" name="stock" type="number" min="0" required />
            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-neutral-700">Category</label>
              <select name="category" className="w-full h-[44px] px-3 text-[14px] font-medium border border-neutral-300 rounded-[12px] bg-white">
                <option value="Pain Relief">Pain Relief</option>
                <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                <option value="First Aid">First Aid</option>
                <option value="Prescription">Prescription</option>
              </select>
            </div>
          </div>

          {/* Product Image */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold text-neutral-700">Product Image</label>
            {imageUrl ? (
              <div className="flex items-center gap-4 p-4 border border-neutral-200 rounded-[12px] bg-neutral-50">
                <img src={imageUrl} alt="Product" className="w-16 h-16 rounded-[8px] object-cover border border-neutral-200" />
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-neutral-600 truncate max-w-[250px]">{imageUrl.split('/').pop()}</div>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
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
                  onChange={handleUploadImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImage}
                />
                <div className="text-center space-y-1">
                  <p className="text-[13px] font-semibold text-neutral-600">
                    {uploadingImage ? "Uploading image..." : "Upload Product Image"}
                  </p>
                  <p className="text-[11px] text-neutral-400">JPG, PNG, WEBP up to 5MB</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold text-neutral-700">Description</label>
            <textarea
              name="description"
              className="w-full p-3.5 border border-neutral-300 rounded-[12px] outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-[14px] resize-none h-[120px]"
              placeholder="Detailed product description, usage, side effects..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-4 border-t border-neutral-200">
            <Link href={partnerRoutes.vendor.products}>
              <Button type="button" variant="secondary" className="h-[44px]">Cancel</Button>
            </Link>
            <Button type="submit" className="h-[44px] shadow-sm" disabled={createProduct.isPending}>
              {createProduct.isPending ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
