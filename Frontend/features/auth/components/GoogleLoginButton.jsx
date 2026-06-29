"use client";

import { useState } from "react";
import { GoogleLogo } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";

export function GoogleLoginButton({ onSuccess, className = "" }) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {error ? <p className="text-xs text-red-600 mb-2">{error}</p> : null}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full h-11 flex items-center justify-center gap-2 border rounded-xl font-semibold text-sm hover:bg-neutral-50 disabled:opacity-60"
      >
        <GoogleLogo size={18} weight="bold" />
        {loading ? "Signing in…" : "Continue with Google"}
      </button>
    </div>
  );
}
