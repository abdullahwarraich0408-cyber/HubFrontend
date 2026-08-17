"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Envelope } from "@phosphor-icons/react";
import { authApi } from "@/lib/api/index";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setFieldError("Please enter your email address.");
      return;
    }
    setFieldError("");
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      if (isNetworkAuthError(err)) {
        setError(friendlyAuthError(err));
      } else {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout variant="recover" compact>
      {submitted ? (
        <>
          <h1 className="font-[var(--font-heading)] text-[30px] leading-tight text-[#102A43] sm:text-[36px]">
            Check your inbox
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#627D98] sm:text-[16px]">
            If an account matches the information you entered, we&apos;ll send password reset instructions.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#17618E] text-[15px] font-semibold text-white hover:bg-[#124362]"
          >
            Back to Sign In
          </Link>
        </>
      ) : (
        <>
          <h1 className="font-[var(--font-heading)] text-[30px] leading-tight text-[#102A43] sm:text-[36px]">
            Forgot your password?
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#627D98] sm:text-[16px]">
            Enter the email address linked to your Medzoos account and we&apos;ll help you reset your password.
          </p>

          <AuthError
            message={error}
            onRetry={isNetworkAuthError({ message: error }) ? () => setError("") : undefined}
          />

          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
            <AuthInput
              label="Email address"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              leftIcon={<Envelope size={18} />}
              error={fieldError}
            />
            <AuthButton loading={loading} loadingLabel="Sending code..." showArrow={false}>
              Send Verification Code
            </AuthButton>
          </form>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[#627D98] hover:text-[#17618E]"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </>
      )}
    </AuthLayout>
  );
}
