"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const vapidKey = (process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "").trim();

function getFirebaseApp() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

function getWebDeviceId() {
  if (typeof window === "undefined") return "web-unknown";
  const key = "medzoos_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

/**
 * Register FCM web push (works with closed tabs via service worker).
 * @param {(payload: { fcmToken: string, deviceId: string, platform: string }) => Promise<unknown>} registerFn
 */
export async function registerWebFcmPush(registerFn) {
  if (typeof window === "undefined") {
    return { ok: false, reason: "ssr" };
  }
  if (!vapidKey) {
    return { ok: false, reason: "missing_vapid" };
  }
  if (!firebaseConfig.apiKey) {
    return { ok: false, reason: "missing_firebase_config" };
  }
  if (!("serviceWorker" in navigator) || !("Notification" in window)) {
    return { ok: false, reason: "unsupported" };
  }
  if (Notification.permission !== "granted") {
    return { ok: false, reason: "permission_denied" };
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    return { ok: false, reason: "messaging_unsupported" };
  }

  const app = getFirebaseApp();
  if (!app) return { ok: false, reason: "firebase_init_failed" };

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
    scope: "/",
  });
  await navigator.serviceWorker.ready;

  const messaging = getMessaging(app);
  const fcmToken = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });

  if (!fcmToken) {
    return { ok: false, reason: "no_token" };
  }

  const deviceId = getWebDeviceId();
  if (typeof registerFn === "function") {
    await registerFn({
      fcmToken,
      deviceId,
      platform: "web",
    });
  }

  try {
    localStorage.setItem("medzoos_fcm_web_token", fcmToken);
  } catch {
    // ignore
  }

  return { ok: true, fcmToken, deviceId };
}
