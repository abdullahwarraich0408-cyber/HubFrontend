"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Envelope, Lock, ShieldCheck, User } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { completeWebLogin } from "@/features/auth/lib/completeWebLogin";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { PasswordRequirements } from "@/features/auth/components/PasswordRequirements";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";
import { AuthPageHeader } from "@/features/auth/components/AuthChrome";
import { OtpInput } from "@/features/auth/components/OtpInput";

export function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { initiateRegistration, verifyRegistrationOtp, resendRegistrationOtp } = useAuth();

  const [step, setStep] = useState("form"); // "form" | "otp"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    let timer;
    if (step === "otp" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleInitiateSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) nextErrors.password = "Please create a password.";
    else if (form.password.length < 8) nextErrors.password = "Your password must be at least 8 characters.";
    if (!agreeTerms) nextErrors.terms = "Please agree to the Terms & Conditions and Privacy Policy.";

    setFieldErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await initiateRegistration({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setStep("otp");
      setOtp("");
      setResendCooldown(60);
    } catch (err) {
      setFormError(friendlyAuthError(err, "We couldn't verify your details. Please check and try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (event) => {
    event.preventDefault();
    if (!otp || otp.trim().length < 6) {
      setFormError("Please enter the complete 6-digit verification code sent to your email.");
      return;
    }

    setFormError("");
    setLoading(true);
    try {
      await verifyRegistrationOtp({
        email: form.email.trim(),
        otp: otp.trim(),
      });
      await completeWebLogin({ router, redirectTo });
    } catch (err) {
      setFormError(friendlyAuthError(err, "Invalid or expired verification code. Please check your email or request a new code."));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setFormError("");
    try {
      await resendRegistrationOtp(form.email.trim());
      setResendCooldown(60);
    } catch (err) {
      setFormError(friendlyAuthError(err, "Failed to resend code. Please try again in a moment."));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      {step === "otp" ? (
        <>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E0F2FE] text-[#0284C7]">
            <ShieldCheck size={28} weight="fill" />
          </div>

          <AuthPageHeader
            title="Verify your email"
            description={`We sent a 6-digit security code to ${form.email.trim()}. Enter it below to activate your account.`}
          />

          <AuthError
            message={formError}
            onRetry={isNetworkAuthError({ message: formError }) ? () => setFormError("") : undefined}
          />

          <form onSubmit={handleVerifyOtpSubmit} className="space-y-6" noValidate>
            <div className="py-2">
              <OtpInput value={otp} onChange={setOtp} disabled={loading} />
            </div>

            <AuthButton loading={loading} loadingLabel="Verifying code..." showArrow={false}>
              Verify & Complete Registration
            </AuthButton>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-center text-[13px] text-[#5B6B7A]">
            <div>
              Didn&apos;t receive the code?{" "}
              {resendCooldown > 0 ? (
                <span className="font-semibold text-[#17618E]">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
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
                setStep("form");
                setFormError("");
              }}
              className="inline-flex items-center gap-1.5 font-medium text-[#5B6B7A] hover:text-[#082B3F] hover:underline"
            >
              <ArrowLeft size={14} />
              Change email address ({form.email})
            </button>
          </div>
        </>
      ) : (
        <>
          <AuthPageHeader
            title="Create your account"
            description="Join Medzoos with your email to access authentic medicines, top doctors and certified lab tests."
          />

          <AuthError
            message={formError}
            onRetry={isNetworkAuthError({ message: formError }) ? () => setFormError("") : undefined}
          />

          <form onSubmit={handleInitiateSubmit} className="space-y-3.5" noValidate>
            <AuthInput
              label="Full name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={update("name")}
              placeholder="Enter your full name"
              leftIcon={<User size={18} />}
              error={fieldErrors.name}
            />
            <AuthInput
              label="Email address"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              placeholder="Enter your email"
              leftIcon={<Envelope size={18} />}
              error={fieldErrors.email}
            />
            <div>
              <PasswordInput
                label="Password"
                name="password"
                autoComplete="new-password"
                value={form.password}
                onChange={update("password")}
                placeholder="Create a strong password"
                leftIcon={<Lock size={18} />}
                error={fieldErrors.password}
              />
              <PasswordRequirements password={form.password} />
            </div>

            <label className="flex items-start gap-3 text-[13px] leading-5 text-[#5B6B7A]">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D7E4EA] text-[#17618E] focus:ring-[#17618E]"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-semibold text-[#17618E] hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-[#17618E] hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {fieldErrors.terms ? (
              <p className="-mt-2 text-[13px] text-[#D92D20]">{fieldErrors.terms}</p>
            ) : null}

            <AuthButton loading={loading} loadingLabel="Sending verification code..." showArrow={false}>
              Continue with Email Verification
            </AuthButton>
          </form>

          <p className="mt-4 text-[14px] text-[#5B6B7A]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#17618E] hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
