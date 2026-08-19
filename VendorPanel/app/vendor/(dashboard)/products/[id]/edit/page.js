"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { ProductForm } from "@/shared/components/ProductForm";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { useMyVendorProduct } from "@/lib/hooks/useApi";

export default function EditProductPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useMyVendorProduct(id);

  return (
    <div className="max-w-[920px]">
      <Link href={partnerRoutes.vendor.product(id)} className="inline-flex items-center text-[13px] font-semibold text-neutral-500 mb-4">
        <ArrowLeft size={16} className="mr-2" /> Back to product
      </Link>
      <h1 className="font-heading text-[28px] font-extrabold mb-6">Edit Product</h1>
      {isLoading ? <TableSkeleton /> : <ProductForm mode="edit" product={product} />}
    </div>
  );
}
