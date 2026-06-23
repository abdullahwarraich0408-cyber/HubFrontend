"use client";

import Link from "next/link";
import { DownloadSimple, Stethoscope, Pill } from "@phosphor-icons/react";
import { useLabReports } from "@/lib/hooks/useApi";
import { Button } from "@/shared/components/Button";

export function LabReportsPage() {
  const { data: reports = [], isLoading } = useLabReports();

  return (
    <div className="max-w-[960px] mx-auto px-4 py-8">
      <h1 className="text-[28px] font-bold text-ink-headline mb-2">My Lab Reports</h1>
      <p className="text-neutral-500 mb-8">Download reports and follow up with a doctor or order medicines.</p>

      {isLoading ? (
        <p className="text-neutral-500">Loading reports...</p>
      ) : reports.length === 0 ? (
        <div className="bg-white border rounded-[16px] p-10 text-center">
          <p className="text-neutral-500 mb-4">No reports available yet.</p>
          <Link href="/lab-tests"><Button>Browse Lab Tests</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white border rounded-[16px] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[16px] font-bold">{report.testName}</h3>
                  <p className="text-[13px] text-neutral-500">{report.lab} · {new Date(report.collectionDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.reportUrl && (
                    <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary"><DownloadSimple size={16} className="mr-2" />Download PDF</Button>
                    </a>
                  )}
                  <Link href="/doctors"><Button variant="secondary"><Stethoscope size={16} className="mr-2" />Book Consultation</Button></Link>
                  <Link href="/browse"><Button><Pill size={16} className="mr-2" />Order Medicine</Button></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
