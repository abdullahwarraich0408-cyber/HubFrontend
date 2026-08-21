"use client";

import { useEffect, useState } from "react";
import { Bell } from "@phosphor-icons/react";
import {
  ensureBrowserNotificationPermission,
  getBrowserNotificationPermission,
  wasNotificationPermissionPrompted,
} from "@/lib/notifications/browserNotify";
import { registerWebFcmPush } from "@/lib/notifications/fcmWeb";
import { notificationsApi } from "@/lib/api/index";

async function syncFcmToken() {
  try {
    await registerWebFcmPush((payload) => notificationsApi.registerDeviceToken(payload));
  } catch {
    // Permission or Firebase config issues — browser banner still works
  }
}

/**
 * Asks once for OS notification permission and registers FCM for closed-tab push.
 */
export function EnableNotificationsPrompt({ enabled }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }
    const permission = getBrowserNotificationPermission();
    if (permission === "granted") {
      void syncFcmToken();
      setVisible(false);
      return;
    }
    if (permission === "unsupported" || permission === "denied") {
      setVisible(false);
      return;
    }
    if (wasNotificationPermissionPrompted()) {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, [enabled]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] w-[min(440px,calc(100vw-24px))]">
      <div className="rounded-2xl border border-[#D9DEE5] bg-white shadow-xl px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#DEEEF9] text-[#17618E] flex items-center justify-center shrink-0">
          <Bell size={18} weight="fill" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-[#082B3F]">Turn on notifications</p>
          <p className="text-[11px] text-[#64748B]">
            Get alerts even when Medzoos is closed in this browser.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 px-3 py-2 rounded-lg bg-[#17618E] text-white text-[12px] font-semibold hover:bg-[#124362]"
          onClick={async () => {
            await ensureBrowserNotificationPermission();
            await syncFcmToken();
            setVisible(false);
          }}
        >
          Allow
        </button>
        <button
          type="button"
          className="shrink-0 px-2 py-2 text-[12px] font-semibold text-[#64748B]"
          onClick={() => {
            try {
              localStorage.setItem("medzoos_notify_prompted", "1");
            } catch {
              // ignore
            }
            setVisible(false);
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
