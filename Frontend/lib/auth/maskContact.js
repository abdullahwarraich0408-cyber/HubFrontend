export function maskPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 4) return "your registered number";
  const last4 = digits.slice(-4);
  if (digits.startsWith("92") && digits.length >= 12) {
    return `+92 3XX XXX ${last4}`;
  }
  return `*** *** ${last4}`;
}

export function maskEmail(email) {
  const value = String(email || "").trim();
  const at = value.indexOf("@");
  if (at < 1) return value;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}
