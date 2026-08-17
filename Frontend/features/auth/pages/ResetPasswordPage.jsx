"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Lock } from "@phosphor-icons/react";
import { authApi } from "@/lib/api/index";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";

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
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F5ED] text-[#15803D]">
            <CheckCircle size={34} weight="fill" />
          </div>
          <h1 className="font-[var(--font-heading)] text-[30px] leading-tight text-[#102A43] sm:text-[34px]">
            Password reset successfully
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#627D98]">
            Your password has been updated. You can now sign in to your Medzoos account.
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-8 inline-flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#17618E] text-[15px] font-semibold text-white hover:bg-[#124362]"
          >
            Continue to Sign In
          </button>
        </div>
      ) : (
        <>
          <h1 className="font-[var(--font-heading)] text-[30px] leading-tight text-[#102A43] sm:text-[36px]">
            Create a new password
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#627D98] sm:text-[16px]">
            Choose a strong password for your Medzoos account.
          </p>

          <AuthError
            message={error}
            onRetry={isNetworkAuthError({ message: error }) ? () => setError("") : undefined}
          />

          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
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
