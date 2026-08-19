"use client";

import { useState } from "react";
import { GoogleLogo } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { friendlyAuthError } from "@/lib/auth/friendlyAuthError";

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
      setError(
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
        className="relative z-20 inline-flex h-[54px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#D7E4EA] bg-white text-[15px] font-semibold text-[#102A43] shadow-[0_1px_2px_rgba(16,42,67,0.04)] transition-all hover:border-[#087F8C]/30 hover:bg-[#F7FBFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C] disabled:cursor-wait disabled:opacity-60"
      >
        <GoogleLogo size={18} weight="bold" />
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
    </div>
  );
}
