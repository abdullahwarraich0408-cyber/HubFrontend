function readMessage(err) {
  if (!err) return "";
  if (typeof err === "string") return err;
  return err.message || err.error || "";
}

export function isNetworkAuthError(err) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  const message = readMessage(err);
  return /failed to fetch|networkerror|network request failed|econnrefused|enotfound|timeout|offline|couldn't connect|could not connect|internet connection/i.test(
    message
  );
}

export function friendlyAuthError(err, fallback = "Something went wrong. Please try again.") {
  if (isNetworkAuthError(err)) {
    return "We couldn't connect right now. Check your internet connection and try again.";
  }

  const message = readMessage(err);
  const lower = message.toLowerCase();
  const code = err?.code || "";

  if (code === "auth/unauthorized-domain" || /unauthorized-domain|domain is not authorized/i.test(lower)) {
    return "This website domain is not authorized for Google sign-in. Add it in the Firebase project the live site actually uses.";
  }

  if (code === "auth/operation-not-allowed") {
    return "Google sign-in is not enabled in Firebase yet. Enable the Google provider under Authentication → Sign-in method.";
  }

  if (code === "auth/popup-blocked") {
    return "Your browser blocked the Google window. Allow popups for Medzoos and try again.";
  }

  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Google sign-in was cancelled. Please try again.";
  }

  if (
    /invalid credentials|incorrect password|invalid email or password|\b401\b/.test(lower)
  ) {
    return "The email or password you entered is incorrect.";
  }

  if (/user already exists|email already|already registered/.test(lower)) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (/password.{0,20}8|at least 8/.test(lower)) {
    return "Your password must be at least 8 characters.";
  }

  if (/invalid otp|invalid code|wrong code|expired/.test(lower)) {
    return "That verification code is incorrect or has expired. Please try again.";
  }

  if (/prisma|stack|sql|internal server|econn|undefined is not/.test(lower)) {
    return fallback;
  }

  if (message && message.length <= 140 && !message.includes("\n")) {
    return message.replace(/^Firebase:\s*/i, "").trim();
  }

  return fallback;
}
