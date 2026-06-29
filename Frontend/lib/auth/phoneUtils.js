/**
 * Normalize phone numbers for Firebase (E.164).
 * Pakistan: 0336... → +92336...
 */
export function normalizePhoneNumber(input) {
  const raw = String(input || "").trim().replace(/[\s-]/g, "");
  if (!raw) return "";

  if (raw.startsWith("+")) {
    return raw;
  }

  // Pakistan local format: 03XXXXXXXXX → +923XXXXXXXXX
  if (/^0[3]\d{9}$/.test(raw)) {
    return `+92${raw.slice(1)}`;
  }

  // Already has country code without +: 923XXXXXXXXX
  if (/^92[3]\d{9}$/.test(raw)) {
    return `+${raw}`;
  }

  // Fallback: prepend +
  return `+${raw.replace(/^0+/, "")}`;
}
