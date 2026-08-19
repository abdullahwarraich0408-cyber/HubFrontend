"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, PencilSimple, UploadSimple } from "@phosphor-icons/react";
import { BulkProductImport } from "@/shared/components/BulkProductImport";
import { ProductForm } from "@/shared/components/ProductForm";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

export default function AddProductPage() {
  const [mode, setMode] = useState("manual");

  return (
    <div className="animate-in fade-in duration-500 max-w-[920px]">
      <Link href={partnerRoutes.vendor.products} className="inline-flex items-center text-[13px] font-semibold text-neutral-500 hover:text-black mb-4">
        <ArrowLeft size={16} className="mr-2" /> Back to Products
      </Link>
      <h1 className="text-[28px] font-heading font-extrabold text-ink-headline">Add New Product</h1>
      <p className="text-[14px] text-neutral-500 mt-1 mb-6">Add a medicine manually or import many at once. Drafts stay private until submitted for review.</p>

      <div className="flex gap-2 mb-6 p-1 bg-neutral-100 rounded-[12px] w-fit">
        <button type="button" onClick={() => setMode("manual")} className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold ${mode === "manual" ? "bg-white text-ink-900 shadow-sm" : "text-neutral-500"}`}>
          <PencilSimple size={16} weight="bold" /> Manual Entry
        </button>
        <button type="button" onClick={() => setMode("bulk")} className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold ${mode === "bulk" ? "bg-white text-ink-900 shadow-sm" : "text-neutral-500"}`}>
          <UploadSimple size={16} weight="bold" /> Bulk Import (CSV / Excel)
        </button>
      </div>

      {mode === "manual" ? <ProductForm mode="create" /> : <div className="bg-white rounded-[16px] border border-neutral-200 p-8"><BulkProductImport variant="inline" /></div>}
    </div>
  );
}
