"use client";

import { useMemo, useState } from "react";
import { AppleLogo, GoogleLogo } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { friendlyAuthError } from "@/lib/auth/friendlyAuthError";
import { formatFirebaseAuthError } from "@/lib/auth/firebaseErrors";
import { isFirebaseConfigured } from "@/lib/firebase";
import { AuthError } from "./AuthError";

function isApplePlatform() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function SocialLogin({ onSuccess }) {
  const { loginWithGoogle, loginWithApple } = useAuth();
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const showApple = useMemo(() => isApplePlatform() && typeof loginWithApple === "function", [loginWithApple]);

  if (!isFirebaseConfigured()) return null;

  const run = async (provider, action) => {
    setError("");
    setLoading(provider);
    try {
      const user = await action();
      if (user) onSuccess?.(user);
    } catch (err) {
      const firebaseMessage = err?.code ? formatFirebaseAuthError(err) : "";
      setError(
        firebaseMessage ||
          friendlyAuthError(err, `${provider === "apple" ? "Apple" : "Google"} sign-in could not be completed. Please try again.`)
      );
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="space-y-3">
      <AuthError message={error} />
      <button
        type="button"
        onClick={() => run("google", loginWithGoogle)}
        disabled={Boolean(loading)}
        className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[#D5E0DE] bg-white text-[15px] font-semibold text-[#1A2B2A] transition-all hover:bg-[#F7FBFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] disabled:opacity-60"
      >
        <GoogleLogo size={18} weight="bold" />
        {loading === "google" ? "Connecting..." : "Sign in with Google"}
      </button>
      {showApple ? (
        <button
          type="button"
          onClick={() => run("apple", loginWithApple)}
          disabled={Boolean(loading)}
          className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[#D5E0DE] bg-[#1A2B2A] text-[15px] font-semibold text-white transition-all hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] disabled:opacity-60"
        >
          <AppleLogo size={18} weight="fill" />
          {loading === "apple" ? "Connecting..." : "Continue with Apple"}
        </button>
      ) : null}
    </div>
  );
}
