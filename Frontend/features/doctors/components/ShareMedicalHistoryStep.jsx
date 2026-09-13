"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { medicalHistoryApi } from "@/lib/api/index";
import { Button } from "@/shared/components/Button";

function grantKey(type, id) {
  return `${type}:${id}`;
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SelectRow({ checked, onChange, title, subtitle, meta }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-[12px] border border-neutral-200 bg-white cursor-pointer hover:border-brand-primary/40">
      <input type="checkbox" className="mt-1" checked={checked} onChange={onChange} />
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-ink-headline">{title}</span>
        {subtitle ? (
          <span className="block text-[12px] text-neutral-600 mt-0.5 line-clamp-2">{subtitle}</span>
        ) : null}
        {meta ? <span className="block text-[11px] text-neutral-400 mt-1">{meta}</span> : null}
      </span>
    </label>
  );
}

export function ShareMedicalHistoryStep({
  doctorName,
  selectedKeys,
  onChangeSelectedKeys,
  onBack,
  onSkip,
  onShareAndContinue,
  isSubmitting,
}) {
  const query = useQuery({
    queryKey: ["shareable-medical-history"],
    queryFn: () => medicalHistoryApi.listShareable(),
  });

  const data = query.data || {};
  const sections = useMemo(
    () => [
      {
        key: "visit_summaries",
        title: "Visit summaries",
        hint: "Diagnosis + short treatment summary only",
        items: (data.visit_summaries || []).map((item) => ({
          key: grantKey(item.record_type, item.record_id),
          record_type: item.record_type,
          record_id: item.record_id,
          title: item.diagnosis || item.title || "Visit summary",
          subtitle: item.summary || "No short summary available",
          meta: [item.doctor_name ? `Dr. ${item.doctor_name}` : null, formatDate(item.date)]
            .filter(Boolean)
            .join(" · "),
        })),
      },
      {
        key: "prescriptions",
        title: "Prescriptions",
        items: (data.prescriptions || []).map((item) => ({
          key: grantKey(item.record_type, item.record_id),
          record_type: item.record_type,
          record_id: item.record_id,
          title: item.title || "Prescription",
          subtitle: item.items_count ? `${item.items_count} medicine(s)` : null,
          meta: formatDate(item.date),
        })),
      },
      {
        key: "lab_reports",
        title: "Lab reports",
        items: (data.lab_reports || []).map((item) => ({
          key: grantKey(item.record_type, item.record_id),
          record_type: item.record_type,
          record_id: item.record_id,
          title: item.title || "Lab report",
          subtitle: item.lab_name || null,
          meta: formatDate(item.date),
        })),
      },
      {
        key: "medical_documents",
        title: "Medical documents",
        items: (data.medical_documents || []).map((item) => ({
          key: grantKey(item.record_type, item.record_id),
          record_type: item.record_type,
          record_id: item.record_id,
          title: item.title || "Document",
          subtitle: item.document_type || null,
          meta: formatDate(item.date),
        })),
      },
      {
        key: "visit_documents",
        title: "Visit documents",
        items: (data.visit_documents || []).map((item) => ({
          key: grantKey(item.record_type, item.record_id),
          record_type: item.record_type,
          record_id: item.record_id,
          title: item.title || "Visit document",
          subtitle: item.document_type || null,
          meta: formatDate(item.date),
        })),
      },
    ],
    [data],
  );

  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const totalAvailable = sections.reduce((sum, s) => sum + s.items.length, 0);

  const toggle = (key) => {
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChangeSelectedKeys(Array.from(next));
  };

  const grants = useMemo(() => {
    const map = new Map();
    sections.forEach((section) => {
      section.items.forEach((item) => {
        map.set(item.key, {
          record_type: item.record_type,
          record_id: item.record_id,
        });
      });
    });
    return selectedKeys.map((key) => map.get(key)).filter(Boolean);
  }, [sections, selectedKeys]);

  useEffect(() => {
    // expose grants via custom event property on continue
  }, [grants]);

  return (
    <div className="max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="text-[13px] text-neutral-500 mb-4 hover:text-ink-headline"
      >
        ← Back to payment
      </button>

      <div className="bg-white rounded-[16px] border border-neutral-200 p-5 md:p-6">
        <h3 className="text-[18px] font-bold text-ink-headline mb-1">Share Medical History</h3>
        <p className="text-[13px] text-neutral-500 mb-5">
          Help {doctorName} understand your previous treatment. Only selected items are shared —
          full private consultation notes stay private.
        </p>

        {query.isLoading ? (
          <p className="text-[13px] text-neutral-500 py-8 text-center">Loading your records…</p>
        ) : totalAvailable === 0 ? (
          <p className="text-[13px] text-neutral-500 py-6">
            No previous records found to share yet. You can continue without sharing.
          </p>
        ) : (
          <div className="space-y-5">
            {sections.map((section) =>
              section.items.length === 0 ? null : (
                <div key={section.key}>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-neutral-600 mb-1">
                    {section.title}
                  </p>
                  {section.hint ? (
                    <p className="text-[11px] text-neutral-400 mb-2">{section.hint}</p>
                  ) : null}
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <SelectRow
                        key={item.key}
                        checked={selectedSet.has(item.key)}
                        onChange={() => toggle(item.key)}
                        title={item.title}
                        subtitle={item.subtitle}
                        meta={item.meta}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onSkip} disabled={isSubmitting}>
            Don&apos;t share
          </Button>
          <Button
            className="flex-1"
            disabled={isSubmitting}
            onClick={() => onShareAndContinue(grants)}
          >
            {isSubmitting
              ? "Booking…"
              : selectedKeys.length
                ? `Share ${selectedKeys.length} & book`
                : "Continue without selection"}
          </Button>
        </div>
      </div>
    </div>
  );
}
