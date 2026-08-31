"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldWarning,
  ClockCountdown,
  ArrowClockwise,
  SignOut,
  Sparkle,
} from "@phosphor-icons/react";
import {
  clearAdminSession,
  broadcastSessionEvent,
  subscribeToSessionEvents,
} from "@/lib/auth/adminSession";
import { authApi } from "@/lib/api/index";

// 30 minutes of total idle time before logout
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
// Show warning modal when 60 seconds remain
const WARNING_THRESHOLD_MS = 60 * 1000;
const CHECK_INTERVAL_MS = 1000;

export default function AdminSessionTimeoutModal() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const isWarningOpenRef = useRef(false);

  const resetActivity = useCallback((broadcast = true) => {
    lastActivityRef.current = Date.now();
    if (isWarningOpenRef.current) {
      isWarningOpenRef.current = false;
      setShowModal(false);
    }
    if (broadcast) {
      broadcastSessionEvent("ACTIVITY", { timestamp: Date.now() });
    }
  }, []);

  const handleLogout = useCallback((reason = "idle") => {
    clearAdminSession(true);
    window.location.replace(`/portal-access?expired=true&reason=${reason}`);
  }, []);

  const handleStayLoggedIn = async () => {
    setIsRefreshing(true);
    try {
      await authApi.refresh().catch(() => {});
    } catch {
      // Ignored
    } finally {
      setIsRefreshing(false);
      resetActivity(true);
    }
  };

  // Activity listeners
  useEffect(() => {
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    let throttleTimer = null;
    const handleUserActivity = () => {
      // If modal is showing, only deliberate click on "Stay Logged In" resets it
      if (isWarningOpenRef.current) return;

      lastActivityRef.current = Date.now();

      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          broadcastSessionEvent("ACTIVITY", { timestamp: Date.now() });
        }, 10000); // Broadcast to other tabs every 10s
      }
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });


    // Cross-tab sync
    const unsubscribe = subscribeToSessionEvents((event) => {
      if (event?.type === "LOGOUT") {
        handleLogout("logged_out");
      } else if (event?.type === "ACTIVITY") {
        if (!isWarningOpenRef.current) {
          lastActivityRef.current = event.payload?.timestamp || Date.now();
        }
      }
    });

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
      if (throttleTimer) clearTimeout(throttleTimer);
      unsubscribe();
    };
  }, [handleLogout]);

  // Periodic idle check
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const timeLeft = INACTIVITY_TIMEOUT_MS - elapsed;

      if (timeLeft <= 0) {
        // Time expired! Log out immediately
        clearInterval(timer);
        handleLogout("idle");
      } else if (timeLeft <= WARNING_THRESHOLD_MS) {
        // Warning threshold reached
        isWarningOpenRef.current = true;
        setShowModal(true);
        setSecondsRemaining(Math.max(1, Math.ceil(timeLeft / 1000)));
      } else {
        if (isWarningOpenRef.current) {
          isWarningOpenRef.current = false;
          setShowModal(false);
        }
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [handleLogout]);

  if (!showModal) return null;

  const progressPercent = Math.min(100, Math.max(0, (secondsRemaining / 60) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082B3F]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-timeout-title"
      >
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              secondsRemaining <= 15
                ? "bg-rose-500"
                : secondsRemaining <= 30
                ? "bg-amber-500"
                : "bg-[#17618E]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="p-6 md:p-8 text-center space-y-5">
          {/* Icon Badge */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
            <ClockCountdown size={36} weight="duotone" className="animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3
              id="session-timeout-title"
              className="text-xl font-heading font-extrabold text-[#082B3F]"
            >
              Session Expiring Soon
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              You have been inactive for a while. For security reasons, your admin session will end in:
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-sm">
            <span
              className={`text-2xl font-black tabular-nums tracking-tight ${
                secondsRemaining <= 15 ? "text-rose-600 animate-pulse" : "text-[#17618E]"
              }`}
            >
              {secondsRemaining}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              seconds remaining
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => handleLogout("manual")}
              className="flex-1 order-2 sm:order-1 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <SignOut size={16} />
              <span>Log Out Now</span>
            </button>

            <button
              type="button"
              onClick={handleStayLoggedIn}
              disabled={isRefreshing}
              className="flex-1 order-1 sm:order-2 px-4 py-3 rounded-xl bg-[#17618E] hover:bg-[#082B3F] text-white font-bold text-xs shadow-md shadow-[#17618E]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <ArrowClockwise
                size={16}
                weight="bold"
                className={isRefreshing ? "animate-spin" : ""}
              />
              <span>{isRefreshing ? "Renewing..." : "Stay Logged In"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
