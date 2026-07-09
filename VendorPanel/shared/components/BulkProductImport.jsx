"use client";

import { useState } from "react";
import { UploadSimple, DownloadSimple, Warning, CheckCircle, X } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { useBulkImportProducts } from "@/lib/hooks/useApi";
import {
  downloadProductCsvTemplate,
  loadXLSX,
  parseCSVPreview,
  mapExcelRows,
  productsToCsvFile,
  countValidProducts,
  hasInvalidRows,
} from "@/lib/utils/productCsvImport";
import { toast } from "sonner";

export function BulkProductImport({ variant = "inline", onSuccess, onCancel }) {
  const [importing, setImporting] = useState(false);
  const [parsedProducts, setParsedProducts] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const bulkImportMutation = useBulkImportProducts();

  const reset = () => {
    setParsedProducts([]);
    setFileToUpload(null);
    setErrorMsg("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    reset();

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const { rows, error } = parseCSVPreview(event.target.result);
        if (error) setErrorMsg(error);
        else setParsedProducts(rows);
      };
      reader.readAsText(file);
    } else if (ext === "xlsx" || ext === "xls") {
      setImporting(true);
      try {
        const XLSX = await loadXLSX();
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(firstSheet);
            const mapped = mapExcelRows(json);

            if (mapped.length === 0) {
              setErrorMsg("The Excel sheet is empty.");
            } else {
              setParsedProducts(mapped);
              setFileToUpload(productsToCsvFile(mapped));
            }
          } catch {
            setErrorMsg("Failed to parse Excel file. Make sure it's valid.");
          } finally {
            setImporting(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch {
        toast.error("Could not load Excel parser library.");
        setImporting(false);
      }
    } else {
      setErrorMsg("Unsupported file type. Please upload a CSV or Excel file.");
    }
  };

  const handleConfirmImport = async () => {
    if (!fileToUpload) return;
    setImporting(true);
    try {
      const result = await bulkImportMutation.mutateAsync(fileToUpload);
      toast.success(
        `${result.count || parsedProducts.length} products imported and submitted for review.`
      );
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to import products");
    } finally {
      setImporting(false);
    }
  };

  const validCount = countValidProducts(parsedProducts);
  const isModal = variant === "modal";
  const isBusy = importing || bulkImportMutation.isPending;

  const body = (
    <>
      {!fileToUpload ? (
        <div className="relative border-2 border-dashed border-neutral-300 hover:border-brand-primary/40 transition-colors rounded-[12px] p-8 flex flex-col items-center justify-center bg-neutral-50/50 text-center">
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={importing}
          />
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
              <UploadSimple size={24} weight="bold" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-ink-900">
                {importing ? "Loading File Parser..." : "Click or drag file to upload"}
              </p>
              <p className="text-[12px] text-neutral-400 mt-1">
                CSV or Excel files (.xlsx, .xls) up to 10MB
              </p>
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
              <div className="text-[14px] font-bold text-ink-900">File Ready for Import</div>
              <div className="text-[12px] text-neutral-500">{parsedProducts.length} items found</div>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-[12px] font-bold text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      )}

      {!fileToUpload && (
        <div className="flex items-start gap-3 p-4 rounded-[12px] border border-neutral-200 bg-neutral-50/30">
          <div className="text-brand-primary mt-0.5">
            <DownloadSimple size={20} weight="bold" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-ink-900">Need a template format?</h4>
            <p className="text-[12px] text-neutral-500 mt-1">
              Download a blank template or a ready-made sample file with 15 medicines to test bulk
              import.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <button
                type="button"
                onClick={downloadProductCsvTemplate}
                className="text-[12px] font-semibold text-brand-primary hover:underline inline-flex items-center gap-1.5"
              >
                <DownloadSimple size={14} weight="bold" /> Blank Template
              </button>
              <a
                href="/sample_medicines_test.csv"
                download="sample_medicines_test.csv"
                className="text-[12px] font-semibold text-brand-primary hover:underline inline-flex items-center gap-1.5"
              >
                <DownloadSimple size={14} weight="bold" /> Sample File (15 medicines)
              </a>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-[8px] border border-red-200 bg-red-50 text-red-600 text-[13px] font-medium">
          <Warning size={18} weight="bold" />
          {errorMsg}
        </div>
      )}

      {parsedProducts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-ink-headline">Data Preview</h3>
            <span className="text-[12px] text-neutral-500">Showing first 5 items</span>
          </div>

          <div className="border border-neutral-200 rounded-[12px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-500 uppercase">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Formula</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-[13px]">
                {parsedProducts.slice(0, 5).map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      !row.name || isNaN(parseFloat(row.price)) ? "bg-red-50/50" : ""
                    }
                  >
                    <td className="p-3 font-semibold text-ink-900 truncate max-w-[120px]">
                      {row.name || <span className="text-red-500 italic">Missing</span>}
                    </td>
                    <td className="p-3 text-neutral-500 truncate max-w-[120px]">
                      {row.formula || "-"}
                    </td>
                    <td className="p-3 font-bold text-ink-900">
                      {row.price ? (
                        `PKR ${Number(row.price).toLocaleString()}`
                      ) : (
                        <span className="text-red-500 italic">Missing</span>
                      )}
                    </td>
                    <td className="p-3 text-neutral-600">{row.stock || "0"} units</td>
                    <td className="p-3 text-neutral-600">{row.category || "General"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {parsedProducts.length > 5 && (
            <div className="text-center text-[12px] text-neutral-400">
              + {parsedProducts.length - 5} more items in this file
            </div>
          )}

          {hasInvalidRows(parsedProducts) && (
            <div className="flex items-start gap-2 p-3 rounded-[8px] border border-amber-200 bg-amber-50 text-amber-700 text-[12px]">
              <Warning size={16} weight="bold" className="mt-0.5" />
              <div>
                <strong>Warning:</strong> Some rows are missing required fields (Name or Price).
                Invalid rows will be skipped during import.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  const actions = (
    <div className={`flex justify-end gap-3 ${isModal ? "p-6 border-t border-neutral-200 bg-neutral-50" : "pt-4 border-t border-neutral-200"}`}>
      {onCancel && (
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className={isModal ? "h-[40px]" : "h-[44px]"}
          disabled={isBusy}
        >
          Cancel
        </Button>
      )}
      <Button
        type="button"
        onClick={handleConfirmImport}
        className={`${isModal ? "h-[40px]" : "h-[44px]"} shadow-sm`}
        disabled={!fileToUpload || isBusy || validCount === 0}
      >
        {bulkImportMutation.isPending
          ? "Importing..."
          : `Import ${validCount} Product${validCount === 1 ? "" : "s"}`}
      </Button>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-2xl rounded-[16px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50">
            <div>
              <h2 className="text-[18px] font-extrabold text-ink-headline">Bulk Import Products</h2>
              <p className="text-[12px] text-neutral-500 mt-0.5">
                Upload a CSV or Excel spreadsheet to import products in bulk.
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
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
