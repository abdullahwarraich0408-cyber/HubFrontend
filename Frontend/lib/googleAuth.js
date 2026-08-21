"use client";

/**
 * Google Identity Services (GIS) — no Firebase.
 * Opens Google's popup and returns an OAuth authorization code for the backend.
 */

const GIS_SCRIPT = "https://accounts.google.com/gsi/client";

function getGoogleClientId() {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    ""
  ).trim();
}

function loadGisScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Browser environment required"));
  }
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google sign-in"))
      );
      // Script may already be loaded
      if (window.google?.accounts?.oauth2) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google sign-in"));
    document.head.appendChild(script);
  });
}

/**
 * Sign in with Google and return an authorization code (popup UX).
 * Backend exchanges the code for tokens using the client secret.
 */
export async function signInWithGoogleCode() {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error(
      "Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID."
    );
  }

  await loadGisScript();

  return new Promise((resolve, reject) => {
    try {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: "openid email profile",
        ux_mode: "popup",
        callback: (response) => {
          if (response?.error) {
            reject(
              new Error(
                response.error === "access_denied" || response.error === "popup_closed"
                  ? "Google sign-in was cancelled."
                  : `Google sign-in failed: ${response.error}`
              )
            );
            return;
          }
          if (!response?.code) {
            reject(new Error("Google sign-in failed: No authorization code returned."));
            return;
          }
          resolve(response.code);
        },
        error_callback: (err) => {
          const type = err?.type || "";
          if (type === "popup_closed" || type === "popup_failed_to_open") {
            reject(
              new Error(
                type === "popup_closed"
                  ? "Google sign-in was cancelled."
                  : "Your browser blocked the Google window. Allow popups for this site and try again."
              )
            );
            return;
          }
          reject(new Error(err?.message || "Google sign-in failed."));
        },
      });

      client.requestCode();
    } catch (err) {
      reject(err instanceof Error ? err : new Error("Google sign-in failed."));
    }
  });
}

/**
 * Alternative: One Tap / credential JWT (id_token) when the code popup is unavailable.
 */
export async function signInWithGoogleIdToken() {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error(
      "Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID."
    );
  }

  await loadGisScript();

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (credential, error) => {
      if (settled) return;
      settled = true;
      if (error) reject(error);
      else if (credential) resolve(credential);
      else reject(new Error("Google sign-in failed: No credential returned."));
    };

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => finish(response?.credential),
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: true,
    });

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        finish(
          null,
          new Error(
            "Google sign-in could not open. Check that this origin is listed under Authorized JavaScript origins in Google Cloud Console."
          )
        );
      }
    });

    setTimeout(() => {
      finish(null, new Error("Google sign-in timed out. Please try again."));
    }, 90_000);
  });
}
