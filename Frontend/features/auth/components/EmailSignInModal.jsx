"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope, Lock, X } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { isFirebaseConfigured } from "@/lib/firebase";
import { mergeGuestCart } from "@/features/auth/lib/completeWebLogin";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";
import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton";

export function EmailSignInModal({ open, onClose, onSuccess }) {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const finish = async () => {
    await mergeGuestCart();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-updated"));
    }
    onSuccess?.();
    onClose?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Please enter your email address.";
    if (!password) nextErrors.password = "Please enter your password.";
    setFieldErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      await finish();
    } catch (err) {
      setFormError(
        friendlyAuthError(err, "We couldn't sign you in. Check your details and try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[420px] rounded-[20px] bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-[#627D98] hover:bg-[#F1F7FA]"
          aria-label="Close sign in"
        >
          <X size={18} weight="bold" />
        </button>

        <h2 className="pr-10 font-[var(--font-heading)] text-[28px] text-[#102A43]">Welcome back</h2>
        <p className="mt-1 text-[14px] leading-relaxed text-[#627D98]">
          Sign in with your Medzoos email and password.
        </p>

        <AuthError
          message={formError}
          onRetry={isNetworkAuthError({ message: formError }) ? () => setFormError("") : undefined}
        />

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <AuthInput
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            leftIcon={<Envelope size={18} />}
            error={fieldErrors.email}
          />
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            leftIcon={<Lock size={18} />}
            error={fieldErrors.password}
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" onClick={onClose} className="text-[13px] font-semibold text-[#17618E]">
              Forgot password?
            </Link>
          </div>
          <AuthButton loading={loading} loadingLabel="Signing in...">
            Sign In
          </AuthButton>
        </form>

        {isFirebaseConfigured() ? (
          <div className="mt-4">
            <GoogleLoginButton onSuccess={finish} />
          </div>
        ) : null}

        <p className="mt-5 text-[14px] text-[#627D98]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" onClick={onClose} className="font-semibold text-[#17618E]">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
