"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { inquiriesApi } from "@/lib/api/index";
import { useAdminDoctors, useUpdateDoctorStatus } from "@/lib/hooks/useApi";
import { CheckCircle, FileText, Eye, X, DownloadSimple } from "@phosphor-icons/react";

function parseDocumentLinks(messageText = "") {
  const links = [];
  const regex = /(https?:\/\/[^\s]+|\/uploads\/[^\s]+)/g;
  let match;
  while ((match = regex.exec(messageText)) !== null) {
    const url = match[0];
    let label = "Attached Document";
    if (url.includes("pmdc") || messageText.includes("PMDC")) label = "PMDC Certificate";
    else if (url.includes("degree")) label = "Medical Degree";
    else if (url.includes("cnic")) label = "CNIC Copy";
    else if (url.includes("experience")) label = "Affiliation Proof";
    else if (url.includes("license")) label = "Lab License";
    else if (url.includes("accreditation")) label = "Accreditation Certificate";
    else if (url.includes("tax")) label = "Tax Certificate";
    else if (url.includes("bank")) label = "Bank Document";

    links.push({ url, label });
  }
  return links;
}

export default function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const data = await inquiriesApi.list();
      return data.inquiries || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => inquiriesApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast.success("Inquiry updated");
    },
    onError: (error) => toast.error(error.message || "Could not update inquiry"),
  });

  const { data: doctors = [] } = useAdminDoctors();
  const updateDoctorStatus = useUpdateDoctorStatus();

  const handleApproveDoctor = async (doctorId, inquiryId) => {
    try {
      await updateDoctorStatus.mutateAsync({ id: doctorId, is_active: true, note: "Approved via Inquiry Review" });
      await updateStatus.mutateAsync({ id: inquiryId, status: "resolved" });
      toast.success("Doctor profile approved and activated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      setSelectedInquiry(null);
    } catch (err) {
      toast.error(err.message || "Failed to approve doctor profile");
    }
  };

  const matchingDoctor = selectedInquiry ? doctors.find((d) => (d.email || "").toLowerCase() === (selectedInquiry.email || "").toLowerCase()) : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-[#082B3F]">Leads & Onboarding Inquiries</h1>
        <p className="text-[14px] text-slate-500 mt-1">
          Website contact form submissions, doctor & lab partner applications, and attached credentials.
        </p>
      </div>

      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-4 pl-6">Contact</th>
              <th className="p-4">Type / Subject</th>
              <th className="p-4">Message Summary & Credentials</th>
              <th className="p-4">Received</th>
              <th className="p-4">Status & Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Loading inquiries...
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No inquiries yet. New partner applications and contact messages will appear here.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => {
                const docLinks = parseDocumentLinks(inquiry.message || "");
                return (
                  <tr key={inquiry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-sm text-[#082B3F]">
                        {[inquiry.first_name, inquiry.last_name].filter(Boolean).join(" ")}
                      </div>
                      <div className="text-[12px] text-slate-500 font-medium">{inquiry.email}</div>
                      {inquiry.phone && <div className="text-[11px] text-slate-400 font-mono mt-0.5">{inquiry.phone}</div>}
                    </td>
                    <td className="p-4 text-[13px]">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-semibold capitalize text-[#082B3F] text-[11px]">
                        {inquiry.type || "General"}
                      </span>
                      {inquiry.subject && (
                        <p className="text-[12px] font-medium text-slate-600 truncate max-w-[200px] mt-1">
                          {inquiry.subject}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-[13px] text-slate-600 max-w-md">
                      <p className="line-clamp-2 text-[12px] font-medium text-slate-700 whitespace-pre-line">
                        {inquiry.message}
                      </p>

                      {/* Render attached document badges */}
                      {docLinks.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {docLinks.map((doc, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setPreviewDoc({ title: doc.label, url: doc.url })}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#17618E]/10 text-[#17618E] hover:bg-[#17618E] hover:text-white text-[11px] font-bold transition-colors"
                            >
                              <FileText size={13} />
                              <span>{doc.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-[12px] text-slate-500 whitespace-nowrap">
                      {new Date(inquiry.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Badge status={inquiry.status} />
                        <select
                          value={inquiry.status}
                          onChange={(event) =>
                            updateStatus.mutate({ id: inquiry.id, status: event.target.value })
                          }
                          className="text-[12px] font-semibold border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:border-[#082B3F]"
                        >
                          <option value="new">new</option>
                          <option value="in_progress">in progress</option>
                          <option value="resolved">resolved</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-[#17618E] hover:bg-slate-100 transition-colors"
                          title="View Full Application Details"
                        >
                          <Eye size={16} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082B3F]/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-[#082B3F]">
                  {[selectedInquiry.first_name, selectedInquiry.last_name].filter(Boolean).join(" ")}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{selectedInquiry.email} · {selectedInquiry.phone || "No phone"}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {selectedInquiry.subject && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Subject</span>
                  <p className="text-sm font-bold text-[#082B3F]">{selectedInquiry.subject}</p>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Application Details</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>

              {parseDocumentLinks(selectedInquiry.message || "").length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Uploaded Digital Credentials & Licenses</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {parseDocumentLinks(selectedInquiry.message || "").map((doc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPreviewDoc({ title: doc.label, url: doc.url })}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#17618E]/20 bg-[#17618E]/5 text-[#17618E] font-bold text-xs hover:bg-[#17618E] hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <FileText size={18} />
                          <span>{doc.label}</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold underline">View Document ↗</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Submitted on {new Date(selectedInquiry.created_at).toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                {matchingDoctor && (
                  matchingDoctor.is_active ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle size={16} weight="bold" /> Doctor Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApproveDoctor(matchingDoctor.id, selectedInquiry.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <CheckCircle size={16} weight="bold" /> Approve & Activate Doctor Profile
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 rounded-xl bg-[#082B3F] text-white text-xs font-bold hover:bg-[#17618E] transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#082B3F]/75 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#17618E] flex items-center justify-center font-bold">
                  <FileText size={20} weight="bold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#082B3F] capitalize">{previewDoc.title || "Document Preview"}</h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-md">{previewDoc.url}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <DownloadSimple size={16} weight="bold" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 bg-slate-900/5 p-4 overflow-auto flex items-center justify-center relative">
              {previewDoc.url?.toLowerCase().endsWith(".pdf") || previewDoc.url?.includes("pdf") ? (
                <iframe
                  src={previewDoc.url}
                  className="w-full h-full rounded-xl border border-slate-200 bg-white shadow-inner"
                  title={previewDoc.title}
                />
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-slate-200/50 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
