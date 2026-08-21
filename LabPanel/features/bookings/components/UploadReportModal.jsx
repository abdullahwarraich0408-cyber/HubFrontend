"use client";

import { useState, useRef } from "react";
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export function UploadReportModal({
  booking,
  isOpen,
  onClose,
  onUpload,
  isLoading = false,
}) {
  const [file, setFile] = useState(null);
  const [reportUrl, setReportUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMode, setUploadMode] = useState("file"); // "file" or "url"
  const fileInputRef = useRef(null);

  if (!isOpen || !booking) return null;

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File size exceeds 10MB limit. Please upload a smaller file.");
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type) && !selectedFile.name.endsWith(".pdf")) {
      toast.error("Invalid file format. Please upload PDF, JPG, or PNG.");
      return;
    }

    setFile(selectedFile);
    setReportUrl("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file && !reportUrl.trim()) {
      toast.error("Please select a report file or provide a report URL");
      return;
    }

    onUpload({
      bookingId: booking.id,
      file: file || undefined,
      report_url: reportUrl.trim() || undefined,
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-[20px] border border-[#D9DEE5] shadow-2xl w-full max-w-lg p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D9DEE5]">
          <div>
            <h3 className="text-[18px] font-bold text-[#082B3F]">
              Upload Diagnostic Report
            </h3>
            <p className="text-[13px] text-[#667085] mt-0.5">
              {booking.patient_name || booking.patient} · {booking.test_name || booking.test}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#667085] hover:text-[#082B3F] p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-5">
          {/* Tab Selection */}
          <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => setUploadMode("file")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                uploadMode === "file"
                  ? "bg-white text-[#082B3F] shadow-xs"
                  : "text-[#667085] hover:text-[#082B3F]"
              }`}
            >
              Upload Document (PDF / Image)
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("url")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                uploadMode === "url"
                  ? "bg-white text-[#082B3F] shadow-xs"
                  : "text-[#667085] hover:text-[#082B3F]"
              }`}
            >
              Link Report URL
            </button>
          </div>

          {/* Drag & Drop File Zone */}
          {uploadMode === "file" ? (
            <div>
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-[#17618E] bg-teal-50/50 scale-[1.01]"
                      : "border-[#D9DEE5] hover:border-[#17618E]/60 hover:bg-neutral-50/60"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/jpg"
                    onChange={(e) => {
                      if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#DEEEF9] text-[#17618E] mx-auto flex items-center justify-center mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-[14px] font-bold text-[#082B3F]">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[12px] text-[#667085] mt-1">
                    PDF, JPG or PNG (Maximum file size: 10MB)
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[13px] font-bold text-[#082B3F] truncate max-w-[240px]">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-[#667085]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-[#667085] hover:text-[#EF233C] p-2 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
                Report Document URL
              </label>
              <div className="relative">
                <Link2
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
                />
                <input
                  type="url"
                  value={reportUrl}
                  onChange={(e) => {
                    setReportUrl(e.target.value);
                    if (e.target.value.trim()) setFile(null);
                  }}
                  placeholder="https://medzoos.com/reports/patient-cbc-123.pdf"
                  className="w-full h-[42px] pl-10 pr-3 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E]"
                />
              </div>
            </div>
          )}

          {/* Pathologist Notes */}
          <div>
            <label className="block text-[12px] font-semibold text-[#082B3F] mb-1.5">
              Pathologist / Lab Remarks (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. All parameters within reference limits. Verified by Dr. M. Iqbal."
              className="w-full px-3.5 py-2.5 text-[13px] border border-[#D9DEE5] rounded-xl text-[#082B3F] focus:outline-none focus:border-[#17618E]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-[13px] font-semibold text-[#667085] hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!file && !reportUrl.trim())}
              className="px-5 py-2.5 text-[13px] font-semibold text-white bg-[#17618E] hover:bg-[#124362] rounded-lg transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Upload & Mark Ready</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
