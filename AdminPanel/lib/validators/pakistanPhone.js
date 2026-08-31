/**
 * Utility functions for Pakistani Phone Numbers
 * Valid formats:
 * - +92 300 1234567 (Mobile)
 * - 0300 1234567 (Mobile)
 * - +92 42 35789012 (Landline)
 * - 042 35789012 (Landline)
 */

export function isValidPakistaniPhone(phone) {
  if (!phone || !phone.trim()) return true; // Optional field
  const cleaned = phone.trim().replace(/[\s\-\(\)]/g, '');
  
  // Mobile: +923XXXXXXXXX, 923XXXXXXXXX, 03XXXXXXXXX, 3XXXXXXXXX
  const mobileRegex = /^(?:\+92|92|0)?3[0-9]{9}$/;
  
  // General/Landline: (+92|92|0) + 2-9 followed by 7-9 digits (total 10-12 digits)
  const landlineRegex = /^(?:\+92|92|0)?[2-9][0-9]{7,9}$/;

  return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
}

export function formatPakistaniPhoneInput(val) {
  if (!val) return "";
  // Keep only digits and initial +
  let cleaned = val.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+92')) {
    const rest = cleaned.slice(3).replace(/\+/g, '').slice(0, 10);
    cleaned = '+92 ' + rest;
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(0, 11);
  } else if (cleaned.startsWith('92')) {
    const rest = cleaned.slice(2).replace(/\+/g, '').slice(0, 10);
    cleaned = '+92 ' + rest;
  } else {
    cleaned = cleaned.slice(0, 11);
  }
  return cleaned;
}
