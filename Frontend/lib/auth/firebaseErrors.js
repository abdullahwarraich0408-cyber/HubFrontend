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

  if (code === "auth/unauthorized-domain" || /unauthorized-domain|domain is not authorized/i.test(message)) {
    return "This website domain is not authorized for Google sign-in in the Firebase project the live site uses. Add medzoos.com and www.medzoos.com under Authentication → Settings → Authorized domains for project medcare-a5507.";
  }

  if (code === "auth/operation-not-allowed" && /google/i.test(message)) {
    return "Google sign-in is not enabled yet. In Firebase, open Authentication → Sign-in method and enable Google.";
  }

  if (code === "auth/popup-blocked") {
    return "Your browser blocked the Google window. Allow popups for this site and try again.";
  }

  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Google sign-in was cancelled. Please try again.";
  }

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

  if (
    /Invalid `prisma|does not exist on the database server|PrismaClient/i.test(message)
  ) {
    return "Sign-in is temporarily unavailable. Please try again in a moment.";
  }

  // Keep OTP UI readable — never dump backend stack traces into the modal
  const cleaned = message.replace(/^Firebase:\s*/i, "").trim();
  if (cleaned.length > 180 || cleaned.includes("\n")) {
    return "Could not verify that code. Please try again.";
  }

  return cleaned;
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
