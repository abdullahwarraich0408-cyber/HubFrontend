"use client";
 
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MagnifyingGlass, Pill, UploadSimple, X, DownloadSimple, Warning, CheckCircle, PencilSimple, Trash } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Badge } from "@/shared/components/Badge";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { useMyVendorProducts, useBulkImportProducts, useUpdateVendorProduct, useDeleteVendorProduct, useUploadImage } from "@/lib/hooks/useApi";
import { toast } from "sonner";

export default function MyProductsPage() {
  const { data: products = [], isLoading } = useMyVendorProducts();
  const [search, setSearch] = useState("");

  // Edit & Delete States
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  const updateProductMutation = useUpdateVendorProduct();
  const deleteProductMutation = useDeleteVendorProduct();
  const uploadImageMutation = useUploadImage();

  useEffect(() => {
    if (editingProduct) {
      setEditImageUrl(editingProduct.image_url || "");
    } else {
      setEditImageUrl("");
    }
  }, [editingProduct]);

  // Bulk Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedProducts, setParsedProducts] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const bulkImportMutation = useBulkImportProducts();

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        (product.category || "").toLowerCase().includes(q)
    );
  }, [products, search]);

  const downloadTemplate = () => {
    const headers = ["name", "formula", "price", "stock", "category", "description"];
    const sampleRow = ["Panadol Extra", "Paracetamol + Caffeine", "150", "200", "Pain Relief", "Used for fast pain relief"];
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), sampleRow.join(",")].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pharmahub_products_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadXLSX = async () => {
    if (window.XLSX) return window.XLSX;
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
      script.onload = () => resolve(window.XLSX);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setParsedProducts([]);
    setFileToUpload(null);

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        parseCSVPreview(text);
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
            
            const mapped = json.map(row => {
              const findKey = (keys) => {
                const found = Object.keys(row).find(k => keys.includes(k.toLowerCase().trim()));
                return found ? String(row[found]).trim() : "";
              };

              return {
                name: findKey(["name", "title"]),
                formula: findKey(["formula", "generic", "generic formula"]),
                price: findKey(["price", "rate", "cost"]),
                stock: findKey(["stock", "qty", "quantity", "stock quantity"]),
                category: findKey(["category", "type"]),
                description: findKey(["description", "desc"]),
              };
            });

            if (mapped.length === 0) {
              setErrorMsg("The Excel sheet is empty.");
            } else {
              setParsedProducts(mapped);
              
              const csvRows = [];
              const headers = ["name", "formula", "price", "stock", "category", "description"];
              csvRows.push(headers.join(","));
              
              mapped.forEach(item => {
                const row = [
                  `"${(item.name || "").replace(/"/g, '""')}"`,
                  `"${(item.formula || "").replace(/"/g, '""')}"`,
                  item.price || "0",
                  item.stock || "0",
                  `"${(item.category || "").replace(/"/g, '""')}"`,
                  `"${(item.description || "").replace(/"/g, '""')}"`
                ];
                csvRows.push(row.join(","));
              });

              const csvContent = csvRows.join("\n");
              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
              const csvFile = new File([blob], "converted.csv", { type: "text/csv" });
              setFileToUpload(csvFile);
            }
          } catch (err) {
            setErrorMsg("Failed to parse Excel file. Make sure it's valid.");
          } finally {
            setImporting(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        toast.error("Could not load Excel parser library.");
        setImporting(false);
      }
    } else {
      setErrorMsg("Unsupported file type. Please upload a CSV or Excel file.");
    }
  };

  const parseCSVPreview = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      setErrorMsg("CSV file is empty or missing headers.");
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i];
      const cells = [];
      let insideQuote = false;
      let currentCell = '';
      
      for (let charIndex = 0; charIndex < currentLine.length; charIndex++) {
        const char = currentLine[charIndex];
        if (char === '"' || char === "'") {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          cells.push(currentCell.trim().replace(/^["']|["']$/g, ''));
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
      cells.push(currentCell.trim().replace(/^["']|["']$/g, ''));

      if (cells.length === headers.length) {
        const item = {};
        headers.forEach((header, index) => {
          item[header] = cells[index];
        });
        rows.push({
          name: item.name || "",
          formula: item.formula || "",
          price: item.price || "",
          stock: item.stock || "0",
          category: item.category || "",
          description: item.description || "",
        });
      }
    }

    if (rows.length === 0) {
      setErrorMsg("Failed to parse CSV records.");
    } else {
      setParsedProducts(rows);
    }
  };

  const handleConfirmImport = async () => {
    if (!fileToUpload) return;
    setImporting(true);
    try {
      const result = await bulkImportMutation.mutateAsync(fileToUpload);
      toast.success(`${result.count || parsedProducts.length} products imported successfully!`);
      setShowImportModal(false);
      setParsedProducts([]);
      setFileToUpload(null);
    } catch (err) {
      toast.error(err.message || "Failed to import products");
    } finally {
      setImporting(false);
    }
  };

  const handleUploadEditImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingEditImage(true);
    try {
      const res = await uploadImageMutation.mutateAsync(file);
      setEditImageUrl(res.url);
      toast.success("Product image uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload product image");
    } finally {
      setUploadingEditImage(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const formData = new FormData(e.target);
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        name: formData.get("name"),
        formula: formData.get("formula"),
        price: parseFloat(formData.get("price")),
        stock: parseInt(formData.get("stock")),
        category: formData.get("category"),
        description: formData.get("description"),
        image_url: editImageUrl || "",
      });
      toast.success("Product updated successfully!");
      setEditingProduct(null);
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProductMutation.mutateAsync(deletingProduct.id);
      toast.success("Product deleted successfully!");
      setDeletingProduct(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  if (isLoading) {
    return <div className="text-sm text-neutral-500">Loading your products...</div>;
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">My Products</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Manage your pharmacy inventory and listings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowImportModal(true)} 
            variant="secondary"
            className="h-[44px] border border-neutral-300 shadow-sm flex items-center gap-2"
          >
            <UploadSimple size={16} weight="bold" /> Bulk Import
          </Button>
          <Link href={partnerRoutes.vendor.productsNew}>
            <Button className="h-[44px] shadow-sm flex items-center gap-2">
              <Plus size={16} weight="bold" /> Add New Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="w-full sm:w-[320px]">
            <Input
              placeholder="Search your products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<MagnifyingGlass size={16} />}
              className="h-[40px] text-[13px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-neutral-500">
                    No products listed yet. Add your first product to start selling.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[8px] bg-neutral-100 flex items-center justify-center text-brand-primary border border-neutral-200 overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Pill size={20} weight="fill" />
                          )}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-ink-900">{product.name}</div>
                          <div className="text-[12px] text-neutral-500">{product.formula || "Medicine"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] font-medium text-neutral-600">{product.category || "General"}</td>
                    <td className="p-4 text-[14px] font-bold text-ink-900">PKR {Number(product.price).toLocaleString()}</td>
                    <td className="p-4 text-[13px] font-bold text-neutral-700">{product.stock} units</td>
                    <td className="p-4">
                      <Badge variant={product.stock <= 10 ? "warning" : "success"}>
                        {product.stock <= 10 ? "Low Stock" : "Active"}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-brand-primary transition-colors"
                          title="Edit Product"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-neutral-200 text-[13px] font-medium text-neutral-500 bg-neutral-50">
          Showing {filtered.length} of {products.length} products in your store
        </div>
      </div>

      {/* Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[16px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50">
              <div>
                <h2 className="text-[18px] font-extrabold text-ink-headline">Bulk Import Products</h2>
                <p className="text-[12px] text-neutral-500 mt-0.5">Upload a CSV or Excel spreadsheet to import products in bulk.</p>
              </div>
              <button 
                onClick={() => { setShowImportModal(false); setParsedProducts([]); setErrorMsg(""); setFileToUpload(null); }} 
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* File Dropzone */}
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
                      <div className="text-[14px] font-bold text-ink-900">File Ready for Import</div>
                      <div className="text-[12px] text-neutral-500">{parsedProducts.length} items found</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setFileToUpload(null); setParsedProducts([]); }}
                    className="text-[12px] font-bold text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Template Download Help */}
              {!fileToUpload && (
                <div className="flex items-start gap-3 p-4 rounded-[12px] border border-neutral-200 bg-neutral-50/30">
                  <div className="text-brand-primary mt-0.5">
                    <DownloadSimple size={20} weight="bold" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-ink-900">Need a template format?</h4>
                    <p className="text-[12px] text-neutral-500 mt-1">Download our sample spreadsheet structure to ensure your columns (name, formula, price, stock, category, description) map correctly.</p>
                    <button 
                      onClick={downloadTemplate} 
                      className="text-[12px] font-semibold text-brand-primary hover:underline mt-2 inline-flex items-center gap-1.5"
                    >
                      <DownloadSimple size={14} weight="bold" /> Download CSV Template
                    </button>
                  </div>
                </div>
              )}

              {/* Errors/Warnings */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-[8px] border border-red-200 bg-red-50 text-red-600 text-[13px] font-medium">
                  <Warning size={18} weight="bold" />
                  {errorMsg}
                </div>
              )}

              {/* Preview Table */}
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
                          <tr key={idx} className={(!row.name || isNaN(parseFloat(row.price))) ? "bg-red-50/50" : ""}>
                            <td className="p-3 font-semibold text-ink-900 truncate max-w-[120px]">
                              {row.name || <span className="text-red-500 italic">Missing</span>}
                            </td>
                            <td className="p-3 text-neutral-500 truncate max-w-[120px]">{row.formula || "-"}</td>
                            <td className="p-3 font-bold text-ink-900">
                              {row.price ? `PKR ${Number(row.price).toLocaleString()}` : <span className="text-red-500 italic">Missing</span>}
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

                  {parsedProducts.some(row => !row.name || isNaN(parseFloat(row.price))) && (
                    <div className="flex items-start gap-2 p-3 rounded-[8px] border border-amber-200 bg-amber-50 text-amber-700 text-[12px]">
                      <Warning size={16} weight="bold" className="mt-0.5" />
                      <div>
                        <strong>Warning:</strong> Some rows are highlighted in red because they are missing required fields (Name or Price). Invalid rows will be skipped during import.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3">
              <Button 
                variant="secondary"
                onClick={() => { setShowImportModal(false); setParsedProducts([]); setErrorMsg(""); setFileToUpload(null); }}
                className="h-[40px]"
                disabled={importing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmImport}
                className="h-[40px] shadow-sm"
                disabled={!fileToUpload || importing || bulkImportMutation.isPending || parsedProducts.filter(r => r.name && !isNaN(parseFloat(r.price))).length === 0}
              >
                {bulkImportMutation.isPending ? "Importing..." : `Import ${parsedProducts.filter(r => r.name && !isNaN(parseFloat(r.price))).length} Products`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <form onSubmit={handleEditSubmit} className="bg-white w-full max-w-lg rounded-[16px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50 shrink-0">
              <div>
                <h2 className="text-[18px] font-extrabold text-ink-headline">Edit Product</h2>
                <p className="text-[12px] text-neutral-500 mt-0.5">Modify the details of your pharmacy product.</p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingProduct(null)} 
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-white">
              <Input label="Product Name" name="name" defaultValue={editingProduct.name} required />
              <Input label="Generic Formula" name="formula" defaultValue={editingProduct.formula || ""} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price (PKR)" name="price" type="number" step="0.01" defaultValue={editingProduct.price} required />
                <Input label="Stock (Units)" name="stock" type="number" defaultValue={editingProduct.stock} required />
              </div>
              <Input label="Category" name="category" defaultValue={editingProduct.category || ""} required />
              
              {/* Product Image */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-neutral-700">Product Image</label>
                {editImageUrl ? (
                  <div className="flex items-center gap-4 p-4 border border-neutral-200 rounded-[12px] bg-neutral-50">
                    <img src={editImageUrl} alt="Product" className="w-16 h-16 rounded-[8px] object-cover border border-neutral-200" />
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-neutral-600 truncate max-w-[250px]">{editImageUrl.split('/').pop()}</div>
                      <button
                        type="button"
                        onClick={() => setEditImageUrl("")}
                        className="text-[12px] text-red-500 hover:text-red-700 font-bold mt-1"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative border border-dashed border-neutral-300 hover:border-neutral-400 transition-colors rounded-[12px] p-6 flex flex-col items-center justify-center bg-neutral-50/50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadEditImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingEditImage}
                    />
                    <div className="text-center space-y-1">
                      <p className="text-[13px] font-semibold text-neutral-600">
                        {uploadingEditImage ? "Uploading image..." : "Upload Product Image"}
                      </p>
                      <p className="text-[11px] text-neutral-400">JPG, PNG, WEBP up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-bold text-neutral-700">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingProduct.description || ""}
                  rows={3}
                  className="w-full px-3 py-2 text-[14px] border border-neutral-200 rounded-[8px] bg-white outline-none focus:border-brand-primary transition-colors resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50 shrink-0">
              <Button 
                type="button"
                variant="secondary"
                onClick={() => setEditingProduct(null)}
                className="h-[40px]"
                disabled={updateProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-[40px] shadow-sm"
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[16px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <Warning size={32} weight="fill" />
              <div>
                <h3 className="text-[18px] font-extrabold text-ink-headline">Delete Product</h3>
                <p className="text-[12px] text-neutral-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-[14px] text-neutral-600">
              Are you sure you want to delete <strong className="text-ink-900">{deletingProduct.name}</strong> from your inventory? It will be permanently removed from PharmaHub.
            </p>

            <div className="flex justify-end gap-3">
              <Button 
                variant="secondary"
                onClick={() => setDeletingProduct(null)}
                className="h-[40px]"
                disabled={deleteProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="h-[40px] bg-red-600 hover:bg-red-700 text-white shadow-sm"
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? "Deleting..." : "Delete Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
