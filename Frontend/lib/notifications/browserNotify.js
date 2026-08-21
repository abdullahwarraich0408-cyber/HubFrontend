"use client";

const PERMISSION_PROMPTED_KEY = "medzoos_notify_prompted";

export function getBrowserNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function ensureBrowserNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";

  try {
    const result = await Notification.requestPermission();
    try {
      localStorage.setItem(PERMISSION_PROMPTED_KEY, "1");
    } catch {
      // ignore
    }
    return result;
  } catch {
    return Notification.permission;
  }
}

export function wasNotificationPermissionPrompted() {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(PERMISSION_PROMPTED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * OS / browser system notification banner (works even when the tab is in the background).
 */
export function showSystemNotificationBanner({
  id,
  title,
  message,
  link,
  tag,
} = {}) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  if (Notification.permission !== "granted") {
    return false;
  }

  try {
    const notification = new Notification(title || "Medzoos", {
      body: message || "",
      icon: "/images/medzoos-mark.png",
      badge: "/images/medzoos-mark.png",
      tag: tag || (id ? `medzoos-${id}` : `medzoos-${Date.now()}`),
      renotify: true,
      requireInteraction: false,
    });

    notification.onclick = () => {
      try {
        window.focus();
        if (link) {
          window.location.href = link;
        }
      } catch {
        // ignore
      }
      notification.close();
    };

    return true;
  } catch {
    return false;
  }
}
