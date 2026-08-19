import { normalizePhoneNumber } from "./phoneUtils";

export function isTestAuthEnabled() {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH === "true"
  );
}

export function formatAuthError(error) {
  const message = error?.message || String(error || "Authentication failed");

  if (message.includes("Invalid dev test") || message.includes("Test login")) {
    return message;
  }

  if (/invalid otp|invalid code|wrong code|incorrect code/i.test(message)) {
    return "The OTP is incorrect. Please try again.";
  }

  if (/network|failed to fetch|timeout|offline/i.test(message)) {
    return "We couldn't connect right now. Please try again in a moment.";
  }

  if (
    /Invalid `prisma|does not exist on the database server|PrismaClient|internal server/i.test(message)
  ) {
    return "Sign-in is temporarily unavailable. Please try again in a moment.";
  }

  const cleaned = message.trim();
  if (cleaned.length > 180 || cleaned.includes("\n")) {
    return "Authentication failed. Please try again.";
  }

  return cleaned;
}

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
