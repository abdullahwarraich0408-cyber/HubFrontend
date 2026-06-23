"use client";

import Link from "next/link";
import { useState } from "react";
import { House, MapPin, Star, Flask } from "@phosphor-icons/react";
import { useLabs } from "@/lib/hooks/useApi";
import { mapLabToFrontend } from "@/lib/mappers/labTest";
import { Button } from "@/shared/components/Button";

export function LabsPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [homeOnly, setHomeOnly] = useState(false);
  const params = {
    ...(search && { q: search }),
    ...(city && { city }),
    ...(homeOnly && { home_collection: "true" }),
  };
  const { data: labs = [], isLoading } = useLabs(params);

  return (
    <div className="w-full bg-surface-subtle min-h-screen py-8">
      <div className="max-w-[1280px] mx-auto px-4 md:px-[80px]">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-ink-headline mb-2">Lab Partners</h1>
          <p className="text-neutral-500">Browse certified labs, compare services, and book tests.</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lab name..."
            className="px-4 py-3 rounded-[12px] border border-neutral-200 bg-white min-w-[220px]"
          />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-3 rounded-[12px] border border-neutral-200 bg-white"
          >
            <option value="">All cities</option>
            {["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-[12px] text-[14px]">
            <input type="checkbox" checked={homeOnly} onChange={(e) => setHomeOnly(e.target.checked)} />
            Home collection only
          </label>
          <Link href="/lab-tests/cart">
            <Button variant="secondary">View Cart</Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-neutral-500">Loading labs...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {labs.map((raw) => {
              const lab = mapLabToFrontend(raw);
              return (
                <div key={lab.id} className="bg-white rounded-[16px] border border-neutral-200 p-5 hover:border-brand-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-[18px] font-bold text-ink-headline">{lab.name}</h3>
                      <p className="text-[13px] text-neutral-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {lab.city || lab.address || "Pakistan"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[13px] font-bold text-amber-600">
                      <Star size={14} weight="fill" /> {lab.rating?.toFixed(1) || "4.5"}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4 text-[12px]">
                    <span className="px-2 py-1 bg-brand-mist text-brand-primary rounded-full font-semibold">
                      {lab.testCount} tests
                    </span>
                    {lab.homeCollection && (
                      <span className="px-2 py-1 bg-neutral-100 rounded-full flex items-center gap-1">
                        <House size={12} /> Home collection
                      </span>
                    )}
                    {lab.minPrice && (
                      <span className="px-2 py-1 bg-neutral-100 rounded-full">From PKR {lab.minPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <Link href={`/lab-tests/labs/${lab.id}`}>
                    <Button className="w-full">View Lab & Book</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
