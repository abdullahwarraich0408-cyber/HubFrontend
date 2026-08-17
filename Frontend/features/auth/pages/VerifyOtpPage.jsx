"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getPendingPhoneAuth, setPendingPhoneAuth, clearPendingPhoneAuth } from "@/lib/auth/pendingPhoneAuth";
import { maskPhone } from "@/lib/auth/maskContact";
import { friendlyAuthError, isNetworkAuthError } from "@/lib/auth/friendlyAuthError";
import { formatFirebaseAuthError } from "@/lib/auth/firebaseErrors";
import { completeWebLogin } from "@/features/auth/lib/completeWebLogin";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { OtpInput } from "@/features/auth/components/OtpInput";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { AuthError } from "@/features/auth/components/AuthError";

export function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectQuery = searchParams.get("redirect") || "/";
  const { completePhoneLogin, startPhoneLogin } = useAuth();

  const [pending, setPending] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const stored = getPendingPhoneAuth();
    if (!stored?.confirmation) {
      router.replace("/login");
      return;
    }
    setPending(stored);
  }, [router]);

  if (!pending) return null;

  const handleVerify = async (event) => {
    event.preventDefault();
    if (code.trim().length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await completePhoneLogin(pending.confirmation, code.trim());
      clearPendingPhoneAuth();
      await completeWebLogin({ router, redirectTo: pending.redirectTo || redirectQuery });
    } catch (err) {
      setError(
        isNetworkAuthError(err)
          ? friendlyAuthError(err)
          : formatFirebaseAuthError(err)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const confirmation = await startPhoneLogin(pending.phone);
      const next = { ...pending, confirmation };
      setPending(next);
      setPendingPhoneAuth(next);
    } catch (err) {
      setError(formatFirebaseAuthError(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout compact>
      <h1 className="font-[var(--font-heading)] text-[30px] leading-tight text-[#102A43] sm:text-[36px]">
        Enter verification code
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-[#627D98] sm:text-[16px]">
        We&apos;ve sent a verification code to {maskPhone(pending.phone)}.
      </p>

      <AuthError message={error} />

      <form onSubmit={handleVerify} className="mt-7 space-y-6">
        <OtpInput value={code} onChange={setCode} disabled={loading} />
        <AuthButton loading={loading} loadingLabel="Verifying..." showArrow={false}>
          Verify Code
        </AuthButton>
      </form>

      <p className="mt-6 text-[14px] text-[#627D98]">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="font-semibold text-[#17618E] hover:underline disabled:opacity-60"
        >
          {resending ? "Sending..." : "Resend code"}
        </button>
      </p>

      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[#627D98] hover:text-[#17618E]"
      >
        <ArrowLeft size={16} />
        Back
      </Link>
    </AuthLayout>
  );
}
