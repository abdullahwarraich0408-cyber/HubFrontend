"use client";

import { useState } from "react";
import { GoogleLogo } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { friendlyAuthError } from "@/lib/auth/friendlyAuthError";
import { formatFirebaseAuthError } from "@/lib/auth/firebaseErrors";

export function GoogleLoginButton({ onSuccess, className = "" }) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setError("");
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) onSuccess?.();
    } catch (err) {
      const firebaseMessage = err?.code ? formatFirebaseAuthError(err) : "";
      setError(
        firebaseMessage ||
          friendlyAuthError(err, "Google sign-in could not be completed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative z-20 ${className}`}>
      {error ? <p className="mb-2 text-[13px] leading-5 text-[#D92D20]">{error}</p> : null}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="relative z-20 inline-flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#D9E5EC] bg-white text-[15px] font-semibold text-[#102A43] transition-colors hover:bg-[#F8FBFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A9E0] disabled:cursor-wait disabled:opacity-60"
      >
        <GoogleLogo size={18} weight="bold" />
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
    </div>
  );
}
