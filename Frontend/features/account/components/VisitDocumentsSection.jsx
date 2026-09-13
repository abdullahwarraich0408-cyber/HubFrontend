"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, UploadSimple, Trash, Paperclip } from "@phosphor-icons/react";
import { toast } from "sonner";
import { uploadApi, visitDocumentsApi } from "@/lib/api/index";
import { Button } from "@/shared/components/Button";

const DOC_TYPES = [
  { id: "lab_report", label: "Lab report" },
  { id: "imaging", label: "Imaging / scan" },
  { id: "previous_prescription", label: "Previous prescription" },
  { id: "referral", label: "Referral" },
  { id: "medical_report", label: "Medical report" },
  { id: "other", label: "Other" },
];

export function VisitDocumentsSection({ appointmentId, compact = false }) {
  const queryClient = useQueryClient();
  const fileRef = useRef(null);
  const [documentType, setDocumentType] = useState("lab_report");
  const [uploading, setUploading] = useState(false);

  const docsQuery = useQuery({
    queryKey: ["visit-documents", appointmentId],
    enabled: Boolean(appointmentId),
    queryFn: async () => {
      const data = await visitDocumentsApi.list(appointmentId);
      return data.documents || [];
    },
  });

  const removeMut = useMutation({
    mutationFn: (documentId) => visitDocumentsApi.remove(appointmentId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visit-documents", appointmentId] });
      toast.success("Document removed");
    },
    onError: (err) => toast.error(err.message || "Could not remove document"),
  });

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadApi.uploadDocument(file);
      const url = uploaded.url || uploaded.file_url || uploaded;
      await visitDocumentsApi.create(appointmentId, {
        document_type: documentType,
        title: file.name,
        file_name: file.name,
        file_url: typeof url === "string" ? url : url?.url,
        mime_type: file.type || null,
        file_size: file.size || null,
      });
      queryClient.invalidateQueries({ queryKey: ["visit-documents", appointmentId] });
      toast.success("Document added to visit");
    } catch (error) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const documents = docsQuery.data || [];

  return (
    <div className={compact ? "mt-4 pt-4 border-t border-neutral-100" : "mt-4"}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Paperclip size={16} className="text-brand-primary" />
          <p className="text-[13px] font-bold text-ink-headline">Visit Documents</p>
        </div>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="text-[12px] border border-neutral-200 rounded-lg px-2 py-1 bg-white"
        >
          {DOC_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {docsQuery.isLoading ? (
        <p className="text-[12px] text-neutral-500">Loading documents…</p>
      ) : documents.length === 0 ? (
        <p className="text-[12px] text-neutral-500 mb-3">
          Upload labs, scans, or previous prescriptions for your doctor to review.
        </p>
      ) : (
        <ul className="space-y-2 mb-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-2 rounded-[10px] border border-neutral-200 px-3 py-2"
            >
              <a
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 min-w-0 text-[12px] font-medium text-brand-primary"
              >
                <FileText size={14} />
                <span className="truncate">{doc.title || doc.file_name || "Document"}</span>
                <span className="text-neutral-400 font-normal shrink-0">· {doc.source}</span>
              </a>
              {doc.source !== "chat" && doc.uploaded_by_type === "patient" && (
                <button
                  type="button"
                  onClick={() => removeMut.mutate(doc.id)}
                  className="text-neutral-400 hover:text-rose-600"
                  aria-label="Remove document"
                >
                  <Trash size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
        <Button
          variant="secondary"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <UploadSimple size={14} className="mr-1.5" />
          {uploading ? "Uploading…" : "Upload Document"}
        </Button>
      </div>
    </div>
  );
}
