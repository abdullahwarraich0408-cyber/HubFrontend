"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Envelope, Lock, ShieldCheck } from "@phosphor-icons/react";
import { authApi } from "@/lib/api/index";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";
import { AuthPageHeader, AuthBackLink } from "@/features/auth/components/AuthChrome";
import { OtpInput } from "@/features/auth/components/OtpInput";

export function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("email"); // "email" | "reset" | "success"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    let timer;
    if (step === "reset" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  const handleRequestReset = async (event) => {
    event.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldErrors({ email: "Please enter a valid email address." });
      return;
    }
    setFieldErrors({});
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setStep("reset");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setResendCooldown(60);
    } catch (err) {
      if (isNetworkAuthError(err)) {
        setError(friendlyAuthError(err));
      } else {
        setStep("reset");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithOtp = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!otp || otp.trim().length < 6) {
      nextErrors.otp = "Please enter the 6-digit security code sent to your email.";
    }
    if (!newPassword) {
      nextErrors.password = "Please enter a new password.";
    } else if (newPassword.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(nextErrors);
    setError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await authApi.resetPasswordOtp({
        email: email.trim(),
        otp: otp.trim(),
        password: newPassword,
      });
      setStep("success");
    } catch (err) {
      setError(friendlyAuthError(err, "Invalid or expired security code. Please check your email or request a new code."));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await authApi.forgotPassword(email.trim());
      setResendCooldown(60);
    } catch (err) {
      setError(friendlyAuthError(err, "Could not resend code. Please try again."));
    } finally {
      setResending(false);
    }
  };

  if (step === "success") {
    return (
      <AuthLayout variant="recover" compact>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E7F6F1] text-[#15803D]">
            <CheckCircle size={36} weight="fill" />
          </div>
          <AuthPageHeader
            title="Password reset successfully"
            description="Your Medzoos account password has been updated. You can now sign in with your new password."
          />
          <AuthButton type="button" showArrow={false} onClick={() => router.push("/login")}>
            Continue to Sign In
          </AuthButton>
        </div>
      </AuthLayout>
    );
  }

  if (step === "reset") {
    return (
      <AuthLayout variant="recover" compact>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF3C7] text-[#D97706]">
          <ShieldCheck size={28} weight="fill" />
        </div>

        <AuthPageHeader
          title="Reset your password"
          description={`Enter the 6-digit code sent from security@medzoos.pk to ${email.trim()} along with your new password.`}
        />

        <AuthError
          message={error}
          onRetry={isNetworkAuthError({ message: error }) ? () => setError("") : undefined}
        />

        <form onSubmit={handleResetWithOtp} className="space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#5B6B7A]">
              6-Digit Security Code
            </label>
            <OtpInput value={otp} onChange={setOtp} disabled={loading} error={Boolean(fieldErrors.otp)} />
            {fieldErrors.otp ? (
              <p className="mt-1.5 text-xs text-[#D92D20]">{fieldErrors.otp}</p>
            ) : null}
          </div>

          <div>
            <PasswordInput
              label="New password"
              name="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              leftIcon={<Lock size={18} />}
              error={fieldErrors.password}
            />
            <PasswordRequirements password={newPassword} />
          </div>

          <PasswordInput
            label="Confirm new password"
            name="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            leftIcon={<Lock size={18} />}
            error={fieldErrors.confirmPassword}
          />

          <AuthButton loading={loading} loadingLabel="Updating password..." showArrow={false}>
            Update Password & Sign In
          </AuthButton>
        </form>

        <div className="mt-5 flex flex-col items-center gap-2.5 text-center text-[13px] text-[#5B6B7A]">
          <div>
            Didn&apos;t receive the code?{" "}
            {resendCooldown > 0 ? (
              <span className="font-semibold text-[#17618E]">Resend in {resendCooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-semibold text-[#17618E] hover:underline disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend code"}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError("");
            }}
            className="inline-flex items-center gap-1.5 font-medium text-[#5B6B7A] hover:text-[#082B3F] hover:underline"
          >
            <ArrowLeft size={14} />
            Change email address ({email})
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout variant="recover" compact>
      <AuthPageHeader
        title="Forgot your password?"
        description="Enter the email address linked to your Medzoos account and we'll send a 6-digit recovery code and reset link."
      />

      <AuthError
        message={error}
        onRetry={isNetworkAuthError({ message: error }) ? () => setError("") : undefined}
      />

      <form onSubmit={handleRequestReset} className="space-y-5" noValidate>
        <AuthInput
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          leftIcon={<Envelope size={18} />}
          error={fieldErrors.email}
        />
        <AuthButton loading={loading} loadingLabel="Sending code..." showArrow={false}>
          Send 6-Digit Recovery Code
        </AuthButton>
      </form>

      <AuthBackLink>
        <ArrowLeft size={16} />
        Back to Sign In
      </AuthBackLink>
    </AuthLayout>
  );
}
