"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { useLab } from "@/lib/hooks/useApi";
import { mapLabToFrontend, mapLabTestsToFrontend } from "@/lib/mappers/labTest";
import { LabTestCard } from "../components/LabTestCard";
import { addToLabCart } from "@/lib/labCart";
import { toast } from "sonner";

export function LabDetailPage({ labId }) {
  const { data: rawLab, isLoading } = useLab(labId);
  const lab = mapLabToFrontend(rawLab);
  const tests = mapLabTestsToFrontend(rawLab?.lab_tests || []);

  const handleAddToCart = (test) => {
    addToLabCart(test);
    toast.success("Added to cart");
  };

  if (isLoading) return <div className="p-8 text-neutral-500">Loading lab...</div>;
  if (!lab) return <div className="p-8">Lab not found</div>;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[80px] py-8">
      <Link href="/lab-tests/labs" className="inline-flex items-center gap-2 text-[14px] text-neutral-500 mb-6 hover:text-brand-primary">
        <ArrowLeft size={16} /> Back to labs
      </Link>
      <div className="bg-white rounded-[16px] border p-6 mb-8">
        <h1 className="text-[28px] font-bold text-ink-headline mb-2">{lab.name}</h1>
        <p className="text-neutral-500 mb-4">{lab.bio || "Certified diagnostic laboratory"}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
          <div><span className="text-neutral-400 block text-[12px] uppercase">Address</span>{lab.address || "—"}</div>
          <div><span className="text-neutral-400 block text-[12px] uppercase">Hours</span>{lab.operatingHours || "Mon–Sat 8am–8pm"}</div>
          <div><span className="text-neutral-400 block text-[12px] uppercase">Collection areas</span>{lab.collectionAreas || lab.city || "—"}</div>
        </div>
      </div>
      <h2 className="text-[20px] font-bold mb-4">Available Tests</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <div key={test.id} className="relative">
            <LabTestCard test={test} />
            <button
              onClick={() => handleAddToCart(test)}
              className="absolute top-3 right-3 text-[11px] font-bold px-2 py-1 bg-white border rounded-md hover:bg-brand-mist"
            >
              + Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
