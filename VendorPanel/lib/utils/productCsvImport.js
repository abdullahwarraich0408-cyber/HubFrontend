const CSV_HEADERS = ["name", "formula", "price", "stock", "category", "description"];

export function downloadProductCsvTemplate() {
  const sampleRow = [
    "Panadol Extra",
    "Paracetamol + Caffeine",
    "150",
    "200",
    "Pain Relief",
    "Used for fast pain relief",
  ];
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [CSV_HEADERS.join(","), sampleRow.join(",")].join("\n");
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
    return { rows: [], error: "Failed to parse CSV records." };
  }

  return { rows, error: "" };
}

function findExcelKey(row, keys) {
  const found = Object.keys(row).find((k) => keys.includes(k.toLowerCase().trim()));
  return found ? String(row[found]).trim() : "";
}

export function mapExcelRows(json) {
  return json.map((row) => ({
    name: findExcelKey(row, ["name", "title"]),
    formula: findExcelKey(row, ["formula", "generic", "generic formula"]),
    price: findExcelKey(row, ["price", "rate", "cost"]),
    stock: findExcelKey(row, ["stock", "qty", "quantity", "stock quantity"]),
    category: findExcelKey(row, ["category", "type"]),
    description: findExcelKey(row, ["description", "desc"]),
  }));
}

export function productsToCsvFile(mapped) {
  const csvRows = [CSV_HEADERS.join(",")];
  mapped.forEach((item) => {
    const row = [
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${(item.formula || "").replace(/"/g, '""')}"`,
      item.price || "0",
      item.stock || "0",
      `"${(item.category || "").replace(/"/g, '""')}"`,
      `"${(item.description || "").replace(/"/g, '""')}"`,
    ];
    csvRows.push(row.join(","));
  });
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  return new File([blob], "converted.csv", { type: "text/csv" });
}

export function countValidProducts(rows) {
  return rows.filter((row) => row.name && !isNaN(parseFloat(row.price))).length;
}

export function hasInvalidRows(rows) {
  return rows.some((row) => !row.name || isNaN(parseFloat(row.price)));
}
