"use client";

import { useState } from "react";
import { UploadSimple, DownloadSimple, Warning, CheckCircle, X } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { useBulkImportProducts, useValidateBulkImport } from "@/lib/hooks/useApi";
import {
  downloadProductCsvTemplate,
  loadXLSX,
  parseCSVPreview,
  mapExcelRows,
  productsToCsvFile,
} from "@/lib/utils/productCsvImport";
import { toast } from "sonner";

export function BulkProductImport({ variant = "inline", onSuccess, onCancel }) {
  const [importing, setImporting] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [rows, setRows] = useState([]);
  const bulkImportMutation = useBulkImportProducts();
  const validateImport = useValidateBulkImport();

  const reset = () => {
    setRows([]);
    setFileToUpload(null);
    setErrorMsg("");
  };

  const validateFile = async (file) => {
    setImporting(true);
    try {
      const result = await validateImport.mutateAsync(file);
      const validated = result.rows || [];
      setRows(validated);
      setFileToUpload(file);
      if (!validated.length) setErrorMsg("No rows found in this file.");
    } catch (error) {
      setErrorMsg(error.message || "Unable to validate this file.");
    } finally {
      setImporting(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    reset();

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const { rows: preview, error } = parseCSVPreview(event.target.result);
        if (error) {
          setErrorMsg(error);
          return;
        }
        if (!preview.length) {
          setErrorMsg("CSV file is empty.");
          return;
        }
        await validateFile(file);
      };
      reader.readAsText(file);
      return;
    }

    if (ext === "xlsx" || ext === "xls") {
      setImporting(true);
      try {
        const XLSX = await loadXLSX();
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(firstSheet);
            const mapped = mapExcelRows(json);
            if (!mapped.length) {
              setErrorMsg("The Excel sheet is empty.");
              setImporting(false);
              return;
            }
            const csvFile = productsToCsvFile(mapped);
            await validateFile(csvFile);
          } catch {
            setErrorMsg("Failed to parse Excel file. Make sure it's valid.");
            setImporting(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch {
        toast.error("Could not load Excel parser library.");
        setImporting(false);
      }
      return;
    }

    setErrorMsg("Unsupported file type. Please upload a CSV or Excel file.");
  };

  const handleConfirmImport = async () => {
    if (!fileToUpload) return;
    setImporting(true);
    try {
      const result = await bulkImportMutation.mutateAsync({ file: fileToUpload, importValidOnly: true });
      toast.success(`Bulk import completed. ${result.count || 0} products imported.`);
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to import products");
    } finally {
      setImporting(false);
    }
  };

  const validCount = rows.filter((row) => row.valid !== false && (!row.issues || !row.issues.length) && (!row.validation || row.validation === "OK")).length;
  const invalidCount = rows.length - validCount;
  const isModal = variant === "modal";
  const isBusy = importing || bulkImportMutation.isPending || validateImport.isPending;

  const body = (
    <>
      {!fileToUpload ? (
        <div className="relative border-2 border-dashed border-neutral-300 hover:border-brand-primary/40 transition-colors rounded-[12px] p-8 flex flex-col items-center justify-center bg-neutral-50/50 text-center">
          <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isBusy} />
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
              <UploadSimple size={24} weight="bold" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-ink-900">{isBusy ? "Validating file..." : "Click or drag file to upload"}</p>
              <p className="text-[12px] text-neutral-400 mt-1">CSV or Excel files (.xlsx, .xls) up to 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-[12px] border border-neutral-200 bg-neutral-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
              <CheckCircle size={24} weight="bold" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-ink-900">File validated</div>
              <div className="text-[12px] text-neutral-500">
                {validCount} valid · {invalidCount} with issues
              </div>
            </div>
          </div>
          <button type="button" onClick={reset} className="text-[12px] font-bold text-red-500 hover:underline">
            Remove
          </button>
        </div>
      )}

      {!fileToUpload && (
        <div className="flex items-start gap-3 p-4 rounded-[12px] border border-neutral-200 bg-neutral-50/30">
          <DownloadSimple size={20} weight="bold" className="text-brand-primary mt-0.5" />
          <div>
            <h4 className="text-[13px] font-bold text-ink-900">Need a template format?</h4>
            <p className="text-[12px] text-neutral-500 mt-1">Download a blank template with the pharmacy import columns.</p>
            <button type="button" onClick={downloadProductCsvTemplate} className="text-[12px] font-semibold text-brand-primary hover:underline inline-flex items-center gap-1.5 mt-2">
              <DownloadSimple size={14} weight="bold" /> Download Template
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-[8px] border border-red-200 bg-red-50 text-red-600 text-[13px] font-medium">
          <Warning size={18} weight="bold" />
          {errorMsg}
        </div>
      )}

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-ink-headline">Validation preview</h3>
            <span className="text-[12px] text-neutral-500">{rows.length} rows</span>
          </div>
          <div className="border border-neutral-200 rounded-[12px] overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-500 uppercase">
                  <th className="p-3">Row</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[13px]">
                {rows.slice(0, 20).map((row, idx) => {
                  const issues = row.issues || (row.validation && row.validation !== "OK" ? [row.validation] : []);
                  const valid = row.valid !== false && issues.length === 0;
                  return (
                    <tr key={idx} className={valid ? "" : "bg-red-50/50"}>
                      <td className="p-3">{row.row || idx + 1}</td>
                      <td className="p-3 font-semibold">{row.name || row.product_name || "—"}</td>
                      <td className="p-3">{row.category || "—"}</td>
                      <td className="p-3">{row.price || row.retail_price || "—"}</td>
                      <td className="p-3">{row.stock ?? "—"}</td>
                      <td className="p-3">{valid ? <span className="text-green-700 font-semibold">Valid</span> : <span className="text-red-600">{issues.join("; ") || "Invalid"}</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {invalidCount > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-[8px] border border-amber-200 bg-amber-50 text-amber-700 text-[12px]">
              <Warning size={16} weight="bold" className="mt-0.5" />
              Invalid rows will be skipped. You can import valid rows only or fix the file and retry.
            </div>
          )}
        </div>
      )}
    </>
  );

  const actions = (
    <div className={`flex justify-end gap-3 ${isModal ? "p-6 border-t border-neutral-200 bg-neutral-50" : "pt-4 border-t border-neutral-200"}`}>
      {onCancel && (
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isBusy}>
          Fix file and retry
        </Button>
      )}
      <Button type="button" onClick={handleConfirmImport} disabled={!fileToUpload || isBusy || validCount === 0}>
        {bulkImportMutation.isPending ? "Importing..." : `Import valid rows only (${validCount})`}
      </Button>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-3xl rounded-[16px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50">
            <div>
              <h2 className="text-[18px] font-extrabold text-ink-headline">Bulk Import Products</h2>
              <p className="text-[12px] text-neutral-500 mt-0.5">Upload, validate, preview, then import valid rows only.</p>
            </div>
            <button type="button" onClick={onCancel} className="text-neutral-400 hover:text-neutral-600" aria-label="Close">
              <X size={20} weight="bold" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto space-y-6 flex-1">{body}</div>
          {actions}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {body}
      {actions}
    </div>
  );
}
