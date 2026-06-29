import { normalizePhoneNumber } from "./phoneUtils";

export function isTestAuthEnabled() {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH === "true"
  );
}

export function formatFirebaseAuthError(error) {
  const code = error?.code || "";
  const message = error?.message || String(error || "Authentication failed");

  if (code === "auth/operation-not-allowed" || message.includes("region enabled")) {
    if (isTestAuthEnabled()) {
      return [
        "Firebase SMS is blocked for Pakistan on the free Spark plan.",
        "",
        "Use test login instead (no SMS):",
        "1. Click \"Fill test number\"",
        "2. Send OTP → enter 123456",
        "",
        `Test phone: ${DEV_TEST_PHONE}`,
      ].join("\n");
    }
    return [
      "Phone OTP is not available yet for Pakistan.",
      "",
      "Options:",
      "• Sign in with Google",
      "• Ask admin to enable Blaze + Pakistan SMS region in Firebase",
    ].join("\n");
  }

  if (code === "auth/invalid-phone-number") {
    return "Invalid phone format. Use 03361400372 or +923361400372.";
  }

  if (code === "auth/too-many-requests") {
    return "Too many attempts. Wait a few minutes and try again.";
  }

  if (message.includes("Invalid dev test") || message.includes("Test login")) {
    return message;
  }

  return message.replace(/^Firebase:\s*/i, "");
}

/** Test accounts — must match Backend dev-auth.service.js */
export const DEV_TEST_PHONES = ["+923361400372", "+923361400373"];
export const DEV_TEST_PHONE = DEV_TEST_PHONES[0];
export const DEV_TEST_OTP = "123456";

export function isDevTestPhone(phone) {
  const normalized = normalizePhoneNumber(phone) || String(phone || "").replace(/[\s-]/g, "");
  return DEV_TEST_PHONES.some((p) => p.replace(/[\s-]/g, "") === normalized);
}

export function isDevTestOtp(code) {
  return String(code || "").trim() === DEV_TEST_OTP;
}

/** @deprecated use isTestAuthEnabled */
export function isDevAuthEnabled() {
  return isTestAuthEnabled();
}
