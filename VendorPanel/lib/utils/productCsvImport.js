const CSV_HEADERS = [
  "product_name",
  "generic_name",
  "brand",
  "manufacturer",
  "category",
  "subcategory",
  "dosage_form",
  "strength",
  "pack_size",
  "retail_price",
  "sale_price",
  "stock",
  "low_stock_threshold",
  "sku",
  "barcode",
  "prescription_required",
  "description",
];

function normalizeRow(item) {
  return {
    name: item.product_name || item.name || "",
    formula: item.generic_name || item.formula || "",
    generic_name: item.generic_name || item.formula || "",
    brand: item.brand || item.brand_name || "",
    manufacturer: item.manufacturer || "",
    category: item.category || "",
    subcategory: item.subcategory || "",
    dosage_form: item.dosage_form || "",
    strength: item.strength || "",
    pack_size: item.pack_size || "",
    price: item.retail_price || item.price || "",
    sale_price: item.sale_price || "",
    stock: item.stock || "0",
    low_stock_threshold: item.low_stock_threshold || "10",
    sku: item.sku || "",
    barcode: item.barcode || "",
    prescription_required: item.prescription_required || "",
    description: item.description || "",
  };
}

export function downloadProductCsvTemplate() {
  const sampleRow = [
    "Panadol Extra",
    "Paracetamol + Caffeine",
    "Panadol",
    "GSK",
    "Pain Relief",
    "Headache",
    "Tablet",
    "500mg",
    "20 tablets",
    "150",
    "135",
    "200",
    "10",
    "SKU-PND-500",
    "628100000001",
    "false",
    "Used for fast pain relief",
  ];
  const csvContent = "data:text/csv;charset=utf-8," + [CSV_HEADERS.join(","), sampleRow.join(",")].join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "medzoos_products_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function loadXLSX() {
  if (typeof window !== "undefined" && window.XLSX) return window.XLSX;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    script.onload = () => resolve(window.XLSX);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function parseCSVPreview(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) {
    return { rows: [], error: "CSV file is empty or missing headers." };
  }

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ""));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const cells = [];
    let insideQuote = false;
    let currentCell = "";

    for (let charIndex = 0; charIndex < currentLine.length; charIndex++) {
      const char = currentLine.charAt(charIndex);
      if (char === '"' || char === "'") {
        insideQuote = !insideQuote;
      } else if (char === "," && !insideQuote) {
        cells.push(currentCell.trim().replace(/^["']|["']$/g, ""));
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim().replace(/^["']|["']$/g, ""));

    if (cells.length === headers.length) {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = cells[index];
      });
      rows.push(normalizeRow(item));
    }
  }

  if (rows.length === 0) {
    return { rows: [], error: "No valid product rows were found in this file." };
  }

  return { rows, error: "" };
}

export function mapExcelRows(json) {
  return json.map((row) =>
    normalizeRow(
      Object.fromEntries(Object.entries(row).map(([key, value]) => [String(key).trim().toLowerCase(), value ?? ""]))
    )
  );
}

export function productsToCsvFile(rows) {
  const lines = [
    CSV_HEADERS.join(","),
    ...rows.map((row) =>
      [
        row.name,
        row.generic_name || row.formula,
        row.brand,
        row.manufacturer,
        row.category,
        row.subcategory,
        row.dosage_form,
        row.strength,
        row.pack_size,
        row.price,
        row.sale_price,
        row.stock,
        row.low_stock_threshold,
        row.sku,
        row.barcode,
        row.prescription_required,
        row.description,
      ]
        .map((value) => `"${String(value || "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  return new File([lines.join("\n")], "import.csv", { type: "text/csv" });
}

export function countValidProducts(rows) {
  return rows.filter((row) => row.name && !Number.isNaN(parseFloat(row.price)) && parseFloat(row.price) >= 0).length;
}

export function hasInvalidRows(rows) {
  return rows.some((row) => !row.name || Number.isNaN(parseFloat(row.price)) || parseFloat(row.price) < 0);
}
