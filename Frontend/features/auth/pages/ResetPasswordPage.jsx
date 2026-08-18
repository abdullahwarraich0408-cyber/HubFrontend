"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Lock } from "@phosphor-icons/react";
import { authApi } from "@/lib/api/index";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";
import { AuthPageHeader, AuthBackLink } from "@/features/auth/components/AuthChrome";

export function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!password) nextErrors.password = "Please enter a new password.";
    else if (password.length < 8) nextErrors.password = "Your password must be at least 8 characters.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setFieldErrors(nextErrors);
    setError("");
    if (Object.keys(nextErrors).length) return;
    if (!token) {
      setError("This reset link is missing or invalid. Request a new one.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(friendlyAuthError(err, "We couldn't update your password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout variant="recover" compact>
      {success ? (
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E7F6F1] text-[#15803D]">
            <CheckCircle size={34} weight="fill" />
          </div>
          <AuthPageHeader
            title="Password reset successfully"
            description="Your password has been updated. You can now sign in to your Medzoos account."
          />
          <AuthButton type="button" showArrow={false} onClick={() => router.push("/login")}>
            Continue to Sign In
          </AuthButton>
        </div>
      ) : (
        <>
          <AuthPageHeader
            title="Create a new password"
            description="Choose a strong password for your Medzoos account."
          />

          <AuthError
            message={error}
            onRetry={isNetworkAuthError({ message: error }) ? () => setError("") : undefined}
          />

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <PasswordInput
                label="New password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                leftIcon={<Lock size={18} />}
                error={fieldErrors.password}
              />
              <PasswordRequirements password={password} />
            </div>
            <PasswordInput
              label="Confirm new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              leftIcon={<Lock size={18} />}
              error={fieldErrors.confirmPassword}
            />
            <AuthButton loading={loading} loadingLabel="Updating password..." showArrow={false}>
              Reset Password
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
