"use client";

import { useEffect, useState } from "react";
import { OtpInput } from "./OtpInput";
import { AuthButton } from "./AuthButton";
import { AuthError } from "./AuthError";
import { AuthPageHeader } from "./AuthChrome";
import { maskPhone } from "@/lib/auth/maskContact";

const RESEND_SECONDS = 60;

export function OtpVerification({
  phone,
  error,
  loading,
  sending,
  onVerify,
  onResend,
  onChangeNumber,
}) {
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (code.length < 6 || loading) return;
    onVerify(code);
  };

  const handleResend = async () => {
    if (seconds > 0 || sending) return;
    await onResend();
    setCode("");
    setSeconds(RESEND_SECONDS);
  };

  return (
    <div>
      <AuthPageHeader
        title="Enter the 6-digit code"
        description={`We sent a verification code to ${maskPhone(phone)}.`}
      />
      <AuthError message={error} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <OtpInput value={code} onChange={setCode} error="" disabled={loading} />
        <AuthButton
          loading={loading}
          loadingLabel="Verifying..."
          disabled={code.length < 6}
          showArrow={false}
        >
          Verify
        </AuthButton>
      </form>

      <div className="mt-6 space-y-3 text-center text-[14px] text-[#6B7C7B]">
        {seconds > 0 ? (
          <p>
            Resend code in <span className="font-semibold text-[#172525]">{seconds}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={sending}
            className="font-semibold text-[#17618E] hover:underline disabled:opacity-60"
          >
            {sending ? "Sending a new code..." : "Resend OTP"}
          </button>
        )}
        <button
          type="button"
          onClick={onChangeNumber}
          className="block w-full font-semibold text-[#6B7C7B] hover:text-[#17618E]"
        >
          Change phone number
        </button>
      </div>
    </div>
  );
}
