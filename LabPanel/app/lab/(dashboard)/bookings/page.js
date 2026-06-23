"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import {
  useLabPortalBookings,
  useUpdateLabBookingStatus,
} from "@/lib/hooks/usePartnerPortal";
import { labPortalApi } from "@/lib/api/index";

const STATUS_ACTIONS = {
  pending: [
    { label: "Accept", status: "confirmed" },
    { label: "Reject", status: "rejected", variant: "secondary" },
  ],
  confirmed: [
    { label: "Assign Collector", action: "collector" },
    { label: "Sample Collected", status: "sample_collected" },
  ],
  collector_assigned: [{ label: "Sample Collected", status: "sample_collected" }],
  sample_collected: [{ label: "Start Testing", status: "testing" }],
  testing: [{ label: "Upload Report", action: "report" }],
  report_uploaded: [{ label: "Mark Complete", status: "completed" }],
};

function getStatusActions(status) {
  return STATUS_ACTIONS[String(status || "").toLowerCase()] || [];
}

function closeModal(setSelected, resetFields) {
  setSelected(null);
  resetFields();
}

export default function LabBookingsPage() {
  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useLabPortalBookings();
  const updateStatus = useUpdateLabBookingStatus();
  const [selected, setSelected] = useState(null);
  const [collectorName, setCollectorName] = useState("");
  const [collectorPhone, setCollectorPhone] = useState("");
  const [reportUrl, setReportUrl] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [uploadingReport, setUploadingReport] = useState(false);

  const resetModalFields = () => {
    setCollectorName("");
    setCollectorPhone("");
    setReportUrl("");
    setReportFile(null);
    setUploadingReport(false);
  };

  const handleStatus = async (id, status) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Booking updated");
      closeModal(setSelected, resetModalFields);
    } catch (e) {
      toast.error(e.message || "Update failed");
    }
  };

  const handleCollector = async () => {
    if (!selected) return;
    if (!collectorName.trim() || !collectorPhone.trim()) {
      toast.error("Collector name and phone are required");
      return;
    }
    try {
      await labPortalApi.assignCollector(selected.id, {
        collector_name: collectorName.trim(),
        collector_phone: collectorPhone.trim(),
      });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-bookings"] });
      toast.success("Collector assigned");
      closeModal(setSelected, resetModalFields);
    } catch (e) {
      toast.error(e.message || "Failed to assign collector");
    }
  };

  const handleReport = async () => {
    if (!selected) return;

    const url = reportUrl.trim();
    if (!reportFile && !url) {
      toast.error("Choose a PDF file or paste a report link");
      return;
    }

    try {
      setUploadingReport(true);
      if (reportFile) {
        await labPortalApi.uploadReportFile(selected.id, reportFile);
      } else {
        await labPortalApi.uploadReport(selected.id, url);
      }
      queryClient.invalidateQueries({ queryKey: ["lab-portal-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lab-portal-reports"] });
      toast.success("Report uploaded — customer can download it now");
      closeModal(setSelected, resetModalFields);
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploadingReport(false);
    }
  };

  const selectedActions = selected ? getStatusActions(selected.status) : [];

  if (isLoading) return <div className="text-neutral-500 text-sm">Loading bookings...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline">Bookings</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Accept orders, assign collectors, and upload reports.</p>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 border-b text-[12px] font-bold text-neutral-500 uppercase">
              <th className="p-4 pl-6">Patient</th>
              <th className="p-4">Test</th>
              <th className="p-4">Collection</th>
              <th className="p-4">Date / Slot</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500 text-sm">No bookings yet.</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50/50">
                  <td className="p-4 pl-6 font-medium">{b.patient}</td>
                  <td className="p-4">{b.test}</td>
                  <td className="p-4">{b.collection}</td>
                  <td className="p-4 text-[13px]">{b.date} · {b.time}</td>
                  <td className="p-4"><Badge status={b.status} /></td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => {
                        resetModalFields();
                        setSelected(b);
                      }}
                      className="px-3 py-1.5 text-[12px] font-semibold text-brand-primary border border-brand-primary/30 rounded-md hover:bg-brand-light"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-[18px] font-bold mb-2">{selected.patient}</h3>
            <p className="text-[13px] text-neutral-500 mb-4">{selected.test} · {selected.collection}</p>
            <p className="text-[13px] mb-4">{selected.address || "No address"}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedActions.length === 0 && (
                <p className="text-[13px] text-neutral-500 w-full">No actions available for this status.</p>
              )}
              {selectedActions.map((action) =>
                action.action === "collector" ? (
                  <div key="collector" className="w-full space-y-2 mb-2">
                    <Input placeholder="Collector name" value={collectorName} onChange={(e) => setCollectorName(e.target.value)} />
                    <Input placeholder="Collector phone" value={collectorPhone} onChange={(e) => setCollectorPhone(e.target.value)} />
                    <Button onClick={handleCollector} className="w-full">Assign Collector</Button>
                  </div>
                ) : action.action === "report" ? (
                  <div key="report" className="w-full space-y-3 mb-2">
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-600 mb-1.5">
                        Upload report PDF
                      </label>
                      <input
                        type="file"
                        accept=".pdf,application/pdf,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setReportFile(file);
                          if (file) setReportUrl("");
                        }}
                        className="block w-full text-[13px] file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-brand-mist file:text-brand-primary file:font-semibold"
                      />
                      {reportFile && (
                        <p className="text-[12px] text-neutral-500 mt-1">{reportFile.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-600 mb-1.5">
                        Or paste report link
                      </label>
                      <Input
                        placeholder="https://example.com/report.pdf"
                        value={reportUrl}
                        onChange={(e) => {
                          setReportUrl(e.target.value);
                          if (e.target.value.trim()) setReportFile(null);
                        }}
                      />
                    </div>
                    <Button onClick={handleReport} className="w-full" disabled={uploadingReport}>
                      {uploadingReport ? "Uploading..." : "Upload Report"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    key={action.status}
                    variant={action.variant || "primary"}
                    onClick={() => handleStatus(selected.id, action.status)}
                  >
                    {action.label}
                  </Button>
                )
              )}
            </div>
            <Button variant="secondary" className="w-full" onClick={() => closeModal(setSelected, resetModalFields)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
