"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Envelope } from "@phosphor-icons/react";
import { authApi } from "@/lib/api/index";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";
import { AuthPageHeader, AuthBackLink } from "@/features/auth/components/AuthChrome";

export function ForgotPasswordPage() {
  const router = useRouter();
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
          <AuthPageHeader
            title="Check your inbox"
            description="If an account matches the information you entered, we'll send password reset instructions."
          />
          <AuthButton type="button" showArrow={false} onClick={() => router.push("/login")}>
            Back to Sign In
          </AuthButton>
        </>
      ) : (
        <>
          <AuthPageHeader
            title="Forgot your password?"
            description="Enter the email address linked to your Medzoos account and we'll help you reset your password."
          />

          <AuthError
            message={error}
            onRetry={isNetworkAuthError({ message: error }) ? () => setError("") : undefined}
          />

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
            <AuthButton loading={loading} loadingLabel="Sending link..." showArrow={false}>
              Send reset link
            </AuthButton>
          </form>

          <AuthBackLink>
            <ArrowLeft size={16} />
            Back to Sign In
          </AuthBackLink>
        </>
      )}
    </AuthLayout>
  );
}
