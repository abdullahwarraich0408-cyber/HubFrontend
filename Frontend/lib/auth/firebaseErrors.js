export function formatFirebaseAuthError(error) {
  const code = error?.code || "";
  const message = error?.message || String(error || "Authentication failed");

  if (code === "auth/operation-not-allowed" || message.includes("region enabled")) {
    return [
      "Firebase SMS blocked for Pakistan on Spark plan.",
      "",
      "Use dev test login instead (no Firebase SMS):",
      "Phone: +923361400372  |  OTP: 123456",
      "Click \"Fill test number\" then Send OTP → enter 123456.",
    ].join("\n");
  }

  if (code === "auth/invalid-phone-number") {
    return "Invalid phone format. Use 03361400372 or +923361400372.";
  }

  if (code === "auth/too-many-requests") {
    return "Too many attempts. Wait a few minutes or use the dev test number.";
  }

  return message.replace(/^Firebase:\s*/i, "");
}

/** Dev test accounts — must match Backend dev-auth.service.js */
export const DEV_TEST_PHONES = ["+923361400372", "+923361400373"];
export const DEV_TEST_PHONE = DEV_TEST_PHONES[0];
export const DEV_TEST_OTP = "123456";

export function isDevTestPhone(phone) {
  const normalized = String(phone || "").replace(/[\s-]/g, "");
  return DEV_TEST_PHONES.some((p) => p.replace(/[\s-]/g, "") === normalized);
}

export function isDevTestOtp(code) {
  return String(code || "").trim() === DEV_TEST_OTP;
}

export function isDevAuthEnabled() {
  return process.env.NODE_ENV === "development";
}
